import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ParticlesBackground } from "../components/layout/ParticlesBackground";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

import { AuthModal } from "../components/home/AuthModal";
import { SuccessModal } from "../components/home/SuccessModal";

import { BRANCHES, REVIEWS, SLOTS, getServiceById } from "../data/services.data";
import { isValidPhone, money, toISODate } from "../services/booking.utils";

type AuthTab = "login" | "register";

type ToastState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

export default function ServiceDetailPage() {
  const { serviceId } = useParams(); // /services/:serviceId
  const service = useMemo(() => getServiceById(serviceId), [serviceId]);

  // shared auth/success (đồng bộ Home)
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>("login");
  const [success, setSuccess] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const openAuth = useCallback((tab: AuthTab) => {
    setAuthTab(tab);
    setAuthOpen(true);
  }, []);

  const openSuccess = useCallback((message: string) => {
    setSuccess({ open: true, message });
  }, []);

  // Right sidebar form
  const [name, setName] = useState("Khách hàng Demo");
  const [phone, setPhone] = useState("0900000000");
  const [date, setDate] = useState(() => toISODate(new Date()));
  const [note, setNote] = useState("");

  // branch + slot (shared)
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [slot, setSlot] = useState(SLOTS[0]);

  // hold timer
  const [holdLeft, setHoldLeft] = useState<number>(0);
  const holdTimerRef = useRef<number | null>(null);

  const [toast, setToast] = useState<ToastState>(null);

  const todayISO = useMemo(() => toISODate(new Date()), []);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        window.clearInterval(holdTimerRef.current);
        holdTimerRef.current = null;
      }
    };
  }, []);

  function showToast(t: ToastState) {
    setToast(t);
    if (!t) return;
    window.setTimeout(() => setToast(null), 4500);
  }

  function startHold() {
    if (holdTimerRef.current) {
      window.clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    setHoldLeft(10 * 60);
    holdTimerRef.current = window.setInterval(() => {
      setHoldLeft((prev) => {
        if (prev <= 1) {
          if (holdTimerRef.current) {
            window.clearInterval(holdTimerRef.current);
            holdTimerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    showToast({ type: "success", message: `Đã giữ chỗ tại ${branch} lúc ${slot} (demo).` });
  }

  function mmss(sec: number) {
    const mm = String(Math.floor(sec / 60)).padStart(2, "0");
    const ss = String(sec % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  function submitBooking() {
    const n = name.trim();
    const p = phone.trim();
    const d = date.trim();

    if (!n) return showToast({ type: "error", message: "Vui lòng nhập Họ và tên." });
    if (!isValidPhone(p))
      return showToast({ type: "error", message: "SĐT chưa đúng (bắt đầu 0, đủ 10–11 số)." });
    if (!d) return showToast({ type: "error", message: "Vui lòng chọn Ngày." });
    if (d < todayISO) return showToast({ type: "error", message: "Ngày đặt phải >= hôm nay." });

    const msg =
      `Đặt lịch thành công (demo).\n` +
      `- Dịch vụ: ${service.name} (${service.id})\n` +
      `- Chi nhánh: ${branch}\n` +
      `- Ngày: ${d} • Giờ: ${slot}\n` +
      `- Ghi chú: ${note.trim() || "(không)"}\n\n` +
      `Bước sau: nối API Booking + thanh toán đặt cọc nếu cần.`;

    showToast({ type: "success", message: msg });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="bg-slate-50 text-slate-900">
      <ParticlesBackground />

      <div className="page-content">
        <Header onLogin={() => openAuth("login")} onRegister={() => openAuth("register")} />

        <main className="px-4 pb-10">
          <div className="max-w-6xl mx-auto grid gap-4 lg:grid-cols-3">
            {/* Main */}
            <section className="card overflow-hidden lg:col-span-2">
              {/* Hero */}
              <div className="relative">
                <img className="h-64 w-full object-cover" alt="detail" src={service.heroImage} />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/55 to-indigo-700/10" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="text-xs font-extrabold text-white/80">Chi tiết dịch vụ</div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                    {service.name} ({service.id})
                  </h1>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className="chip">
                      <i className="fa-solid fa-clock text-indigo-600" />
                      {service.duration} phút
                    </span>
                    <span className="chip">
                      <i className="fa-solid fa-star star" />
                      {service.rating.toFixed(1)} (
                      {new Intl.NumberFormat("vi-VN").format(service.booked)} lượt)
                    </span>
                    <span className="chip">
                      <i className="fa-solid fa-shield-halved text-emerald-600" />
                      Quy trình chuẩn
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Price + Benefits */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="card p-4">
                    <div className="text-xs font-extrabold text-slate-500">Giá niêm yết</div>
                    <div className="text-2xl font-extrabold mt-1">{money(service.price)}</div>
                    <div className="text-sm muted mt-1">Đã bao gồm tư vấn da cơ bản.</div>

                    <Link to="/booking" className="btn btn-primary w-full mt-3">
                      <i className="fa-solid fa-calendar-check" />
                      Đặt lịch
                    </Link>

                    <Link to="/services" className="btn w-full mt-2">
                      <i className="fa-solid fa-arrow-left" />
                      Danh sách
                    </Link>
                  </div>

                  <div className="card p-4 md:col-span-2">
                    <div className="font-extrabold">Mục tiêu &amp; Lợi ích</div>
                    <ul className="mt-2 text-sm text-slate-700 space-y-2">
                      {service.benefits.map((b, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-emerald-600 font-extrabold">•</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Process + Audience + Hold */}
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="card p-5">
                    <div className="font-extrabold">Quy trình (chuẩn hoá)</div>
                    <ol className="mt-3 text-sm text-slate-700 space-y-2">
                      {service.process.map((p, idx) => (
                        <li key={idx}>
                          <b>{idx + 1})</b> {p}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="card p-5">
                    <div className="font-extrabold">Dành cho ai?</div>
                    <div className="mt-2 text-sm text-slate-700">Phù hợp cho:</div>

                    <div className="mt-2 flex gap-2 flex-wrap">
                      {service.audienceChips.map((c, idx) => (
                        <span key={idx} className="chip">
                          <i className={`${c.iconClass} ${c.iconColorClass || "text-amber-600"}`} />
                          {c.label}
                        </span>
                      ))}
                    </div>

                    {service.note ? <div className="mt-3 text-sm muted">{service.note}</div> : null}

                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <div className="font-extrabold">Chọn chi nhánh &amp; khung giờ</div>

                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <select className="field" value={branch} onChange={(e) => setBranch(e.target.value)}>
                          {BRANCHES.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>

                        <select className="field" value={slot} onChange={(e) => setSlot(e.target.value)}>
                          {SLOTS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button onClick={startHold} className="btn btn-accent w-full mt-2" type="button">
                        <i className="fa-solid fa-lock" />
                        Giữ chỗ 10 phút (demo)
                      </button>

                      <div className="mt-2 text-sm muted">
                        {holdLeft > 0 ? (
                          <>
                            Đã giữ chỗ tại <b>{branch}</b> lúc <b>{slot}</b>. Thời gian còn lại:{" "}
                            <b>{mmss(holdLeft)}</b> (demo).
                          </>
                        ) : (
                          <>Giữ chỗ chưa kích hoạt / đã hết hạn (demo).</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews */}
                <div className="mt-5 card p-5">
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold">Đánh giá khách hàng</div>
                    <Link to="/reviews" className="btn">
                      <i className="fa-solid fa-star" />
                      Xem tất cả
                    </Link>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {REVIEWS.map((r) => (
                      <div key={r.name} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="font-extrabold">{r.name}</div>
                          <div className="text-sm">
                            <i className="fa-solid fa-star star" /> {r.rating.toFixed(1)}
                          </div>
                        </div>
                        <div className="text-sm text-slate-700 mt-2">{r.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Sidebar */}
            <aside className="card p-6">
              <div className="font-extrabold">Đặt lịch nhanh</div>
              <div className="text-sm muted mt-1">Nhập thông tin để giữ chỗ (demo).</div>

              <div className="mt-3 grid gap-2">
                <input className="field" placeholder="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="field" placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input className="field" type="date" value={date} min={todayISO} onChange={(e) => setDate(e.target.value)} />
                <textarea className="field" rows={4} placeholder="Ghi chú (tình trạng da, dị ứng...)" value={note} onChange={(e) => setNote(e.target.value)} />
                <button onClick={submitBooking} className="btn btn-primary" type="button">
                  <i className="fa-solid fa-calendar-check" />
                  Xác nhận đặt
                </button>
              </div>

              {toast ? (
                <div
                  className={[
                    "mt-4 rounded-2xl p-4 ring-1 text-sm whitespace-pre-line",
                    toast.type === "success"
                      ? "bg-emerald-50 ring-emerald-200 text-emerald-800"
                      : "bg-rose-50 ring-rose-200 text-rose-800",
                  ].join(" ")}
                >
                  {toast.message}
                </div>
              ) : null}

              <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-700">
                <div className="font-extrabold">Cam kết</div>
                <ul className="mt-2 space-y-2">
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-extrabold">•</span>Quy trình chuẩn hoá
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-extrabold">•</span>Sản phẩm rõ nguồn gốc
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-extrabold">•</span>Tư vấn trước và sau dịch vụ
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </main>

        <Footer />
      </div>

      <SuccessModal
        open={success.open}
        message={success.message}
        onClose={() => setSuccess({ open: false, message: "" })}
      />

      <AuthModal
        open={authOpen}
        tab={authTab}
        onClose={() => setAuthOpen(false)}
        onSwitchTab={setAuthTab}
        onLoginSuccess={() => {
          setAuthOpen(false);
          openSuccess("Đăng nhập thành công.");
        }}
        onRegisterSuccess={() => {
          setAuthOpen(false);
          openSuccess("Đăng ký thành công.");
        }}
      />
    </div>
  );
}
