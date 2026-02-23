// src/components/course-player/MobileCurriculumDrawer.tsx
import React, { useRef } from "react";
import type { Course } from "../../data/coursePlayer.demo";
import { useEscapeKey, useOutsideClick, useScrollLock } from "../../hooks/useUiGuards";
import { CurriculumPanel } from "./CurriculumPanel";

export function MobileCurriculumDrawer({
  open,
  onClose,
  course,
  activeLessonId,
  search,
  onSelectLesson,
}: {
  open: boolean;
  onClose: () => void;
  course: Course;
  activeLessonId: string;
  search: string;
  onSelectLesson: (lessonId: string) => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  useScrollLock(open);
  useEscapeKey(() => open && onClose(), open);
  useOutsideClick(panelRef, () => open && onClose(), open);

  if (!open) return null;

  return (
    <>
      <div className="drawer-backdrop" />
      <div className="drawer">
        <div ref={panelRef} className="card p-3 h-full overflow-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="font-extrabold">Nội dung khóa học</div>
            <button className="btn h-10 w-10 p-0" type="button" onClick={onClose}>
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
          <div className="mt-3">
            <CurriculumPanel
              course={course}
              activeLessonId={activeLessonId}
              search={search}
              onSelectLesson={(id) => {
                onSelectLesson(id);
                onClose();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
