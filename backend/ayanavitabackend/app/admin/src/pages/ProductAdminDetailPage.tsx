import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createAttribute,
  createIngredient,
  deleteAdminProduct,
  deleteProductImage,
  fetchAdminCategories,
  fetchAdminProductById,
  fetchCatalogLanguages,
  updateAdminProduct,
  updateProductImage,
  uploadProductImage,
  upsertTranslation,
} from "../api/productAdmin.api";
import type { AdminLanguage, ProductAdminItem, ProductCategory } from "../types/productAdmin";

type PendingImageFileMap = Record<string, File>;

const isTempImageId = (id: string) => id.startsWith("temp-");

export function ProductAdminDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductAdminItem | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [activeLang, setActiveLang] = useState("vi");
  const [saving, setSaving] = useState(false);
  const [pendingImageFiles, setPendingImageFiles] = useState<PendingImageFileMap>({});
  const [deletedPersistedImageIds, setDeletedPersistedImageIds] = useState<string[]>([]);

  const load = async () => {
    if (!productId) return;
    const langs = await fetchCatalogLanguages();
    const [detail, categoryList] = await Promise.all([fetchAdminProductById(productId), fetchAdminCategories()]);
    setProduct(detail);
    setCategories(categoryList);
    setLanguages(langs);
    setActiveLang((prev) => (langs.find((x) => x.code === prev)?.code || langs[0]?.code || "vi"));
    setPendingImageFiles({});
    setDeletedPersistedImageIds([]);
  };

  useEffect(() => {
    void load();
  }, [productId]);

  const translation = useMemo(() => product?.translations.find((item) => item.lang === activeLang), [product, activeLang]);

  const updateImageDraft = (imageId: string, patch: Partial<ProductAdminItem["images"][number]>) => {
    setProduct((prev) =>
      prev
        ? {
            ...prev,
            images: prev.images.map((img) => (img.id === imageId ? { ...img, ...patch } : img)),
          }
        : prev,
    );
  };

  const onAddImages = (files: FileList | null) => {
    if (!files || !files.length) return;
    const selectedFiles = Array.from(files);
    const draftImages = selectedFiles.map((file, index) => ({
      id: `temp-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
      imageUrl: URL.createObjectURL(file),
      isPrimary: false,
      sortOrder: index,
      file,
    }));

    setProduct((prev) => {
      if (!prev) return prev;
      const startOrder = prev.images.length;
      return {
        ...prev,
        images: [
          ...prev.images,
          ...draftImages.map((item, index) => ({
            id: item.id,
            imageUrl: item.imageUrl,
            isPrimary: item.isPrimary,
            sortOrder: startOrder + index,
          })),
        ],
      };
    });

    setPendingImageFiles((prev) => ({
      ...prev,
      ...Object.fromEntries(draftImages.map((item) => [item.id, item.file])),
    }));
  };

  const onDeleteImage = (imageId: string) => {
    if (!product) return;
    if (!isTempImageId(imageId)) {
      setDeletedPersistedImageIds((prev) => (prev.includes(imageId) ? prev : [...prev, imageId]));
    } else {
      setPendingImageFiles((prev) => {
        const next = { ...prev };
        delete next[imageId];
        return next;
      });
    }

    setProduct({ ...product, images: product.images.filter((img) => img.id !== imageId) });
  };

  const onSave = async () => {
    if (!product) return;
    setSaving(true);
    try {
      await updateAdminProduct(product);

      for (const imageId of deletedPersistedImageIds) {
        await deleteProductImage(product.id, imageId);
      }

      for (const image of product.images) {
        if (isTempImageId(image.id)) {
          const file = pendingImageFiles[image.id];
          if (!file) continue;
          await uploadProductImage(product.id, file, image.isPrimary, image.sortOrder);
          URL.revokeObjectURL(image.imageUrl);
        } else {
          await updateProductImage(product.id, image);
        }
      }

      await load();
    } finally {
      setSaving(false);
    }
  };

  const onDeleteProduct = async () => {
    if (!product) return;
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      await deleteAdminProduct(product.id);
      navigate("/catalog/products");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể xóa sản phẩm";
      window.alert(`${message}\n\nGợi ý: nếu sản phẩm đang được tham chiếu, hãy tắt trạng thái hoạt động trước.`);
    }
  };

  if (!product) {
    return <div className="card">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <p className="muted" style={{ margin: 0 }}>Chi tiết sản phẩm</p>
            <h2 className="h1">{translation?.name || "Sản phẩm mới"}</h2>
            <p className="muted" style={{ margin: 0 }}>{product.sku}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => navigate("/catalog/products")} className="btn">Quay lại danh sách</button>
            <button onClick={onSave} className="btn btn-primary" disabled={saving}>{saving ? "Đang lưu..." : "Lưu thay đổi"}</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-2">
          <label>
            <div className="muted">SKU</div>
            <input className="input" value={product.sku} onChange={(e) => setProduct((prev) => (prev ? { ...prev, sku: e.target.value } : prev))} />
          </label>
          <label>
            <div className="muted">Category</div>
            <select
              className="select"
              value={product.categoryId}
              onChange={(e) => setProduct((prev) => (prev ? { ...prev, categoryId: e.target.value } : prev))}
            >
              <option value="">-- Chọn category --</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.translations.find((x) => x.lang === activeLang)?.name || item.translations[0]?.name || item.id}
                </option>
              ))}
            </select>
          </label>
          <label>
            <div className="muted">Giá</div>
            <input
              type="number"
              className="input"
              value={product.price}
              onChange={(e) => setProduct((prev) => (prev ? { ...prev, price: Number(e.target.value) } : prev))}
            />
          </label>
          <div>
            <div className="muted">Trạng thái</div>
            <label style={{ display: "inline-flex", gap: 8, alignItems: "center", marginTop: 10 }}>
              <input
                type="checkbox"
                checked={product.status === "active"}
                onChange={(e) =>
                  setProduct((prev) => (prev ? { ...prev, status: e.target.checked ? "active" : "draft" } : prev))
                }
              />
              {product.status === "active" ? "Đang bật" : "Đang tắt"}
            </label>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          {languages.map((lang) => (
            <button key={lang.code} onClick={() => setActiveLang(lang.code)} className={`btn ${activeLang === lang.code ? "btn-primary" : ""}`}>
              {lang.label}
            </button>
          ))}
        </div>

        <div className="grid" style={{ gap: 8 }}>
          <label>
            <div className="muted">Tên sản phẩm</div>
            <input
              className="input"
              value={translation?.name || ""}
              onChange={(e) =>
                setProduct((prev) =>
                  prev ? { ...prev, translations: upsertTranslation(prev.translations, activeLang, { name: e.target.value }) } : prev,
                )
              }
            />
          </label>
          <label>
            <div className="muted">Mô tả ngắn</div>
            <input
              className="input"
              value={translation?.shortDescription || ""}
              onChange={(e) =>
                setProduct((prev) =>
                  prev
                    ? { ...prev, translations: upsertTranslation(prev.translations, activeLang, { shortDescription: e.target.value }) }
                    : prev,
                )
              }
            />
          </label>
          <label>
            <div className="muted">Mô tả chi tiết</div>
            <textarea
              rows={4}
              className="input"
              value={translation?.description || ""}
              onChange={(e) =>
                setProduct((prev) =>
                  prev ? { ...prev, translations: upsertTranslation(prev.translations, activeLang, { description: e.target.value }) } : prev,
                )
              }
            />
          </label>
          <label>
            <div className="muted">Hướng dẫn sử dụng - Giới thiệu</div>
            <textarea
              rows={3}
              className="input"
              value={translation?.guideContent?.intro || ""}
              onChange={(e) =>
                setProduct((prev) =>
                  prev
                    ? {
                        ...prev,
                        translations: upsertTranslation(prev.translations, activeLang, {
                          guideContent: {
                            intro: e.target.value,
                            steps: translation?.guideContent?.steps || [],
                          },
                        }),
                      }
                    : prev,
                )
              }
            />
          </label>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div className="muted">Hướng dẫn sử dụng - Các bước</div>
              <button
                className="btn"
                onClick={() =>
                  setProduct((prev) => {
                    if (!prev) return prev;
                    const current = prev.translations.find((item) => item.lang === activeLang)?.guideContent;
                    const steps = current?.steps || [];
                    return {
                      ...prev,
                      translations: upsertTranslation(prev.translations, activeLang, {
                        guideContent: {
                          intro: current?.intro || "",
                          steps: [...steps, { order: steps.length + 1, content: "" }],
                        },
                      }),
                    };
                  })
                }
              >
                + Thêm bước
              </button>
            </div>

            <div className="grid" style={{ gap: 8 }}>
              {(translation?.guideContent?.steps || []).map((step, idx) => (
                <div key={`${step.order}-${idx}`} className="card" style={{ padding: 10 }}>
                  <div className="grid grid-2">
                    <label>
                      <div className="muted">Thứ tự</div>
                      <input
                        type="number"
                        min={1}
                        className="input"
                        value={step.order}
                        onChange={(e) =>
                          setProduct((prev) => {
                            if (!prev) return prev;
                            const current = prev.translations.find((item) => item.lang === activeLang)?.guideContent;
                            const steps = (current?.steps || []).map((row, rowIdx) =>
                              rowIdx === idx ? { ...row, order: Number(e.target.value) || 1 } : row,
                            );
                            return {
                              ...prev,
                              translations: upsertTranslation(prev.translations, activeLang, {
                                guideContent: { intro: current?.intro || "", steps },
                              }),
                            };
                          })
                        }
                      />
                    </label>
                    <label>
                      <div className="muted">Nội dung bước</div>
                      <input
                        className="input"
                        value={step.content}
                        onChange={(e) =>
                          setProduct((prev) => {
                            if (!prev) return prev;
                            const current = prev.translations.find((item) => item.lang === activeLang)?.guideContent;
                            const steps = (current?.steps || []).map((row, rowIdx) =>
                              rowIdx === idx ? { ...row, content: e.target.value } : row,
                            );
                            return {
                              ...prev,
                              translations: upsertTranslation(prev.translations, activeLang, {
                                guideContent: { intro: current?.intro || "", steps },
                              }),
                            };
                          })
                        }
                      />
                    </label>
                  </div>
                  <button
                    className="btn btn-danger"
                    style={{ marginTop: 8 }}
                    onClick={() =>
                      setProduct((prev) => {
                        if (!prev) return prev;
                        const current = prev.translations.find((item) => item.lang === activeLang)?.guideContent;
                        const steps = (current?.steps || [])
                          .filter((_, rowIdx) => rowIdx !== idx)
                          .map((row, orderIdx) => ({ ...row, order: orderIdx + 1 }));
                        return {
                          ...prev,
                          translations: upsertTranslation(prev.translations, activeLang, {
                            guideContent: { intro: current?.intro || "", steps },
                          }),
                        };
                      })
                    }
                  >
                    Xóa bước
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <h3 className="h2" style={{ margin: 0 }}>Hình ảnh sản phẩm</h3>
          <label className="btn btn-primary" style={{ cursor: "pointer" }}>
            + Tải nhiều ảnh
            <input
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                onAddImages(e.target.files);
                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>

        <div className="grid" style={{ gap: 10, marginTop: 10 }}>
          {product.images.length === 0 ? (
            <p className="muted" style={{ margin: 0 }}>Chưa có ảnh cho sản phẩm này.</p>
          ) : (
            product.images.map((image, idx) => (
              <div key={image.id} className="card" style={{ padding: 10 }}>
                <div className="grid grid-2" style={{ alignItems: "start" }}>
                  <img src={image.imageUrl} alt={`Product ${idx + 1}`} style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8 }} />
                  <div className="grid" style={{ gap: 8 }}>
                    <label>
                      <div className="muted">URL ảnh</div>
                      <input className="input" value={image.imageUrl} onChange={(e) => updateImageDraft(image.id, { imageUrl: e.target.value })} />
                    </label>
                    <label>
                      <div className="muted">Thứ tự hiển thị</div>
                      <input
                        type="number"
                        min={0}
                        className="input"
                        value={image.sortOrder}
                        onChange={(e) => updateImageDraft(image.id, { sortOrder: Number(e.target.value) || 0 })}
                      />
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={image.isPrimary}
                        onChange={(e) =>
                          setProduct((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  images: prev.images.map((row) => ({ ...row, isPrimary: row.id === image.id ? e.target.checked : false })),
                                }
                              : prev,
                          )
                        }
                      />
                      Ảnh chính
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-danger" onClick={() => onDeleteImage(image.id)}>Xóa ảnh</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 className="h2">CRUD thành phần</h3>
            <button className="btn" onClick={() => setProduct((prev) => (prev ? { ...prev, ingredients: [...prev.ingredients, createIngredient()] } : prev))}>+ Thêm</button>
          </div>
          <div className="grid" style={{ marginTop: 10 }}>
            {product.ingredients.map((item) => (
              <div key={item.id} className="card" style={{ padding: 10 }}>
                <input
                  className="input"
                  placeholder={`Tên thành phần (${activeLang})`}
                  value={item.nameByLang[activeLang] || ""}
                  onChange={(e) =>
                    setProduct((prev) =>
                      prev
                        ? {
                            ...prev,
                            ingredients: prev.ingredients.map((row) =>
                              row.id === item.id
                                ? { ...row, nameByLang: { ...row.nameByLang, [activeLang]: e.target.value } }
                                : row,
                            ),
                          }
                        : prev,
                    )
                  }
                />
                <input
                  className="input"
                  style={{ marginTop: 8 }}
                  placeholder="Ghi chú"
                  value={item.note}
                  onChange={(e) =>
                    setProduct((prev) =>
                      prev
                        ? {
                            ...prev,
                            ingredients: prev.ingredients.map((row) => (row.id === item.id ? { ...row, note: e.target.value } : row)),
                          }
                        : prev,
                    )
                  }
                />
                <button
                  className="btn btn-danger"
                  style={{ marginTop: 8 }}
                  onClick={() =>
                    setProduct((prev) => (prev ? { ...prev, ingredients: prev.ingredients.filter((row) => row.id !== item.id) } : prev))
                  }
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 className="h2">CRUD thuộc tính</h3>
            <button className="btn" onClick={() => setProduct((prev) => (prev ? { ...prev, attributes: [...prev.attributes, createAttribute()] } : prev))}>+ Thêm</button>
          </div>
          <div className="grid" style={{ marginTop: 10 }}>
            {product.attributes.map((item) => (
              <div key={item.id} className="card" style={{ padding: 10 }}>
                <input
                  className="input"
                  placeholder={`Tên thuộc tính (${activeLang})`}
                  value={item.keyByLang[activeLang] || ""}
                  onChange={(e) =>
                    setProduct((prev) =>
                      prev
                        ? {
                            ...prev,
                            attributes: prev.attributes.map((row) =>
                              row.id === item.id
                                ? { ...row, keyByLang: { ...row.keyByLang, [activeLang]: e.target.value } }
                                : row,
                            ),
                          }
                        : prev,
                    )
                  }
                />
                <input
                  className="input"
                  style={{ marginTop: 8 }}
                  placeholder="Giá trị"
                  value={item.value}
                  onChange={(e) =>
                    setProduct((prev) =>
                      prev
                        ? {
                            ...prev,
                            attributes: prev.attributes.map((row) => (row.id === item.id ? { ...row, value: e.target.value } : row)),
                          }
                        : prev,
                    )
                  }
                />
                <button
                  className="btn btn-danger"
                  style={{ marginTop: 8 }}
                  onClick={() =>
                    setProduct((prev) => (prev ? { ...prev, attributes: prev.attributes.filter((row) => row.id !== item.id) } : prev))
                  }
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <Link to="/catalog/products" className="btn">← Về trang danh sách</Link>
        <button className="btn btn-danger" onClick={() => void onDeleteProduct()}>Xóa sản phẩm</button>
      </div>
    </div>
  );
}
