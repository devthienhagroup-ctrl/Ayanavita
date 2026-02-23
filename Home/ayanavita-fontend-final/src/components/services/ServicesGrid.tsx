// src/components/services/ServicesGrid.tsx
import React from "react";
import { ServiceCard } from "./ServiceCard";
import { Service } from "../../data/services";


export function ServicesGrid({ items }: { items: Service[] }) {
  if (!items.length) {
    return (
      <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200 text-slate-600 shadow-sm">
        Không có dịch vụ phù hợp bộ lọc.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s) => (
        <ServiceCard key={s.id} s={s} />
      ))}
    </div>
  );
}
