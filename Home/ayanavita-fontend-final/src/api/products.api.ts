import { http } from "./http";

export type ApiProduct = {
  id: number;
  sku: string;
  slug: string;
  name: string;
  description?: string;
  shortDescription?: string;
  imageUrl?: string;
  type: string;
  concerns: string[];
  rating: number;
  sold: number;
  price: number;
  published: boolean;
  updatedAt: string;
};

export type ProductQuery = {
  q?: string;
  type?: string;
  concern?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "best" | "new" | "priceAsc" | "priceDesc" | "rating";
  page?: number;
  pageSize?: number;
};

export async function getProducts(params: ProductQuery) {
  const res = await http.get<{ items: ApiProduct[]; paging: { page: number; totalPages: number; total: number } }>("/products", {
    params,
  });
  return res.data;
}

export async function getProductDetailBySlug(slug: string) {
  const res = await http.get<ApiProduct>(`/products/slug/${slug}`);
  return res.data;
}
