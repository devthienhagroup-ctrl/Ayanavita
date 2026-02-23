// src/data/productCategory.data.ts
import { PRODUCTS, type ProductSku } from "./products.data";

export type SkinConcern = "acne" | "aging" | "bright" | "sensitive";
export type ProductType = "cleanser" | "serum" | "cream" | "mask";

export type CategoryProduct = {
  sku: ProductSku;
  id: string;
  name: string;
  type: ProductType;
  concerns: SkinConcern[];
  price: number;
  rating: number;
  sold: number;
  updated: string; // YYYY-MM-DD
  img: string;
};

const META: Partial<
  Record<
    ProductSku,
    Pick<CategoryProduct, "type" | "concerns" | "rating" | "sold" | "updated">
  >
> = {
  // ✅ map theo SKU bạn đang có trong PRODUCTS
  cleanser: { type: "cleanser", concerns: ["sensitive", "acne"], rating: 4.8, sold: 4120, updated: "2025-12-18" } as any,
  toner: { type: "cleanser", concerns: ["acne", "bright"], rating: 4.7, sold: 3100, updated: "2025-12-16" } as any,
  serum: { type: "serum", concerns: ["sensitive", "aging"], rating: 4.9, sold: 3890, updated: "2025-12-17" } as any,
  cream: { type: "cream", concerns: ["aging", "bright"], rating: 4.7, sold: 2750, updated: "2025-12-15" } as any,
  mask: { type: "mask", concerns: ["acne", "bright"], rating: 4.6, sold: 5210, updated: "2025-12-19" } as any,
};

function fallbackType(sku: string): ProductType {
  if (sku.includes("serum")) return "serum";
  if (sku.includes("cream")) return "cream";
  if (sku.includes("mask")) return "mask";
  return "cleanser";
}

export const CATEGORY_PRODUCTS: CategoryProduct[] = (Object.keys(PRODUCTS) as ProductSku[]).map((sku) => {
  const p: any = (PRODUCTS as any)[sku];
  const m = (META as any)[sku] || {};
  return {
    sku,
    id: String(p?.id ?? sku),
    name: String(p?.name ?? sku),
    price: Number(p?.price ?? 0),
    img: String(p?.img ?? ""),
    type: (m.type ?? fallbackType(String(sku))) as ProductType,
    concerns: (m.concerns ?? []) as SkinConcern[],
    rating: Number(m.rating ?? 4.7),
    sold: Number(m.sold ?? 1000),
    updated: String(m.updated ?? "2025-12-01"),
  };
});

export const TYPE_LABEL: Record<ProductType, string> = {
  cleanser: "Sữa rửa mặt",
  serum: "Serum",
  cream: "Kem dưỡng",
  mask: "Mặt nạ",
};

export const CONCERN_LABEL: Record<SkinConcern, string> = {
  acne: "Mụn",
  aging: "Lão hoá",
  bright: "Thâm sạm",
  sensitive: "Nhạy cảm",
};
