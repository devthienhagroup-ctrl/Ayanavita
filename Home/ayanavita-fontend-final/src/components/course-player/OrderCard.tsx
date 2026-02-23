// src/components/course-player/OrderCard.tsx
import React from "react";
import type { Course } from "../../data/coursePlayer.demo";
import { getCourseOrder, moneyVND, setCourseOrder, uid } from "../../services/coursePlayer.storage";

export function OrderCard({ course }: { course: Course }) {
  const order = getCourseOrder(course.id);

  const createOrder = () => {
    if (order) {
      alert("Đã có đơn hàng. Bạn có thể Mark Paid/Failed hoặc Clear.");
      return;
    }
    setCourseOrder(course.id, {
      id: uid("OD"),
      courseId: course.id,
      amount: course.price,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    alert("Đã tạo đơn hàng (prototype).");
  };

  const mark = (status: "paid" | "failed") => {
    const o = getCourseOrder(course.id);
    if (!o) {
      alert("Chưa có đơn hàng. Bấm Enroll trước.");
      return;
    }
    o.status = status;
    setCourseOrder(course.id, o);
    alert(`Đã mark ${status.toUpperCase()} (prototype).`);
  };

  const clear = () => {
    if (!confirm("Clear order?")) return;
    setCourseOrder(course.id, null);
  };

  const statusChip =
    order?.status === "paid" ? (
      <span className="chip">
        <i className="fa-solid fa-circle-check text-emerald-600" />
        PAID
      </span>
    ) : order?.status === "failed" ? (
      <span className="chip">
        <i className="fa-solid fa-circle-xmark text-rose-600" />
        FAILED
      </span>
    ) : order ? (
      <span className="chip">
        <i className="fa-solid fa-hourglass-half text-amber-600" />
        PENDING
      </span>
    ) : null;

  return (
    <div className="card p-4">
      <div className="font-extrabold">Checkout (mô phỏng)</div>
      <div className="mt-2 text-sm text-slate-600">Bấm “Enroll” để tạo đơn hàng demo, có trạng thái thanh toán.</div>

      <div className="mt-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <div className="text-xs font-extrabold text-slate-500">Order</div>

        <div className="mt-1 text-sm text-slate-700">
          {!order ? (
            "Chưa có đơn hàng"
          ) : (
            <div className="grid gap-1">
              <div>
                <b>Order:</b> {order.id}
              </div>
              <div>
                <b>Amount:</b> {moneyVND(order.amount)}
              </div>
              <div className="flex items-center gap-2">
                <b>Status:</b> {statusChip}
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn btn-accent" type="button" onClick={createOrder}>
            <i className="fa-solid fa-cart-shopping mr-2" />
            Enroll
          </button>
          <button className="btn btn-primary" type="button" onClick={() => mark("paid")}>
            <i className="fa-solid fa-circle-check mr-2" />
            Mark Paid
          </button>
          <button className="btn" type="button" onClick={() => mark("failed")}>
            <i className="fa-solid fa-triangle-exclamation mr-2" />
            Mark Failed
          </button>
          <button className="btn btn-accent" type="button" onClick={clear}>
            <i className="fa-solid fa-trash-can mr-2" />
            Clear
          </button>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          Prototype: Order lưu localStorage. Sau này map sang Orders/Payments API.
        </div>
      </div>
    </div>
  );
}
