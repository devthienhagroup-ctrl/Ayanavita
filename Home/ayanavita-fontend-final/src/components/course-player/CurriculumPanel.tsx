// src/components/course-player/CurriculumPanel.tsx
import React, { useMemo } from "react";
import type { Course, CourseLesson, LessonType } from "../../data/coursePlayer.demo";
import { flattenLessons } from "../../data/coursePlayer.demo";
import { isDone } from "../../services/coursePlayer.storage";

function iconForType(t: LessonType) {
  if (t === "video") return <i className="fa-solid fa-circle-play text-indigo-600" />;
  if (t === "doc") return <i className="fa-solid fa-file-lines text-slate-600" />;
  if (t === "quiz") return <i className="fa-solid fa-list-check text-amber-600" />;
  if (t === "assignment") return <i className="fa-solid fa-upload text-emerald-600" />;
  return <i className="fa-solid fa-circle text-slate-400" />;
}

export function CurriculumPanel({
  course,
  activeLessonId,
  search,
  onSelectLesson,
}: {
  course: Course;
  activeLessonId: string;
  search: string;
  onSelectLesson: (lessonId: string) => void;
}) {
  const q = (search || "").trim().toLowerCase();

  const flat = useMemo(() => flattenLessons(course), [course]);

  const lockedOf = (lessonId: string) => {
    const idx = flat.findIndex((x) => x.lesson.id === lessonId);
    if (idx <= 0) return false;
    const prevId = flat[idx - 1].lesson.id;
    return !isDone(course.id, prevId);
  };

  return (
    <div>
      {course.modules.map((m) => {
        const lessons = (m.lessons || []).filter((l) => {
          if (!q) return true;
          return (l.title + " " + l.type).toLowerCase().includes(q);
        });

        const doneCount = lessons.filter((l) => isDone(course.id, l.id)).length;

        return (
          <div key={m.id} className="mb-3">
            <div className="module-head">
              <div className="flex items-center gap-2">
                <span className="chip">
                  <i className="fa-solid fa-folder text-indigo-600" />
                  Module
                </span>
                <span>{m.title}</span>
              </div>
              <div className="text-xs font-extrabold text-slate-600">
                {doneCount}/{lessons.length}
              </div>
            </div>

            <div className="mt-2 grid gap-2">
              {lessons.length ? (
                lessons.map((l: CourseLesson) => {
                  const locked = lockedOf(l.id);
                  const done = isDone(course.id, l.id);
                  const active = activeLessonId === l.id;

                  const badge = done ? (
                    <span className="chip">
                      <i className="fa-solid fa-circle-check text-emerald-600" />
                      Done
                    </span>
                  ) : locked ? (
                    <span className="chip">
                      <i className="fa-solid fa-lock text-slate-500" />
                      Locked
                    </span>
                  ) : (
                    <span className="chip">
                      <i className="fa-solid fa-circle text-amber-500" />
                      New
                    </span>
                  );

                  return (
                    <button
                      key={l.id}
                      type="button"
                      className={`lesson-item ${active ? "active" : ""} ${
                        locked && !active ? "locked" : ""
                      }`}
                      title={locked && !active ? "Bị khóa: cần hoàn thành bài trước" : "Mở bài học"}
                      onClick={() => {
                        if (locked && !active) {
                          window.alert("Bài này đang bị khóa. Hãy hoàn thành bài trước đó.");
                          return;
                        }
                        onSelectLesson(l.id);
                      }}
                    >
                      <div className="mt-0.5">{iconForType(l.type)}</div>
                      <div className="flex-1">
                        <div className="lesson-title">{l.title}</div>
                        <div className="lesson-meta mt-1">
                          {String(l.type).toUpperCase()} • {l.duration} phút
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">{badge}</div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 text-sm text-slate-600">
                  Không có lesson phù hợp.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
