import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ParticlesBackground } from "../components/layout/ParticlesBackground";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

import { AuthModal } from "../components/home/AuthModal";
import { SuccessModal } from "../components/home/SuccessModal";

import { money } from "../services/booking.utils";
import {
  SERVICES,
  type Service,
  type ServiceCat,
  type ServiceGoal,
} from "../data/services.data";

type AuthTab = "login" | "register";

type DurRule = "all" | "lt60" | "60-90" | "gt90";
type GoalRule = "all" | ServiceGoal;
type CatRule = "all" | ServiceCat;
type SortRule = "popular" | "priceAsc" | "priceDesc" | "rating";

function matchDur(dur: number, rule: DurRule) {
  if (rule === "all") return true;
  if (rule === "lt60") return dur < 60;
  if (rule === "60-90") return dur >= 60 && dur <= 90;
  if (rule === "gt90") return dur > 90;
  return true;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const icons = Array.from({ length: full }, (_, i) => (
    <i key={i} className="fa-solid fa-star star" />
  ));
  return <span className="flex items-center gap-1">{icons}</span>;
}

function ServiceCard({ s }: { s: Service }) {
  return (
    <article className="card p-4">
      <img
        className="h-36 w-full rounded-2xl object-cover ring-1 ring-slate-200"
        src={s.img}
        alt={s.name}
      />

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <div className="font-extrabold">{s.name}</div>
          <div className="text-xs text-slate-500">
            {s.id} • {s.duration} phút
          </div>
        </div>

        <span className="chip">
          <i className="fa-solid fa-tag text-emerald-600" />
          {money(s.price)}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <Stars rating={s.rating} /> <b>{s.rating.toFixed(1)}</b>
        </div>
        <span className="chip">
          <i className="fa-solid fa-fire text-rose-600" />
          {s.tag}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link className="btn" to={`/services/${s.id}`}>
          <i className="fa-solid fa-circle-info" />
          Chi tiết
        </Link>

        <Link className="btn btn-primary" to="/booking">
          <i className="fa-solid fa-calendar-check" />
          Đặt
        </Link>
      </div>
    </article>
  );
}

export default function ServicesPage() {
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

  // filters
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CatRule>("all");
  const [goal, setGoal] = useState<GoalRule>("all");
  const [dur, setDur] = useState<DurRule>("all");
  const [sort, setSort] = useState<SortRule>("popular");

  // paging
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();

    let list = SERVICES.filter((s) => {
      const okQ =
        !qq ||
        s.name.toLowerCase().includes(qq) ||
        s.id.toLowerCase().includes(qq);

      const okC = cat === "all" ? true : s.cat === cat;
      const okG = goal === "all" ? true : (s.goal || []).includes(goal);
      const okD = matchDur(s.duration, dur);
      return okQ && okC && okG && okD;
    });

    if (sort === "popular") list = [...list].sort((a, b) => b.booked - a.booked);
    if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [q, cat, goal, dur, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage]);

  function reset() {
    setQ("");
    setCat("all");
    setGoal("all");
    setDur("all");
    setSort("popular");
    setPage(1);
  }

  function bumpToFirstPage() {
    setPage(1);
  }

  return (
    <div className="bg-slate-50 text-slate-900">
      <ParticlesBackground />

      <div className="page-content">
        <Header onLogin={() => openAuth("login")} onRegister={() => openAuth("register")} />

        <main className="px-4 pb-10">
          <div className="max-w-6xl mx-auto card overflow-hidden">
            {/* Hero */}
            <div className="relative">
              <img
                className="h-52 w-full object-cover"
                alt="services"
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=70"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/55 to-indigo-700/20" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="text-xs font-extrabold text-white/80">Dịch vụ AYANAVITA</div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  Trải nghiệm Spa chuyên sâu, chuẩn hoá theo hệ thống
                </h1>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className="chip">
                    <i className="fa-solid fa-shield-halved text-emerald-600" />
                    Quy trình chuẩn
                  </span>
                  <span className="chip">
                    <i className="fa-solid fa-user-doctor text-indigo-600" />
                    Chuyên viên
                  </span>
                  <span className="chip">
                    <i className="fa-solid fa-star star" />
                    Đánh giá cao
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 grid gap-4 lg:grid-cols-4">
              {/* Filters */}
              <aside className="lg:col-span-1">
                <div className="card p-5">
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold">Bộ lọc dịch vụ</div>
                    <button
                      onClick={reset}
                      className="btn px-3 py-2"
                      type="button"
                      aria-label="reset"
                    >
                      <i className="fa-solid fa-rotate-left" />
                    </button>
                  </div>

                  <div className="mt-3">
                    <label className="text-sm font-extrabold text-slate-700">Tìm theo tên</label>
                    <input
                      className="field mt-2"
                      placeholder="VD: chăm sóc da, trị liệu..."
                      value={q}
                      onChange={(e) => {
                        setQ(e.target.value);
                        bumpToFirstPage();
                      }}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-extrabold text-slate-700">Danh mục</label>
                    <select
                      className="field mt-2"
                      value={cat}
                      onChange={(e) => {
                        setCat(e.target.value as CatRule);
                        bumpToFirstPage();
                      }}
                    >
                      <option value="all">Tất cả</option>
                      <option value="skin">Chăm sóc da</option>
                      <option value="body">Body / Thư giãn</option>
                      <option value="health">Sức khoẻ trị liệu</option>
                      <option value="package">Gói liệu trình</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-extrabold text-slate-700">Mục tiêu</label>
                    <select
                      className="field mt-2"
                      value={goal}
                      onChange={(e) => {
                        setGoal(e.target.value as GoalRule);
                        bumpToFirstPage();
                      }}
                    >
                      <option value="all">Tất cả</option>
                      <option value="relax">Thư giãn</option>
                      <option value="acne">Giảm mụn</option>
                      <option value="bright">Sáng da</option>
                      <option value="restore">Phục hồi</option>
                      <option value="pain">Giảm đau nhức</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-extrabold text-slate-700">Thời lượng</label>
                    <select
                      className="field mt-2"
                      value={dur}
                      onChange={(e) => {
                        setDur(e.target.value as DurRule);
                        bumpToFirstPage();
                      }}
                    >
                      <option value="all">Tất cả</option>
                      <option value="lt60">&lt; 60 phút</option>
                      <option value="60-90">60–90 phút</option>
                      <option value="gt90">&gt; 90 phút</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-extrabold text-slate-700">Sắp xếp</label>
                    <select
                      className="field mt-2"
                      value={sort}
                      onChange={(e) => {
                        setSort(e.target.value as SortRule);
                        bumpToFirstPage();
                      }}
                    >
                      <option value="popular">Phổ biến</option>
                      <option value="priceAsc">Giá tăng</option>
                      <option value="priceDesc">Giá giảm</option>
                      <option value="rating">Đánh giá</option>
                    </select>
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-700">
                    Demo: filter + sort realtime bằng React state.
                  </div>
                </div>
              </aside>

              {/* List */}
              <section className="lg:col-span-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-xs font-extrabold text-slate-500">Danh sách</div>
                    <h2 className="text-xl font-extrabold">Dịch vụ nổi bật</h2>
                    <div className="text-sm text-slate-600">
                      Hiển thị <b>{filtered.length}</b> dịch vụ
                    </div>
                  </div>

                  <Link to="/booking" className="btn btn-primary">
                    <i className="fa-solid fa-calendar-check" />
                    Đặt lịch
                  </Link>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {pageItems.length ? (
                    pageItems.map((s) => <ServiceCard key={s.id} s={s} />)
                  ) : (
                    <div className="text-slate-600 p-6">Không có dịch vụ phù hợp bộ lọc.</div>
                  )}
                </div>

                {/* Pagination */}
                <div className="mt-5 flex items-center justify-between">
                  <button
                    className={`btn ${safePage <= 1 ? "opacity-50" : ""}`}
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    type="button"
                  >
                    Trước
                  </button>

                  <div className="chip">
                    Trang <span className="mx-1 font-extrabold">{safePage}</span>/
                    <span className="ml-1 font-extrabold">{totalPages}</span>
                  </div>

                  <button
                    className={`btn ${safePage >= totalPages ? "opacity-50" : ""}`}
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    type="button"
                  >
                    Sau
                  </button>
                </div>
              </section>
            </div>
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
