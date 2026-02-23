// src/services/productCompare.utils.ts
import type { CompareItem } from "../data/productCompare.data";

export type CompareRow = {
  label: string;
  a?: React.ReactNode;
  b?: React.ReactNode;
  c?: React.ReactNode;
};

export function pricePerMl(p?: CompareItem | null) {
  if (!p) return null;
  const ml = Number(p.ml || 0);
  if (!ml) return null;
  return Math.round(Number(p.price || 0) / ml);
}
