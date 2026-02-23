// src/components/services/ServicesPagination.tsx
import React from "react";

type Props = {
  page: number;
  pages: number;
  onPrev: () => void;
  onNext: () => void;
};

export function ServicesPagination({ page, pages, onPrev, onNext }: Props) {
  const canPrev = page > 1;
  const canNext = page < pages;

  return (
    <div className="mt-5 flex items-center justify-between">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className={`rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold hover:bg-slate-50 ${
          !canPrev ? "opacity-50" : ""
        }`}
      >
        Trước
      </button>

      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold">
        Trang {page}/{pages}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className={`rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold hover:bg-slate-50 ${
          !canNext ? "opacity-50" : ""
        }`}
      >
        Sau
      </button>
    </div>
  );
}
