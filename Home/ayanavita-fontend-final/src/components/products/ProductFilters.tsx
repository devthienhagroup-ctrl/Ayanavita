// src/components/products/ProductFilters.tsx
import React from "react";
import type { ProductType, SkinConcern } from "../../data/productCategory.data";
import { TYPE_LABEL, CONCERN_LABEL } from "../../data/productCategory.data";

export type PriceRange = "all" | "lt200" | "200-400" | "gt400";
export type SortKey = "best" | "new" | "priceAsc" | "priceDesc" | "rating";

export function ProductFilters(props: {
  q: string;
  onQ: (v: string) => void;

  types: ProductType[];
  onToggleType: (t: ProductType) => void;

  concern: "all" | SkinConcern;
  onConcern: (v: "all" | SkinConcern) => void;

  priceRange: PriceRange;
  onPriceRange: (v: PriceRange) => void;

  sort: SortKey;
  onSort: (v: SortKey) => void;

  onReset: () => void;
}) {
  const { q, onQ, types, onToggleType, concern, onConcern, priceRange, onPriceRange, sort, onSort, onReset } = props;

  const typeList: ProductType[] = ["cleanser", "serum", "cream", "mask"];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="font-extrabold">Bộ lọc</div>
        <button className="btn px-3 py-2" type="button" onClick={onReset} title="Reset">
          <i className="fa-solid fa-rotate-left" />
        </button>
      </div>

      <div className="mt-3">
        <label className="text-sm font-extrabold text-slate-700">Tìm kiếm</label>
        <input className="field mt-2" value={q} onChange={(e) => onQ(e.target.value)} placeholder="Tên sản phẩm..." />
      </div>

      <div className="mt-4 grid gap-3">
        <div>
          <div className="text-sm font-extrabold text-slate-700">Loại</div>
          <div className="mt-2 grid gap-2 text-sm">
            {typeList.map((t) => (
              <label key={t} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={types.includes(t)}
                  onChange={() => onToggleType(t)}
                />
                {TYPE_LABEL[t]}
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-extrabold text-slate-700">Vấn đề da</div>
          <select className="field mt-2" value={concern} onChange={(e) => onConcern(e.target.value as any)}>
            <option value="all">Tất cả</option>
            {Object.keys(CONCERN_LABEL).map((k) => (
              <option key={k} value={k}>
                {CONCERN_LABEL[k as SkinConcern]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="text-sm font-extrabold text-slate-700">Khoảng giá</div>
          <select className="field mt-2" value={priceRange} onChange={(e) => onPriceRange(e.target.value as any)}>
            <option value="all">Tất cả</option>
            <option value="lt200">Dưới 200k</option>
            <option value="200-400">200k–400k</option>
            <option value="gt400">Trên 400k</option>
          </select>
        </div>

        <div>
          <div className="text-sm font-extrabold text-slate-700">Sắp xếp</div>
          <select className="field mt-2" value={sort} onChange={(e) => onSort(e.target.value as any)}>
            <option value="best">Bán chạy</option>
            <option value="new">Mới nhất</option>
            <option value="priceAsc">Giá tăng</option>
            <option value="priceDesc">Giá giảm</option>
            <option value="rating">Đánh giá</option>
          </select>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-700">
        Gợi ý: Chọn filter → danh sách cập nhật theo thời gian thực (demo).
      </div>
    </div>
  );
}
