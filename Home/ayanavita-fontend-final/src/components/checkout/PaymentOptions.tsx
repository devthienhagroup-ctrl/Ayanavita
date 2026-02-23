// src/components/checkout/PaymentOptions.tsx
import React from "react";
import type { PayMethod } from "../../services/productCheckout.utils";

export function PaymentOptions({
  value,
  onChange,
  bankContent,
  walletCode,
}: {
  value: PayMethod;
  onChange: (v: PayMethod) => void;
  bankContent: string;
  walletCode: string;
}) {
  return (
    <div className="mt-5 grid gap-2">
      <label className={`radio ${value === "card" ? "active" : ""}`} onClick={() => onChange("card")}>
        <input type="radio" name="pay" checked={value === "card"} readOnly className="mt-1" />
        <div className="w-full">
          <div className="flex items-center justify-between gap-2">
            <div className="font-extrabold">Thẻ (Card) – Stripe/PayOS (demo)</div>
            <div className="flex gap-2 text-slate-500">
              <i className="fa-brands fa-cc-visa" />
              <i className="fa-brands fa-cc-mastercard" />
              <i className="fa-brands fa-cc-amex" />
            </div>
          </div>
          <div className="text-sm muted mt-1">Thanh toán ngay để xác nhận đơn.</div>

          {value === "card" ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-extrabold text-slate-700">Số thẻ (demo)</label>
                <input className="field mt-2" placeholder="4242 4242 4242 4242" />
              </div>
              <div>
                <label className="text-sm font-extrabold text-slate-700">Hết hạn</label>
                <input className="field mt-2" placeholder="MM/YY" />
              </div>
              <div>
                <label className="text-sm font-extrabold text-slate-700">CVC</label>
                <input className="field mt-2" placeholder="123" />
              </div>
            </div>
          ) : null}
        </div>
      </label>

      <label className={`radio ${value === "bank" ? "active" : ""}`} onClick={() => onChange("bank")}>
        <input type="radio" name="pay" checked={value === "bank"} readOnly className="mt-1" />
        <div className="w-full">
          <div className="font-extrabold">Chuyển khoản ngân hàng</div>
          <div className="text-sm muted mt-1">Xác nhận sau khi nhận tiền (demo).</div>

          {value === "bank" ? (
            <div className="mt-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm">
              <div className="font-extrabold">Thông tin nhận chuyển khoản (demo)</div>
              <div className="mt-2 text-slate-700">
                • Ngân hàng: <b>Vietcombank</b>
                <br />• STK: <b>0123 456 789</b>
                <br />• Chủ TK: <b>AYANAVITA</b>
                <br />• Nội dung: <b>{bankContent}</b>
              </div>
            </div>
          ) : null}
        </div>
      </label>

      <label className={`radio ${value === "wallet" ? "active" : ""}`} onClick={() => onChange("wallet")}>
        <input type="radio" name="pay" checked={value === "wallet"} readOnly className="mt-1" />
        <div className="w-full">
          <div className="font-extrabold">Ví điện tử (MoMo/ZaloPay)</div>
          <div className="text-sm muted mt-1">Chuyển hướng sang ví để thanh toán (demo).</div>

          {value === "wallet" ? (
            <div className="mt-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm">
              <div className="font-extrabold">Mô phỏng QR</div>
              <div className="mt-2 text-slate-700 flex items-center gap-3">
                <div className="h-20 w-20 rounded-2xl bg-white ring-1 ring-slate-200 flex items-center justify-center">
                  <i className="fa-solid fa-qrcode text-2xl text-slate-700" />
                </div>
                <div>
                  Quét QR để thanh toán (demo).
                  <br />
                  Mã đơn: <b>{walletCode}</b>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </label>
    </div>
  );
}
