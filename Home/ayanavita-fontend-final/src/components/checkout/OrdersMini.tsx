// src/components/checkout/OrdersMini.tsx
import React from "react";
import type { Order } from "../../services/productCheckout.utils";
import { money } from "../../services/booking.utils";

export function OrdersMini({ orders }: { orders: Order[] }) {
  const list = orders.slice(0, 5);

  return (
    <div className="card p-6">
      <div className="font-extrabold">Lịch sử đơn (demo)</div>
      <div className="mt-3 text-sm muted">Lưu localStorage. Khi làm thật: /orders của user.</div>

      <div className="mt-3 grid gap-2">
        {list.length ? (
          list.map((o) => (
            <div key={o.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-extrabold">{o.code}</div>
                  <div className="text-sm muted">{o.createdAt}</div>
                  <div className="text-sm text-slate-700 mt-1">
                    Tổng: <b>{money(o.total)}</b>
                  </div>
                </div>
                <span className="chip">
                  <i className={`fa-solid fa-circle ${o.payStatus === "PAID" ? "text-emerald-500" : "text-amber-500"}`} />
                  {o.payStatus === "PAID" ? "Đã thanh toán" : "Chờ thanh toán"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-700">Chưa có đơn.</div>
        )}
      </div>
    </div>
  );
}
