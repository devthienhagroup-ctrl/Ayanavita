import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { http } from "../api/http";
import { MAX_COMPARE_PRODUCTS, MIN_COMPARE_PRODUCTS, readCompareProductIds, writeCompareProductIds } from "../services/compare.utils";

type CompareProduct = {
  id: string | number;
  sku: string;
  name: string;
  shortDescription?: string | null;
  price: number;
  image?: string | null;
  attributes?: Array<{ key?: string; name?: string; valueText?: string | null; valueNumber?: number | null; valueBoolean?: boolean | null }>;
};

type ProductListItem = {
  sku: string;
  id: string | number;
  name: string;
  image?: string | null;
  shortDescription?: string | null;
  price: number;
};

const DASH = "—";

function attributeValue(a: any): string {
  if (a?.valueText) return String(a.valueText);
  if (typeof a?.valueNumber === "number") return String(a.valueNumber);
  if (typeof a?.valueBoolean === "boolean") return a.valueBoolean ? "Có" : "Không";
  return DASH;
}

export default function ComparePage() {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => localStorage.getItem("preferred-language") || "vi");
  const [selectedSkus, setSelectedSkus] = useState<string[]>(() => readCompareProductIds());
  const [catalogItems, setCatalogItems] = useState<ProductListItem[]>([]);
  const [products, setProducts] = useState<CompareProduct[]>([]);
  const [openPicker, setOpenPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerSelected, setPickerSelected] = useState<string[]>([]);

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => setCurrentLanguage(event.detail.language);
    const syncCompare = () => setSelectedSkus(readCompareProductIds());

    window.addEventListener("languageChange", handleLanguageChange as EventListener);
    window.addEventListener("aya_compare_changed", syncCompare as EventListener);
    return () => {
      window.removeEventListener("languageChange", handleLanguageChange as EventListener);
      window.removeEventListener("aya_compare_changed", syncCompare as EventListener);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await http.get("/public/catalog/products", {
          params: { lang: currentLanguage, page: 1, pageSize: 100, sort: "nameAsc" },
        });
        if (cancelled) return;
        const rows = Array.isArray(res.data?.items) ? res.data.items : [];
        setCatalogItems(rows);
      } catch (error) {
        console.error("GET /public/catalog/products failed on compare:", error);
        if (!cancelled) setCatalogItems([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentLanguage]);

  useEffect(() => {
    let cancelled = false;
    const loadDetails = async () => {
      if (!selectedSkus.length) {
        setProducts([]);
        return;
      }

      try {
        const rows = await Promise.all(
          selectedSkus.map(async (sku) => {
            const res = await http.get(`/public/catalog/products/${sku}?lang=${currentLanguage}`);
            return res.data;
          })
        );
        if (!cancelled) setProducts(rows);
      } catch (error) {
        console.error("GET /public/catalog/products/:sku failed on compare:", error);
        if (!cancelled) setProducts([]);
      }
    };

    loadDetails();
    return () => {
      cancelled = true;
    };
  }, [selectedSkus, currentLanguage]);

  const filteredCatalog = useMemo(() => {
    const q = pickerSearch.trim().toLowerCase();
    if (!q) return catalogItems;
    return catalogItems.filter((p) => String(p.name).toLowerCase().includes(q) || String(p.sku).toLowerCase().includes(q));
  }, [catalogItems, pickerSearch]);

  const attributeRows = useMemo(() => {
    const counters = new Map<string, number>();
    products.forEach((p) => {
      (p.attributes || []).forEach((a) => {
        const key = String(a?.key || a?.name || "").trim();
        if (!key) return;
        counters.set(key, (counters.get(key) || 0) + 1);
      });
    });

    const all = Array.from(counters.entries()).map(([key, count]) => ({ key, count }));
    all.sort((a, b) => (b.count === a.count ? a.key.localeCompare(b.key) : b.count - a.count));
    return all;
  }, [products]);

  function openModal() {
    setPickerSelected(selectedSkus.slice(0, MAX_COMPARE_PRODUCTS));
    setPickerSearch("");
    setOpenPicker(true);
  }

  function applyPicker() {
    if (pickerSelected.length < MIN_COMPARE_PRODUCTS || pickerSelected.length > MAX_COMPARE_PRODUCTS) return;
    writeCompareProductIds(pickerSelected);
    setSelectedSkus(pickerSelected);
    setOpenPicker(false);
  }

  function removeSku(sku: string) {
    const next = selectedSkus.filter((x) => x !== sku);
    writeCompareProductIds(next);
    setSelectedSkus(next);
  }

  return (
    <div className="text-slate-900">
      <main className="px-4 py-10">
        <div className="max-w-6xl mx-auto grid gap-4">
          <section className="card p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-xs font-extrabold text-slate-500">Compare</div>
                <h1 className="text-2xl font-extrabold">So sánh sản phẩm</h1>
                <div className="mt-1 text-sm text-slate-600">Chọn tối thiểu 2 và tối đa 3 sản phẩm để so sánh.</div>
              </div>
              <div className="flex gap-2">
                <button className="btn" type="button" onClick={openModal}>
                  <i className="fa-solid fa-plus mr-2" />Thêm sản phẩm
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedSkus.map((sku) => (
                <span key={sku} className="chip">
                  {sku}
                  <button className="ml-2" onClick={() => removeSku(sku)}>
                    ✕
                  </button>
                </span>
              ))}
            </div>

            {products.length >= MIN_COMPARE_PRODUCTS ? (
              <div className="mt-5 overflow-auto">
                <table className="w-full min-w-[780px] text-sm">
                  <thead className="text-left text-slate-500">
                    <tr className="border-b border-slate-200">
                      <th className="py-3 pr-4">Tiêu chí</th>
                      {products.map((p) => (
                        <th key={p.sku} className="py-3 pr-4">
                          {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-extrabold">Sản phẩm</td>
                      {products.map((p) => (
                        <td key={p.sku} className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <img className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200" src={p.image || ""} alt={p.name} />
                            <div>
                              <div className="font-extrabold">{p.name}</div>
                              <div className="text-xs text-slate-500">{p.sku}</div>
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-extrabold">Mô tả ngắn</td>
                      {products.map((p) => (
                        <td key={p.sku} className="py-3 pr-4">
                          {p.shortDescription || DASH}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-extrabold">Giá</td>
                      {products.map((p) => (
                        <td key={p.sku} className="py-3 pr-4">
                          {new Intl.NumberFormat(currentLanguage === "vi" ? "vi-VN" : "en-US", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 0,
                          }).format(Number(p.price || 0))}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-extrabold">Đánh giá</td>
                      {products.map((p) => (
                        <td key={p.sku} className="py-3 pr-4">
                          5.0★
                        </td>
                      ))}
                    </tr>

                    {attributeRows.map((row) => (
                      <tr key={row.key} className="border-b border-slate-100">
                        <td className="py-3 pr-4 font-extrabold">{row.key}</td>
                        {products.map((p) => {
                          const matched = (p.attributes || []).find((a) => String(a?.key || a?.name) === row.key);
                          return (
                            <td key={`${p.sku}-${row.key}`} className="py-3 pr-4">
                              {matched ? attributeValue(matched) : DASH}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">Vui lòng chọn ít nhất 2 sản phẩm để bắt đầu so sánh.</div>
            )}

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <Link className="btn text-center" to="/products">
                <i className="fa-solid fa-arrow-left mr-2" />Quay lại danh sách sản phẩm
              </Link>
            </div>
          </section>
        </div>
      </main>

      {openPicker ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold">Chọn sản phẩm so sánh</h2>
              <button className="btn" onClick={() => setOpenPicker(false)}>
                Đóng
              </button>
            </div>

            <input
              className="field mt-3"
              value={pickerSearch}
              onChange={(e) => setPickerSearch(e.target.value)}
              placeholder="Tìm theo tên hoặc SKU"
            />

            <div className="mt-3 max-h-[360px] overflow-auto space-y-2">
              {filteredCatalog.map((p) => {
                const checked = pickerSelected.includes(p.sku);
                const disabled = !checked && pickerSelected.length >= MAX_COMPARE_PRODUCTS;
                return (
                  <label key={p.sku} className={`flex items-center gap-3 rounded-xl border p-3 ${disabled ? "opacity-60" : ""}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => {
                        if (checked) {
                          setPickerSelected((prev) => prev.filter((x) => x !== p.sku));
                          return;
                        }
                        if (pickerSelected.length >= MAX_COMPARE_PRODUCTS) return;
                        setPickerSelected((prev) => [...prev, p.sku]);
                      }}
                    />
                    <img className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-200" src={p.image || ""} alt={p.name} />
                    <div className="min-w-0">
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.sku}</div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <div>
                Đã chọn: <b>{pickerSelected.length}</b> / {MAX_COMPARE_PRODUCTS} (tối thiểu {MIN_COMPARE_PRODUCTS})
              </div>
              <button
                className={`btn ${pickerSelected.length < MIN_COMPARE_PRODUCTS ? "opacity-60" : ""}`}
                disabled={pickerSelected.length < MIN_COMPARE_PRODUCTS}
                onClick={applyPicker}
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
