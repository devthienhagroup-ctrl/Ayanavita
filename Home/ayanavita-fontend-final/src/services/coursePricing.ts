// src/services/coursePricing.ts
import type { Voucher } from "../data/courseDetail.demo";

export function moneyVND(n: number) {
  return "₫ " + new Intl.NumberFormat("vi-VN").format(Number(n || 0));
}

export function uid(prefix = "ID") {
  return prefix + "-" + Math.random().toString(16).slice(2, 8).toUpperCase();
}

export function safeUpper(s: string) {
  return (s || "").toString().trim().toUpperCase();
}

export function categoryLabel(c: string) {
  return ({ tech: "Công nghệ", business: "Kinh doanh", design: "Thiết kế" } as Record<string, string>)[c] || "Khác";
}

export function findVoucher(vouchers: Voucher[], code: string, courseId: string) {
  const c = safeUpper(code);
  if (!c) return null;

  const now = new Date();
  const v = vouchers.find((x) => safeUpper(x.code) === c && x.active);
  if (!v) return null;

  if (v.expire) {
    const exp = new Date(v.expire + "T23:59:59");
    if (exp < now) return null;
  }
  if (Number(v.used || 0) >= Number(v.limit || 0)) return null;
  if (v.scope === "course" && v.courseId && v.courseId !== courseId) return null;

  return v;
}

export function computeFinalPrice(basePrice: number, defaultDiscount: number, voucher: Voucher | null) {
  const base = Number(basePrice || 0);
  const d = Math.max(0, Math.min(100, Number(defaultDiscount || 0)));

  let price = Math.round(base * (1 - d / 100));
  let note = `Áp dụng giảm mặc định: ${d}%`;

  if (voucher) {
    if (voucher.type === "percent") {
      price = Math.round(price * (1 - Number(voucher.value || 0) / 100));
      note += ` + voucher ${voucher.code} (-${voucher.value}%)`;
    } else {
      price = Math.max(0, price - Number(voucher.value || 0));
      note += ` + voucher ${voucher.code} (-${moneyVND(voucher.value)})`;
    }
  }
  return { price, note };
}

/** picsum helper */
export function imgSeed(seed: string, w = 1400, h = 800) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}
export function courseSeed(courseId: string) {
  return String(courseId || "CR-0000").replace(/[^a-zA-Z0-9-]/g, "");
}
export function lessonSeed(courseId: string, lessonId: string) {
  return `${courseSeed(courseId)}-${lessonId || "L"}`;
}
export function personSeed(name: string) {
  return `person-${(name || "user").toLowerCase().replace(/\s+/g, "-")}`;
}
