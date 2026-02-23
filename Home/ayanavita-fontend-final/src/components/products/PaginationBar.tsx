// src/components/products/PaginationBar.tsx
import React from "react";

export function PaginationBar({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="mt-5 flex items-center justify-between">
      <button className={`btn ${prevDisabled ? "opacity-50" : ""}`} type="button" disabled={prevDisabled} onClick={onPrev}>
        Trước
      </button>
      <div className="chip">
        Trang <span className="font-extrabold">{page}</span>/<span className="font-extrabold">{totalPages}</span>
      </div>
      <button className={`btn ${nextDisabled ? "opacity-50" : ""}`} type="button" disabled={nextDisabled} onClick={onNext}>
        Sau
      </button>
    </div>
  );
}
