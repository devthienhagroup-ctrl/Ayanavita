// src/components/booking/ToastStack.tsx
import React from "react";
import type { ToastItem } from "../../services/useToast";

export function ToastStack({
  items,
  onClose,
}: {
  items: ToastItem[];
  onClose: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-[90] grid w-[min(420px,calc(100vw-32px))] gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className="flex gap-3 rounded-2xl border border-white/10 bg-slate-900 p-3 text-white shadow-2xl"
        >
          <div className="mt-0.5 text-emerald-400">●</div>
          <div className="min-w-0">
            <div className="font-extrabold">{t.title}</div>
            {t.desc ? <div className="mt-0.5 text-sm text-white/80">{t.desc}</div> : null}
          </div>
          <button
            className="ml-auto opacity-80 hover:opacity-100"
            aria-label="close"
            onClick={() => onClose(t.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
