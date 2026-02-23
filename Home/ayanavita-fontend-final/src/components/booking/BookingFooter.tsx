// src/components/booking/BookingFooter.tsx
import React, { useState } from "react";

export function BookingFooter({ onLead }: { onLead: (email: string) => void }) {
  const [email, setEmail] = useState("");

  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 font-extrabold text-white">
              A
            </div>
            <div>
              <div className="font-extrabold">AYANAVITA</div>
              <div className="text-xs font-extrabold text-slate-500">Chuỗi Spa • Nhượng quyền • Đào tạo</div>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Demo UI phục vụ thiết kế hệ thống: dịch vụ spa, sản phẩm offline và khoá học online.
          </p>
        </div>

        <div>
          <div className="font-extrabold">Liên kết</div>
          <div className="mt-3 grid gap-2 text-sm">
            <span className="font-extrabold text-indigo-600">Đặt lịch</span>
            <span className="font-extrabold text-indigo-600">Nhượng quyền</span>
            <span className="font-extrabold text-indigo-600">Đánh giá</span>
            <span className="font-extrabold text-indigo-600">Theo dõi đơn</span>
          </div>
        </div>

        <div>
          <div className="font-extrabold">Hỗ trợ</div>
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            <div>☎ Hotline: 0900 000 000</div>
            <div>📍 VN: HN • HCM • ĐN</div>
            <div>✉ hello@ayanavita.vn</div>
          </div>
        </div>

        <div>
          <div className="font-extrabold">Nhận tư vấn</div>
          <div className="mt-3 flex gap-2">
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-100"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-300 px-4 py-3 text-sm font-extrabold text-slate-900 ring-1 ring-amber-200 hover:opacity-95"
              onClick={() => {
                onLead(email.trim());
                setEmail("");
              }}
              type="button"
              aria-label="send"
            >
              ➤
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-500">Bấm gửi để nhận brochure (demo).</div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>© 2025 AYANAVITA • Booking UI Prototype</div>
          <div className="flex gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-extrabold">
              🛡 Privacy
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-extrabold">
              ⚡ Fast
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
