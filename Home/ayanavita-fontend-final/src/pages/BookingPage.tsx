// src/pages/BookingPage.tsx
import React from "react";
import { BookingHeader } from "../components/booking/BookingHeader";
import { BookingHero } from "../components/booking/BookingHero";
import { BookingForm } from "../components/booking/BookingForm";
import { SlotPicker } from "../components/booking/SlotPicker";
import { MyBookings } from "../components/booking/MyBookings";
import { TrustSection } from "../components/booking/TrustSection";
import { BookingFooter } from "../components/booking/BookingFooter";
import { AuthModal } from "../components/booking/AuthModal";
import { PolicyModal } from "../components/booking/PolicyModal";
import { ToastStack } from "../components/booking/ToastStack";

import { useBookingCatalog } from "../services/booking.demo";
import { http } from "../api/http";
import { useToast } from "../services/useToast";
import { useBookingSlots } from "../services/useBookingSlots";
import { useBookings } from "../services/useBookings";
import { getAuth, setAuth, type AuthUser } from "../services/auth.storage";
import type { BookingStatus } from "../services/booking.storage";
import { Footer } from "../components/layout/Footer";

export default function BookingPage() {
  const { items: toasts, push: toast, remove } = useToast();
  const slots = useBookingSlots();
  const bookings = useBookings();
  const catalog = useBookingCatalog();

  const [authOpen, setAuthOpen] = React.useState(false);
  const [policyOpen, setPolicyOpen] = React.useState(false);
  const [user, setUser] = React.useState<AuthUser | null>(() => {
    try {
      return getAuth();
    } catch {
      return null;
    }
  });

  const [resetSignal, setResetSignal] = React.useState(0);

  const formRef = React.useRef<HTMLDivElement | null>(null);

  const userLabel = user ? user.name : "Đăng nhập";

  const onAuthClick = () => {
    if (user) {
      if (confirm("Bạn muốn đăng xuất?")) {
        setAuth(null);
        setUser(null);
        toast("Đã đăng xuất");
      }
      return;
    }
    setAuthOpen(true);
  };

  const fillDemo = () => {
    // demo fill via reset signal and user name propagated to BookingForm
    if (!user) {
      const demoUser: AuthUser = { email: "demo@ayanavita.vn", name: "Khách Demo", remember: false };
      setUser(demoUser);
    }
    toast("Đã điền demo", "Hãy chọn khung giờ và tạo lịch hẹn.");
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const viewMyBookings = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    toast("Lịch của tôi", "Xem phần sidebar bên phải.");
  };

  const resetAll = () => {
    setResetSignal((x) => x + 1);
    slots.refresh();
    bookings.reload();
    toast("Đã reset", "Bạn có thể đặt lịch lại.");
  };

  const clearBookings = () => {
    if (!confirm("Xóa toàn bộ lịch hẹn (demo)?")) return;
    bookings.clearAll();
    toast("Đã xóa lịch hẹn", "LocalStorage đã được làm sạch.");
  };

  const setStatus = (id: string, status: BookingStatus) => {
    bookings.setStatus(id, status);
    toast("Đã cập nhật trạng thái", `${id} • ${status}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <BookingHeader
        userLabel={userLabel}
        onHotline={() => toast("Hotline", "Gọi 0900 000 000 (demo).")}
        onAuthClick={onAuthClick}
      />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <BookingHero onFillDemo={fillDemo} onScrollForm={scrollToForm} onViewMyBookings={viewMyBookings} />

        <section id="form" className="mt-5 grid gap-4 lg:grid-cols-3" ref={formRef}>
          <div className="lg:col-span-2 space-y-4">
            <BookingForm
              services={catalog.services}
              staff={catalog.staff}
              branches={catalog.branches}
              selectedSlot={slots.selectedSlot}
              onToast={toast}
              onCreate={async (b) => {
                bookings.add(b);
                try {
                  await http.post("/booking/appointments", {
                    customerName: b.name,
                    customerPhone: b.phone,
                    customerEmail: b.email || undefined,
                    appointmentAt: `${b.date}T${b.time}:00`,
                    note: b.note || undefined,
                    branchId: Number(b.branchId),
                    serviceId: Number(b.serviceId),
                    specialistId: b.staffId ? Number(b.staffId) : undefined,
                  });
                } catch {
                  toast("Lưu DB chưa thành công", "Vui lòng kiểm tra backend (localhost:8090).");
                }
              }}
              onResetSignal={resetSignal}
              initialName={user?.name || ""}
            />
            {catalog.loading && <div className="text-sm text-slate-500">Đang tải dữ liệu dịch vụ từ API...</div>}

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-slate-700">
                  Khung giờ đã chọn: <b>{slots.selectedSlot || "Chưa chọn"}</b>
                  <span className="text-slate-500"> • </span>
                  <button className="font-extrabold text-indigo-600 hover:underline" onClick={resetAll} type="button">
                    Reset toàn bộ
                  </button>
                </div>
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Tip: bấm “Làm mới” ở khung giờ để random available/unavailable (demo).
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <SlotPicker
              slots={slots.slots}
              selected={slots.selectedSlot}
              onPick={(t) => slots.pick(t)}
              onRefresh={() => {
                slots.refresh();
                toast("Đã làm mới slot", "Một số khung giờ có thể hết chỗ (demo).");
              }}
            />

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <MyBookings list={bookings.list} onSetStatus={setStatus} onClear={clearBookings} />
            </div>
          </div>
        </section>

        <TrustSection onPolicy={() => setPolicyOpen(true)} />
      </main>

      <Footer
      />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        toast={toast}
        onAuthed={(u) => setUser(u)}
      />

      <PolicyModal open={policyOpen} onClose={() => setPolicyOpen(false)} />

      <ToastStack items={toasts} onClose={remove} />
    </div>
  );
}
