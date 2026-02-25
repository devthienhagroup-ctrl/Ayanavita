import { apiFetch } from "./client";

export type AdminProduct = {
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
};

export type ProductListRes = { items: AdminProduct[]; paging: { total: number } };

export const productsApi = {
  list(token: string, q = "") {
    return apiFetch<ProductListRes>(`/products/admin?q=${encodeURIComponent(q)}`, { token });
  },
  create(token: string, payload: Partial<AdminProduct>) {
    return apiFetch<AdminProduct>("/products", { method: "POST", token, body: JSON.stringify(payload) });
  },
  update(token: string, id: number, payload: Partial<AdminProduct>) {
    return apiFetch<AdminProduct>(`/products/${id}`, { method: "PATCH", token, body: JSON.stringify(payload) });
  },
  remove(token: string, id: number) {
    return apiFetch<{ id: number }>(`/products/${id}`, { method: "DELETE", token });
  },
};
