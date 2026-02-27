// src/pages/BookingPage.tsx
import React from "react";
import { useSearchParams } from "react-router-dom";

import { BookingHero } from "../components/booking/BookingHero";
import { BookingForm } from "../components/booking/BookingForm";
import { SlotPicker } from "../components/booking/SlotPicker";
import { TrustSection } from "../components/booking/TrustSection";
import { PolicyModal } from "../components/booking/PolicyModal";
import { ToastStack } from "../components/booking/ToastStack";
import { MyBookings } from "../components/booking/MyBookings";

import { http } from "../api/http";
import { useToast } from "../services/useToast";
import { useBookingSlots } from "../services/useBookingSlots";
import { useBookings } from "../services/useBookings";
import { getAuth, type AuthUser } from "../services/auth.storage";
import type { BookingStatus } from "../services/booking.storage";

/* ================== TOAST CMS ================== */

const defaultToastCmsData = {
  demoFilled: { title: "Đã điền demo", message: "Hãy chọn khung giờ và tạo lịch hẹn." },
  myBookings: { title: "Lịch của tôi", message: "Xem phần sidebar bên phải." },
  resetDone: { title: "Đã reset", message: "Bạn có thể đặt lịch lại." },
  bookingsCleared: { title: "Đã xóa lịch hẹn", message: "LocalStorage đã được làm sạch." },
  statusUpdated: { title: "Đã cập nhật trạng thái", message: "{id} • {status}" },
  slotsRefreshed: { title: "Đã làm mới slot", message: "Một số khung giờ có thể hết chỗ (demo)." },

  uiSelectedSlotLabel: { title: "UI", message: "Khung giờ đã chọn:" },
  uiNotSelected: { title: "UI", message: "Chưa chọn" },
  uiResetAll: { title: "UI", message: "Reset toàn bộ" },
  uiTipRefreshSlots: {
    title: "UI",
    message: 'Tip: bấm “Làm mới” ở khung giờ để random available/unavailable (demo).',
  },
  uiConfirmClearBookings: {
    title: "UI",
    message: "Xóa toàn bộ lịch hẹn (demo)?",
  },
} as const;

type ToastCmsData = Record<string, { title: string; message: string }>;
type ToastCmsKey = keyof typeof defaultToastCmsData;

function formatTemplate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
      vars[k] === undefined ? `{${k}}` : String(vars[k])
  );
}

/* ================== COMPONENT ================== */

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const { items: toasts, push: toast, remove } = useToast();
  const slots = useBookingSlots();
  const bookings = useBookings();

  const [policyOpen, setPolicyOpen] = React.useState(false);
  const [resetSignal, setResetSignal] = React.useState(0);

  const [currentLanguage, setCurrentLanguage] = React.useState<string>(
      () => localStorage.getItem("preferred-language") || "vi"
  );

  const [bookingData, setBookingData] = React.useState<any>(null);
  const [toastCmsData, setToastCmsData] = React.useState<ToastCmsData>(
      defaultToastCmsData as any
  );

  const [user] = React.useState<AuthUser | null>(() => {
    try {
      return getAuth();
    } catch {
      return null;
    }
  });

  /* ========== Lắng nghe language change ========== */

  React.useEffect(() => {
    const handler = (e: any) => setCurrentLanguage(e.detail.language);
    window.addEventListener("languageChange", handler);
    return () => window.removeEventListener("languageChange", handler);
  }, []);

  /* ========== Fetch CMS Page ========== */

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await http.get(`/public/pages/booking?lang=${currentLanguage}`);
        if (!alive) return;
        setBookingData(res.data);
      } catch {}
    })();
    return () => {
      alive = false;
    };
  }, [currentLanguage]);

  /* ========== Update Toast CMS ========== */

  React.useEffect(() => {
    const next = bookingData?.sections?.[5]?.data;
    if (next && typeof next === "object") {
      setToastCmsData(next);
    } else {
      setToastCmsData(defaultToastCmsData as any);
    }
  }, [bookingData]);

  /* ========== Helpers ========== */

  const toastFromCms = React.useCallback(
      (key: ToastCmsKey, vars?: Record<string, string | number>) => {
        const item = toastCmsData[key];
        if (!item) return;
        toast(item.title, formatTemplate(item.message, vars));
      },
      [toast, toastCmsData]
  );

  const cmsMsg = React.useCallback(
      (key: ToastCmsKey, vars?: Record<string, string | number>) => {
        const item = toastCmsData[key];
        return item ? formatTemplate(item.message, vars) : "";
      },
      [toastCmsData]
  );

  /* ========== Actions ========== */

  const fillDemo = () => toastFromCms("demoFilled");

  const viewMyBookings = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    toastFromCms("myBookings");
  };

  const resetAll = () => {
    setResetSignal((x) => x + 1);
    slots.refresh();
    bookings.reload();
    toastFromCms("resetDone");
  };

  const clearBookings = () => {
    if (!confirm(cmsMsg("uiConfirmClearBookings"))) return;
    bookings.clearAll();
    toastFromCms("bookingsCleared");
  };

  const setStatus = (id: string, status: BookingStatus) => {
    bookings.setStatus(id, status);
    toastFromCms("statusUpdated", { id, status });
  };

  /* ================== UI ================== */

  return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <main className="mx-auto max-w-7xl px-4 py-6">
          <BookingHero
              cmsData={bookingData?.sections?.[0]?.data}
              onFillDemo={fillDemo}
              onViewMyBookings={viewMyBookings}
          />

          <section className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <BookingForm
                  cmsData={bookingData?.sections?.[1]?.data}
                  selectedSlot={slots.selectedSlot}
                  onToast={toast}
                  onCreate={(b) => bookings.add(b)}
                  onResetSignal={resetSignal}
                  initialName={user?.name || ""}
              />

              <div className="rounded-3xl border bg-slate-50 p-4">
                <div className="text-sm">
                  {cmsMsg("uiSelectedSlotLabel")}{" "}
                  <b>{slots.selectedSlot || cmsMsg("uiNotSelected")}</b>
                  <button
                      onClick={resetAll}
                      className="ml-3 font-bold text-indigo-600"
                  >
                    {cmsMsg("uiResetAll")}
                  </button>
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {cmsMsg("uiTipRefreshSlots")}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <SlotPicker
                  cmsData={bookingData?.sections?.[2]?.data}
                  slots={slots.slots}
                  selected={slots.selectedSlot}
                  onPick={(t) => slots.pick(t)}
                  onRefresh={() => {
                    slots.refresh();
                    toastFromCms("slotsRefreshed");
                  }}
              />

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <MyBookings
                    cmsData={bookingData?.sections?.[3]?.data}
                    list={bookings.list}
                    onSetStatus={setStatus}
                    onClear={clearBookings}
                />
              </div>
            </div>
          </section>

          <TrustSection
              cmsData={bookingData?.sections?.[4]?.data}
              onPolicy={() => setPolicyOpen(true)}
          />
        </main>

        <PolicyModal
            cmsData={bookingData?.sections?.[5]?.data}
            open={policyOpen}
            onClose={() => setPolicyOpen(false)}
        />

        <ToastStack items={toasts} onClose={remove} />
      </div>
  );
}