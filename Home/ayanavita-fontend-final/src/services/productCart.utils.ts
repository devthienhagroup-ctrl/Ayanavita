// src/services/productCart.utils.ts
import type { ProductSku } from "../data/products.data";

export const PRODUCT_CART_KEY = "aya_product_cart_v1";

export type ProductCartItem = { sku: ProductSku; qty: number };

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function normalize(items: ProductCartItem[]): ProductCartItem[] {
  const map = new Map<ProductSku, number>();
  for (const it of items || []) {
    if (!it?.sku) continue;
    const qty = Math.max(1, Number(it.qty || 1));
    map.set(it.sku, (map.get(it.sku) || 0) + qty);
  }
  return Array.from(map.entries()).map(([sku, qty]) => ({ sku, qty }));
}

function emitChanged(items: ProductCartItem[]) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("aya_product_cart_changed", { detail: items }));
  window.dispatchEvent(new CustomEvent("aya_cart_changed", { detail: items })); // optional shared event
}

export function readProductCart(): ProductCartItem[] {
  if (typeof window === "undefined") return [];
  return normalize(safeParse<ProductCartItem[]>(localStorage.getItem(PRODUCT_CART_KEY), []));
}

export function writeProductCart(items: ProductCartItem[]) {
  if (typeof window === "undefined") return;
  const norm = normalize(items);
  localStorage.setItem(PRODUCT_CART_KEY, JSON.stringify(norm));
  emitChanged(norm);
}

export function ensureProductCartSeed(seed: ProductCartItem[]) {
  const cur = readProductCart();
  if (cur.length) return cur;

  // ✅ write normalized, then return normalized (NOT raw seed)
  writeProductCart(seed);
  return readProductCart();
}

export function addProductToCart(sku: ProductSku, qty = 1) {
  const cur = readProductCart();
  const found = cur.find((x) => x.sku === sku);
  if (found) found.qty += Math.max(1, qty);
  else cur.push({ sku, qty: Math.max(1, qty) });
  writeProductCart(cur);
  return readProductCart();
}

export function incProductQty(sku: ProductSku) {
  return addProductToCart(sku, 1);
}

export function decProductQty(sku: ProductSku) {
  const cur = readProductCart();
  const found = cur.find((x) => x.sku === sku);
  if (!found) return cur;
  found.qty = Math.max(1, found.qty - 1);
  writeProductCart(cur);
  return readProductCart();
}

export function removeProductFromCart(sku: ProductSku) {
  const next = readProductCart().filter((x) => x.sku !== sku);
  writeProductCart(next);
  return next;
}

export function clearProductCart() {
  writeProductCart([]);
  return [];
}

export function getProductCartCount() {
  return readProductCart().length;
}

export function getProductCartQtySum() {
  return readProductCart().reduce((s, x) => s + Number(x.qty || 0), 0);
}

/**
 * Subscribe changes:
 * - same-tab: CustomEvent("aya_product_cart_changed")
 * - cross-tab: window "storage"
 */
export function subscribeProductCart(cb: (items: ProductCartItem[]) => void) {
  if (typeof window === "undefined") return () => {};

  const onCustom = (e: Event) => {
    const ce = e as CustomEvent<ProductCartItem[]>;
    cb(Array.isArray(ce.detail) ? ce.detail : readProductCart());
  };

  const onStorage = (e: StorageEvent) => {
    if (e.key && e.key !== PRODUCT_CART_KEY) return;
    cb(readProductCart());
  };

  window.addEventListener("aya_product_cart_changed", onCustom as EventListener);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener("aya_product_cart_changed", onCustom as EventListener);
    window.removeEventListener("storage", onStorage);
  };
}
