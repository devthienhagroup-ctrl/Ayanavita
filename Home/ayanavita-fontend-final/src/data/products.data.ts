// src/data/products.data.ts
export type ProductSku = "cleanser" | "toner" | "serum" | "cream" | "mask";

export type Product = {
  sku: ProductSku;
  id: string;
  name: string;
  price: number;
  img: string;
};

export const PRODUCTS: Record<ProductSku, Product> = {
  cleanser: {
    sku: "cleanser",
    id: "P-01",
    name: "Sữa rửa mặt dịu nhẹ",
    price: 329000,
    img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=70",
  },
  toner: {
    sku: "toner",
    id: "P-02",
    name: "Toner cân bằng",
    price: 279000,
    img: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=70",
  },
  serum: {
    sku: "serum",
    id: "P-03",
    name: "Serum phục hồi",
    price: 459000,
    img: "https://images.unsplash.com/photo-1612810436541-336d870b5a44?auto=format&fit=crop&w=900&q=70",
  },
  cream: {
    sku: "cream",
    id: "P-04",
    name: "Kem dưỡng ban đêm",
    price: 399000,
    img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=900&q=70",
  },
  mask: {
    sku: "mask",
    id: "P-05",
    name: "Mặt nạ detox",
    price: 189000,
    img: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?auto=format&fit=crop&w=900&q=70",
  },
};

export const PRODUCT_CART_SEED = [
  { sku: "cleanser" as const, qty: 1 },
  { sku: "toner" as const, qty: 2 },
];

export const UPSELL: Array<{ sku: ProductSku; subtitle: string; icon: string }> = [
  { sku: "serum", subtitle: "Hỗ trợ hàng rào da.", icon: "fa-solid fa-plus" },
  { sku: "cream", subtitle: "Dưỡng ẩm sâu.", icon: "fa-solid fa-plus" },
  { sku: "mask", subtitle: "Làm sạch và thư giãn.", icon: "fa-solid fa-plus" },
];
