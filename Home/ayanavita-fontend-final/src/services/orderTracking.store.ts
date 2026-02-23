// src/services/orderTracking.store.ts
import type { TrackOrder, PaymentStatus } from "../data/orderTracking.data";
import { DEMO_TRACK_ORDER } from "../data/orderTracking.data";

export const CHECKOUT_KEY = "aya_checkout_v1";       // nếu bạn có prototype checkout cũ
export const TRACK_PROGRESS_KEY = "aya_track_orders_v1"; // lưu tiến trình theo code

type Progress = {
  step: number;
  paymentStatus?: PaymentStatus;
  updatedAtISO?: string;
};

type ProgressMap = Record<string, Progress>;

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function clampStep(step: number) {
  const n = Math.floor(Number(step || 0));
  return Math.max(0, Math.min(4, n));
}

export function readProgressMap(): ProgressMap {
  if (typeof window === "undefined") return {};
  return safeParse<ProgressMap>(localStorage.getItem(TRACK_PROGRESS_KEY), {});
}

export function writeProgressMap(map: ProgressMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TRACK_PROGRESS_KEY, JSON.stringify(map));
}

export function setOrderProgress(code: string, next: Progress) {
  const map = readProgressMap();
  map[code] = {
    step: clampStep(next.step),
    paymentStatus: next.paymentStatus,
    updatedAtISO: next.updatedAtISO || new Date().toISOString(),
  };
  writeProgressMap(map);
  return map[code];
}

function paymentFromCheckoutText(payStatus?: string): PaymentStatus {
  const s = (payStatus || "").toLowerCase();
  if (s.includes("đã thanh toán") || s.includes("paid")) return "paid";
  if (s.includes("hoàn tiền") || s.includes("refund")) return "refund";
  return "unpaid";
}

/**
 * Đọc orders từ prototype checkout HTML (nếu có).
 * Prototype trước của bạn lưu state.orders trong CHECKOUT_KEY.
 */
export function readTrackOrdersFromCheckout(): TrackOrder[] {
  if (typeof window === "undefined") return [];
  const state = safeParse<any>(localStorage.getItem(CHECKOUT_KEY), null);
  const orders: any[] = Array.isArray(state?.orders) ? state.orders : [];
  const map = readProgressMap();

  return orders
    .map((o) => {
      const code = String(o?.code || "");
      const phone = String(o?.customer?.phone || "");
      if (!code || !phone) return null;

      const name = String(o?.customer?.name || "—");
      const addrParts = [
        String(o?.customer?.district || "").trim(),
        String(o?.customer?.city || "").trim(),
        String(o?.customer?.addr || "").trim(),
      ].filter(Boolean);
      const addr = addrParts.length ? addrParts.join(", ") : "—";

      const sub = Number(o?.subtotal || 0);
      const ship = Number(o?.shipFee || 0);
      const total = Number(o?.total || Math.max(0, sub + ship));

      const paymentStatus = paymentFromCheckoutText(String(o?.payStatus || ""));
      // step demo: nếu đã thanh toán -> >=2, chưa -> 1
      const baseStep = paymentStatus === "paid" ? 2 : 1;

      const prog = map[code];
      const step = clampStep(prog?.step ?? baseStep);

      return {
        code,
        phone,
        name,
        addr,
        sub,
        ship,
        total,
        paymentStatus: (prog?.paymentStatus ?? paymentStatus) as PaymentStatus,
        step,
        updatedAtISO: prog?.updatedAtISO || String(o?.createdAt || new Date().toISOString()),
      } as TrackOrder;
    })
    .filter(Boolean) as TrackOrder[];
}

export function findTrackOrder(code: string, phone: string): TrackOrder | null {
  const c = (code || "").trim();
  const p = (phone || "").trim();
  if (!c || !p) return null;

  // 1) tìm trong checkout orders
  const list = readTrackOrdersFromCheckout();
  const found = list.find((x) => x.code === c && x.phone === p);
  if (found) return found;

  // 2) fallback demo
  if (c === DEMO_TRACK_ORDER.code && p === DEMO_TRACK_ORDER.phone) {
    const map = readProgressMap();
    const prog = map[c];
    return {
      ...DEMO_TRACK_ORDER,
      step: clampStep(prog?.step ?? DEMO_TRACK_ORDER.step),
      paymentStatus: (prog?.paymentStatus ?? DEMO_TRACK_ORDER.paymentStatus) as PaymentStatus,
      updatedAtISO: prog?.updatedAtISO || DEMO_TRACK_ORDER.updatedAtISO,
    };
  }

  return null;
}

export function bumpProgress(order: TrackOrder): TrackOrder {
  const nextStep = clampStep(order.step + 1);
  const nextPay: PaymentStatus = nextStep >= 2 ? "paid" : order.paymentStatus;

  setOrderProgress(order.code, {
    step: nextStep,
    paymentStatus: nextPay,
  });

  return {
    ...order,
    step: nextStep,
    paymentStatus: nextPay,
    updatedAtISO: new Date().toISOString(),
  };
}
