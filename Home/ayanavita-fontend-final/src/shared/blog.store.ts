import type { BlogPost, BlogTag, SortMode, BlogFilter } from "./blog.types";
import { BLOG_SEED } from "./blog.seed";

export const POSTS_KEY = "aya_blog_posts_v1";
export const SAVED_KEY = "aya_blog_saved_v1";

export function getJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function ensureSeed() {
  const posts = getJson<BlogPost[]>(POSTS_KEY, []);
  if (posts.length) return;
  setJson(POSTS_KEY, BLOG_SEED);
}

export function getPosts(): BlogPost[] {
  return getJson<BlogPost[]>(POSTS_KEY, []);
}

export function getSavedIds(): string[] {
  return getJson<string[]>(SAVED_KEY, []);
}

export function setSavedIds(ids: string[]) {
  setJson(SAVED_KEY, ids);
}

export function toggleSaved(id: string) {
  const set = new Set(getSavedIds());
  if (set.has(id)) set.delete(id);
  else set.add(id);
  setSavedIds(Array.from(set));
  return set;
}

export function tagLabel(t: BlogTag) {
  return (
    {
      skincare: "Skincare",
      massage: "Massage",
      wellness: "Wellness",
      franchise: "Nhượng quyền",
    }[t] || t
  );
}

export function applyFilter(posts: BlogPost[], f: BlogFilter): BlogPost[] {
  const q = (f.q || "").trim().toLowerCase();
  const tag = f.tag;

  const filtered = posts.filter((p) => {
    if (tag !== "all" && p.tag !== tag) return false;
    if (!q) return true;
    const hay = (p.title + " " + p.excerpt + " " + p.body.join(" ")).toLowerCase();
    return hay.includes(q);
  });

  return sortPosts(filtered, f.sort);
}

export function sortPosts(arr: BlogPost[], sort: SortMode): BlogPost[] {
  const copy = [...arr];
  if (sort === "popular") copy.sort((a, b) => (b.views || 0) - (a.views || 0));
  else copy.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return copy;
}

export function formatViews(n: number) {
  return new Intl.NumberFormat("vi-VN").format(n || 0);
}

export async function copyLink(id: string) {
  const url = `${window.location.origin}${window.location.pathname}#post-${id}`;
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = url;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  }
}
