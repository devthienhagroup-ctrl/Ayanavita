// src/components/course-detail/PreviewSidebar.tsx
import React, { useMemo } from "react";
import type { LmsCourse, LmsLesson } from "../../data/lmsCourses.data";
import { imgSeed, lessonSeed } from "../../services/lmsImage.utils";

export function PreviewSidebar({
  course,
  onPreview,
}: {
  course: LmsCourse;
  onPreview: (lesson: LmsLesson) => void;
}) {
  const previewLessons = useMemo(() => {
    const lessons = (course.modules || []).flatMap((m) => m.lessons || []);
    return lessons.filter((l) => l.preview);
  }, [course]);

  return (
    <div className="card p-5">
      <div className="font-extrabold">Preview lessons</div>
      <div className="mt-2 text-sm text-slate-600">Click để xem mô phỏng preview.</div>

      <div className="mt-3 grid gap-2">
        {previewLessons.length ? (
          previewLessons.map((l) => (
            <button key={l.id} type="button" className="btn text-left" onClick={() => onPreview(l)}>
              <span className="inline-flex items-center gap-2">
                <img
                  className="w-16 h-11 rounded-xl object-cover border border-slate-200 bg-slate-200"
                  alt="Preview thumb"
                  src={imgSeed("preview-" + lessonSeed(course, l), 320, 220)}
                />
                <span>
                  <span className="block font-extrabold">{l.title}</span>
                  <span className="block text-slate-500 text-sm font-bold">{l.duration} phút</span>
                </span>
              </span>
            </button>
          ))
        ) : (
          <div className="text-sm text-slate-600">Chưa có preview lesson.</div>
        )}
      </div>
    </div>
  );
}
