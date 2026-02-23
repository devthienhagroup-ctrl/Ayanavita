// src/components/services/ServicesHero.tsx
import React from "react";

export function ServicesHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm">
      <div className="relative">
        <img
          className="h-52 w-full object-cover"
          alt="services"
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/55 to-indigo-700/20" />
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="text-xs font-extrabold text-white/80">Dịch vụ AYANAVITA</div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Trải nghiệm Spa chuyên sâu, chuẩn hoá theo hệ thống
          </h1>

          <div className="mt-2 flex gap-2 flex-wrap">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold">
              <span className="text-emerald-600">●</span> Quy trình chuẩn
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold">
              <span className="text-indigo-600">●</span> Chuyên viên
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold">
              <span className="text-amber-500">★</span> Đánh giá cao
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
