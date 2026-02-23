import React from "react";

export function Stars({
  value,
  sizeClass = "text-base",
  onClass = "text-amber-500",
  offClass = "text-slate-300",
}: {
  value: number;
  sizeClass?: string;
  onClass?: string;
  offClass?: string;
}) {
  const v = Math.max(0, Math.min(5, Number(value || 0)));
  const rounded = Math.round(v * 2) / 2; // allow .5
  const full = Math.floor(rounded);
  const half = rounded - full >= 0.5;

  return (
    <span className={`inline-flex items-center gap-1 ${sizeClass}`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        if (idx <= full) return <i key={idx} className={`fa-solid fa-star ${onClass}`} />;
        if (idx === full + 1 && half) return <i key={idx} className={`fa-solid fa-star-half-stroke ${onClass}`} />;
        return <i key={idx} className={`fa-solid fa-star ${offClass}`} />;
      })}
    </span>
  );
}
