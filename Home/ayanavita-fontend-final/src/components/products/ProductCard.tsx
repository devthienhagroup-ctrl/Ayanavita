// src/components/products/ProductCard.tsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import type { CategoryProduct } from "../../data/productCategory.data";
import { money } from "../../services/booking.utils";
import { addProductToCart } from "../../services/productCart.utils";

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: full }).map((_, i) => (
          <i key={i} className="fa-solid fa-star star" />
        ))}
        {half ? <i className="fa-solid fa-star-half-stroke star" /> : null}
      </div>
      <b>{rating.toFixed(1)}</b>
    </div>
  );
}

export function ProductCard({ p, detailTo }: { p: CategoryProduct; detailTo: string }) {
  const soldText = useMemo(() => new Intl.NumberFormat("vi-VN").format(p.sold), [p.sold]);

  return (
    <article className="card p-4">
      <img className="h-36 w-full rounded-2xl object-cover ring-1 ring-slate-200" src={p.img} alt={p.name} />

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <div className="font-extrabold">{p.name}</div>
          <div className="text-xs text-slate-500">
            {p.id} • Bán chạy: {soldText}
          </div>
        </div>
        <span className="chip">
          <i className="fa-solid fa-tag text-emerald-600" />
          {money(p.price)}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
        <Stars rating={p.rating} />
        <span className="text-slate-500">Cập nhật: {p.updated}</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link className="btn text-center" to={detailTo}>
          <i className="fa-solid fa-circle-info mr-2" />
          Chi tiết
        </Link>

        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            addProductToCart(p.sku, 1);
            window.alert("Đã thêm vào giỏ (demo).");
          }}
        >
          <i className="fa-solid fa-cart-plus mr-2" />
          Thêm
        </button>
      </div>

      <button
        className="mt-2 btn w-full"
        type="button"
        onClick={() => window.alert("Đã thêm vào so sánh (demo).")}
      >
        <i className="fa-solid fa-scale-balanced mr-2" />
        So sánh
      </button>
    </article>
  );
}
