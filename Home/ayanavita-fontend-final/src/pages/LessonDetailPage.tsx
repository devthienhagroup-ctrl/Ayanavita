// src/pages/LessonDetailPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { coursesApi, type Lesson } from "../api/courses.api";
import { lessonsApi, type LessonDetail } from "../api/lessons.api";
import { progressApi, type CourseProgressRes } from "../api/progress.api";

import { LessonsSidebar } from "../components/LessonsSidebar";
import { EnrollmentGatePanel, type EnrollmentGateState } from "../components/EnrollmentGatePanel";
import { useEnrollmentGate } from "../hooks/useEnrollmentGate";

import {
  buildSequentialRows,
  getLessonNavFromRows,
  statusOf,
  type LessonStatusUI,
} from "../shared/lessons";

import {
  AppShell,
  Badge,
  Button,
  Card,
  Container,
  Hr,
  Muted,
  SubTitle,
  Title,
} from "../ui/ui";

import { IconArrowLeft, IconCheck, IconLock, IconRefresh } from "../ui/icons";

import { useInterval } from "../hooks/useInterval";
import { useVideoPlayer } from "../hooks/useVideoPlayer";
import { getNote, setNote } from "../shared/playerStorage";

type TabKey = "overview" | "notes" | "qa" | "reviews";

/** tolerant check: "LOCKED" | "locked" */
function isLockedStatus(s?: LessonStatusUI | null) {
  return String(s || "").toLowerCase() === "locked";
}
function isDoneStatus(s?: LessonStatusUI | null) {
  return String(s || "").toLowerCase() === "done";
}

/** cố gắng rút doneSet từ progress (nếu backend trả dạng khác nhau) */
function extractDoneSet(progress: CourseProgressRes | null): Set<string> {
  const set = new Set<string>();
  if (!progress) return set;

  const anyP: any = progress as any;

  const arrCandidates: any[] = [
    anyP.doneLessonIds,
    anyP.completedLessonIds,
    anyP.completedIds,
    anyP.doneIds,
    anyP?.items?.filter?.((x: any) => x?.status === "DONE" || x?.done)?.map?.((x: any) => x.lessonId),
  ].filter(Boolean);

  for (const c of arrCandidates) {
    if (Array.isArray(c)) {
      for (const id of c) if (typeof id === "string") set.add(id);
    }
  }

  // fallback: progress map { [lessonId]: { done: true } }
  if (anyP?.map && typeof anyP.map === "object") {
    for (const [k, v] of Object.entries<any>(anyP.map)) {
      if (v?.done === true || v?.status === "DONE") set.add(k);
    }
  }

  return set;
}

/** drip lock tuần tự: nếu bài trước chưa DONE -> các bài sau LOCKED */
function computeSequentialLockedSet(rows: Lesson[], doneSet: Set<string>): Set<string> {
  const locked = new Set<string>();
  let canUnlockNext = true;

  for (const l of rows) {
    if (!canUnlockNext) {
      locked.add(l.id);
      continue;
    }
    // bài hiện tại được unlock; sau đó chỉ unlock tiếp nếu bài này DONE
    canUnlockNext = doneSet.has(l.id);
  }
  return locked;
}

type GateHookResult =
  | EnrollmentGateState
  | {
      gate: EnrollmentGateState;
      refresh?: () => Promise<void>;
      enroll?: () => Promise<void>;
      login?: () => void;
      markPaid?: () => Promise<void>;
      cancel?: () => Promise<void>;
    };

export default function LessonDetailPage() {
  const nav = useNavigate();
  const { courseId = "" } = useParams();
  const [sp, setSp] = useSearchParams();
  const lessonId = sp.get("lessonId") || "";

  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [progress, setProgress] = useState<CourseProgressRes | null>(null);

  const [tab, setTab] = useState<TabKey>("overview");
  const [search, setSearch] = useState("");
  const [theater, setTheater] = useState(false);

  const [autoplay, setAutoplay] = useState(true);
  const [cdOpen, setCdOpen] = useState(false);
  const [cd, setCd] = useState(5);

  const [note, setNoteState] = useState("");

  // ✅ hook nhận string courseId
  const gateRes = useEnrollmentGate(courseId) as GateHookResult;

  // normalize gate state
  const gateState: EnrollmentGateState = useMemo(() => {
    if (!gateRes) return { allowed: false, loading: true, reason: "ERROR" };
    return "gate" in gateRes ? gateRes.gate : gateRes;
  }, [gateRes]);

  const allowed = !!gateState.allowed || !!gateState.isAdminBypass;

  // load course + lessons + progress + lesson detail
  useEffect(() => {
    if (!courseId) return;

    (async () => {
      // course
      const c = await coursesApi.get(courseId);
      setCourse(c);

      // lessons
      const ls = await coursesApi.lessons(courseId);
      setLessons(ls);

      // default lessonId
      const firstLessonId = (ls?.[0] as any)?.id || "";
      const activeId = lessonId || firstLessonId;
      if (activeId && !lessonId) setSp({ lessonId: activeId });

      // progress (không phá UI nếu lỗi)
      try {
        const p = await progressApi.getMyCourseProgress(courseId);
        setProgress(p);
      } catch {
        setProgress(null);
      }

      // lesson detail
      if (activeId) {
        try {
          const ld = await lessonsApi.getDetail(courseId, activeId);
          setLesson(ld);
          setNoteState(getNote(courseId, activeId));
        } catch {
          setLesson(null);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // when lessonId changes
  useEffect(() => {
    if (!courseId || !lessonId) return;

    (async () => {
      try {
        const ld = await lessonsApi.getDetail(courseId, lessonId);
        setLesson(ld);
      } catch {
        setLesson(null);
      }

      setTab("overview");
      setCdOpen(false);
      setCd(5);
      setNoteState(getNote(courseId, lessonId));
    })();
  }, [courseId, lessonId]);

  // theater mode
  useEffect(() => {
    document.body.classList.toggle("theater", theater);
    return () => document.body.classList.remove("theater");
  }, [theater]);

  const rows = useMemo(() => buildSequentialRows(lessons), [lessons]);

  const doneSet = useMemo(() => extractDoneSet(progress), [progress]);

  const lockedSet = useMemo(() => {
    if (!allowed) return new Set(rows.map((l) => l.id));
    return computeSequentialLockedSet(rows, doneSet);
  }, [allowed, rows, doneSet]);

  const statuses = useMemo(() => {
    const map = new Map<string, LessonStatusUI>();
    for (const l of rows) {
      map.set(
        l.id,
        statusOf({
          lessonId: l.id,
          activeLessonId: lessonId || null,
          doneSet,
          lockedSet,
        })
      );
    }
    return map;
  }, [rows, lessonId, doneSet, lockedSet]);

  const navInfo = useMemo(() => {
    const active = lessonId || rows[0]?.id || "";
    return active
      ? getLessonNavFromRows(rows, active)
      : { prev: null, next: null, idx: -1, total: rows.length };
  }, [rows, lessonId]);

  const activeStatus = statuses.get(lessonId) ?? (("NEW" as any) as LessonStatusUI);
  const isLocked = isLockedStatus(activeStatus);

  // === Player hook ===
  const isVideo = String((lesson as any)?.type || "").toLowerCase() === "video";
  const canPlay = allowed && isVideo && !isLocked;

  const player = useVideoPlayer({
    courseId,
    lessonId,
    src: (lesson as any)?.videoUrl || (lesson as any)?.video || "",
    enabled: canPlay,
  });

  // autoplay countdown tick
  useInterval(
    () => {
      if (!cdOpen) return;
      setCd((s) => s - 1);
    },
    cdOpen ? 1000 : null
  );

  useEffect(() => {
    if (!cdOpen) return;
    if (cd > 0) return;

    setCdOpen(false);
    const nextId = navInfo.next?.id;
    if (!nextId) return;

    const st = statuses.get(nextId);
    if (isLockedStatus(st)) return;

    setSp({ lessonId: nextId });
  }, [cd, cdOpen, navInfo, statuses, setSp]);

  const refreshProgress = async () => {
    try {
      const p = await progressApi.getMyCourseProgress(courseId);
      setProgress(p);
    } catch {
      setProgress(null);
    }
  };

  const markDone = async () => {
    if (!allowed) return;
    if (!lessonId) return;

    // ✅ theo file progressApi bạn đang có: complete(lessonId)
    await progressApi.complete(lessonId);
    await refreshProgress();
  };

  const onEnded = async () => {
    await markDone();

    if (!autoplay) return;
    const nextId = navInfo.next?.id;
    if (!nextId) return;

    const st = statuses.get(nextId);
    if (isLockedStatus(st)) return;

    setCd(5);
    setCdOpen(true);
  };

  const onEnroll = async () => {
    // CTA tạo order/enroll theo backend: POST /courses/:id/order
    try {
      await coursesApi.order(courseId);
      // refresh gate nếu hook có
      if ("refresh" in gateRes && gateRes.refresh) await gateRes.refresh();
    } catch {
      // không crash UI
    }
  };

  const onLogin = () => {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    nav(`/login?next=${next}`);
  };

  if (!course) {
    return (
      <AppShell>
        <Container>
          <Card>
            <Title>Loading…</Title>
          </Card>
        </Container>
      </AppShell>
    );
  }

  if (!lessonId) {
    return (
      <AppShell>
        <Container>
          <Card>
            <Title>Chưa chọn bài học</Title>
            <Muted>Vui lòng chọn một lesson trong sidebar.</Muted>
          </Card>
        </Container>
      </AppShell>
    );
  }

  const nextLocked = navInfo.next ? isLockedStatus(statuses.get(navInfo.next.id)) : false;

  return (
    <AppShell>
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => nav(`/courses/${courseId}`)}>
              <IconArrowLeft /> Quay lại
            </Button>
            <div>
              <Title>{course.title}</Title>
              <Muted>{course.subtitle}</Muted>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => setTheater((v) => !v)}>
              {theater ? "Exit Theater" : "Theater"}
            </Button>
            <Button variant="solid" onClick={markDone} disabled={!allowed || isLocked}>
              <IconCheck /> Mark done
            </Button>
          </div>
        </div>

        <Hr />

        {/* ✅ FIX 1: EnrollmentGatePanel nhận state, không nhận courseId */}
        <EnrollmentGatePanel
          courseTitle={course?.title}
          state={gateState}
          onEnroll={onEnroll}
          onRefresh={("refresh" in gateRes && gateRes.refresh) ? gateRes.refresh : undefined}
          onLogin={("login" in gateRes && gateRes.login) ? gateRes.login : onLogin}
          onMarkPaid={("markPaid" in gateRes && gateRes.markPaid) ? gateRes.markPaid : undefined}
          onCancelEnrollment={("cancel" in gateRes && gateRes.cancel) ? gateRes.cancel : undefined}
        />

        <div id="mainGrid" className="grid lg:grid-cols-[1fr_360px] gap-3">
          {/* LEFT */}
          <div className="grid gap-3">
            <Card>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {isLocked ? (
                    <Badge>
                      <IconLock /> Locked
                    </Badge>
                  ) : (
                    <Badge>Active</Badge>
                  )}
                  <Muted>Autoplay next</Muted>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={autoplay}
                      onChange={(e) => setAutoplay(e.target.checked)}
                    />
                    Bật
                  </label>

                  <select
                    className="btn"
                    value={String(player.speed)}
                    onChange={(e) => player.setSpeed(Number(e.target.value))}
                  >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>

                  <Button onClick={player.togglePiP}>PiP</Button>
                  <Button onClick={player.toggleFullscreen}>Fullscreen</Button>
                </div>
              </div>

              <div className="mt-3" ref={player.wrapRef}>
                {canPlay ? (
                  <video
                    ref={player.videoRef}
                    className="w-full h-[240px] sm:h-[360px] lg:h-[420px] theater-video rounded-2xl bg-black"
                    controls
                    playsInline
                    onEnded={onEnded}
                  >
                    <source
                      src={(lesson as any)?.videoUrl || (lesson as any)?.video || ""}
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <div className="rounded-2xl bg-slate-50 p-6">
                    {isLocked ? (
                      <div className="font-bold">Lesson bị khóa (drip lock).</div>
                    ) : (
                      <div className="font-bold">Không phải video hoặc chưa được phép xem.</div>
                    )}
                  </div>
                )}
              </div>

              {cdOpen ? (
                <div className="mt-3 rounded-2xl bg-slate-50 p-4">
                  <div className="font-bold">Sắp chuyển bài tiếp theo…</div>
                  <div className="text-sm mt-1">
                    Sau <b>{cd}</b>s •{" "}
                    <button className="link" onClick={() => setCdOpen(false)} type="button">
                      Hủy
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="mt-3 flex items-center justify-between">
                <Button
                  variant="ghost"
                  disabled={!navInfo.prev}
                  onClick={() => navInfo.prev && setSp({ lessonId: navInfo.prev.id })}
                >
                  Prev
                </Button>
                <Button
                  variant="solid"
                  disabled={!navInfo.next || nextLocked}
                  onClick={() => navInfo.next && setSp({ lessonId: navInfo.next.id })}
                >
                  Next
                </Button>
              </div>
            </Card>

            <Card>
              <div className="flex gap-2 flex-wrap">
                <Button variant={tab === "overview" ? "solid" : "ghost"} onClick={() => setTab("overview")}>
                  Tổng quan
                </Button>
                <Button variant={tab === "notes" ? "solid" : "ghost"} onClick={() => setTab("notes")}>
                  Ghi chú
                </Button>
                <Button variant={tab === "qa" ? "solid" : "ghost"} onClick={() => setTab("qa")}>
                  Q&A
                </Button>
                <Button variant={tab === "reviews" ? "solid" : "ghost"} onClick={() => setTab("reviews")}>
                  Reviews
                </Button>
              </div>

              <Hr />

              {tab === "overview" ? (
                <div className="grid gap-2">
                  <SubTitle>{lesson?.title ?? "—"}</SubTitle>
                  <Muted>{(lesson as any)?.desc || "—"}</Muted>
                </div>
              ) : null}

              {tab === "notes" ? (
                <div className="grid gap-2">
                  <textarea
                    className="field"
                    rows={6}
                    value={note}
                    onChange={(e) => setNoteState(e.target.value)}
                    placeholder="Ghi chú theo bài học..."
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="solid"
                      onClick={() => {
                        setNote(courseId, lessonId, note);
                        alert("Đã lưu ghi chú.");
                      }}
                    >
                      Lưu
                    </Button>
                    <Button
                      onClick={() => {
                        if (!confirm("Xóa ghi chú?")) return;
                        setNoteState("");
                        setNote(courseId, lessonId, "");
                      }}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ) : null}

              {tab === "qa" ? (
                <div className="grid gap-2">
                  <Card>
                    <b>Hỏi:</b> Khi nào nối API?
                    <div className="mt-1">
                      <b>Đáp:</b> Khi chốt UI, thay localStorage → progress/lesson endpoints.
                    </div>
                  </Card>
                </div>
              ) : null}

              {tab === "reviews" ? (
                <div className="grid gap-2">
                  <Card>Review demo…</Card>
                </div>
              ) : null}
            </Card>
          </div>

          {/* RIGHT */}
          <div className="grid gap-3">
            {/* ✅ FIX 2: LessonsSidebar props chuẩn (file mình đưa bên dưới có courseId optional) */}
            <LessonsSidebar
              courseId={courseId}
              lessons={rows}
              activeLessonId={lessonId}
              statuses={statuses}
              search={search}
              onSearch={setSearch}
              onSelectLesson={(id: string) => setSp({ lessonId: id })}
            />

            <Card>
              <Button onClick={refreshProgress}>
                <IconRefresh /> Refresh progress
              </Button>
              <div className="mt-2 text-xs font-extrabold text-slate-500">
                Done: {Array.from(doneSet).length} • Locked: {Array.from(lockedSet).length}
              </div>
            </Card>

            <Card>
              <div className="text-xs font-extrabold text-slate-500">Debug</div>
              <div className="mt-1 text-sm text-slate-700">
                Active status: <b>{String(activeStatus)}</b> • Done? <b>{String(isDoneStatus(activeStatus))}</b>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </AppShell>
  );
}
