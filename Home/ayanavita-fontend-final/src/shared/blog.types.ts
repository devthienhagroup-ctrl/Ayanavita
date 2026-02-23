export type BlogTag = "skincare" | "massage" | "wellness" | "franchise";

export type BlogPost = {
  id: string;
  title: string;
  tag: BlogTag;
  author: string;
  date: string; // YYYY-MM-DD
  views: number;
  img: string;
  excerpt: string;
  body: string[];
};

export type SortMode = "new" | "popular";

export type BlogFilter = {
  q: string;
  tag: "all" | BlogTag;
  sort: SortMode;
};
