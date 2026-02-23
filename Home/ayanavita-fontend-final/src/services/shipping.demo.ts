export function shippingFeeDemo(subtotal: number) {
  const sub = Number(subtotal || 0);
  if (!sub) return 0;
  if (sub >= 1_000_000) return 0;
  return 30_000;
}
