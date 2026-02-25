import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getProducts, type ApiProduct } from "../api/products.api";
import { ProductFilters, type PriceRange, type SortKey } from "../components/products/ProductFilters";
import { ProductCard } from "../components/products/ProductCard";
import type { CategoryProduct, ProductType, SkinConcern } from "../data/productCategory.data";

const concernMap: Record<string, SkinConcern> = {
  acne: "acne",
  aging: "aging",
  bright: "bright",
  sensitive: "sensitive",
};

function toCategoryProduct(p: ApiProduct): CategoryProduct {
  const type = (["cleanser", "serum", "cream", "mask"].includes(p.type) ? p.type : "cleanser") as ProductType;
  const concerns = (p.concerns || []).map((c) => concernMap[c]).filter(Boolean) as SkinConcern[];
  return {
    sku: (p.slug as any),
    id: p.sku,
    name: p.name,
    type,
    concerns,
    price: p.price,
    rating: p.rating,
    sold: p.sold,
    updated: new Date(p.updatedAt).toISOString().slice(0, 10),
    img: p.imageUrl || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=70",
  };
}

function mapPriceRange(range: PriceRange): { minPrice?: number; maxPrice?: number } {
  if (range === "lt200") return { maxPrice: 200_000 };
  if (range === "200-400") return { minPrice: 200_000, maxPrice: 400_000 };
  if (range === "gt400") return { minPrice: 400_000 };
  return {};
}

export default function ProductsPage() {
  const [q, setQ] = useState("");
  const [types, setTypes] = useState<ProductType[]>([]);
  const [concern, setConcern] = useState<"all" | SkinConcern>("all");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [sort, setSort] = useState<SortKey>("best");
  const [page, setPage] = useState(1);

  const [items, setItems] = useState<CategoryProduct[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const activeType = useMemo(() => (types.length ? types[0] : undefined), [types]);

  useEffect(() => {
    const run = async () => {
      const data = await getProducts({
        q,
        page,
        pageSize: 6,
        sort,
        type: activeType,
        concern: concern === "all" ? undefined : concern,
        ...mapPriceRange(priceRange),
      });
      setItems((data.items || []).map(toCategoryProduct));
      setTotalPages(data.paging?.totalPages || 1);
    };
    run().catch(console.error);
  }, [q, page, sort, activeType, concern, priceRange]);

  return (
    <div className="text-slate-900">
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[300px_1fr] gap-5">
          <ProductFilters
            q={q}
            onQ={(v) => { setQ(v); setPage(1); }}
            types={types}
            onToggleType={(t) => { setTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [t]); setPage(1); }}
            concern={concern}
            onConcern={(v) => { setConcern(v); setPage(1); }}
            priceRange={priceRange}
            onPriceRange={(v) => { setPriceRange(v); setPage(1); }}
            sort={sort}
            onSort={(v) => { setSort(v); setPage(1); }}
            onReset={() => { setQ(""); setTypes([]); setConcern("all"); setPriceRange("all"); setSort("best"); setPage(1); }}
          />

          <div>
            <div className="mb-3 text-sm text-slate-600">Hiển thị {items.length} sản phẩm</div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map((p) => (
                <ProductCard key={p.id} p={p} detailTo={`/products/${String(p.sku)}`} />
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button className="btn" type="button" disabled={page <= 1} onClick={() => setPage((v) => v - 1)}>Trước</button>
              <div className="chip">Trang <b>{page}</b>/<b>{totalPages}</b></div>
              <button className="btn" type="button" disabled={page >= totalPages} onClick={() => setPage((v) => v + 1)}>Sau</button>
            </div>

            <Link to="/" className="inline-block mt-5 text-sm text-indigo-700">← Về trang chủ</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
