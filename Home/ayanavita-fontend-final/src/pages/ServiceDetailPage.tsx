import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { AuthModal } from "../components/home/AuthModal";
import { SuccessModal } from "../components/home/SuccessModal";

import { http } from "../api/http";
import { isValidPhone, money, toISODate } from "../services/booking.utils";

type AuthTab = "login" | "register";

type ToastState =
    | { type: "success"; message: string }
    | { type: "error"; message: string }
    | null;

/* ================= CMS DEFAULT ================= */

const cmsData = {
  hero: {
    eyebrow: "Chi tiết dịch vụ",
    chips: {
      durationSuffix: "phút",
      ratingBookedLabel: "lượt",
      certifiedProcess: "Quy trình chuẩn",
    },
  },
  pricing: {
    title: "Giá niêm yết",
    includedNote: "Đã bao gồm tư vấn da cơ bản.",
    ctaBooking: "Đặt lịch",
    ctaBackToList: "Danh sách",
  },
  benefits: { title: "Mục tiêu & Lợi ích" },
  process: { title: "Quy trình (chuẩn hoá)" },
  audience: {
    title: "Dành cho ai?",
    suitableFor: "Phù hợp cho:",
  },
  reviews: {
    title: "Đánh giá khách hàng",
    ctaAll: "Xem tất cả",
  },
  sidebar: {
    title: "Đặt lịch nhanh",
    subtitle: "Nhập thông tin để giữ chỗ.",
    fields: {
      namePlaceholder: "Họ và tên",
      phonePlaceholder: "Số điện thoại",
      notePlaceholder: "Ghi chú (tình trạng da, dị ứng...)",
      submit: "Xác nhận đặt",
    },
    pledge: {
      title: "Cam kết",
      items: [
        "Quy trình chuẩn hoá",
        "Sản phẩm rõ nguồn gốc",
        "Tư vấn trước và sau dịch vụ",
      ],
    },
  },
  booking: {
    validation: {
      missingName: "Vui lòng nhập Họ và tên.",
      invalidPhone: "SĐT chưa đúng (bắt đầu 0, đủ 10–11 số).",
      missingDate: "Vui lòng chọn Ngày.",
      pastDate: "Ngày đặt phải >= hôm nay.",
    },
    success: { emptyNote: "(không)" },
  },
  auth: {
    loginSuccess: "Đăng nhập thành công.",
    registerSuccess: "Đăng ký thành công.",
  },
} as const;

type CmsData = typeof cmsData;

/* ================= TYPES ================= */

type BranchOption = {
  id: number;
  name: string;
  address?: string;
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
  reviews: ServiceReview[];
};

type PreferredLanguage = "vi" | "en" | "ja";

/* ================= UTIL ================= */

function getPreferredLanguage(): PreferredLanguage {
  const raw = localStorage.getItem("preferred-language")?.trim().toLowerCase();
  if (raw === "en") return "en";
  if (raw === "ja") return "ja";
  return "vi";
}

/* ================= PAGE ================= */

export default function ServiceDetailPage() {
  const { serviceId } = useParams();
  const preferredLanguage = getPreferredLanguage();

  const [cmsDataApi, setCmsDataApi] =
      useState<Partial<CmsData> | null>(null);

  const cms = useMemo<CmsData>(() => {
    return {
      ...cmsData,
      ...(cmsDataApi || {}),
      hero: { ...cmsData.hero, ...(cmsDataApi?.hero || {}) },
      pricing: { ...cmsData.pricing, ...(cmsDataApi?.pricing || {}) },
      benefits: { ...cmsData.benefits, ...(cmsDataApi?.benefits || {}) },
      process: { ...cmsData.process, ...(cmsDataApi?.process || {}) },
      audience: { ...cmsData.audience, ...(cmsDataApi?.audience || {}) },
      reviews: { ...cmsData.reviews, ...(cmsDataApi?.reviews || {}) },
      sidebar: {
        ...cmsData.sidebar,
        ...(cmsDataApi?.sidebar || {}),
        fields: {
          ...cmsData.sidebar.fields,
          ...(cmsDataApi?.sidebar?.fields || {}),
        },
        pledge: {
          ...cmsData.sidebar.pledge,
          ...(cmsDataApi?.sidebar?.pledge || {}),
          items:
              cmsDataApi?.sidebar?.pledge?.items ??
              cmsData.sidebar.pledge.items,
        },
      },
      booking: {
        ...cmsData.booking,
        ...(cmsDataApi?.booking || {}),
        validation: {
          ...cmsData.booking.validation,
          ...(cmsDataApi?.booking?.validation || {}),
        },
      },
      auth: { ...cmsData.auth, ...(cmsDataApi?.auth || {}) },
    };
  }, [cmsDataApi]);

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(() => toISODate(new Date()));
  const [time, setTime] = useState("09:00");
  const [note, setNote] = useState("");
  const [branchId, setBranchId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const todayISO = useMemo(() => toISODate(new Date()), []);

  /* ================= LOAD SERVICE ================= */

  useEffect(() => {
    const id = Number(serviceId);
    if (!Number.isInteger(id)) return;

    (async () => {
      try {
        const [{ data: detail }, { data: branchRows }] =
            await Promise.all([
              http.get(`/booking/services/${id}`, {
                params: { lang: preferredLanguage },
              }),
              http.get("/booking/branches", {
                params: { serviceId: id, lang: preferredLanguage },
              }),
            ]);

        setService(detail);
        setBranches(branchRows || []);
        if (branchRows?.length) {
          setBranchId(String(branchRows[0].id));
        }
      } catch {
        setError("Không thể tải dữ liệu dịch vụ.");
      } finally {
        setLoading(false);
      }
    })();
  }, [serviceId, preferredLanguage]);

  /* ================= LOAD CMS ================= */

  useEffect(() => {
    (async () => {
      try {
        const res = await http.get(
            `/public/pages/serviceDetail?lang=${preferredLanguage}`
        );
        const payload =
            res.data.sections?.[0]?.data?.cmsData ??
            res.data.sections?.[0]?.data;

        if (payload) setCmsDataApi(payload);
      } catch (e) {
        console.error("CMS error", e);
      }
    })();
  }, [preferredLanguage]);

  /* ================= BOOKING ================= */

  function showToast(t: ToastState) {
    setToast(t);
    if (t) setTimeout(() => setToast(null), 4500);
  }

  async function submitBooking() {
    if (!service) return;

    const n = name.trim();
    const p = phone.trim();
    const d = date.trim();
    const t = time.trim();

    if (!n)
      return showToast({
        type: "error",
        message: cms.booking.validation.missingName,
      });

    if (!isValidPhone(p))
      return showToast({
        type: "error",
        message: cms.booking.validation.invalidPhone,
      });

    if (!d)
      return showToast({
        type: "error",
        message: cms.booking.validation.missingDate,
      });

    if (d < todayISO)
      return showToast({
        type: "error",
        message: cms.booking.validation.pastDate,
      });

    try {
      setSubmitting(true);

      await http.post("/booking/appointments", {
        customerName: n,
        customerPhone: p,
        customerEmail: email || undefined,
        appointmentAt: `${d}T${t}:00`,
        note: note || undefined,
        branchId: Number(branchId),
        serviceId: service.id,
        lang: preferredLanguage,
      });

      showToast({
        type: "success",
        message: `Đặt lịch thành công cho ${service.name}`,
      });
    } catch (err: any) {
      showToast({
        type: "error",
        message:
            err?.response?.data?.message ||
            "Không thể tạo lịch hẹn.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!service) return null;

  return (
      <div className="page-content max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">
          {service.name}
        </h1>

        <div className="mt-4 text-xl font-semibold">
          {money(service.price)}
        </div>

        <div className="mt-6">
          <div className="font-bold">{cms.sidebar.title}</div>

          <div className="grid gap-2 mt-3">
            <input
                className="field"
                placeholder={cms.sidebar.fields.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className="field"
                placeholder={cms.sidebar.fields.phonePlaceholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <input
                className="field"
                type="date"
                min={todayISO}
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <textarea
                className="field"
                rows={4}
                placeholder={cms.sidebar.fields.notePlaceholder}
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />

            <button
                onClick={submitBooking}
                className="btn btn-primary"
                disabled={submitting}
            >
              {cms.sidebar.fields.submit}
            </button>
          </div>

          {toast && (
              <div className="mt-4 text-sm whitespace-pre-line">
                {toast.message}
              </div>
          )}
        </div>
      </div>
  );
}