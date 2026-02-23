// src/components/services/ServiceCard.tsx
import React from "react";
import type { Service } from "../../data/services";

const fmtVND = (n: number) => "₫ " + new Intl.NumberFormat("vi-VN").format(Number(n || 0));

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <span className="inline-flex items-center gap-1 text-amber-500">
      {Array.from({ length: full }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </span>
  );
}

export function ServiceCard({ s }: { s: Service }) {
  return (
    <article className="rounded-3xl bg-white p-4 ring-1 ring-slate-200 shadow-sm">
      <img
        className="h-36 w-full rounded-2xl object-cover ring-1 ring-slate-200"
        src={s.img}
        alt={s.name}
        loading="lazy"
      />

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <div className="font-extrabold">{s.name}</div>
          <div className="text-xs text-slate-500">
            {s.id} • {s.dur} phút
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-extrabold">
          <span className="text-emerald-600">🏷</span> {fmtVND(s.price)}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <Stars rating={s.rating} /> <b>{s.rating.toFixed(1)}</b>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-extrabold">
          <span className="text-rose-600">🔥</span> {s.tag}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <a
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-extrabold hover:bg-slate-50"
          href="/service-detail"
        >
          Chi tiết
        </a>
        <a
          className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-3 text-center text-sm font-extrabold text-white ring-1 ring-indigo-200 hover:opacity-95"
          href="/booking"
        >
          Đặt
        </a>
      </div>
    </article>
  );
}
