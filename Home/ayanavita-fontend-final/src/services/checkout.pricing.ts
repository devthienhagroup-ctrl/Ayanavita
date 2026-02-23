import type { CheckoutState } from "./checkout.storage";

export function calcSubtotal(state: CheckoutState) {
  return (state.cart || []).reduce(
    (s, i) => s + Number(i.price || 0) * Number(i.qty || 0),
    0
  );
}

export function calcDiscountAmount(state: CheckoutState) {
  const sub = calcSubtotal(state);
  const d = Number(state.voucher.discount || 0); // percent 0..1
  return Math.round(sub * d);
}

export function calcShippingFee(state: CheckoutState) {
  const sub = calcSubtotal(state);
  const freeByThreshold = sub >= 1_000_000; // demo threshold giống HTML
  if (!sub) return 0;
  if (state.voucher.freeShip) return 0;
  if (freeByThreshold) return 0;

  return state.shipping === "fast" ? 60_000 : 30_000;
}

export function calcTotal(state: CheckoutState) {
  const sub = calcSubtotal(state);
  const disc = calcDiscountAmount(state);
  const ship = calcShippingFee(state);
  return Math.max(0, sub - disc + ship);
}
