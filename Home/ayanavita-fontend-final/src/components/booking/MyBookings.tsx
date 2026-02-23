// src/components/booking/MyBookings.tsx
import React from "react";
import type { Booking, BookingStatus } from "../../services/booking.storage";
import { money } from "../../services/booking.utils";

function StatusBadge({ status }: { status: BookingStatus }) {
  if (status === "confirmed")
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-extrabold">
        <span className="text-emerald-500">●</span> Confirmed
      </span>
    );
  if (status === "pending")
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-extrabold">
        <span className="text-amber-500">●</span> Pending
      </span>
    );
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-extrabold">
      <span className="text-slate-400">●</span> Cancelled
    </span>
  );
}

export function MyBookings({
  list,
  onSetStatus,
  onClear,
}: {
  list: Booking[];
  onSetStatus: (id: string, status: BookingStatus) => void;
  onClear: () => void;
}) {
  return (
    <div className="mt-4 border-t border-slate-200 pt-4">
      <div className="flex items-center justify-between">
        <div className="font-extrabold">Lịch đã đặt (demo)</div>
        <button
          type="button"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold hover:bg-slate-50"
          onClick={onClear}
        >
          🗑 Xóa
        </button>
      </div>

      <div className="mt-3 grid gap-2">
        {list.length ? (
          list.slice(0, 5).map((b) => (
            <div key={b.id} className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-extrabold">{b.serviceName}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {b.id} • {b.branchName}
                  </div>

                  <div className="mt-2 text-sm text-slate-700">
                    📅 <b>{b.date}</b> <span className="text-slate-400">•</span> 🕒 <b>{b.time}</b>
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Chuyên viên: {b.staffName} • {b.duration} phút • {money(b.price || 0)}
                  </div>
                </div>

                <div className="grid justify-items-end gap-2">
                  <StatusBadge status={b.status} />
                  <div className="flex gap-2">
                    <button
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold hover:bg-white"
                      onClick={() => onSetStatus(b.id, "pending")}
                      type="button"
                    >
                      Chờ
                    </button>
                    <button
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold hover:bg-white"
                      onClick={() => onSetStatus(b.id, "cancelled")}
                      type="button"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-600">
            Chưa có lịch hẹn. Hãy tạo lịch hẹn ở form bên trái.
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-slate-500">
        Lưu localStorage: <b>aya_bookings_v1</b>
      </div>
    </div>
  );
}
