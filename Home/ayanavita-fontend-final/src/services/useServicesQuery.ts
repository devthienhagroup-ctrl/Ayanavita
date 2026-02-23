// src/services/useServicesQuery.ts
import { useMemo } from "react";
import type { Service, ServiceGoal } from "../data/services";

export type DurationRule = "all" | "lt60" | "60-90" | "gt90";
export type SortRule = "popular" | "priceAsc" | "priceDesc" | "rating";

export type ServicesFilters = {
  q: string;
  cat: "all" | Service["cat"];
  goal: "all" | ServiceGoal;
  dur: DurationRule;
  sort: SortRule;
};

function matchDur(minutes: number, rule: DurationRule) {
  if (rule === "all") return true;
  if (rule === "lt60") return minutes < 60;
  if (rule === "60-90") return minutes >= 60 && minutes <= 90;
  if (rule === "gt90") return minutes > 90;
  return true;
}

export function useServicesQuery(params: {
  data: Service[];
  filters: ServicesFilters;
  page: number;
  pageSize: number;
}) {
  const { data, filters, page, pageSize } = params;

  const filteredSorted = useMemo(() => {
    const q = (filters.q || "").trim().toLowerCase();

    let list = data.filter((s) => {
      const okQ = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
      const okC = filters.cat === "all" ? true : s.cat === filters.cat;
      const okG = filters.goal === "all" ? true : (s.goal || []).includes(filters.goal);
      const okD = matchDur(s.dur, filters.dur);
      return okQ && okC && okG && okD;
    });

    if (filters.sort === "popular") list = [...list].sort((a, b) => b.booked - a.booked);
    if (filters.sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (filters.sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    if (filters.sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [data, filters]);

  const total = filteredSorted.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pages);

  const items = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, safePage, pageSize]);

  return { items, total, pages, page: safePage };
}
