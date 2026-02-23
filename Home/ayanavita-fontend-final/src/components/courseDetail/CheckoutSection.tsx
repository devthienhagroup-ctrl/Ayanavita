// src/components/courseDetail/CheckoutSection.tsx
import React, { useMemo, useState } from "react";
import type { CourseDetail, Voucher } from "../../data/courseDetail.demo";
import { computeFinalPrice, findVoucher, imgSeed, moneyVND, uid, categoryLabel, courseSeed } from "../../services/coursePricing";

type OrderStatus = "NONE" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";

type Order = {
  id: string;
  courseId: string;
  status: OrderStatus;
  createdAt: string;
};

function StatusChip({ status }: { status: OrderStatus }) {
  const iconColor =
    status === "PENDING"
      ? "text-amber-500"
      : status === "PAID"
        ? "text-emerald-500"
        : status === "FAILED"
          ? "text-rose-500"
          : status === "REFUNDED"
            ? "text-slate-500"
            : "text-slate-400";

  return (
    <span className="chip">
      <i className={`fa-solid fa-circle ${iconColor}`} />
      {status}
    </span>
  );
}

export function CheckoutSection({
  course,
  vouchers,
}: {
  course: CourseDetail;
  vouchers: Voucher[];
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [agree, setAgree] = useState(false);

  const [order, setOrder] = useState<Order | null>(null);

  const voucher = useMemo(() => findVoucher(vouchers, voucherCode, course.id), [vouchers, voucherCode, course.id]);

  const pricing = useMemo(() => {
    return computeFinalPrice(course.sales.basePrice ?? course.price, course.sales.defaultDiscount ?? 0, voucher);
  }, [course.id, course.price, course.sales.basePrice, course.sales.defaultDiscount, voucher]);

  function calc() {
    // state already memo; this is just a UX button
    window.alert("Đã tính lại giá (prototype).");
  }

  function createOrder() {
    if (!name.trim() || !email.trim()) {
      window.alert("Vui lòng nhập Họ tên và Email để tạo đơn.");
      return;
    }
    const o: Order = {
      id: uid("OD"),
      courseId: course.id,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    setOrder(o);
    window.alert(`Đã tạo đơn hàng: ${o.id} (prototype).`);
  }

  function setStatus(status: OrderStatus) {
    if (!order) {
      window.alert("Chưa có đơn hàng. Bấm “Tạo đơn hàng” trước.");
      return;
    }
    setOrder({ ...order, status });
  }

  function payNow() {
    if (!order) {
      window.alert("Chưa có đơn hàng. Bấm “Tạo đơn hàng” trước.");
      return;
    }
    if (!agree) {
      window.alert("Vui lòng tick đồng ý điều khoản (demo).");
      return;
    }
    setStatus("PAID");
    window.alert("Thanh toán thành công (demo).");
  }

  const base = Number(course.sales.basePrice ?? course.price ?? 0);
  const def = Math.max(0, Math.min(100, Number(course.sales.defaultDiscount ?? 0)));

  return (
    <div id="checkout" className="card p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-extrabold text-slate-500">Checkout</div>
          <div className="text-2xl font-extrabold">Thanh toán (Prototype)</div>
          <div className="mt-1 text-sm text-slate-600">Mô phỏng trang checkout riêng: tạo đơn hàng + trạng thái thanh toán.</div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" type="button" onClick={createOrder}>
            <i className="fa-solid fa-receipt mr-2" />
            Tạo đơn hàng
          </button>
          <button className="btn btn-accent" type="button" onClick={payNow}>
            <i className="fa-solid fa-credit-card mr-2" />
            Thanh toán (demo)
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {/* left: student info */}
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="font-extrabold">Thông tin học viên</div>
          <div className="mt-3 grid gap-3">
            <div>
              <div className="text-xs font-extrabold text-slate-500">Họ và tên</div>
              <input className="field mt-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-500">Email</div>
              <input className="field mt-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-500">Số điện thoại (tuỳ chọn)</div>
              <input className="field mt-2" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="090..." />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-500">Voucher (demo)</div>
              <input className="field mt-2" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} placeholder="AYA20" />
              <div className="text-xs text-slate-500 mt-2">Prototype: checkout có áp voucher demo.</div>
            </div>
          </div>
        </div>

        {/* right: order summary */}
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="font-extrabold">Tóm tắt đơn</div>

          <div className="mt-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  className="h-11 w-16 rounded-xl object-cover ring-1 ring-slate-200"
                  alt="Course thumb"
                  src={imgSeed("thumb-" + courseSeed(course.id), 320, 220)}
                />
                <div className="min-w-0">
                  <div className="font-extrabold truncate">{course.title}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {categoryLabel(course.category)} • {course.id} • Rating {course.rating.toFixed(1)}
                  </div>
                </div>
              </div>
              <span className="chip">
                <i className="fa-solid fa-tag text-emerald-600" />
                {moneyVND(pricing.price)}
              </span>
            </div>

            <div className="mt-3 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Giá niêm yết</span>
                <b>{moneyVND(base)}</b>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span>Giảm mặc định</span>
                <b>{def}%</b>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span>Voucher</span>
                <b>
                  {voucher
                    ? voucher.type === "percent"
                      ? `-${voucher.value}% (${voucher.code})`
                      : `-${moneyVND(voucher.value)} (${voucher.code})`
                    : "—"}
                </b>
              </div>
              <div className="my-3 border-t border-slate-200" />
              <div className="flex items-center justify-between">
                <span className="font-extrabold">Tổng thanh toán</span>
                <b className="text-lg">{moneyVND(pricing.price)}</b>
              </div>
              <div className="text-xs text-slate-500 mt-2">{voucher ? pricing.note : `${pricing.note} (không có voucher hợp lệ)`}</div>
            </div>

            <label className="mt-4 flex items-center gap-2 text-sm font-extrabold">
              <input className="h-4 w-4 rounded border-slate-300" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              Tôi đồng ý điều khoản (demo)
            </label>

            <div className="mt-4 grid gap-2">
              <button className="btn" type="button" onClick={calc}>
                <i className="fa-solid fa-calculator mr-2" />
                Tính lại giá
              </button>
              <button className="btn btn-primary" type="button" onClick={payNow}>
                <i className="fa-solid fa-lock mr-2" />
                Thanh toán an toàn (demo)
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <div className="font-extrabold">Đơn hàng</div>
            <div className="mt-2 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Mã đơn</span>
                <b>{order?.id || "—"}</b>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span>Trạng thái</span>
                <StatusChip status={order?.status || "NONE"} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span>Thời gian</span>
                <span className="text-slate-500">{order ? new Date(order.createdAt).toLocaleString("vi-VN") : "—"}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn" type="button" onClick={() => setStatus("PENDING")}>Pending</button>
              <button className="btn btn-accent" type="button" onClick={() => setStatus("PAID")}>Paid</button>
              <button className="btn" type="button" onClick={() => setStatus("FAILED")}>Failed</button>
              <button className="btn" type="button" onClick={() => setStatus("REFUNDED")}>Refunded</button>
            </div>

            <div className="mt-3 text-xs text-slate-500">Prototype: trạng thái đơn hàng chỉ lưu trong state.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
