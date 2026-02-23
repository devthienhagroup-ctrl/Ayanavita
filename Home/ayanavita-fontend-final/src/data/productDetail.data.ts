import type { ProductSku } from "./products.data";

export type ProductDetailSeed = {
  sku: ProductSku;
  cat: "serum" | "cleanser" | "moisturizer" | "sunscreen" | "body";
  target: "repair" | "hydrate" | "brighten" | "sun" | "body";
  skuText?: string;
  size?: string;
  skinType?: string;
  shortDesc?: string;
  longDesc?: string;
  highlights?: string[];
  ingredients?: { name: string; desc: string }[];
  images?: string[];
  usage?: { am: string[]; pm: string[] };
  checklist?: string[];
  relatedSkus?: ProductSku[];
  seedMeta?: { rating: number; reviews: number; sold: number };
  comboHint?: string;
};

export const PRODUCT_DETAIL_SEEDS: Partial<Record<ProductSku, ProductDetailSeed>> = {
  // Bạn có thể map 1 sku "hot" trong PRODUCTS vào seed này.
  // Nếu chưa biết sku nào, trang vẫn chạy fallback demo.
} as const;

export function catLabel(c: ProductDetailSeed["cat"]) {
  return (
    {
      serum: "Serum",
      cleanser: "Cleanser & Toner",
      moisturizer: "Kem dưỡng",
      sunscreen: "Chống nắng",
      body: "Body care",
    }[c] || "Khác"
  );
}

export function goalLabel(g: ProductDetailSeed["target"]) {
  return (
    {
      repair: "Phục hồi",
      hydrate: "Cấp ẩm",
      brighten: "Làm sáng",
      sun: "Chống nắng",
      body: "Body thư giãn",
    }[g] || "Mục tiêu"
  );
}
