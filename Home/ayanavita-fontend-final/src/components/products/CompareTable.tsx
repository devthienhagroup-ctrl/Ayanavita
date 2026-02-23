// src/components/products/CompareTable.tsx
import React, { useMemo } from "react";
import type { CompareItem } from "../../data/productCompare.data";
import { money } from "../../services/booking.utils";
import { pricePerMl } from "../../services/productCompare.utils";
import {
  CompareListCell,
  CompareMoneyCell,
  CompareProductCell,
  CompareTextCell,
} from "./CompareCells";

function Row({
  label,
  a,
  b,
  c,
}: {
  label: string;
  a: React.ReactNode;
  b: React.ReactNode;
  c: React.ReactNode;
}) {
  return (
    <tr className="border-b border-slate-100">
      <td className="py-3 pr-4 font-extrabold text-slate-700">{label}</td>
      <td className="py-3 pr-4">{a}</td>
      <td className="py-3 pr-4">{b}</td>
      <td className="py-3 pr-4">{c}</td>
    </tr>
  );
}

export function CompareTable({
  A,
  B,
  C,
}: {
  A?: CompareItem | null;
  B?: CompareItem | null;
  C?: CompareItem | null;
}) {
  const perA = useMemo(() => pricePerMl(A), [A]);
  const perB = useMemo(() => pricePerMl(B), [B]);
  const perC = useMemo(() => pricePerMl(C), [C]);

  return (
    <div className="mt-5 overflow-auto">
      <table className="w-full min-w-[980px] text-sm">
        <thead className="text-left text-slate-500">
          <tr className="border-b border-slate-200">
            <th className="py-3 pr-4">Tiêu chí</th>
            <th className="py-3 pr-4">A</th>
            <th className="py-3 pr-4">B</th>
            <th className="py-3 pr-4">C</th>
          </tr>
        </thead>
        <tbody className="text-slate-700">
          <Row label="Sản phẩm" a={<CompareProductCell p={A} />} b={<CompareProductCell p={B} />} c={<CompareProductCell p={C} />} />
          <Row label="Loại" a={<CompareTextCell s={A?.type} />} b={<CompareTextCell s={B?.type} />} c={<CompareTextCell s={C?.type} />} />
          <Row label="Giá" a={<CompareMoneyCell n={A?.price} />} b={<CompareMoneyCell n={B?.price} />} c={<CompareMoneyCell n={C?.price} />} />
          <Row label="Dung tích" a={<CompareTextCell s={A ? `${A.ml} ml` : ""} />} b={<CompareTextCell s={B ? `${B.ml} ml` : ""} />} c={<CompareTextCell s={C ? `${C.ml} ml` : ""} />} />
          <Row
            label="Giá/ML"
            a={<CompareTextCell s={perA ? `${money(perA)}/ml` : ""} />}
            b={<CompareTextCell s={perB ? `${money(perB)}/ml` : ""} />}
            c={<CompareTextCell s={perC ? `${money(perC)}/ml` : ""} />}
          />
          <Row label="Đánh giá" a={<CompareTextCell s={A ? `${A.rating}★` : ""} />} b={<CompareTextCell s={B ? `${B.rating}★` : ""} />} c={<CompareTextCell s={C ? `${C.rating}★` : ""} />} />
          <Row label="Thành phần nổi bật" a={<CompareListCell list={A?.key} />} b={<CompareListCell list={B?.key} />} c={<CompareListCell list={C?.key} />} />
          <Row label="Công dụng" a={<CompareTextCell s={A?.benefit} />} b={<CompareTextCell s={B?.benefit} />} c={<CompareTextCell s={C?.benefit} />} />
          <Row label="Phù hợp" a={<CompareTextCell s={A?.skin} />} b={<CompareTextCell s={B?.skin} />} c={<CompareTextCell s={C?.skin} />} />
        </tbody>
      </table>
    </div>
  );
}
