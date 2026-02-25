import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ParticlesBackground } from "../components/layout/ParticlesBackground";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

import { AuthModal } from "../components/home/AuthModal";
import { SuccessModal } from "../components/home/SuccessModal";

import { http } from "../api/http";
import { isValidPhone, money, toISODate } from "../services/booking.utils";

type AuthTab = "login" | "register";

type ToastState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

type BranchOption = {
  id: number;
  name: string;
};

type ServiceReview = {
  id: number;
  stars: number;
  comment?: string | null;
  customerName?: string | null;
};

type ServiceDetail = {
  id: number;
  name: string;
  description?: string | null;
  goals: string[];
  suitableFor: string[];
  process: string[];
  durationMin: number;
  price: number;
  ratingAvg: number;
  bookedCount: number;
  imageUrl?: string | null;
  branchIds: number[];
  reviews: ServiceReview[];
};

const SLOTS = ["09:00", "10:30", "13:30", "15:00", "19:00"];

export default function ServiceDetailPage() {
  const { serviceId } = useParams();

  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>("login");
  const [success, setSuccess] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const openAuth = useCallback((tab: AuthTab) => {
    setAuthTab(tab);
    setAuthOpen(true);
  }, []);

  const openSuccess = useCallback((message: string) => {
    setSuccess({ open: true, message });
  }, []);

  const [name, setName] = useState("Khách hàng Demo");
  const [phone, setPhone] = useState("0900000000");
  const [date, setDate] = useState(() => toISODate(new Date()));
  const [note, setNote] = useState("");
  const [branch, setBranch] = useState("");
  const [slot, setSlot] = useState(SLOTS[0]);

  const [toast, setToast] = useState<ToastState>(null);
  const todayISO = useMemo(() => toISODate(new Date()), []);

  useEffect(() => {
    const id = Number(serviceId);
    if (!Number.isInteger(id) || id < 1) {
      setError("Mã dịch vụ không hợp lệ.");
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const [{ data: detail }, { data: branchRows }] = await Promise.all([
          http.get(`/booking/services/${id}`),
          http.get("/booking/branches", { params: { serviceId: id } }),
        ]);
        if (!mounted) return;

        setService(detail);
        const normalizedBranches = Array.isArray(branchRows)
          ? branchRows.map((item: any) => ({ id: item.id, name: item.name }))
          : [];
        setBranches(normalizedBranches);
        setBranch(normalizedBranches[0]?.name || "");
      } catch {
        if (!mounted) return;
        setError("Không thể tải dữ liệu dịch vụ. Vui lòng thử lại.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [serviceId]);

  function showToast(t: ToastState) {
    setToast(t);
    if (!t) return;
    window.setTimeout(() => setToast(null), 4500);
  }

  function submitBooking() {
    if (!service) return;

    const n = name.trim();
    const p = phone.trim();
    const d = date.trim();

    if (!n) return showToast({ type: "error", message: "Vui lòng nhập Họ và tên." });
    if (!isValidPhone(p)) {
      return showToast({ type: "error", message: "SĐT chưa đúng (bắt đầu 0, đủ 10–11 số)." });
    }
    if (!d) return showToast({ type: "error", message: "Vui lòng chọn Ngày." });
    if (d < todayISO) return showToast({ type: "error", message: "Ngày đặt phải >= hôm nay." });

    const msg =
      `Đặt lịch thành công (demo).\n` +
      `- Dịch vụ: ${service.name} (#${service.id})\n` +
      `- Chi nhánh: ${branch || "Chưa chọn"}\n` +
      `- Ngày: ${d} • Giờ: ${slot}\n` +
      `- Ghi chú: ${note.trim() || "(không)"}`;

    showToast({ type: "success", message: msg });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="bg-slate-50 text-slate-900">
      <ParticlesBackground />

      <div className="page-content">
        <Header onLogin={() => openAuth("login")} onRegister={() => openAuth("register")} />

        <main className="px-4 pb-10">
          {loading ? <div className="max-w-6xl mx-auto text-sm text-slate-500">Đang tải chi tiết dịch vụ...</div> : null}
          {error ? <div className="max-w-6xl mx-auto text-sm text-rose-600">{error}</div> : null}

          {service ? (
            <div className="max-w-6xl mx-auto grid gap-4 lg:grid-cols-3">
              <section className="card overflow-hidden lg:col-span-2">
                <div className="relative">
                  <img
                    className="h-64 w-full object-cover"
                    alt="detail"
                    src={service.imageUrl || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=70"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/55 to-indigo-700/10" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="text-xs font-extrabold text-white/80">Chi tiết dịch vụ</div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                      {service.name} (#{service.id})
                    </h1>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <span className="chip"><i className="fa-solid fa-clock text-indigo-600" />{service.durationMin} phút</span>
                      <span className="chip">
                        <i className="fa-solid fa-star star" />
                        {service.ratingAvg.toFixed(1)} ({new Intl.NumberFormat("vi-VN").format(service.bookedCount)} lượt)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 grid gap-4 md:grid-cols-3">
                  <div className="card p-4">
                    <div className="text-xs font-extrabold text-slate-500">Giá niêm yết</div>
                    <div className="text-2xl font-extrabold mt-1">{money(service.price)}</div>
                    <Link to="/booking" className="btn btn-primary w-full mt-3"><i className="fa-solid fa-calendar-check" />Đặt lịch</Link>
                    <Link to="/services" className="btn w-full mt-2"><i className="fa-solid fa-arrow-left" />Danh sách</Link>
                  </div>

                  <div className="card p-4 md:col-span-2">
                    <div className="font-extrabold">Mục tiêu &amp; Lợi ích</div>
                    <ul className="mt-2 text-sm text-slate-700 space-y-2">
                      {service.goals.length ? service.goals.map((goal, idx) => (
                        <li key={idx} className="flex gap-2"><span className="text-emerald-600 font-extrabold">•</span>{goal}</li>
                      )) : <li>Đang cập nhật.</li>}
                    </ul>
                    {service.description ? <div className="mt-3 text-sm muted">{service.description}</div> : null}
                  </div>
                </div>

                <div className="px-5 pb-5 grid gap-4 lg:grid-cols-2">
                  <div className="card p-5">
                    <div className="font-extrabold">Quy trình</div>
                    <ol className="mt-3 text-sm text-slate-700 space-y-2">
                      {service.process.length ? service.process.map((p, idx) => (
                        <li key={idx}><b>{idx + 1})</b> {p}</li>
                      )) : <li>Đang cập nhật.</li>}
                    </ol>
                  </div>

                  <div className="card p-5">
                    <div className="font-extrabold">Dành cho ai?</div>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {service.suitableFor.length ? service.suitableFor.map((label, idx) => (
                        <span key={idx} className="chip"><i className="fa-solid fa-user-check text-amber-600" />{label}</span>
                      )) : <span className="text-sm muted">Đang cập nhật.</span>}
                    </div>
                  </div>
                </div>

                <div className="mx-5 mb-5 card p-5">
                  <div className="font-extrabold">Đánh giá khách hàng</div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {service.reviews.length ? service.reviews.map((r) => (
                      <div key={r.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="font-extrabold">{r.customerName || "Khách hàng"}</div>
                          <div className="text-sm"><i className="fa-solid fa-star star" /> {r.stars.toFixed(1)}</div>
                        </div>
                        <div className="text-sm text-slate-700 mt-2">{r.comment || "Khách hàng chưa để lại nhận xét."}</div>
                      </div>
                    )) : <div className="text-sm muted">Chưa có đánh giá cho dịch vụ này.</div>}
                  </div>
                </div>
              </section>

              <aside className="card p-6">
                <div className="font-extrabold">Đặt lịch nhanh</div>
                <div className="text-sm muted mt-1">Nhập thông tin để đặt lịch (demo).</div>

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
              </aside>
            </div>
          ) : null}
        </main>

        <Footer />
      </div>

      <SuccessModal open={success.open} message={success.message} onClose={() => setSuccess({ open: false, message: "" })} />

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
