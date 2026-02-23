// src/components/services/ServicesFilters.tsx
import React from "react";
import { ServicesFilters } from "../../services/useServicesQuery";


type Props = {
  value: ServicesFilters;
  onChange: (next: ServicesFilters) => void;
  onReset: () => void;
};

export function ServicesFiltersPanel({ value, onChange, onReset }: Props) {
  const set = <K extends keyof ServicesFilters>(k: K, v: ServicesFilters[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <aside className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="font-extrabold">Bộ lọc dịch vụ</div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white font-extrabold hover:bg-slate-50"
          title="Reset"
        >
          ↺
        </button>
      </div>

      <div className="mt-3">
        <label className="text-sm font-extrabold text-slate-700">Tìm theo tên</label>
        <input
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-100"
          placeholder="VD: chăm sóc da, trị liệu..."
          value={value.q}
          onChange={(e) => set("q", e.target.value)}
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-extrabold text-slate-700">Danh mục</label>
        <select
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-100"
          value={value.cat}
          onChange={(e) => set("cat", e.target.value as any)}
        >
          <option value="all">Tất cả</option>
          <option value="skin">Chăm sóc da</option>
          <option value="body">Body / Thư giãn</option>
          <option value="health">Sức khoẻ trị liệu</option>
          <option value="package">Gói liệu trình</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="text-sm font-extrabold text-slate-700">Mục tiêu</label>
        <select
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-100"
          value={value.goal}
          onChange={(e) => set("goal", e.target.value as any)}
        >
          <option value="all">Tất cả</option>
          <option value="relax">Thư giãn</option>
          <option value="acne">Giảm mụn</option>
          <option value="bright">Sáng da</option>
          <option value="restore">Phục hồi</option>
          <option value="pain">Giảm đau nhức</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="text-sm font-extrabold text-slate-700">Thời lượng</label>
        <select
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-100"
          value={value.dur}
          onChange={(e) => set("dur", e.target.value as any)}
        >
          <option value="all">Tất cả</option>
          <option value="lt60">&lt; 60 phút</option>
          <option value="60-90">60–90 phút</option>
          <option value="gt90">&gt; 90 phút</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="text-sm font-extrabold text-slate-700">Sắp xếp</label>
        <select
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-100"
          value={value.sort}
          onChange={(e) => set("sort", e.target.value as any)}
        >
          <option value="popular">Phổ biến</option>
          <option value="priceAsc">Giá tăng</option>
          <option value="priceDesc">Giá giảm</option>
          <option value="rating">Đánh giá</option>
        </select>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-700">
        Demo: filter + sort realtime bằng React state (không cần JS DOM).
      </div>
    </aside>
  );
}
