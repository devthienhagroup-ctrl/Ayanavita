import React, { useEffect, useMemo, useState } from "react";

import { useAuth } from "../app/auth.store";
import { productsApi, type AdminProduct } from "../api/products.api";

const emptyForm = {
  sku: "",
  slug: "",
  name: "",
  type: "cleanser",
  concerns: "",
  price: 0,
  rating: 4.5,
  sold: 0,
  imageUrl: "",
  shortDescription: "",
  description: "",
  published: true,
};

export function ProductsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<AdminProduct[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const isEdit = useMemo(() => editingId !== null, [editingId]);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await productsApi.list(token, q);
      setItems(res.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const payload = {
      ...form,
      concerns: form.concerns.split(",").map((x) => x.trim()).filter(Boolean),
    };
    if (editingId) await productsApi.update(token, editingId, payload as any);
    else await productsApi.create(token, payload as any);

    setForm(emptyForm);
    setEditingId(null);
    await load();
  };

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="card">
        <div className="row" style={{ padding: 0 }}>
          <h1 className="h1">Quản lý sản phẩm</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="input" placeholder="Tìm theo tên/SKU" value={q} onChange={(e) => setQ(e.target.value)} />
            <button className="btn" type="button" onClick={load}>Tìm</button>
          </div>
        </div>
      </div>

      <form className="card grid grid-3" onSubmit={submit}>
        <input className="input" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
        <input className="input" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
        <input className="input" placeholder="Tên sản phẩm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" placeholder="Loại" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
        <input className="input" placeholder="Concerns: acne,aging" value={form.concerns} onChange={(e) => setForm({ ...form, concerns: e.target.value })} />
        <input className="input" type="number" placeholder="Giá" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <input className="input" type="number" step="0.1" min="0" max="5" placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
        <input className="input" type="number" placeholder="Đã bán" value={form.sold} onChange={(e) => setForm({ ...form, sold: Number(e.target.value) })} />
        <input className="input" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <input className="input" placeholder="Mô tả ngắn" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
        <textarea className="textarea" placeholder="Mô tả chi tiết" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ minHeight: 100 }} />
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary" type="submit">{isEdit ? "Cập nhật" : "Tạo mới"}</button>
          {isEdit && <button className="btn" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Huỷ</button>}
        </div>
      </form>

      <div className="card">
        <table className="table">
          <thead>
            <tr><th>ID</th><th>SKU</th><th>Tên</th><th>Giá</th><th>Rating</th><th>Published</th><th></th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7}>Loading...</td></tr> : items.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>{p.price.toLocaleString("vi-VN")}</td>
                <td>{p.rating}</td>
                <td>{p.published ? "Yes" : "No"}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button className="btn" onClick={() => { setEditingId(p.id); setForm({
                    sku: p.sku, slug: p.slug, name: p.name, type: p.type, concerns: (p.concerns || []).join(","),
                    price: p.price, rating: p.rating, sold: p.sold, imageUrl: p.imageUrl || "", shortDescription: p.shortDescription || "",
                    description: p.description || "", published: p.published,
                  }); }}>Sửa</button>
                  <button className="btn btn-danger" onClick={async () => { if (!token) return; await productsApi.remove(token, p.id); await load(); }}>Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
