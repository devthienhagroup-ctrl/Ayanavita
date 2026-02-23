import type { ProductSku } from "../data/products.data";

export type ProductReview = {
  id: string;
  sku: ProductSku;
  name: string;
  stars: number; // 1..5
  text: string;
  createdAt: string; // YYYY-MM-DD
};

const KEY = "aya_product_reviews_v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function uid(prefix = "R") {
  return `${prefix}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
}

function todayYYYYMMDD() {
  return new Date().toISOString().slice(0, 10);
}

function readAll(): ProductReview[] {
  if (typeof window === "undefined") return [];
  return safeParse<ProductReview[]>(localStorage.getItem(KEY), []);
}

function writeAll(items: ProductReview[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function listReviewsBySku(sku: ProductSku): ProductReview[] {
  return readAll().filter((r) => r.sku === sku);
}

export function addReview(sku: ProductSku, input: { name: string; stars: number; text: string }) {
  const all = readAll();
  const r: ProductReview = {
    id: uid("R"),
    sku,
    name: (input.name || "Khách hàng").trim() || "Khách hàng",
    stars: Math.max(1, Math.min(5, Math.round(Number(input.stars || 5)))),
    text: (input.text || "").trim(),
    createdAt: todayYYYYMMDD(),
  };
  all.unshift(r);
  writeAll(all);
  return r;
}

export function calcReviewStats(reviews: ProductReview[]) {
  const n = reviews.length;
  if (!n) return { avg: 0, count: 0 };
  const avg = reviews.reduce((s, r) => s + Number(r.stars || 0), 0) / n;
  return { avg: Number(avg.toFixed(1)), count: n };
}
