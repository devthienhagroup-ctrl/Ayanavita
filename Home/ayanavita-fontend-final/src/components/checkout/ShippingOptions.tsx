// src/components/checkout/ShippingOptions.tsx
import React from "react";
import type { ShippingMethod } from "../../services/productCheckout.utils";

export function ShippingOptions({
  value,
  onChange,
}: {
  value: ShippingMethod;
  onChange: (v: ShippingMethod) => void;
}) {
  return (
    <div className="mt-5 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
      <div className="font-extrabold">Tuỳ chọn giao hàng</div>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <label className={`radio ${value === "standard" ? "active" : ""}`} onClick={() => onChange("standard")}>
          <input type="radio" name="ship" checked={value === "standard"} readOnly className="mt-1" />
          <div>
            <div className="font-extrabold">Giao tiêu chuẩn</div>
            <div className="text-sm muted">
              24–48h (demo) • <b>₫ 30.000</b> (miễn phí đơn ≥ ₫ 1.000.000)
            </div>
          </div>
        </label>

        <label className={`radio ${value === "fast" ? "active" : ""}`} onClick={() => onChange("fast")}>
          <input type="radio" name="ship" checked={value === "fast"} readOnly className="mt-1" />
          <div>
            <div className="font-extrabold">Giao nhanh</div>
            <div className="text-sm muted">
              2–4h nội thành (demo) • <b>₫ 60.000</b>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}
