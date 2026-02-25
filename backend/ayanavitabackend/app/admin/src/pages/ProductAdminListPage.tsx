import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createAdminCategory,
  createAdminProduct,
  deleteAdminCategory,
  fetchAdminCategories,
  fetchAdminProducts,
  updateAdminCategory,
} from "../api/productAdmin.api";
import type { ProductAdminItem, ProductCategory } from "../types/productAdmin";

function CategoryRow({
  category,
  onSave,
  onDelete,
}: {
  category: ProductCategory;
  onSave: (item: ProductCategory) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState(category);

  useEffect(() => setDraft(category), [category]);

  return (
    <div className="card" style={{ padding: 10 }}>
      <div className="grid" style={{ gap: 8 }}>
        <input className="input" value={draft.name} onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))} />
        <input
          className="input"
          value={draft.description || ""}
          onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary" onClick={() => onSave(draft)}>Lưu</button>
          <button className="btn btn-danger" onClick={() => onDelete(category.id)}>Xóa</button>
        </div>
      </div>
    </div>
  );
}

export function ProductAdminListPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductAdminItem[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  const categoryMap = useMemo(() => Object.fromEntries(categories.map((item) => [item.id, item.name])), [categories]);

  const loadData = async () => {
    setLoading(true);
    const [productList, categoryList] = await Promise.all([fetchAdminProducts(), fetchAdminCategories()]);
    setProducts(productList);
    setCategories(categoryList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onCreateProduct = async () => {
    const created = await createAdminProduct();
    navigate(`/catalog/products/${created.id}`);
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: 16 }}>
        <p className="muted" style={{ margin: 0 }}>Quản lý sản phẩm</p>
        <h2 className="h1">Danh sách sản phẩm</h2>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <button onClick={onCreateProduct} className="btn btn-primary">+ Thêm sản phẩm</button>
          <button onClick={() => setOpenCategoryModal(true)} className="btn">Quản lý category</button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="muted">Đang tải dữ liệu...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Tên (VI)</th>
                <th>Category</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const viName = product.translations.find((item) => item.lang === "vi")?.name || "(chưa đặt tên)";
                return (
                  <tr key={product.id}>
                    <td>{product.sku}</td>
                    <td>{viName}</td>
                    <td>{categoryMap[product.categoryId] || "-"}</td>
                    <td>{product.price.toLocaleString("vi-VN")} đ</td>
                    <td>{product.status}</td>
                    <td>
                      <Link className="btn" to={`/catalog/products/${product.id}`}>Chỉnh sửa</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {openCategoryModal ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 className="h2">Quản lý category</h3>
          <div style={{ display: "flex", gap: 8, margin: "10px 0" }}>
            <input
              className="input"
              placeholder="Tên category"
              value={newCategory.name}
              onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Mô tả"
              value={newCategory.description}
              onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
            />
            <button
              className="btn btn-primary"
              onClick={async () => {
                if (!newCategory.name.trim()) return;
                await createAdminCategory(newCategory.name.trim(), newCategory.description.trim());
                setNewCategory({ name: "", description: "" });
                loadData();
              }}
            >
              + Tạo
            </button>
            <button className="btn" onClick={() => setOpenCategoryModal(false)}>Đóng</button>
          </div>

          <div className="grid" style={{ gap: 8 }}>
            {categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onSave={async (item) => {
                  await updateAdminCategory(item);
                  loadData();
                }}
                onDelete={async (id) => {
                  await deleteAdminCategory(id);
                  loadData();
                }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
