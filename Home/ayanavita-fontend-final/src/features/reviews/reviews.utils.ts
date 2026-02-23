import type { Review, ReviewsState } from "./reviews.types";

export function starIconsCount(avg: number) {
  return Math.max(0, Math.min(5, Math.round(avg)));
}

export function matches(r: Review, s: ReviewsState) {
  if (s.category !== "all" && r.category !== s.category) return false;
  if (s.star !== "all" && Number(s.star) !== r.rating) return false;
  if (s.verifiedOnly && !r.verified) return false;

  const q = (s.q || "").trim().toLowerCase();
  if (q) {
    const hay = `${r.item} ${r.text} ${(r.branch || "")} ${(r.name || "")}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

export function sortReviews(arr: Review[], sort: ReviewsState["sort"]) {
  const a = [...arr];
  if (sort === "helpful") return a.sort((x, y) => (y.helpful || 0) - (x.helpful || 0));
  if (sort === "high") return a.sort((x, y) => y.rating - x.rating);
  if (sort === "low") return a.sort((x, y) => x.rating - y.rating);
  return a.sort((x, y) => (y.createdAt || "").localeCompare(x.createdAt || ""));
}

export function calcStats(all: Review[]) {
  const count = all.length;
  const sum = all.reduce((acc, r) => acc + (r.rating || 0), 0);
  const avg = count ? sum / count : 0;
  const verified = all.filter((r) => r.verified).length;
  const helpful = all.reduce((acc, r) => acc + (r.helpful || 0), 0);
  const dist: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  all.forEach((r) => {
    const k = r.rating as 1 | 2 | 3 | 4 | 5;
    dist[k] = (dist[k] || 0) + 1;
  });
  return { count, avg, verified, helpful, dist };
}
