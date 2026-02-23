// src/components/course-player/PlayerArea.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Course, CourseLesson } from "../../data/coursePlayer.demo";
import { flattenLessons } from "../../data/coursePlayer.demo";
import { isDone, markDone, setResume, getResume } from "../../services/coursePlayer.storage";
import { useInterval } from "../../hooks/useInterval";

export function PlayerArea({
  course,
  activeLesson,
  onSelectLesson,
  onOpenQuiz,
  onOpenAssignment,
  autoplayEnabled,
  onToggleAutoplay,
}: {
  course: Course;
  activeLesson: CourseLesson;
  onSelectLesson: (lessonId: string) => void;
  onOpenQuiz: () => void;
  onOpenAssignment: () => void;
  autoplayEnabled: boolean;
  onToggleAutoplay: (v: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [speed, setSpeedState] = useState(1);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const flat = useMemo(() => flattenLessons(course), [course]);

  const idx = useMemo(
    () => flat.findIndex((x) => x.lesson.id === activeLesson.id),
    [flat, activeLesson.id]
  );

  const prevId = idx > 0 ? flat[idx - 1].lesson.id : null;
  const nextId = idx < flat.length - 1 ? flat[idx + 1].lesson.id : null;

  const isLocked = (lessonId: string) => {
    const i = flat.findIndex((x) => x.lesson.id === lessonId);
    if (i <= 0) return false;
    const prev = flat[i - 1].lesson.id;
    return !isDone(course.id, prev);
  };

  // Apply speed
  useEffect(() => {
    if (!videoRef.current) return;
    try {
      videoRef.current.playbackRate = Number(speed || 1);
    } catch {}
  }, [speed, activeLesson.id]);

  // Restore resume time when switching to video lesson
  useEffect(() => {
    if (activeLesson.type !== "video") return;
    const v = videoRef.current;
    if (!v) return;

    const t = getResume(course.id, activeLesson.id);
    if (t <= 2 || !Number.isFinite(t)) return;

    const handler = () => {
      const max = Math.max(0, (v.duration || 0) - 2);
      v.currentTime = Math.min(t, max);
      v.removeEventListener("loadedmetadata", handler);
    };
    v.addEventListener("loadedmetadata", handler);
    return () => v.removeEventListener("loadedmetadata", handler);
  }, [course.id, activeLesson.id, activeLesson.type]);

  // Persist resume + auto complete
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let lastSave = 0;
    const onTime = () => {
      if (activeLesson.type !== "video") return;
      const now = Date.now();
      if (now - lastSave < 1500) return;
      lastSave = now;

      setResume(course.id, activeLesson.id, v.currentTime || 0);

      const dur = Number(v.duration || 0);
      if (dur > 0) {
        const ratio = (v.currentTime || 0) / dur;
        if (ratio >= 0.9 && !isDone(course.id, activeLesson.id)) {
          markDone(course.id, activeLesson.id);
        }
      }
    };

    const onEnded = () => {
      // ensure auto complete
      if (!isDone(course.id, activeLesson.id)) markDone(course.id, activeLesson.id);

      if (!autoplayEnabled) return;
      if (!nextId) return;

      // if next is locked, stop
      if (isLocked(nextId)) {
        window.alert("Bài tiếp theo đang bị khóa. Hãy hoàn thành bài trước.");
        return;
      }

      setCountdown(5);
      setShowCountdown(true);
    };

    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
    };
  }, [activeLesson, autoplayEnabled, course.id, nextId]);

  // Countdown interval
  useInterval(
    () => {
      if (!showCountdown) return;
      setCountdown((s) => s - 1);
    },
    showCountdown ? 1000 : null
  );

  useEffect(() => {
    if (!showCountdown) return;
    if (countdown > 0) return;

    setShowCountdown(false);
    if (!nextId) return;
    if (isLocked(nextId)) return;
    onSelectLesson(nextId);
  }, [countdown, showCountdown, nextId, onSelectLesson]);

  const startPiP = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      // @ts-ignore
      if (document.pictureInPictureElement) {
        // @ts-ignore
        await document.exitPictureInPicture();
      } else {
        // @ts-ignore
        await v.requestPictureInPicture();
      }
    } catch {
      window.alert("Trình duyệt chưa hỗ trợ Picture-in-Picture.");
    }
  };

  const toggleFullscreen = async () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await wrap.requestFullscreen();
      }
    } catch {
      window.alert("Trình duyệt không cho fullscreen.");
    }
  };

  return (
    <div className="card p-4">
      {/* Header bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="chip">
            <i className="fa-solid fa-circle-play text-indigo-600" />
            Player
          </span>
          <span className="chip hidden sm:inline-flex">
            <i className="fa-solid fa-lock text-slate-500" />
            Drip lock
          </span>
        </div>

        {/* Search placed at page-level in CoursePlayerPage */}
        <div className="text-sm text-slate-600 font-bold hidden md:block">
          Đang học: <b>{activeLesson.title}</b>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Video / Controls */}
        <div className="lg:col-span-2">
          <div ref={wrapRef} className="rounded-2xl overflow-hidden ring-1 ring-slate-200 bg-black">
            {activeLesson.type === "video" ? (
              <video
                ref={videoRef}
                className="w-full h-[240px] sm:h-[360px] lg:h-[420px] theater-video"
                controls
                playsInline
                poster="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80"
                key={activeLesson.id} // force reload
              >
                <source
                  src={
                    activeLesson.video ||
                    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                  }
                  type="video/mp4"
                />
              </video>
            ) : (
              <div className="w-full h-[240px] sm:h-[360px] lg:h-[420px] flex items-center justify-center text-white font-extrabold">
                Lesson type: {String(activeLesson.type).toUpperCase()}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="text-xs font-extrabold text-slate-500">Playback</div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 text-sm font-extrabold">
                  <span className="text-slate-500">Speed</span>
                  <select
                    className="btn"
                    value={String(speed)}
                    onChange={(e) => setSpeedState(Number(e.target.value))}
                  >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                </label>

                <button type="button" className="btn" onClick={startPiP}>
                  <i className="fa-solid fa-clone mr-2" />
                  PiP
                </button>

                <button type="button" className="btn" onClick={toggleFullscreen}>
                  <i className="fa-solid fa-up-right-and-down-left-from-center mr-2" />
                  Fullscreen
                </button>

                <button
                  type="button"
                  className="btn btn-accent"
                  onClick={() => {
                    markDone(course.id, activeLesson.id);
                    window.alert("Đã Mark done (prototype).");
                  }}
                >
                  <i className="fa-solid fa-circle-check mr-2" />
                  Mark done
                </button>
              </div>

              <div className="mt-3 text-xs text-slate-500">
                Resume + auto-complete (≥90%) lưu localStorage theo lesson.
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="text-xs font-extrabold text-slate-500">Autoplay next</div>

              <label className="mt-3 flex items-center gap-2 text-sm font-extrabold">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                  checked={autoplayEnabled}
                  onChange={(e) => onToggleAutoplay(e.target.checked)}
                />
                Bật tự động sang bài tiếp theo
              </label>

              {showCountdown ? (
                <div className="mt-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                  <div className="font-extrabold text-sm">Sắp chuyển bài tiếp theo…</div>
                  <div className="text-sm text-slate-700 mt-1">
                    Sau <b>{countdown}</b>s •{" "}
                    <button
                      type="button"
                      className="font-extrabold text-indigo-600"
                      onClick={() => setShowCountdown(false)}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="mt-3 text-xs text-slate-500">
                Hết video sẽ countdown 5s (giống Udemy).
              </div>
            </div>
          </div>

          {/* Prev/Next */}
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              Đang học: <b>{activeLesson.title}</b>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn"
                disabled={!prevId}
                onClick={() => prevId && onSelectLesson(prevId)}
              >
                <i className="fa-solid fa-arrow-left mr-2" />
                Prev
              </button>

              <button
                type="button"
                className="btn btn-primary"
                disabled={!nextId || (nextId ? isLocked(nextId) : false)}
                onClick={() => {
                  if (!nextId) return;
                  if (isLocked(nextId)) {
                    window.alert("Bài tiếp theo đang bị khóa. Hãy hoàn thành bài hiện tại trước.");
                    return;
                  }
                  onSelectLesson(nextId);
                }}
              >
                Next<i className="fa-solid fa-arrow-right ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Lesson side panel */}
        <aside className="card p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs font-extrabold text-slate-500">Lesson</div>
              <div className="text-lg font-extrabold">{activeLesson.title}</div>
              <div className="mt-2 inline-flex chip">
                {activeLesson.type === "video" ? (
                  <>
                    <i className="fa-solid fa-circle-play text-indigo-600" />
                    Video
                  </>
                ) : activeLesson.type === "doc" ? (
                  <>
                    <i className="fa-solid fa-file-lines text-slate-600" />
                    Doc
                  </>
                ) : activeLesson.type === "quiz" ? (
                  <>
                    <i className="fa-solid fa-list-check text-amber-600" />
                    Quiz
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-upload text-emerald-600" />
                    Assignment
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {activeLesson.type === "quiz" ? (
                <button type="button" className="btn" title="Quiz builder" onClick={onOpenQuiz}>
                  <i className="fa-solid fa-pen-to-square" />
                </button>
              ) : null}
              {activeLesson.type === "assignment" ? (
                <button type="button" className="btn" title="Nộp bài" onClick={onOpenAssignment}>
                  <i className="fa-solid fa-upload" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="text-xs font-extrabold text-slate-500">Mô tả</div>
              <div className="mt-1 text-sm text-slate-700">{activeLesson.desc || "—"}</div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="text-xs font-extrabold text-slate-500">Tài nguyên</div>
              <div className="mt-2 text-sm text-slate-700 grid gap-2">
                <a className="text-indigo-600 font-black hover:underline" href={activeLesson.res1 || "#"} target="_blank" rel="noreferrer">
                  {activeLesson.res1 ? "Resource 1" : "—"}
                </a>
                <a className="text-indigo-600 font-black hover:underline" href={activeLesson.res2 || "#"} target="_blank" rel="noreferrer">
                  {activeLesson.res2 ? "Resource 2" : "—"}
                </a>
              </div>
              <div className="mt-2 text-xs text-slate-500">Prototype: link mẫu.</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
