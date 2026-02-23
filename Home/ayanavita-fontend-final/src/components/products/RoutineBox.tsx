// src/components/products/RoutineBox.tsx
import React from "react";
import type { CompareItem } from "../../data/productCompare.data";

export function RoutineBox({ A, B, C }: { A?: CompareItem | null; B?: CompareItem | null; C?: CompareItem | null }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <div className="font-extrabold">Routine đề xuất (demo)</div>
      <ol className="mt-2 space-y-2 text-sm text-slate-700">
        <li>
          1) Làm sạch: <b>{A?.name || "—"}</b>
        </li>
        <li>
          2) Treatment/Serum: <b>{B?.name || "—"}</b>
        </li>
        <li>
          3) Dưỡng khoá ẩm: <b>{C?.name || "Kem dưỡng ban đêm"}</b>
        </li>
      </ol>
      <div className="mt-2 text-sm text-slate-600">Bạn có thể tuỳ chỉnh theo loại da và mục tiêu.</div>
    </div>
  );
}
