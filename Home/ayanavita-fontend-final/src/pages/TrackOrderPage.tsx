import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { SiteHeader } from "../components/layout/SiteHeader";
import { Footer } from "../components/layout/Footer";
import { money } from "../services/booking.utils";

type PayStatus = "unpaid" | "paid" | "refund";

const ORDER_DEMO = {
  code: "AYA-24001",
  phone: "0900000000",
  name: "Khách hàng Demo",
  addr: "Q.1, TP.HCM",
  sub: 837000,
  ship: 25000,
  total: 862000,
  paymentStatus: "unpaid" as PayStatus,
  step: 2, // 0..4
};

const STEPS = [
  { t: "Đã tạo đơn", d: "Đơn hàng được ghi nhận trên hệ thống." },
  { t: "Đang xử lý", d: "Đóng gói sản phẩm và xác nhận tồn kho." },
  { t: "Đang giao", d: "Đơn vị vận chuyển đang giao hàng." },
  { t: "Giao thành công", d: "Khách đã nhận hàng." },
  { t: "Hoàn tất", d: "Kết thúc đơn hàng, có thể đánh giá." },
];

function payChip(st: PayStatus) {
  if (st === "paid") return { txt: "Đã thanh toán", cls: "text-emerald-700 bg-emerald-50 ring-emerald-200" };
  if (st === "refund") return { txt: "Hoàn tiền", cls: "text-rose-700 bg-rose-50 ring-rose-200" };
  return { txt: "Chưa thanh toán", cls: "text-amber-700 bg-amber-50 ring-amber-200" };
}

export default function TrackOrderPage() {
  const [orderCode, setOrderCode] = useState(ORDER_DEMO.code);
  const [phone, setPhone] = useState(ORDER_DEMO.phone);

  const [state, setState] = useState({ ...ORDER_DEMO });
  const [visible, setVisible] = useState(true);

  const chip = useMemo(() => payChip(state.paymentStatus), [state.paymentStatus]);

  function lookup() {
    const c = orderCode.trim();
    const p = phone.trim();
    if (c !== ORDER_DEMO.code || p !== ORDER_DEMO.phone) {
      window.alert("Không tìm thấy đơn (demo). Dùng: AYA-24001 / 0900000000");
      setVisible(false);
      return;
    }
    setVisible(true);
  }

  function fakeNext() {
    setState((cur) => {
      const nextStep = Math.min(4, cur.step + 1);
      const pay: PayStatus = nextStep >= 2 ? "paid" : cur.paymentStatus;
      return { ...cur, step: nextStep, paymentStatus: pay };
    });
    setVisible(true);
  }

  return (
    <div className="text-slate-900">
      <SiteHeader />

      <main className="px-4 pb-10">
        <div className="max-w-5xl mx-auto grid gap-4 lg:grid-cols-3">
          <section className="card p-6 lg:col-span-2">
            <div className="text-xs font-extrabold text-slate-500">Tra cứu</div>
            <h1 className="text-2xl font-extrabold">Theo dõi đơn hàng</h1>
            <div className="mt-1 text-sm text-slate-600">Nhập mã đơn và số điện thoại để xem trạng thái vận chuyển (demo).</div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="text-sm font-extrabold text-slate-700">Mã đơn</label>
                <input className="field mt-2" value={orderCode} onChange={(e) => setOrderCode(e.target.value)} placeholder="VD: AYA-24001" />
              </div>
              <div>
                <label className="text-sm font-extrabold text-slate-700">Số điện thoại</label>
                <input className="field mt-2" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="VD: 09xxxxxxx" />
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button className="btn btn-primary" type="button" onClick={lookup}>
                <i className="fa-solid fa-magnifying-glass mr-2" />Tra cứu
              </button>
              <button className="btn" type="button" onClick={fakeNext}>
                <i className="fa-solid fa-forward mr-2" />Giả lập tiến trình
              </button>
            </div>

            {visible ? (
              <div className="mt-5">
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-extrabold">Đơn hàng: <span>{state.code}</span></div>
                      <div className="text-sm text-slate-600 mt-1">Người nhận: <b>{state.name}</b> • {state.addr}</div>
                    </div>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold ring-1 ${chip.cls}`}>
                      <i className="fa-solid fa-credit-card" />{chip.txt}
                    </span>
                  </div>
                </div>

                <div className="mt-4 card p-5">
                  <div className="font-extrabold">Timeline</div>
                  <div className="mt-4 grid gap-2">
                    {STEPS.map((s, i) => {
                      const done = i <= state.step;
                      return (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="flex flex-col items-center">
                            <div className={`h-4 w-4 rounded-full border-[3px] ${done ? "border-emerald-500" : "border-slate-300"}`} />
                            {i < STEPS.length - 1 ? (
                              <div className={`w-[2px] h-9 ${done ? "bg-emerald-500" : "bg-slate-300/70"}`} />
                            ) : null}
                          </div>
                          <div className="pb-2">
                            <div className="font-extrabold">{s.t}</div>
                            <div className="text-sm text-slate-600">{s.d}</div>
                            <div className="text-xs text-slate-500 mt-1">Cập nhật: {new Date().toISOString().slice(0, 10)} (demo)</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 card p-5">
                  <div className="font-extrabold">Tóm tắt</div>
                  <div className="mt-2 text-sm text-slate-700 grid gap-2">
                    <div className="flex justify-between"><span>Tạm tính</span><b>{money(state.sub)}</b></div>
                    <div className="flex justify-between"><span>Ship</span><b>{money(state.ship)}</b></div>
                    <div className="flex justify-between"><span>Tổng</span><b>{money(state.total)}</b></div>
                    <div className="text-slate-500 text-xs">* Dữ liệu demo, sẽ nối API backend ở bước sau.</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link className="btn" to="/cart"><i className="fa-solid fa-cart-shopping mr-2" />Giỏ hàng</Link>
                  <Link className="btn btn-primary" to="/checkout"><i className="fa-solid fa-credit-card mr-2" />Checkout</Link>
                </div>
              </div>
            ) : null}
          </section>

          <aside className="card p-6">
            <div className="font-extrabold">Hỗ trợ</div>
            <div className="mt-2 text-sm text-slate-600">Nếu cần hỗ trợ nhanh, để lại thông tin.</div>
            <div className="mt-3 grid gap-2">
              <input className="field" placeholder="Họ và tên" />
              <input className="field" placeholder="Số điện thoại" />
              <textarea className="field" rows={4} placeholder="Nội dung cần hỗ trợ..." />
              <button className="btn btn-primary" type="button">
                <i className="fa-solid fa-headset mr-2" />Gửi
              </button>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-700">
              Hotline: <b>1900 0000</b><br />Zalo: <b>AYANAVITA</b>
            </div>
          </aside>
        </div>

        <div className="max-w-5xl mx-auto mt-4 text-center text-sm text-slate-500">© 2025 AYANAVITA • Prototype Track Order</div>
      </main>

      <Footer />
    </div>
  );
}
