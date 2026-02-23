// src/services/courseCart.utils.ts
export const COURSE_CART_KEY = "aya_courses_cart_v1";

/**
 * Custom events để UI (SiteHeader/CartBadge/...) update realtime trong CÙNG tab
 * - SiteHeader của bạn đang nghe: "aya_cart_changed" và "aya_course_cart_changed"
 */
export const COURSE_CART_CHANGED_EVENT = "aya_cart_changed";
export const COURSE_CART_CHANGED_EVENT_ALT = "aya_course_cart_changed";

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function emitCartChanged() {
  if (typeof window === "undefined") return;
  // emit 2 event cho chắc, tránh mismatch tên event giữa các component
  window.dispatchEvent(new Event(COURSE_CART_CHANGED_EVENT));
  window.dispatchEvent(new Event(COURSE_CART_CHANGED_EVENT_ALT));
}

export function readCourseCart(): string[] {
  if (typeof window === "undefined") return [];
  return safeParse<string[]>(localStorage.getItem(COURSE_CART_KEY), []);
}

export function writeCourseCart(ids: string[]) {
  if (typeof window === "undefined") return;

  // normalize: unique + trim + keep order
  const seen = new Set<string>();
  const normalized: string[] = [];
  for (const raw of ids || []) {
    const id = String(raw || "").trim();
    if (!id) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    normalized.push(id);
  }

  localStorage.setItem(COURSE_CART_KEY, JSON.stringify(normalized));
  emitCartChanged();
  return normalized;
}

export function addCourseToCart(id: string) {
  const x = String(id || "").trim();
  if (!x) return readCourseCart();

  const cur = readCourseCart();
  if (cur.includes(x)) return cur;

  cur.push(x);
  writeCourseCart(cur);
  return cur;
}

export function removeCourseFromCart(id: string) {
  const x = String(id || "").trim();
  if (!x) return readCourseCart();

  const next = readCourseCart().filter((t) => t !== x);
  writeCourseCart(next);
  return next;
}

export function clearCourseCart() {
  writeCourseCart([]);
  return [];
}

/** tiện dùng cho badge */
export function getCourseCartCount() {
  return readCourseCart().length;
}

/** toggle (optional) */
export function toggleCourseInCart(id: string) {
  const x = String(id || "").trim();
  if (!x) return readCourseCart();

  const cur = readCourseCart();
  if (cur.includes(x)) return removeCourseFromCart(x);
  return addCourseToCart(x);
}
