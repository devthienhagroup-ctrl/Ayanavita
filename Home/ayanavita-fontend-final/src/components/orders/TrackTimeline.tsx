// src/components/orders/TrackTimeline.tsx
import React from "react";
import { TRACK_STEPS } from "../../data/orderTracking.data";

export function TrackTimeline({ step, updatedAtISO }: { step: number; updatedAtISO?: string }) {
  const dateText = (updatedAtISO || new Date().toISOString()).slice(0, 10);

  return (
    <div className="mt-4 grid gap-2">
      {TRACK_STEPS.map((s, i) => {
        const done = i <= step;
        return (
          <div key={s.t} className="flex gap-3 items-start">
            <div className="flex flex-col items-center">
              <div
                className={[
                  "h-3.5 w-3.5 rounded-full border-[3px] mt-1",
                  done ? "border-emerald-500" : "border-slate-300",
                ].join(" ")}
              />
              {i < TRACK_STEPS.length - 1 ? (
                <div className={["w-0.5 h-9", done ? "bg-emerald-500" : "bg-slate-300"].join(" ")} />
              ) : null}
            </div>

            <div className="pb-2">
              <div className="font-extrabold">{s.t}</div>
              <div className="text-sm text-slate-600">{s.d}</div>
              <div className="text-xs text-slate-500 mt-1">Cập nhật: {dateText} (demo)</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
