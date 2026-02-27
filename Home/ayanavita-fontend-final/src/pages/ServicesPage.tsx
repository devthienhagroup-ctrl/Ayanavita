import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ParticlesBackground } from "../components/layout/ParticlesBackground";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

import { AuthModal } from "../components/home/AuthModal";
import { SuccessModal } from "../components/home/SuccessModal";

import { money } from "../services/booking.utils";
import { http } from "../api/http";

/* ================= TYPES ================= */

type AuthTab = "login" | "register";
type DurRule = "all" | "lt60" | "60-90" | "gt90";
type SortRule = "popular" | "priceAsc" | "priceDesc" | "rating";

type ApiService = {
  id: string;
  dbId: number;
  name: string;
  cat: string;
  goal: string[];
  duration: number;
  price: number;
  rating: number;
  booked: number;
  img?: string | null;
  tag: string;
};

interface CmsData {
  hero: {
    preTitle: string;
    title: string;
    chips: { text: string; icon: string }[];
  };
  filters: {
    title: string;
    search: { label: string; placeholder: string };
    category: { label: string; options: { value: string; label: string }[] };
    goal: { label: string; options: { value: string; label: string }[] };
    duration: { label: string; options: { value: string; label: string }[] };
    sort: { label: string; options: { value: string; label: string }[] };
  };
  listSection: {
    preTitle: string;
    title: string;
    showingText: string;
    servicesText: string;
    bookButton: string;
  };
  card: {
    detailsButton: string;
    bookButton: string;
    minutes: string;
  };
  pagination: {
    prev: string;
    next: string;
    page: string;
  };
}

/* ================= CMS DEFAULT ================= */

const defaultCmsData: CmsData = {
  hero: {
    preTitle: "Dịch vụ AYANAVITA",
    title: "Trải nghiệm Spa chuyên sâu, chuẩn hoá theo hệ thống",
    chips: [
      { text: "Quy trình chuẩn", icon: "fa-solid fa-shield-halved" },
      { text: "Chuyên viên", icon: "fa-solid fa-user-doctor" },
      { text: "Đánh giá cao", icon: "fa-solid fa-star" }
    ]
  },
  filters: {
    title: "Bộ lọc dịch vụ",
    search: { label: "Tìm theo tên", placeholder: "VD: chăm sóc da..." },
    category: {
      label: "Danh mục",
      options: [{ value: "all", label: "Tất cả" }]
    },
    goal: {
      label: "Mục tiêu",
      options: [{ value: "all", label: "Tất cả" }]
    },
    duration: {
      label: "Thời lượng",
      options: [
        { value: "all", label: "Tất cả" },
        { value: "lt60", label: "< 60 phút" },
        { value: "60-90", label: "60–90 phút" },
        { value: "gt90", label: "> 90 phút" }
      ]
    },
    sort: {
      label: "Sắp xếp",
      options: [
        { value: "popular", label: "Phổ biến" },
        { value: "priceAsc", label: "Giá tăng" },
        { value: "priceDesc", label: "Giá giảm" },
        { value: "rating", label: "Đánh giá" }
      ]
    }
  },
  listSection: {
    preTitle: "Danh sách",
    title: "Dịch vụ nổi bật",
    showingText: "Hiển thị",
    servicesText: "dịch vụ",
    bookButton: "Đặt lịch"
  },
  card: {
    detailsButton: "Chi tiết",
    bookButton: "Đặt",
    minutes: "phút"
  },
  pagination: {
    prev: "Trước",
    next: "Sau",
    page: "Trang"
  }
};

/* ================= UTIL ================= */

function matchDur(dur: number, rule: DurRule) {
  if (rule === "lt60") return dur < 60;
  if (rule === "60-90") return dur >= 60 && dur <= 90;
  if (rule === "gt90") return dur > 90;
  return true;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.max(1, Math.floor(rating));
  return (
      <span className="flex gap-1">
      {Array.from({ length: full }).map((_, i) => (
          <i key={i} className="fa-solid fa-star star" />
      ))}
    </span>
  );
}

/* ================= PAGE ================= */

export default function ServicesPage() {
  const preferredLanguage =
      localStorage.getItem("preferred-language") || "vi";

  const [cmsFromApi, setCmsFromApi] = useState<Partial<CmsData> | null>(null);
  const cms = useMemo(
      () => ({ ...defaultCmsData, ...(cmsFromApi || {}) }),
      [cmsFromApi]
  );

  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [goal, setGoal] = useState("all");
  const [dur, setDur] = useState<DurRule>("all");
  const [sort, setSort] = useState<SortRule>("popular");
  const [page, setPage] = useState(1);

  const pageSize = 6;

  /* ================= LOAD SERVICES ================= */

  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get("/booking/services-page", {
          params: { lang: preferredLanguage }
        });
        setServices(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    })();
  }, [preferredLanguage]);

  /* ================= LOAD CMS ================= */

  useEffect(() => {
    (async () => {
      try {
        const res = await http.get(
            `/public/pages/services?lang=${preferredLanguage}`
        );
        setCmsFromApi(res.data.sections?.[0]?.data ?? null);
      } catch {
        setCmsFromApi(null);
      }
    })();
  }, [preferredLanguage]);

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {
    let list = services.filter((s) => {
      const okQ =
          !q ||
          s.name.toLowerCase().includes(q.toLowerCase()) ||
          s.id.toLowerCase().includes(q.toLowerCase());
      const okC = cat === "all" || s.cat === cat;
      const okG = goal === "all" || s.goal?.includes(goal);
      const okD = matchDur(s.duration, dur);
      return okQ && okC && okG && okD;
    });

    if (sort === "popular") list.sort((a, b) => b.booked - a.booked);
    if (sort === "priceAsc") list.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [services, q, cat, goal, dur, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageItems = filtered.slice(
      (safePage - 1) * pageSize,
      safePage * pageSize
  );

  /* ================= UI ================= */

  return (
      <div className="bg-slate-50 text-slate-900">
        <ParticlesBackground />
        <div className="page-content">
          <Header />

          <main className="px-4 pb-10">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold">{cms.hero.title}</h1>

              {loading && (
                  <div className="mt-4 text-sm text-slate-500">
                    Đang tải dữ liệu dịch vụ...
                  </div>
              )}

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pageItems.map((s) => (
                    <article key={s.id} className="card p-4">
                      <img
                          src={s.img || ""}
                          alt={s.name}
                          className="h-36 w-full object-cover rounded-xl"
                      />
                      <div className="mt-3 font-bold">{s.name}</div>
                      <div className="text-sm text-slate-500">
                        {s.duration} {cms.card.minutes}
                      </div>
                      <div className="mt-2">{money(s.price)}</div>
                      <Stars rating={s.rating} />
                      <Link
                          className="btn btn-primary mt-3"
                          to={`/services/${s.dbId}`}
                      >
                        {cms.card.detailsButton}
                      </Link>
                    </article>
                ))}
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
  );
}