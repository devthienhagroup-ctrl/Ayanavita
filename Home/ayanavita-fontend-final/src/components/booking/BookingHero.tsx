// src/components/booking/BookingHero.tsx
import React from "react";

export type BookingHeroCmsData = {
  badges: string[];
  title: string;
  description: string;
  highlightCards: string[][]; // [label, title, desc]
  ctaPrimary: string;
  ctaSecondary: string;
  illustrationLabel: string;
  rating: string;
  quote: string;
  rightCards: string[][]; // [label, title, desc]
};

export const defaultBookingHeroCmsData: BookingHeroCmsData = {
  badges: ["Booking", "Tư vấn miễn phí"],
  title: "Đặt lịch chăm sóc sắc đẹp & sức khoẻ tại AYANAVITA",
  description:
      "Chọn dịch vụ, chi nhánh, ngày giờ và chuyên viên. Hệ thống demo sẽ tạo “phiếu đặt lịch” và lưu vào localStorage.",
  highlightCards: [
    ["Cam kết", "Chuẩn quy trình", "Đào tạo bài bản, đồng nhất thương hiệu."],
    ["Thời gian", "Linh hoạt", "Khung giờ đa dạng, ưu tiên khách đặt trước."],
    ["Hỗ trợ", "Nhanh chóng", "Hotline + Zalo + tư vấn tại chỗ."],
  ],
  ctaPrimary: "Đặt lịch ngay",
  ctaSecondary: "Xem lịch của tôi",
  illustrationLabel: "Hình minh hoạ (SVG)",
  rating: "★ 4.9/5",
  quote: "“Đặt lịch trước giúp chúng tôi chuẩn bị chuyên viên và phòng trị liệu phù hợp.”",
  rightCards: [
    ["Gợi ý", "Chọn gói liệu trình", "Combo giúp tối ưu chi phí, tăng hiệu quả."],
    ["Trải nghiệm", "Nhắc lịch tự động", "SMS/Zalo (demo), hạn chế quên lịch."],
  ],
};

export function BookingHero({
  onFillDemo,
  onScrollForm,
}: {
  onFillDemo: () => void;
  onScrollForm: () => void;
  onViewMyBookings: () => void;
  cmsData?: Partial<BookingHeroCmsData>;
}) {
  const data: BookingHeroCmsData = {
    ...defaultBookingHeroCmsData,
    ...cmsData,
    badges: cmsData?.badges ?? defaultBookingHeroCmsData.badges,
    highlightCards: cmsData?.highlightCards ?? defaultBookingHeroCmsData.highlightCards,
    rightCards: cmsData?.rightCards ?? defaultBookingHeroCmsData.rightCards,
  };

  return (
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-2">
          <div className="p-6 lg:p-8">
            <div className="inline-flex items-center gap-2">
            <span
                className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-white px-3 py-1 text-xs  font-extrabold">
              <i className="fa-solid fa-calendar-day text-blue-400"></i> {data.badges[0] ?? ""}
            </span>
              <span
                  className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-extrabold">
              <i className="fa-solid fa-heart text-amber-400"></i> {data.badges[1] ?? ""}
            </span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
              {data.title}
            </h1>
            <p className="mt-3 text-slate-600">
              {data.description}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {data.highlightCards.map(([k, t, d]) => (
                  <div key={k} className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <div className="text-xs font-extrabold text-slate-500">{k}</div>
                    <div className="mt-1 font-extrabold">{t}</div>
                    <div className="mt-1 text-sm text-slate-600">{d}</div>
                  </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {/*            <button
              type="button"
              onClick={onFillDemo}
              className="rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-300 px-4 py-3 text-sm font-extrabold text-slate-900 ring-1 ring-amber-200 hover:opacity-95"
            >
              ✨ Điền demo
<<<<<<< HEAD
            </button>
            <button
              type="button"
              onClick={onScrollForm}
              className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-3 text-sm font-extrabold text-white ring-1 ring-indigo-200 hover:opacity-95"
            >
              📝 Đặt lịch ngay
            </button>
=======
            </button>*/}
              <button
                  type="button"
                  onClick={onScrollForm}
                  className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-3 text-sm font-extrabold text-white ring-1 ring-indigo-200 hover:opacity-95"
              >
                <i className="fa-solid fa-calendar-days"></i> {data.ctaPrimary}
              </button>
              <button
                  type="button"
                  onClick={onViewMyBookings}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold hover:bg-slate-50"
              >
                {data.ctaSecondary}
              </button>
            </div>
          </div>

          {/* right illustration */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white lg:p-8">
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold opacity-90">{data.illustrationLabel}</div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-extrabold">
              {data.rating}
            </span>
            </div>

            <div className="mt-4 rounded-3xl bg-white/10 p-4 ring-1 ring-white/20">
              <svg viewBox="0 0 800 420" className="h-auto w-full">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0" stopColor="#FBBF24" />
                    <stop offset="1" stopColor="#F59E0B" />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" x2="1">
                    <stop offset="0" stopColor="#A78BFA" />
                    <stop offset="1" stopColor="#4F46E5" />
                  </linearGradient>
                </defs>
                <rect x="20" y="20" width="760" height="380" rx="28" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.25)" />
                <rect x="70" y="70" width="340" height="260" rx="22" fill="rgba(255,255,255,.10)" stroke="rgba(255,255,255,.22)" />
                <rect x="440" y="70" width="290" height="60" rx="18" fill="url(#g1)" opacity="0.95" />
                <rect x="440" y="150" width="290" height="180" rx="22" fill="rgba(255,255,255,.10)" stroke="rgba(255,255,255,.22)" />
                <circle cx="120" cy="120" r="26" fill="url(#g1)" />
                <rect x="160" y="104" width="220" height="14" rx="7" fill="rgba(255,255,255,.65)" />
                <rect x="160" y="128" width="160" height="12" rx="6" fill="rgba(255,255,255,.35)" />
                <rect x="100" y="170" width="270" height="16" rx="8" fill="rgba(255,255,255,.55)" />
                <rect x="100" y="202" width="240" height="12" rx="6" fill="rgba(255,255,255,.28)" />
                <rect x="100" y="234" width="220" height="12" rx="6" fill="rgba(255,255,255,.28)" />
                <rect x="100" y="266" width="180" height="12" rx="6" fill="rgba(255,255,255,.28)" />
                <rect x="470" y="174" width="230" height="18" rx="9" fill="rgba(255,255,255,.55)" />
                <rect x="470" y="210" width="190" height="12" rx="6" fill="rgba(255,255,255,.28)" />
                <rect x="470" y="240" width="210" height="12" rx="6" fill="rgba(255,255,255,.28)" />
                <rect x="470" y="270" width="160" height="12" rx="6" fill="rgba(255,255,255,.28)" />
                <circle cx="680" cy="100" r="10" fill="rgba(255,255,255,.75)" />
                <circle cx="710" cy="100" r="10" fill="rgba(255,255,255,.45)" />
                <path d="M470 90 h140" stroke="rgba(255,255,255,.75)" strokeWidth="10" strokeLinecap="round" />
                <path d="M470 110 h90" stroke="rgba(255,255,255,.45)" strokeWidth="10" strokeLinecap="round" />
                <path d="M120 360 c80-40 140-50 240-20 s160 40 260-10" stroke="url(#g2)" strokeWidth="10" strokeLinecap="round" fill="none" opacity=".8" />
              </svg>

              <div className="mt-3 text-sm opacity-90">
                {data.quote}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.rightCards.map(([k, t, d]) => (
                  <div key={k} className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/20">
                    <div className="text-xs font-extrabold opacity-80">{k}</div>
                    <div className="mt-1 font-extrabold">{t}</div>
                    <div className="mt-1 text-sm opacity-90">{d}</div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </section>
  );
}
