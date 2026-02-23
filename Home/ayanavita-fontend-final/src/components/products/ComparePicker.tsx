// src/components/products/ComparePicker.tsx
import React from "react";
import type { CompareItem } from "../../data/productCompare.data";

export function ComparePicker({
  label,
  value,
  items,
  allowEmpty,
  onChange,
}: {
  label: string;
  value: string;
  items: CompareItem[];
  allowEmpty?: boolean;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-extrabold text-slate-700">{label}</label>
      <select className="field mt-2" value={value} onChange={(e) => onChange(e.target.value)}>
        {allowEmpty ? <option value="">(Không chọn)</option> : null}
        {items.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.id})
          </option>
        ))}
      </select>
    </div>
  );
}
