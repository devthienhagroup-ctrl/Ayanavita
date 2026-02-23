import { PRODUCTS, type ProductSku } from "./products.data";

export type CatalogType = "cleanser" | "serum" | "cream" | "mask";
export type SkinConcern = "acne" | "aging" | "bright" | "sensitive";

export type CatalogMeta = {
  sku: ProductSku;
  type: CatalogType;
  concern: SkinConcern[];
  ml: number;
  rating: number;
  sold: number;
  updated: string; // YYYY-MM-DD
};

const TYPE_CYCLE: CatalogType[] = ["cleanser", "serum", "cream", "mask"];
const CONCERN_CYCLE: SkinConcern[][] = [
  ["sensitive", "acne"],
  ["sensitive", "aging"],
  ["aging", "bright"],
  ["acne", "bright"],
  ["acne", "bright"],
  ["bright"],
  ["sensitive"],
  ["sensitive", "aging"],
];

const RATING_CYCLE = [4.8, 4.9, 4.7, 4.6, 4.7, 4.8, 4.9, 4.6];
const SOLD_CYCLE = [4120, 3890, 2750, 5210, 3100, 1980, 1420, 980];
const ML_CYCLE = [150, 30, 50, 80, 120, 30, 50, 80];

export function buildCatalogMetas(): CatalogMeta[] {
  const skus = Object.keys(PRODUCTS) as ProductSku[];
  if (!skus.length) return [];

  return skus.map((sku, i) => {
    const day = 12 + (i % 18);
    return {
      sku,
      type: TYPE_CYCLE[i % TYPE_CYCLE.length],
      concern: CONCERN_CYCLE[i % CONCERN_CYCLE.length],
      ml: ML_CYCLE[i % ML_CYCLE.length],
      rating: RATING_CYCLE[i % RATING_CYCLE.length],
      sold: SOLD_CYCLE[i % SOLD_CYCLE.length],
      updated: `2025-12-${String(day).padStart(2, "0")}`,
    };
  });
}
