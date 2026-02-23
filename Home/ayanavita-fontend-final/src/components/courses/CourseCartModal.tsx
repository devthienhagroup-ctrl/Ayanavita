// src/components/courses/CourseCartModal.tsx
import React, { useEffect } from "react";
import type { Course } from "../../data/courses.data";
import { topicLabel } from "../../data/courses.data";
import { money } from "../../services/booking.utils";

export function CourseCartModal({
  open,
  items,
  onClose,
  onRemove,
  onClear,
  onCheckoutDemo,
}: {
  open: boolean;
  items: Course[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onCheckoutDemo: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const total = items.reduce((s, x) => s + Number(x.price || 0), 0);

  return (
    <div className={`modal ${open ? "active" : ""}`} aria-hidden={!open}>
      <div
        className="modal-content card w-[92%] max-w-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold text-slate-500">Cart</div>
            <div className="text-lg font-extrabold">Giỏ khoá học (demo)</div>
          </div>

          <div className="flex gap-2">
            <button className="btn" onClick={onClear} type="button">
              <i className="fa-solid fa-trash" /> Xoá
            </button>
            <button className="btn h-10 w-10 p-0" onClick={onClose} type="button" aria-label="close">
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {items.length ? (
            <div className="grid gap-3">
              {items.map((c) => (
                <div key={c.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <img
                        src={c.img}
                        alt={c.title}
                        className="h-16 w-24 object-cover rounded-2xl ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="font-extrabold">{c.title}</div>
                        <div className="text-sm text-slate-600 mt-1">
                          {topicLabel(c.topic)} • {money(c.price)}
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn h-10 w-10 p-0"
                      onClick={() => onRemove(c.id)}
                      type="button"
                      title="Xoá"
                    >
                      <i className="fa-solid fa-trash text-rose-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-600 py-10">
              <div className="text-3xl">
                <i className="fa-solid fa-cart-shopping" />
              </div>
              <div className="mt-2 font-extrabold">Cart trống</div>
              <div className="text-sm mt-1">Thêm khoá học để test checkout.</div>
            </div>
          )}

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">Tạm tính</div>
            <div className="font-extrabold text-indigo-700">{money(total)}</div>
          </div>

          <div className="mt-4 flex gap-2">
            <button className="btn btn-primary flex-1" onClick={onCheckoutDemo} type="button">
              <i className="fa-solid fa-credit-card" /> Checkout (demo)
            </button>
            <button className="btn flex-1" onClick={onClose} type="button">
              <i className="fa-solid fa-arrow-left" /> Tiếp tục xem
            </button>
          </div>
        </div>
      </div>

      {/* backdrop click */}
      <button
        className="absolute inset-0"
        onClick={onClose}
        aria-label="backdrop"
        style={{ cursor: "default" }}
      />
    </div>
  );
}
