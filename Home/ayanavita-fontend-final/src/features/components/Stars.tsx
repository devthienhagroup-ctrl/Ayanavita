import React from "react";

function Star({ on }: { on: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={on ? "h-5 w-5 text-amber-500" : "h-5 w-5 text-slate-300"}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 17.3l-6.18 3.25 1.18-6.9L1.99 8.9l6.92-1L12 1.6l3.09 6.3 6.92 1-5.01 4.75 1.18 6.9z" />
    </svg>
  );
}

export function StarsRow({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "h-6 w-6" : "h-5 w-5";
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={cls}>
          <Star on={i + 1 <= value} />
        </div>
      ))}
    </div>
  );
}

export function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="mt-2 flex items-center gap-2">
      {Array.from({ length: 5 }).map((_, i) => {
        const v = i + 1;
        return (
          <button
            key={v}
            type="button"
            className="rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 h-11 w-11 inline-flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-indigo-500/15"
            onClick={() => onChange(v)}
            aria-label={`Chọn ${v} sao`}
          >
            <Star on={v <= value} />
          </button>
        );
      })}
    </div>
  );
}
