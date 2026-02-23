// src/components/courses/CourseCard.tsx
import React from "react";
import type { Course } from "../../data/courses.data";
import { topicLabel } from "../../data/courses.data";
import { money } from "../../services/booking.utils";

function Stars({ rating }: { rating: number }) {
  const on = Math.round(rating);
  return (
    <span className="flex gap-1 items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={`fa-solid fa-star star ${i + 1 <= on ? "on" : ""}`} />
      ))}
    </span>
  );
}

export function CourseCard({
  c,
  onView,
  onAdd,
}: {
  c: Course;
  onView: (id: string) => void;
  onAdd: (id: string) => void;
}) {
  return (
    <article className="card overflow-hidden">
      <div className="relative">
        <img src={c.img} alt={c.title} className="w-full h-44 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 to-transparent" />
        <div className="absolute left-4 bottom-4 flex flex-wrap gap-2">
          <span className="chip">
            <i className="fa-solid fa-layer-group text-indigo-600" />
            {topicLabel(c.topic)}
          </span>
          <span className="chip">
            <i className="fa-solid fa-clock text-amber-600" />
            {c.hours}h
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="text-lg font-extrabold">{c.title}</div>

        <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
          <Stars rating={c.rating} />
          <b>{c.rating.toFixed(1)}</b>
          <span className="muted">
            • {new Intl.NumberFormat("vi-VN").format(c.students)} HV
          </span>
        </div>

        <p className="mt-3 text-slate-700 leading-relaxed">{c.desc}</p>

        <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
          <div className="font-extrabold text-indigo-700">{money(c.price)}</div>
          <div className="flex gap-2">
            <button className="btn" onClick={() => onView(c.id)} type="button">
              <i className="fa-solid fa-eye" /> Chi tiết
            </button>
            <button className="btn btn-primary" onClick={() => onAdd(c.id)} type="button">
              <i className="fa-solid fa-cart-plus" /> Thêm
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
