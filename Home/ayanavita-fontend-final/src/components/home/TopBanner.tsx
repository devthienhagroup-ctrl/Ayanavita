// src/components/home/TopBanner.tsx
import React from "react";

type TopBannerProps = {
  onConsult?: () => void;
};

export const TopBanner: React.FC<TopBannerProps> = ({ onConsult }) => {
  return (
    <section className="w-full pt-6" id="top">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200 shadow-sm md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-slate-700">NEW</span>
              </span>
              <span className="text-sm font-semibold text-slate-900">AYANAVITA</span>
              <span className="text-sm text-slate-600">
                Ưu đãi thành viên mới: giảm 20% + miễn phí 3 khóa cơ bản.
              </span>
            </div>

            <div className="flex gap-2">
              <a
                href="#pricing"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
              >
                Xem gói
              </a>
              <button
                type="button"
                onClick={onConsult}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
              >
                Nhận tư vấn
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
