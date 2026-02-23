
import { http } from "./http";  // theo chuẩn dự án bạn (axios/fetch wrapper)

export type BlogTag = "skincare" | "massage" | "wellness" | "franchise";

export type BlogPostListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImage?: string | null;
  tag: BlogTag;
  authorName: string;
  views: number;
  publishedAt?: string | null;
  createdAt: string;
};

export type BlogPostDetail = BlogPostListItem & {
  contentMd: string;
  updatedAt: string;
};

export const blogApi = {
  list(params: { q?: string; tag?: string; sort?: "new"|"popular"; page?: number; pageSize?: number }) {
    return http.get<{ items: BlogPostListItem[]; meta: any }>("/blog/posts", { params });
  },
  detail(slug: string) {
    return http.get<BlogPostDetail>(`/blog/posts/${slug}`);
  },
  incView(id: string) {
    return http.post<{ id: string; views: number }>(`/blog/posts/${id}/view`, {});
  },
  getSaved() {
    return http.get<{ ids: string[] }>("/blog/saved");
  },
  save(postId: string) {
    return http.post(`/blog/saved/${postId}`, {});
  },
  unsave(postId: string) {
    return http.delete(`/blog/saved/${postId}`);
  },
  clearSaved() {
    return http.delete(`/blog/saved`);
  },
};
