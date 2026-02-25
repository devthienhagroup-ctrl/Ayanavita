// src/pages/BookingPage.tsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import { BookingHeader } from "../components/booking/BookingHeader";
import { BookingHero } from "../components/booking/BookingHero";
import { BookingForm } from "../components/booking/BookingForm";
import { SlotPicker } from "../components/booking/SlotPicker";
import { TrustSection } from "../components/booking/TrustSection";
import { AuthModal } from "../components/booking/AuthModal";
import { PolicyModal } from "../components/booking/PolicyModal";
import { ToastStack } from "../components/booking/ToastStack";

import { bookingApi } from "../api/booking.api";
import { http } from "../api/http";
import { useToast } from "../services/useToast";
import { useBookingSlots } from "../services/useBookingSlots";
import { getAuth, setAuth, type AuthUser } from "../services/auth.storage";
import { Footer } from "../components/layout/Footer";

type Opt = { id: string; name: string; duration?: number; price?: number; address?: string };

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get("serviceId") || "";

  const { items: toasts, push: toast, remove } = useToast();
  const slots = useBookingSlots();

  const [services, setServices] = React.useState<Opt[]>([]);
  const [branches, setBranches] = React.useState<Opt[]>([]);
  const [loadingCatalog, setLoadingCatalog] = React.useState(true);

  const [serviceId, setServiceId] = React.useState<string>("");
  const [branchId, setBranchId] = React.useState<string>("");
  const [date, setDate] = React.useState<string>(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [customTime, setCustomTime] = React.useState("");

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

  const refreshSlots = React.useCallback(async (sid: string, bid: string, d: string) => {
    await slots.refresh({
      serviceId: sid ? Number(sid) : undefined,
      branchId: bid ? Number(bid) : undefined,
      date: d,
    });
  }, [slots.refresh]);

  const normalizeServices = React.useCallback(
    (input: any[]) => input.map((s: any) => ({ id: String(s.id), name: s.name, duration: Number(s.durationMin || 0), price: Number(s.price || 0) })),
    [],
  );

  const normalizeBranches = React.useCallback(
    (input: any[]) => input.map((b: any) => ({ id: String(b.id), name: b.name, address: b.address })),
    [],
  );

  const bootstrapCatalog = React.useCallback(async () => {
    setLoadingCatalog(true);
    try {
      const serviceRows = await bookingApi.services();
      const normalizedServices = normalizeServices(serviceRows);
      setServices(normalizedServices);

      const preferred = normalizedServices.find((s) => s.id === preselectedService)?.id;
      const nextService = preferred || normalizedServices[0]?.id || "";
      setServiceId(nextService);

      const branchRows = nextService ? await bookingApi.branches({ serviceId: Number(nextService) }) : [];
      const normalizedBranches = normalizeBranches(branchRows);
      setBranches(normalizedBranches);

      const nextBranch = normalizedBranches[0]?.id || "";
      setBranchId(nextBranch);

      await refreshSlots(nextService, nextBranch, date);
    } catch {
      toast("Không tải được dữ liệu", "Vui lòng kiểm tra backend (localhost:8090).");
    } finally {
      setLoadingCatalog(false);
    }
  }, [date, normalizeBranches, normalizeServices, preselectedService, refreshSlots, toast]);

  React.useEffect(() => {
    bootstrapCatalog();
  }, [bootstrapCatalog]);

  const onBranchChange = async (nextBranch: string) => {
    setBranchId(nextBranch);
    setCustomTime("");
    slots.clearPick();
    await refreshSlots(serviceId, nextBranch, date);
  };

  const onServiceChange = async (nextService: string) => {
    setServiceId(nextService);
    setCustomTime("");
    slots.clearPick();
    try {
      const branchRows = await bookingApi.branches(nextService ? { serviceId: Number(nextService) } : undefined);
      const normalizedBranches = normalizeBranches(branchRows);
      setBranches(normalizedBranches);
      const nextBranch = normalizedBranches[0]?.id || "";
      setBranchId(nextBranch);
      await refreshSlots(nextService, nextBranch, date);
    } catch {
      toast("Không tải được chi nhánh theo dịch vụ");
    }
  };

  const onDateChange = async (nextDate: string) => {
    setDate(nextDate);
    setCustomTime("");
    slots.clearPick();
    await refreshSlots(serviceId, branchId, nextDate);
  };

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
    if (!user) {
      const demoUser: AuthUser = { email: "demo@ayanavita.vn", name: "Khách Demo", remember: false };
      setUser(demoUser);
    }
    toast("Đã điền demo", "Hãy chọn khung giờ và tạo lịch hẹn.");
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetAll = async () => {
    setResetSignal((x) => x + 1);
    setCustomTime("");
    slots.clearPick();
    await bootstrapCatalog();
    toast("Đã reset", "Bạn có thể đặt lịch lại.");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <BookingHeader userLabel={userLabel} onHotline={() => toast("Hotline", "Gọi 0900 000 000 (demo)." )} onAuthClick={onAuthClick} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <BookingHero onFillDemo={fillDemo} onScrollForm={scrollToForm} />

        <section id="form" className="mt-5 grid gap-4 lg:grid-cols-3" ref={formRef}>
          <div className="lg:col-span-2 space-y-4">
            <BookingForm
              services={services as any}
              branches={branches as any}
              selectedServiceId={serviceId}
              selectedBranchId={branchId}
              selectedSlot={slots.selectedSlot}
              customTime={customTime}
              onCustomTime={(v) => {
                setCustomTime(v);
                if (v) slots.clearPick();
              }}
              onToast={toast}
              onCreate={async (b) => {
                try {
                  await http.post("/booking/appointments", {
                    customerName: b.name,
                    customerPhone: b.phone,
                    customerEmail: b.email || undefined,
                    appointmentAt: `${b.date}T${b.time}:00`,
                    note: b.note || undefined,
                    branchId: Number(b.branchId),
                    serviceId: Number(b.serviceId),
                  });
                  toast("Tạo lịch hẹn thành công", `${b.date} ${b.time}`);
                  await refreshSlots(serviceId, branchId, date);
                } catch (error: any) {
                  toast("Không thể tạo lịch", error?.response?.data?.message || "Khung giờ có thể đã hết chỗ.");
                }
              }}
              onResetSignal={resetSignal}
              initialName={user?.name || ""}
              onServiceChange={onServiceChange}
              onBranchChange={onBranchChange}
              onDateChange={onDateChange}
            />
            {loadingCatalog && <div className="text-sm text-slate-500">Đang tải dữ liệu dịch vụ từ API...</div>}

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-slate-700">
                  Khung giờ đã chọn: <b>{customTime || slots.selectedSlot || "Chưa chọn"}</b>
                  <span className="text-slate-500"> • </span>
                  <button className="font-extrabold text-indigo-600 hover:underline" onClick={resetAll} type="button">
                    Reset toàn bộ
                  </button>
                </div>
              </div>
              <div className="mt-2 text-sm text-slate-600">Slot được backend tính theo số chuyên viên phục vụ được dịch vụ ở chi nhánh đã chọn.</div>
            </div>
          </div>

          <div className="space-y-4">
            <SlotPicker
              slots={slots.slots}
              selected={slots.selectedSlot}
              loading={slots.loading}
              durationMin={slots.durationMin}
              capacity={slots.capacity}
              onPick={(t) => {
                setCustomTime("");
                slots.pick(t);
              }}
              onRefresh={() => refreshSlots(serviceId, branchId, date)}
            />
          </div>
        </section>

        <TrustSection onPolicy={() => setPolicyOpen(true)} />
      </main>

      <Footer />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} toast={toast} onAuthed={(u) => setUser(u)} />
      <PolicyModal open={policyOpen} onClose={() => setPolicyOpen(false)} />
      <ToastStack items={toasts} onClose={remove} />
    </div>
  );
}
