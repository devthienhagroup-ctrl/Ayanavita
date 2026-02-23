// src/components/booking/BookingHeader.tsx
import React from "react";
import { Link } from "react-router-dom";

export function BookingHeader({
  userLabel,
  onHotline,
  onAuthClick,
}: {
  userLabel: string;
  onHotline: () => void;
  onAuthClick: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 font-extrabold text-white shadow-lg shadow-indigo-500/25">
            A
          </div>
          <div>
            <div className="text-sm font-extrabold leading-4">AYANAVITA</div>
            <div className="text-xs font-extrabold text-slate-500">Spa • Sức khoẻ • Đào tạo</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold hover:bg-slate-50" to="/products">
            Sản phẩm
          </Link>
          <Link className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold hover:bg-slate-50" to="/services">
            Dịch vụ
          </Link>
          <Link className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold hover:bg-slate-50" to="/courses">
            Khoá học
          </Link>
          <Link
            className="rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-300 px-4 py-2 text-sm font-extrabold text-slate-900 ring-1 ring-amber-200 hover:opacity-95"
            to="/booking"
          >
            Đặt lịch
          </Link>
          <Link className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold hover:bg-slate-50" to="/franchise">
            Nhượng quyền
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold hover:bg-slate-50 sm:inline-flex"
            onClick={onHotline}
          >
            Hotline
          </button>
          <button
            className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-extrabold text-white ring-1 ring-indigo-200 hover:opacity-95"
            onClick={onAuthClick}
          >
            {userLabel}
          </button>
          <button
            className="h-10 w-10 rounded-2xl border border-slate-200 bg-white font-extrabold md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="menu"
          >
            ☰
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto grid max-w-7xl gap-2 px-4 py-3">
            <Link className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold" to="/products">
              Sản phẩm
            </Link>
            <Link className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold" to="/services">
              Dịch vụ
            </Link>
            <Link className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold" to="/courses">
              Khoá học
            </Link>
            <Link className="rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-300 px-4 py-2 text-sm font-extrabold text-slate-900 ring-1 ring-amber-200" to="/booking">
              Đặt lịch
            </Link>
            <Link className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold" to="/franchise">
              Nhượng quyền
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
