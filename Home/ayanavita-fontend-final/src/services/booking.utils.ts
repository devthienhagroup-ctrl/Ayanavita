// src/services/booking.ultill.ts
// Utilities cho trang Booking (demo/prototype) — không phụ thuộc React

// =========================
// Types
// =========================
export type NotifyChannel = "zalo" | "sms" | "email";
export type BookingStatus = "confirmed" | "pending" | "cancelled";

export type ServiceItem = {
  id: string;
  name: string;
  duration: number; // minutes
  price: number; // VND
  tag?: string;
};

export type StaffItem = {
  id: string;
  name: string;
  level?: string;
};

export type BranchItem = {
  id: string;
  name: string;
  address?: string;
};

export type BookingItem = {
  id: string;
  createdAt: string; // ISO
  name: string;
  phone: string;
  email?: string;
  notify: NotifyChannel;

  serviceId?: string;
  serviceName?: string;
  duration?: number;
  price?: number;

  staffId?: string | null;
  staffName?: string;

  branchId?: string;
  branchName?: string;

  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  note?: string;

  status: BookingStatus;
};

// =========================
// Constants / Keys
// =========================
export const BOOKING_STORAGE_KEY = "aya_bookings_v1";

// =========================
// Formatters
// =========================
export function money(n: number) {
  return "₫ " + new Intl.NumberFormat("vi-VN").format(Number(n || 0));
}

// =========================
// IDs / Date helpers
// =========================
export function uid(prefix = "BK") {
  // BK-XXXXXX
  return `${prefix}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
}

export function toISODate(d: Date | string | number) {
  const x = new Date(d);
  // giữ YYYY-MM-DD
  return x.toISOString().slice(0, 10);
}

export function addDaysISO(base: Date | string | number, days: number) {
  const dt = new Date(base);
  dt.setDate(dt.getDate() + days);
  return toISODate(dt);
}

// =========================
// Validation
// =========================
export function normalizePhone(p: string) {
  return String(p || "").replace(/\s+/g, "");
}

/**
 * Validate số điện thoại VN dạng:
 * - Bắt đầu bằng 0
 * - Tổng độ dài 10–11 số (0 + 9 hoặc 10 chữ số)
 *
 * Ví dụ hợp lệ: 0900000000, 09123456789
 */
export function isValidPhone(phone: string) {
  const x = normalizePhone(phone);
  return /^0\d{9,10}$/.test(x);
}

// (giữ alias cũ nếu bạn đang dùng validatePhoneVN ở chỗ khác)
export const validatePhoneVN = isValidPhone;

// =========================
// LocalStorage CRUD
// =========================
export function loadBookings(key: string = BOOKING_STORAGE_KEY): BookingItem[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BookingItem[]) : [];
  } catch {
    return [];
  }
}

export function saveBookings(list: BookingItem[], key: string = BOOKING_STORAGE_KEY) {
  localStorage.setItem(key, JSON.stringify(list || []));
}

export function clearBookings(key: string = BOOKING_STORAGE_KEY) {
  localStorage.removeItem(key);
}

export function upsertBooking(b: BookingItem, key: string = BOOKING_STORAGE_KEY) {
  const list = loadBookings(key);
  const idx = list.findIndex((x) => x.id === b.id);
  if (idx >= 0) list[idx] = b;
  else list.unshift(b);
  saveBookings(list, key);
  return list;
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus,
  key: string = BOOKING_STORAGE_KEY
) {
  const list = loadBookings(key);
  const idx = list.findIndex((x) => x.id === id);
  if (idx < 0) return list;
  list[idx] = { ...list[idx], status };
  saveBookings(list, key);
  return list;
}

export function removeBooking(id: string, key: string = BOOKING_STORAGE_KEY) {
  const list = loadBookings(key).filter((x) => x.id !== id);
  saveBookings(list, key);
  return list;
}

// =========================
// Lookup helpers
// =========================
export function findService(services: ServiceItem[], id?: string) {
  if (!id) return undefined;
  return services.find((s) => s.id === id);
}

export function findStaff(staff: StaffItem[], id?: string) {
  if (!id) return undefined;
  return staff.find((s) => s.id === id);
}

export function findBranch(branches: BranchItem[], id?: string) {
  if (!id) return undefined;
  return branches.find((b) => b.id === id);
}

// =========================
// Slot generation (demo)
// =========================
export type SlotItem = { t: string; available: boolean };

export function defaultSlotBase(): string[] {
  return ["09:00", "10:00", "11:00", "13:30", "14:30", "15:30", "16:30", "18:30", "19:30"];
}

/**
 * Gen slots demo: random unavailable theo tỷ lệ (default 25%)
 */
export function genSlots(options?: { base?: string[]; unavailableRate?: number }): SlotItem[] {
  const base = options?.base ?? defaultSlotBase();
  const rate = typeof options?.unavailableRate === "number" ? options.unavailableRate : 0.25;

  return base.map((t) => ({
    t,
    available: Math.random() > rate,
  }));
}

// =========================
// Create booking (compose)
// =========================
export type CreateBookingInput = {
  name: string;
  phone: string;
  email?: string;
  notify: NotifyChannel;

  serviceId: string;
  staffId?: string; // empty = system assign
  branchId: string;

  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  note?: string;
};

export function createBooking(
  input: CreateBookingInput,
  ctx: { services: ServiceItem[]; staff: StaffItem[]; branches: BranchItem[] },
  now: Date = new Date()
): BookingItem {
  const service = findService(ctx.services, input.serviceId);
  const staff = findStaff(ctx.staff, input.staffId);
  const branch = findBranch(ctx.branches, input.branchId);

  return {
    id: uid("BK"),
    createdAt: now.toISOString(),
    name: (input.name || "").trim(),
    phone: normalizePhone(input.phone),
    email: (input.email || "").trim() || undefined,
    notify: input.notify,

    serviceId: service?.id,
    serviceName: service?.name,
    duration: service?.duration,
    price: service?.price,

    staffId: staff?.id ?? null,
    staffName: staff?.name ?? "Hệ thống phân bổ",

    branchId: branch?.id,
    branchName: branch?.name,

    date: input.date,
    time: input.time,
    note: (input.note || "").trim() || undefined,

    status: "confirmed",
  };
}

// =========================
// Demo datasets (optional)
// =========================
export const DEMO_SERVICES: ServiceItem[] = [
  { id: "sv1", name: "Chăm sóc da chuyên sâu", duration: 75, price: 690000, tag: "Da" },
  { id: "sv2", name: "Massage trị liệu cổ vai gáy", duration: 60, price: 490000, tag: "Sức khoẻ" },
  { id: "sv3", name: "Gội đầu dưỡng sinh", duration: 45, price: 320000, tag: "Thư giãn" },
  { id: "sv4", name: "Combo: Da + Massage", duration: 120, price: 1050000, tag: "Combo" },
];

export const DEMO_STAFF: StaffItem[] = [
  { id: "st1", name: "Chuyên viên Linh", level: "Senior" },
  { id: "st2", name: "Chuyên viên Trang", level: "Expert" },
  { id: "st3", name: "Chuyên viên Mai", level: "Senior" },
  { id: "st4", name: "Chuyên viên Nam", level: "Therapist" },
];

export const DEMO_BRANCHES: BranchItem[] = [
  { id: "b1", name: "AYANAVITA • Quận 1 (HCM)", address: "Số 12, đường A, Q1" },
  { id: "b2", name: "AYANAVITA • Cầu Giấy (HN)", address: "Số 88, đường B, Cầu Giấy" },
  { id: "b3", name: "AYANAVITA • Hải Châu (ĐN)", address: "Số 25, đường C, Hải Châu" },
];
