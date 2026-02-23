import React from "react";
import { ReviewsState } from "../reviews/reviews.types";
import { Button, Card, SubTitle, Title } from "src/ui/ui";


function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {children}
    </select>
  );
}

export function FiltersBar({
  filters,
  setFilters,
  onOpenWrite,
  onClearDemo,
}: {
  filters: ReviewsState;
  setFilters: (updater: (prev: ReviewsState) => ReviewsState) => void;
  onOpenWrite: () => void;
  onClearDemo: () => void;
}) {
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <SubTitle>Danh sách</SubTitle>
          <Title className="mt-1">Đánh giá mới nhất</Title>
          <p className="mt-2 text-slate-600">Lọc theo sao, dịch vụ/sản phẩm, từ khóa. Like “Hữu ích” để ưu tiên hiển thị.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button tone="brand" variant="solid" onClick={onOpenWrite}>
            Viết đánh giá
          </Button>
          <Button variant="ghost" onClick={onClearDemo}>
            Xoá demo
          </Button>
        </div>
      </div>

      <Card className="mt-6 p-6">
        <div className="grid lg:grid-cols-12 gap-3 items-end">
          <div className="lg:col-span-4">
            <div className="text-sm font-extrabold text-slate-700">Tìm kiếm</div>
            <div className="mt-2">
              <Input
                value={filters.q}
                onChange={(v) => setFilters((p) => ({ ...p, q: v }))}
                placeholder="VD: facial, massage, serum, thái độ phục vụ..."
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="text-sm font-extrabold text-slate-700">Danh mục</div>
            <div className="mt-2">
              <Select value={filters.category} onChange={(v) => setFilters((p) => ({ ...p, category: v as any }))}>
                <option value="all">Tất cả</option>
                <option value="service">Dịch vụ</option>
                <option value="product">Sản phẩm</option>
              </Select>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="text-sm font-extrabold text-slate-700">Sắp xếp</div>
            <div className="mt-2">
              <Select value={filters.sort} onChange={(v) => setFilters((p) => ({ ...p, sort: v as any }))}>
                <option value="new">Mới nhất</option>
                <option value="helpful">Hữu ích nhất</option>
                <option value="high">Sao cao → thấp</option>
                <option value="low">Sao thấp → cao</option>
              </Select>
            </div>
          </div>

          <div className="lg:col-span-2 flex gap-2">
            <Button tone="brand" variant="solid" className="flex-1" onClick={() => {}}>
              Lọc
            </Button>
            <Button variant="ghost" className="flex-1" onClick={() => setFilters(() => ({ q: "", category: "all", sort: "new", star: "all", verifiedOnly: false }))}>
              Reset
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(["all", "5", "4", "3", "2", "1"] as const).map((s) => {
            const active = filters.star === s;
            return (
              <button
                key={s}
                type="button"
                className={
                  "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-extrabold transition " +
                  (active
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50")
                }
                onClick={() => setFilters((p) => ({ ...p, star: s }))}
              >
                {s === "all" ? "Tất cả" : `${s} sao`}
              </button>
            );
          })}

          <button
            type="button"
            className={
              "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-extrabold transition " +
              (filters.verifiedOnly
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50")
            }
            onClick={() => setFilters((p) => ({ ...p, verifiedOnly: !p.verifiedOnly }))}
          >
            Verified: {filters.verifiedOnly ? "ON" : "OFF"}
          </button>
        </div>
      </Card>
    </>
  );
}
