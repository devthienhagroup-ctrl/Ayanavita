// src/data/productCompare.data.ts
import type { ProductSku } from "./products.data";
import { PRODUCTS } from "./products.data";

export type CompareItem = {
  id: string;
  sku?: ProductSku; // optional nếu bạn muốn liên kết SKU hệ thống
  name: string;
  price: number;
  ml: number;
  rating: number;
  type: "Cleanser" | "Serum" | "Moisturizer" | "Mask";
  key: string[];
  benefit: string;
  skin: string;
  img: string;
};

function fromProductsFallback(): CompareItem[] {
  // fallback: nếu bạn muốn so sánh theo dữ liệu PRODUCTS hiện có
  // map kiểu “demo” theo sku
  const map: Partial<Record<string, Partial<CompareItem>>> = {
    cleanser: { ml: 150, rating: 4.8, type: "Cleanser", key: ["Amino acids", "pH 5.5"], benefit: "Làm sạch dịu, giảm kích ứng", skin: "Nhạy cảm, mụn" },
    serum: { ml: 30, rating: 4.9, type: "Serum", key: ["Ceramide", "Panthenol"], benefit: "Phục hồi hàng rào da", skin: "Nhạy cảm, lão hoá" },
    cream: { ml: 50, rating: 4.7, type: "Moisturizer", key: ["Niacinamide", "Peptides"], benefit: "Dưỡng ẩm, cải thiện độ đàn hồi", skin: "Lão hoá, thâm sạm" },
    mask: { ml: 80, rating: 4.6, type: "Mask", key: ["Clay", "Charcoal"], benefit: "Làm sạch sâu, thông thoáng", skin: "Mụn, dầu" },
  };

  return Object.entries(PRODUCTS).map(([sku, p]: any, idx) => {
    const meta = (map as any)[sku] || {};
    return {
      id: p?.id ? String(p.id) : `P-${String(idx + 1).padStart(2, "0")}`,
      sku: sku as ProductSku,
      name: String(p?.name ?? sku),
      price: Number(p?.price ?? 0),
      ml: Number(meta.ml ?? 50),
      rating: Number(meta.rating ?? 4.7),
      type: (meta.type ?? "Moisturizer") as CompareItem["type"],
      key: (meta.key ?? ["—"]) as string[],
      benefit: String(meta.benefit ?? "—"),
      skin: String(meta.skin ?? "—"),
      img: String(p?.img ?? ""),
    };
  });
}

export const COMPARE_ITEMS: CompareItem[] = [
  {
    id: "P-01",
    name: "Sữa rửa mặt dịu nhẹ",
    price: 329000,
    ml: 150,
    rating: 4.8,
    type: "Cleanser",
    key: ["Amino acids", "pH 5.5"],
    benefit: "Làm sạch dịu, giảm kích ứng",
    skin: "Nhạy cảm, mụn",
    img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=70",
  },
  {
    id: "P-02",
    name: "Serum phục hồi",
    price: 459000,
    ml: 30,
    rating: 4.9,
    type: "Serum",
    key: ["Ceramide", "Panthenol"],
    benefit: "Phục hồi hàng rào da",
    skin: "Nhạy cảm, lão hoá",
    img: "https://images.unsplash.com/photo-1612810436541-336d870b5a44?auto=format&fit=crop&w=900&q=70",
  },
  {
    id: "P-03",
    name: "Kem dưỡng ban đêm",
    price: 399000,
    ml: 50,
    rating: 4.7,
    type: "Moisturizer",
    key: ["Niacinamide", "Peptides"],
    benefit: "Dưỡng ẩm, cải thiện độ đàn hồi",
    skin: "Lão hoá, thâm sạm",
    img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=900&q=70",
  },
  {
    id: "P-04",
    name: "Mặt nạ detox",
    price: 189000,
    ml: 80,
    rating: 4.6,
    type: "Mask",
    key: ["Clay", "Charcoal"],
    benefit: "Làm sạch sâu, thông thoáng",
    skin: "Mụn, dầu",
    img: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?auto=format&fit=crop&w=900&q=70",
  },
];

// Nếu bạn muốn thay toàn bộ bằng PRODUCTS hệ thống, đổi export này:
// export const COMPARE_ITEMS = fromProductsFallback();
