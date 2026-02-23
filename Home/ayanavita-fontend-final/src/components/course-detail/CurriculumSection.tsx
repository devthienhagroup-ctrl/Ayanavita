// src/components/course-detail/CurriculumSection.tsx
import React from "react";
import type { LmsCourse, LmsLesson } from "../../data/lmsCourses.data";
import { imgSeed, lessonSeed } from "../../services/lmsImage.utils";

export function CurriculumSection({
  course,
  onPreview,
}: {
  course: LmsCourse;
  onPreview: (lesson: LmsLesson) => void;
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
              <div
                key={l.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200"
              >
                <div className="flex items-center gap-3">
                  <img
                    className="w-16 h-11 rounded-xl object-cover border border-slate-200 bg-slate-200"
                    alt="Lesson thumbnail"
                    src={imgSeed("lesson-" + lessonSeed(course, l), 320, 220)}
                  />
                  <div>
                    <div className="font-extrabold">{l.title}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {String(l.type).toUpperCase()} • {l.duration} phút
                      {l.preview ? " • Preview" : ""}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {l.preview ? (
                    <button type="button" className="btn btn-accent" onClick={() => onPreview(l)}>
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
