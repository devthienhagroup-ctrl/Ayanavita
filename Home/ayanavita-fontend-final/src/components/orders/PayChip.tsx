// src/components/orders/PayChip.tsx
import React, { useMemo } from "react";
import type { PaymentStatus } from "../../data/orderTracking.data";

function payChip(st: PaymentStatus) {
  if (st === "paid")
    return { txt: "Đã thanh toán", cls: "text-emerald-700 bg-emerald-50 ring-emerald-200" };
  if (st === "refund")
    return { txt: "Hoàn tiền", cls: "text-rose-700 bg-rose-50 ring-rose-200" };
  return { txt: "Chưa thanh toán", cls: "text-amber-700 bg-amber-50 ring-amber-200" };
}

export function PayChip({ status }: { status: PaymentStatus }) {
  const p = useMemo(() => payChip(status), [status]);
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold ring-1 ${p.cls}`}>
      <i className="fa-solid fa-credit-card" />
      {p.txt}
    </span>
  );
}
