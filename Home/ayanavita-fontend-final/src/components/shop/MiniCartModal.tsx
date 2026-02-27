import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Modal } from "../common/Modal";
import { PRODUCTS, type ProductSku } from "../../data/products.data";
import { money } from "../../services/booking.utils";
import {
  readProductCart,
  incProductQty,
  decProductQty,
  removeProductFromCart,
  clearProductCart,
  type ProductCartItem,
} from "../../services/productCart.utils";
import { shippingFeeDemo } from "../../services/shipping.demo";

export function MiniCartModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [cart, setCart] = useState<ProductCartItem[]>([]);

  function refresh() {
    setCart(readProductCart());
  }

  useEffect(() => {
    if (!open) return;
    refresh();
  }, [open]);

  useEffect(() => {
    const onChanged = () => refresh();
    window.addEventListener("aya_product_cart_changed", onChanged as any);
    return () => window.removeEventListener("aya_product_cart_changed", onChanged as any);
  }, []);

  const rows = useMemo(() => {
    return cart
      .map((it) => {
        const p = PRODUCTS[it.sku];
        if (!p) return null;
        return { ...it, product: p, line: p.price * it.qty };
      })
      .filter(Boolean) as Array<ProductCartItem & { product: any; line: number }>;
  }, [cart]);

  const subtotal = useMemo(() => rows.reduce((s, x) => s + x.line, 0), [rows]);
  const ship = useMemo(() => shippingFeeDemo(subtotal), [subtotal]);
  const total = subtotal + ship;

  function onInc(sku: ProductSku) {
    setCart(incProductQty(sku));
  }
  function onDec(sku: ProductSku) {
    setCart(decProductQty(sku));
  }
  function onDel(sku: ProductSku) {
    setCart(removeProductFromCart(sku));
  }
  function onClear() {
    if (!window.confirm("Xóa toàn bộ giỏ hàng?")) return;
    setCart(clearProductCart());
  }

  return (
    <Modal open={open} onClose={onClose} subTitle="Giỏ hàng" title="Sản phẩm đã chọn" maxWidthClass="max-w-3xl">
      <div className="grid gap-3">
        {rows.length ? (
          rows.map((it) => (
            <div key={it.sku} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    className="h-16 w-16 rounded-2xl object-cover border border-slate-200"
                    src={it.product.img}
                    alt={it.product.name}
                  />
                  <div className="min-w-0">
                    <div className="font-extrabold truncate">{it.product.name}</div>
                    <div className="text-sm text-slate-600">{it.product.id} • {money(it.product.price)}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-amber-600">{money(it.line)}</div>
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <button className="btn w-11 h-11 p-0" type="button" onClick={() => onDec(it.sku)}>
                      <i className="fa-solid fa-minus" />
                    </button>
                    <span className="chip">SL: <b>{it.qty}</b></span>
                    <button className="btn w-11 h-11 p-0" type="button" onClick={() => onInc(it.sku)}>
                      <i className="fa-solid fa-plus" />
                    </button>
                    <button className="btn" type="button" onClick={() => onDel(it.sku)}>
                      Xoá
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-700">
            Giỏ hàng trống.
          </div>
        )}

        <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 font-extrabold">Tạm tính</span>
            <b>{money(subtotal)}</b>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-slate-600 font-extrabold">Phí vận chuyển (demo)</span>
            <b>{money(ship)}</b>
          </div>
          <div className="border-t border-slate-200 my-3" />
          <div className="flex items-center justify-between">
            <span className="font-extrabold">Tổng</span>
            <span className="text-2xl font-extrabold text-amber-600">{money(total)}</span>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Link className="btn btn-primary text-center" to="/checkout" onClick={onClose}>
              <i className="fa-solid fa-credit-card mr-2" /> Đi tới checkout
            </Link>
            <button className="btn" type="button" onClick={onClear} disabled={!rows.length}>
              <i className="fa-solid fa-trash mr-2" /> Xóa giỏ
            </button>
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Prototype: giỏ dùng localStorage. Khi làm thật, nối API /orders.
          </div>
        </div>
      </div>
    </Modal>
  );
}
