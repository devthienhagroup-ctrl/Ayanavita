// src/components/products/CompareCells.tsx
import React from "react";
import type { CompareItem } from "../../data/productCompare.data";
import { money } from "../../services/booking.utils";

export function CompareProductCell({ p }: { p?: CompareItem | null }) {
  if (!p) return <span>—</span>;
  return (
    <div className="flex items-center gap-3">
      <img className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200" src={p.img} alt={p.name} />
      <div className="min-w-0">
        <div className="font-extrabold truncate">{p.name}</div>
        <div className="text-xs text-slate-500">{p.id}</div>
      </div>
    </div>
  );
}

export function CompareMoneyCell({ n }: { n?: number | null }) {
  if (typeof n !== "number") return <span>—</span>;
  return <span className="font-extrabold">{money(n)}</span>;
}

export function CompareTextCell({ s }: { s?: string | null }) {
  return <span>{s || "—"}</span>;
}

export function CompareListCell({ list }: { list?: string[] | null }) {
  if (!list?.length) return <span>—</span>;
  return <span>{list.join(", ")}</span>;
}
