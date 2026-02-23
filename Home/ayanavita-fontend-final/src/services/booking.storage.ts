// src/services/booking.storage.ts
export type BookingStatus = "confirmed" | "pending" | "cancelled";

export type Booking = {
  id: string;
  createdAt: string;

  name: string;
  phone: string;
  email?: string;
  notify: "zalo" | "sms" | "email";

  serviceId?: string;
  serviceName?: string;
  duration?: number;
  price?: number;

  staffId?: string | null;
  staffName?: string;

  branchId?: string;
  branchName?: string;

  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  note?: string;

  status: BookingStatus;
};

const BOOKING_KEY = "aya_bookings_v1";

export function loadBookings(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem(BOOKING_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveBookings(list: Booking[]) {
  localStorage.setItem(BOOKING_KEY, JSON.stringify(list)
);
}

export function clearBookings() {
  saveBookings([]);
}
