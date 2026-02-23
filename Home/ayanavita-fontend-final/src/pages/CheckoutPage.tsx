// src/pages/CheckoutPage.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SiteHeader } from "../components/layout/SiteHeader";
import { Footer } from "../components/layout/Footer";

import { readProductCart, clearProductCart } from "../services/productCart.utils";
import { money } from "../services/booking.utils";

import {
  COUPONS,
  calcDiscount,
  calcShipFee,
  calcSubtotal,
  calcTotal,
  buildOrderItems,
  fmtOrderCode,
  payStatusByMethod,
  readCheckoutDraft,
  writeCheckoutDraft,
  readOrders,
  writeOrders,
  uid,
  type CheckoutDraft,
  type Order,
  type PayMethod,
  type ShippingMethod,
} from "../services/productCheckout.utils";

import { CheckoutSteps } from "../components/checkout/CheckoutSteps";
import { ShippingOptions } from "../components/checkout/ShippingOptions";
import { PaymentOptions } from "../components/checkout/PaymentOptions";
import { OrderSummary } from "../components/checkout/OrderSummary";
import { OrdersMini } from "../components/checkout/OrdersMini";

export default function CheckoutPage() {
  const nav = useNavigate();

  // cart
  const cart = useMemo(() => readProductCart(), []);
  const items = useMemo(() => buildOrderItems(cart), [cart]);

  // draft
  const [draft, setDraft] = useState<CheckoutDraft>(() => readCheckoutDraft());
  const [agree, setAgree] = useState(false);

  // orders
  const [orders, setOrders] = useState<Order[]>(() => readOrders());

  // voucher ui
  const [voucherInput, setVoucherInput] = useState(draft.voucherCode || "");
  const [voucherNote, setVoucherNote] = useState("");

  const subtotal = useMemo(() => calcSubtotal(items), [items]);
  const discount = useMemo(() => calcDiscount(subtotal, draft.voucherCode), [subtotal, draft.voucherCode]);
  const shipFee = useMemo(() => calcShipFee(subtotal, draft.shipping, draft.voucherCode), [subtotal, draft.shipping, draft.voucherCode]);
  const total = useMemo(() => calcTotal(subtotal, discount, shipFee), [subtotal, discount, shipFee]);

  const bankContent = useMemo(() => orders[0]?.code || "AYA-ORDER", [orders]);
  const walletCode = useMemo(() => orders[0]?.code || "AYA-ORDER", [orders]);

  function patchDraft(p: Partial<CheckoutDraft>) {
    const next = { ...draft, ...p };
    setDraft(next);
    writeCheckoutDraft(next);
  }

  function setShip(v: ShippingMethod) {
    patchDraft({ shipping: v });
  }

  function setPay(v: PayMethod) {
    patchDraft({ payMethod: v });
  }

  function applyVoucher() {
    const code = voucherInput.trim().toUpperCase();

    if (!code) {
      patchDraft({ voucherCode: "" });
      setVoucherNote("Đã xóa voucher.");
      return;
    }

    if (code !== "AYA10" && code !== "FREESHIP") {
      setVoucherNote("Voucher không hợp lệ (demo).");
      return;
    }

    patchDraft({ voucherCode: code });
    setVoucherNote(COUPONS[code as "AYA10" | "FREESHIP"].note);
  }

  function validate() {
    if (!items.length) return false;
    if (!agree) return false;
    if (!draft.name.trim()) return false;
    if (!draft.phone.trim()) return false;
    if (!draft.addr.trim()) return false;
    if (!draft.city.trim()) return false;
    if (!draft.district.trim()) return false;
    return true;
  }

  function createOrder() {
    const code = fmtOrderCode();
    const order: Order = {
      id: uid("ORD"),
      code,
      createdAt: new Date().toISOString(),
      customer: {
        name: draft.name.trim(),
        phone: draft.phone.trim(),
        email: draft.email.trim(),
        addr: draft.addr.trim(),
        city: draft.city.trim(),
        district: draft.district.trim(),
        note: draft.note.trim(),
      },
      shipping: draft.shipping,
      payMethod: draft.payMethod,
      voucherCode: draft.voucherCode,
      subtotal,
      discount,
      shipFee,
      total,
      payStatus: payStatusByMethod(draft.payMethod),
      items,
    };

    const nextOrders = [order, ...orders];
    setOrders(nextOrders);
    writeOrders(nextOrders);

    // Optional: nếu muốn clear cart sau order, bật dòng dưới:
    // clearProductCart();

    return order;
  }

  const step: 1 | 2 | 3 = useMemo(() => {
    if (!draft.name && !draft.phone) return 1;
    if (!agree) return 2;
    return 3;
  }, [draft.name, draft.phone, agree]);

  return (
    <div className="text-slate-900">
      <SiteHeader active="products" />

      <div
        className="py-6"
        style={{
          background:
            "radial-gradient(900px 420px at 10% 20%, rgba(245,158,11,0.18), transparent 60%), radial-gradient(900px 420px at 90% 10%, rgba(124,58,237,0.18), transparent 60%), linear-gradient(135deg, rgba(79,70,229,0.08), rgba(255,255,255,0) 55%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-xs font-extrabold text-slate-500">Checkout</div>
              <div className="text-2xl font-extrabold">Thanh toán sản phẩm</div>
              <div className="mt-1 text-sm text-slate-600">
                Prototype: nối API tạo order + payment sau.
              </div>
            </div>

            <CheckoutSteps step={step} />

            <button className="btn" type="button" onClick={() => nav(-1)}>
              <i className="fa-solid fa-arrow-left mr-2" />
              Quay lại
            </button>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3 items-start">
            {/* Left */}
            <section className="lg:col-span-2 grid gap-5">
              {/* Customer */}
              <div className="card p-6">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-xs font-extrabold muted">Bước 1</div>
                    <div className="text-2xl font-extrabold">Thông tin giao hàng</div>
                  </div>
                  <span className="badge">
                    <i className="fa-solid fa-lock" /> SSL
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-extrabold text-slate-700">Họ và tên *</label>
                    <input className="field mt-2" value={draft.name} onChange={(e) => patchDraft({ name: e.target.value })} placeholder="Ví dụ: Lê Hiếu" />
                  </div>

                  <div>
                    <label className="text-sm font-extrabold text-slate-700">Số điện thoại *</label>
                    <input className="field mt-2" value={draft.phone} onChange={(e) => patchDraft({ phone: e.target.value })} placeholder="Ví dụ: 090xxxxxxx" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-extrabold text-slate-700">Email</label>
                    <input className="field mt-2" value={draft.email} onChange={(e) => patchDraft({ email: e.target.value })} placeholder="email@example.com" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-extrabold text-slate-700">Địa chỉ *</label>
                    <input className="field mt-2" value={draft.addr} onChange={(e) => patchDraft({ addr: e.target.value })} placeholder="Số nhà, đường, phường/xã..." />
                  </div>

                  <div>
                    <label className="text-sm font-extrabold text-slate-700">Tỉnh/TP *</label>
                    <select className="field mt-2" value={draft.city} onChange={(e) => patchDraft({ city: e.target.value })}>
                      <option value="">Chọn Tỉnh/TP</option>
                      <option>TP. Hồ Chí Minh</option>
                      <option>Hà Nội</option>
                      <option>Đà Nẵng</option>
                      <option>Cần Thơ</option>
                      <option>Hải Phòng</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-extrabold text-slate-700">Quận/Huyện *</label>
                    <input className="field mt-2" value={draft.district} onChange={(e) => patchDraft({ district: e.target.value })} placeholder="Ví dụ: Quận 1" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-extrabold text-slate-700">Ghi chú (tuỳ chọn)</label>
                    <textarea className="field mt-2" rows={3} value={draft.note} onChange={(e) => patchDraft({ note: e.target.value })} placeholder="Khung giờ nhận hàng, lưu ý cho shipper..." />
                  </div>
                </div>

                <ShippingOptions value={draft.shipping} onChange={setShip} />

                {subtotal >= 1_000_000 ? (
                  <div className="mt-4 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200 text-sm text-emerald-800 font-extrabold">
                    Đơn ≥ {money(1_000_000)} → miễn phí ship tiêu chuẩn (demo).
                  </div>
                ) : null}
              </div>

              {/* Payment */}
              <div className="card p-6">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-xs font-extrabold muted">Bước 2</div>
                    <div className="text-2xl font-extrabold">Phương thức thanh toán</div>
                    <div className="mt-1 text-sm text-slate-700">Mô phỏng: Card / Chuyển khoản / Ví.</div>
                  </div>
                  <span className="chip">
                    <i className="fa-solid fa-credit-card text-indigo-600" /> Payments
                  </span>
                </div>

                <PaymentOptions value={draft.payMethod} onChange={setPay} bankContent={bankContent} walletCode={walletCode} />

                <div className="mt-5 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-slate-300"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                    />
                    <span className="text-sm text-slate-700">
                      Tôi đồng ý với <a className="underline font-extrabold" href="#">điều khoản</a> và{" "}
                      <a className="underline font-extrabold" href="#">chính sách</a>.
                    </span>
                  </label>
                  <div className="mt-2 text-xs muted">Prototype: khi làm thật, bạn log consent + version điều khoản.</div>
                </div>
              </div>

              {/* Confirm */}
              <div className="card p-6">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-xs font-extrabold muted">Bước 3</div>
                    <div className="text-2xl font-extrabold">Xác nhận & tạo đơn</div>
                    <div className="mt-1 text-sm text-slate-700">Nút “Thanh toán” sẽ tạo order + mô phỏng trạng thái.</div>
                  </div>
                  <span className="chip">
                    <i className="fa-solid fa-receipt text-amber-600" /> Order
                  </span>
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      if (!validate()) {
                        window.alert("Vui lòng nhập đủ thông tin bắt buộc và đồng ý điều khoản.");
                        return;
                      }
                      const o = createOrder();
                      window.alert(
                        `Đã tạo đơn ${o.code} • Tổng ${money(o.total)} • Trạng thái: ${o.payStatus === "PAID" ? "Đã thanh toán" : "Chờ thanh toán"} (demo)`
                      );
                    }}
                    disabled={!items.length}
                  >
                    <i className="fa-solid fa-lock mr-2" />
                    Thanh toán & tạo đơn
                  </button>

                  <button className="btn" type="button" onClick={() => writeCheckoutDraft(draft)}>
                    <i className="fa-solid fa-floppy-disk mr-2" />
                    Lưu thông tin (demo)
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      if (!window.confirm("Clear cart sau checkout (demo)?")) return;
                      clearProductCart();
                      window.location.reload();
                    }}
                    disabled={!items.length}
                  >
                    <i className="fa-solid fa-trash mr-2" />
                    Clear cart
                  </button>
                </div>
              </div>
            </section>

            {/* Right */}
            <aside className="stickyBox grid gap-4">
              <OrderSummary
                items={items}
                voucherCode={voucherInput}
                onVoucherChange={setVoucherInput}
                onApplyVoucher={applyVoucher}
                voucherNote={voucherNote}
                subtotal={subtotal}
                discount={discount}
                shipFee={shipFee}
                total={total}
                shipping={draft.shipping}
              />

              <OrdersMini orders={orders} />
            </aside>
          </div>

          <div className="mt-8 text-center text-sm muted">
            © 2025 AYANAVITA • Checkout prototype (React)
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
