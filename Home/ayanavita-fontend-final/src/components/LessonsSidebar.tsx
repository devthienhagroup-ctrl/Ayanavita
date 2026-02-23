// src/components/LessonsSidebar.tsx
import React, { useMemo } from "react";
import type { Lesson } from "../api/courses.api";
import type { LessonStatusUI } from "../shared/lessons";

import { Card, Button, Badge, Hr, Muted } from "../ui/ui";
import { IconLock } from "../ui/icons";

type Props = {
  courseId?: string;
  lessons: Lesson[];
  activeLessonId: string;
  statuses: Map<string, LessonStatusUI>;
  search: string;
  onSearch: (v: string) => void;
  onSelectLesson: (id: string) => void;
};

function isLockedStatus(s?: LessonStatusUI | null) {
  return String(s || "").toLowerCase() === "locked";
}
function isDoneStatus(s?: LessonStatusUI | null) {
  return String(s || "").toLowerCase() === "done";
}
function isActiveStatus(s?: LessonStatusUI | null) {
  return String(s || "").toLowerCase() === "active";
}

export function LessonsSidebar({
  courseId,
  lessons,
  activeLessonId,
  statuses,
  search,
  onSearch,
  onSelectLesson,
}: Props) {
  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return lessons;
    return lessons.filter((l) => {
      const hay = `${l.title || ""} ${l.type || ""} ${l.id || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [lessons, search]);

  const stat = useMemo(() => {
    let done = 0,
      locked = 0;
    for (const l of lessons) {
      const s = statuses.get(l.id);
      if (isDoneStatus(s)) done++;
      if (isLockedStatus(s)) locked++;
    }
    return { done, locked, total: lessons.length };
  }, [lessons, statuses]);

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-extrabold text-slate-500">CURRICULUM</div>
          <div className="text-lg font-extrabold">Bài học</div>
          {courseId ? (
            <div className="text-xs font-extrabold text-slate-400 mt-1">Course: {courseId}</div>
          ) : null}
        </div>
        <div className="text-right">
          <div className="text-xs font-extrabold text-slate-500">Progress</div>
          <div className="mt-1 text-sm">
            <b>{stat.done}</b>/<b>{stat.total}</b>{" "}
            <span className="text-slate-400">• locked {stat.locked}</span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <input
          className="field"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Tìm lesson..."
        />
      </div>

      <Hr />

      <div className="grid gap-2 max-h-[70vh] overflow-auto pr-1">
        {filtered.map((l, idx) => {
          const st = statuses.get(l.id);
          const locked = isLockedStatus(st);
          const active = l.id === activeLessonId || isActiveStatus(st);
          const done = isDoneStatus(st);

          return (
            <div
              key={l.id}
              role="button"
              tabIndex={0}
              onClick={() => !locked && onSelectLesson(l.id)}
              onKeyDown={(e) => {
                if (locked) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectLesson(l.id);
                }
              }}
              className={[
                "w-full rounded-2xl border px-3 py-3 transition outline-none",
                active
                  ? "border-indigo-200 bg-indigo-50"
                  : "border-slate-200 bg-white hover:bg-slate-50",
                locked ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-500">
                    #{(l.order ?? idx + 1).toString().padStart(2, "0")} •{" "}
                    {String(l.type || "").toUpperCase()}
                  </div>
                  <div className="mt-1 font-extrabold text-slate-900 truncate">{l.title}</div>
                  <div className="mt-1">
                    <Muted className="truncate">{l.id}</Muted>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {locked ? (
                    <Badge>
                      <IconLock /> Locked
                    </Badge>
                  ) : done ? (
                    <Badge>Done</Badge>
                  ) : active ? (
                    <Badge>Active</Badge>
                  ) : (
                    <Badge>New</Badge>
                  )}
                </div>
              </div>

              <div className="mt-2 flex gap-2 items-center">
                <Button
                  type="button"
                  variant={active ? "solid" : "ghost"}
                  disabled={locked}
                  onClick={(e) => {
                    e?.preventDefault?.();
                    e?.stopPropagation?.();
                    if (!locked) onSelectLesson(l.id);
                  }}
                >
                  Mở
                </Button>

                {locked ? (
                  <span className="text-xs font-extrabold text-slate-500">
                    Hoàn thành bài trước để mở
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}

        {!filtered.length ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
            <div className="text-sm font-extrabold text-slate-900">Không tìm thấy lesson</div>
            <div className="text-sm text-slate-600 mt-1">Thử từ khóa khác.</div>
            <div className="mt-3">
              <Button type="button" onClick={() => onSearch("")}>
                Reset
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
