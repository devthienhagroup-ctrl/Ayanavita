import React from "react";
import { Button, Hr, SubTitle } from "../../../ui/ui";
import type { Review } from "../reviews.types";

export function SavedDrawer({
  open,
  onClose,
  savedIds,
  reviews,
  onClear,
  onToggleSave,
}: {
  open: boolean;
  onClose: () => void;
  savedIds: string[];
  reviews: Review[];
  onClear: () => void;
  onToggleSave: (id: string) => void;
}) {
  if (!open) return null;

  const items = savedIds
    .map((id) => reviews.find((r) => r.id === id))
    .filter(Boolean) as Review[];

  return (
    <>
      <div className="fixed inset-0 bg-black/55 z-40" onClick={onClose} />

      <aside className="fixed top-0 right-0 h-full w-[min(420px,92vw)] bg-white z-50 border-l border-slate-200 shadow-[-18px_0_60px_rgba(2,6,23,0.12)]">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <SubTitle>Saved</SubTitle>
            <div className="text-lg font-extrabold">Đánh giá đã lưu</div>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Đóng
          </Button>
        </div>

        <div className="p-6">
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-700">
            Prototype: lưu danh sách “saved reviews” bằng localStorage để người dùng xem lại.
          </div>

          <Hr className="mt-5" />

          <div className="mt-5 flex items-center justify-between">
            <div className="font-extrabold">Danh sách</div>
            <Button variant="ghost" onClick={onClear}>
              Xoá
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="mt-10 text-center text-slate-600">
              <div className="mt-2 font-extrabold">Chưa có mục đã lưu</div>
              <div className="text-sm mt-1">Nhấn “Lưu” ở một review để thấy nó xuất hiện tại đây.</div>
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              {items.map((r) => {
                const displayName = r.anonymous ? "Ẩn danh" : r.name || "Khách hàng";
                return (
                  <div key={r.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-extrabold">{r.item}</div>
                        <div className="text-sm text-slate-600 mt-1">
                          {displayName} • {r.rating}★
                        </div>
                      </div>
                      <Button variant="ghost" onClick={() => onToggleSave(r.id)}>
                        Bỏ lưu
                      </Button>
                    </div>
                    <div className="mt-3 text-sm text-slate-700 line-clamp-2 whitespace-pre-line">{r.text}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
