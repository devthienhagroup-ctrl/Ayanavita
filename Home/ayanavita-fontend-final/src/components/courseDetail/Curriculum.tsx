// src/components/courseDetail/Curriculum.tsx
import React from "react";
import type { CourseDetail, Lesson } from "../../data/courseDetail.demo";
import { imgSeed, lessonSeed } from "../../services/coursePricing";

function typeLabel(t: string) {
  return String(t || "video").toUpperCase();
}

export function Curriculum({
  course,
  onPreview,
}: {
  course: CourseDetail;
  onPreview: (lesson: Lesson) => void;
}) {
  const modules = course.modules || [];

  if (!modules.length) {
    return (
      <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 text-sm text-slate-600">
        Khóa học chưa có curriculum. (Prototype)
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {modules.map((m, idx) => (
        <div key={m.id} className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div className="font-extrabold">
              Module {idx + 1}: {m.title}
            </div>
            <span className="chip">
              <i className="fa-solid fa-list text-indigo-600" />
              {(m.lessons || []).length} lessons
            </span>
          </div>

          <div className="mt-3 grid gap-2">
            {(m.lessons || []).map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    className="h-11 w-16 rounded-xl object-cover ring-1 ring-slate-200"
                    alt="Lesson thumbnail"
                    src={imgSeed("lesson-" + lessonSeed(course.id, l.id), 320, 220)}
                  />
                  <div className="min-w-0">
                    <div className="font-extrabold truncate">{l.title}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {typeLabel(l.type)} • {Number(l.duration || 0)} phút {l.preview === "yes" ? " • Preview" : ""}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {l.preview === "yes" ? (
                    <button className="btn btn-accent" type="button" onClick={() => onPreview(l)}>
                      <i className="fa-solid fa-eye mr-2" />
                      Preview
                    </button>
                  ) : (
                    <span className="chip">
                      <i className="fa-solid fa-lock text-slate-500" />
                      Locked
                    </span>
                  )}
                </div>
              </div>
            ))}
            {!m.lessons?.length ? <div className="text-sm text-slate-600">Chưa có lesson.</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
