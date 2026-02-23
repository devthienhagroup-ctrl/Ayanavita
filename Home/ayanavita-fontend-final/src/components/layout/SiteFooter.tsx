// src/components/layout/SiteFooter.tsx
import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="px-4 mt-4">
      <div className="max-w-6xl mx-auto card p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="font-extrabold text-lg">AYANAVITA</div>
            <div className="text-sm text-slate-600 mt-1">
              Hệ thống Spa nhượng quyền • đào tạo online • bán sản phẩm offline.
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              <span className="chip">
                <i className="fa-solid fa-phone text-indigo-600" />
                1900 0000
              </span>
              <span className="chip">
                <i className="fa-solid fa-location-dot text-rose-600" />
                TP.HCM
              </span>
            </div>
          </div>

          <div>
            <div className="font-extrabold">Liên kết nhanh</div>
            <div className="mt-2 grid gap-2 text-sm">
              <Link className="navlink inline-block" to="/services">
                Dịch vụ
              </Link>
              <Link className="navlink inline-block" to="/booking">
                Đặt lịch
              </Link>
              <Link className="navlink inline-block" to="/franchise">
                Nhượng quyền
              </Link>
            </div>
          </div>

          <div>
            <div className="font-extrabold">Nhận tư vấn</div>
            <div className="mt-2 flex gap-2">
              <input className="field" placeholder="Số điện thoại" />
              <button className="btn btn-accent">Gửi</button>
            </div>
            <div className="text-xs text-slate-500 mt-2">Prototype UI • © 2025</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-4 text-center text-sm text-slate-500">
        © 2025 AYANAVITA • Service Detail
      </div>
    </footer>
  );
}
