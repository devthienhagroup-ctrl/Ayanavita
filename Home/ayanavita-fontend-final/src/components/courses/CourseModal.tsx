// src/components/courses/CourseModal.tsx
import React, { useEffect } from "react";
import type { Course } from "../../data/courses.data";
import { topicLabel } from "../../data/courses.data";
import { money } from "../../services/booking.utils";

export function CourseModal({
  open,
  course,
  onClose,
  onAdd,
}: {
  open: boolean;
  course: Course | null;
  onClose: () => void;
  onAdd: (id: string) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!course) return null;

  return (
    <div className={`modal ${open ? "active" : ""}`} aria-hidden={!open}>
      <div
        className="modal-content card w-[92%] max-w-4xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold text-slate-500">Course</div>
            <div className="text-lg font-extrabold">{course.title}</div>
          </div>

          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={() => onAdd(course.id)} type="button">
              <i className="fa-solid fa-cart-plus" /> Thêm vào cart
            </button>
            <button className="btn h-10 w-10 p-0" onClick={onClose} type="button" aria-label="close">
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>

        <div className="p-6 grid gap-4">
          <img
            className="w-full h-64 object-cover rounded-3xl ring-1 ring-slate-200"
            src={course.img}
            alt={course.title}
          />

          <div className="flex flex-wrap gap-2">
            <span className="chip">
              <i className="fa-solid fa-layer-group text-indigo-600" /> {topicLabel(course.topic)}
            </span>
            <span className="chip">
              <i className="fa-solid fa-clock text-amber-600" /> {course.hours} giờ
            </span>
            <span className="chip">
              <i className="fa-solid fa-users text-emerald-600" />{" "}
              {new Intl.NumberFormat("vi-VN").format(course.students)} HV
            </span>
            <span className="chip">
              <i className="fa-solid fa-star text-amber-500" /> {course.rating.toFixed(1)}
            </span>
          </div>

          <div className="text-slate-700 leading-relaxed">{course.desc}</div>

          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div className="font-extrabold text-indigo-700">{money(course.price)}</div>
              <div className="text-sm text-slate-600">Giá demo (có thể áp voucher)</div>
            </div>
          </div>
        </div>
      </div>

      {/* backdrop click */}
      <button
        className="absolute inset-0"
        onClick={onClose}
        aria-label="backdrop"
        style={{ cursor: "default" }}
      />
    </div>
  );
}
