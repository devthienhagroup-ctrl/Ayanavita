import { api } from "../lib/http";
import {
  LANGUAGES,
  type LanguageCode,
  type ProductAdminItem,
  type ProductAttribute,
  type ProductCategory,
  type ProductIngredient,
  type ProductTranslation,
} from "../types/productAdmin";

const uid = () => Math.random().toString(36).slice(2, 10);

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") || `item-${uid()}`;

const ensureTranslations = (
  rows: Array<{ languageCode: string; name?: string; shortDescription?: string; description?: string }> = [],
): ProductTranslation[] =>
  LANGUAGES.map((lang) => {
    const found = rows.find((item) => item.languageCode === lang.code);
    return {
      lang: lang.code,
      name: found?.name || "",
      shortDescription: found?.shortDescription || "",
      description: found?.description || "",
    };
  });

const pickName = (rows: Array<{ languageCode: string; name?: string }> = []) => {
  const vi = rows.find((item) => item.languageCode === "vi")?.name;
  return vi || rows[0]?.name || "";
};

type ApiCategory = {
  id: string | number;
  translations?: Array<{ languageCode: string; name: string; description?: string }>;
};

type ApiAttributeKey = {
  id: string | number;
  code: string;
  translations?: Array<{ languageCode: string; displayName: string }>;
};

type ApiIngredientKey = {
  id: string | number;
  code: string;
  translations?: Array<{ languageCode: string; displayName: string }>;
};

const loadAttributeKeys = async (): Promise<Record<string, ApiAttributeKey>> => {
  const rows = await api<ApiAttributeKey[]>("/catalog/attributes");
  return Object.fromEntries(rows.map((item) => [String(item.id), item]));
};

const loadIngredientKeys = async (): Promise<Record<string, ApiIngredientKey>> => {
  const rows = await api<ApiIngredientKey[]>("/catalog/ingredients");
  return Object.fromEntries(rows.map((item) => [String(item.id), item]));
};

const mapCategory = (item: ApiCategory): ProductCategory => ({
  id: String(item.id),
  name: pickName(item.translations),
  description: item.translations?.find((row) => row.languageCode === "vi")?.description || "",
});

type ApiProduct = {
  id: string | number;
  sku: string;
  categoryId?: string | number | null;
  price: number;
  status?: string;
  stock?: number;
  updatedAt?: string;
  translations?: Array<{ languageCode: string; name: string; shortDescription?: string; description?: string }>;
  attributes?: Array<{ id: string | number; attributeKeyId: string | number; valueText?: string; valueNumber?: number }>;
  ingredients?: Array<{ id: string | number; ingredientKeyId: string | number; note?: string; value?: string }>;
};

const mapProduct = (
  item: ApiProduct,
  ingredientKeys: Record<string, ApiIngredientKey> = {},
  attributeKeys: Record<string, ApiAttributeKey> = {},
): ProductAdminItem => ({
  id: String(item.id),
  sku: item.sku,
  categoryId: item.categoryId ? String(item.categoryId) : "",
  price: Number(item.price || 0),
  stock: Number(item.stock || 0),
  status: item.status === "active" ? "active" : "draft",
  translations: ensureTranslations(item.translations),
  ingredients: (item.ingredients || []).map((row) => ({
    id: String(row.id),
    name:
      ingredientKeys[String(row.ingredientKeyId)]?.translations?.find((x) => x.languageCode === "vi")?.displayName ||
      ingredientKeys[String(row.ingredientKeyId)]?.code ||
      "",
    note: row.note || row.value || "",
  })),
  attributes: (item.attributes || []).map((row) => ({
    id: String(row.id),
    key:
      attributeKeys[String(row.attributeKeyId)]?.translations?.find((x) => x.languageCode === "vi")?.displayName ||
      attributeKeys[String(row.attributeKeyId)]?.code ||
      "",
    value: row.valueText || String(row.valueNumber ?? ""),
  })),
  updatedAt: item.updatedAt || new Date().toISOString(),
});

const toProductPayload = (item: ProductAdminItem) => ({
  sku: item.sku,
  categoryId: item.categoryId ? Number(item.categoryId) : null,
  price: Number(item.price || 0),
  status: item.status,
  translations: item.translations.map((row) => ({
    languageCode: row.lang,
    name: row.name || "",
    slug: slugify(row.name || `${item.sku}-${row.lang}`),
    shortDescription: row.shortDescription || "",
    description: row.description || "",
  })),
});

export async function fetchAdminProducts(): Promise<ProductAdminItem[]> {
  const [products, ingredientKeys, attributeKeys] = await Promise.all([
    api<ApiProduct[]>("/catalog/products"),
    loadIngredientKeys(),
    loadAttributeKeys(),
  ]);
  return products.map((item) => mapProduct(item, ingredientKeys, attributeKeys));
}

export async function fetchAdminProductById(id: string): Promise<ProductAdminItem | null> {
  try {
    const [item, ingredientKeys, attributeKeys] = await Promise.all([
      api<ApiProduct>(`/catalog/products/${id}`),
      loadIngredientKeys(),
      loadAttributeKeys(),
    ]);
    return mapProduct(item, ingredientKeys, attributeKeys);
  } catch {
    return null;
  }
}

export async function createAdminProduct(): Promise<ProductAdminItem> {
  const payload = {
    sku: `AYA-${uid().toUpperCase()}`,
    price: 0,
    status: "draft",
    translations: LANGUAGES.map((lang) => ({
      languageCode: lang.code,
      name: "",
      slug: `new-${lang.code}-${uid()}`,
      shortDescription: "",
      description: "",
    })),
  };
  const created = await api<ApiProduct>("/catalog/products", { method: "POST", body: JSON.stringify(payload) });
  return mapProduct(created);
}

export async function updateAdminProduct(item: ProductAdminItem): Promise<ProductAdminItem> {
  const product = await api<ApiProduct>(`/catalog/products/${item.id}`, {
    method: "PATCH",
    body: JSON.stringify(toProductPayload(item)),
  });

  const ingredientKeysByCode = await api<ApiIngredientKey[]>("/catalog/ingredients");
  const ingredientKeyMap = new Map(ingredientKeysByCode.map((k) => [k.code.toLowerCase(), k]));
  const ingredientItems: Array<{ ingredientKeyId: number; note: string; value: string; sortOrder: number }> = [];
  for (const [idx, ingredient] of item.ingredients.entries()) {
    const code = slugify(ingredient.name || `ingredient-${idx}`);
    let key = ingredientKeyMap.get(code);
    if (!key) {
      key = await api<ApiIngredientKey>("/catalog/ingredients", {
        method: "POST",
        body: JSON.stringify({
          code,
          translations: LANGUAGES.map((lang) => ({ languageCode: lang.code, displayName: ingredient.name || code })),
        }),
      });
      ingredientKeyMap.set(code, key);
    }
    ingredientItems.push({ ingredientKeyId: Number(key.id), note: ingredient.note || "", value: ingredient.note || "", sortOrder: idx });
  }

  const attributeKeysByCode = await api<ApiAttributeKey[]>("/catalog/attributes");
  const attributeKeyMap = new Map(attributeKeysByCode.map((k) => [k.code.toLowerCase(), k]));
  const attributeItems: Array<{ attributeKeyId: number; valueText: string }> = [];
  for (const attribute of item.attributes) {
    const code = slugify(attribute.key || "attribute");
    let key = attributeKeyMap.get(code);
    if (!key) {
      key = await api<ApiAttributeKey>("/catalog/attributes", {
        method: "POST",
        body: JSON.stringify({
          code,
          valueType: "text",
          translations: LANGUAGES.map((lang) => ({ languageCode: lang.code, displayName: attribute.key || code })),
        }),
      });
      attributeKeyMap.set(code, key);
    }
    attributeItems.push({ attributeKeyId: Number(key.id), valueText: attribute.value || "" });
  }

  await api(`/catalog/products/${item.id}/ingredients`, {
    method: "PATCH",
    body: JSON.stringify({ items: ingredientItems }),
  });

  await api(`/catalog/products/${item.id}/attributes`, {
    method: "PATCH",
    body: JSON.stringify({ items: attributeItems }),
  });

  const ingredientKeys = Object.fromEntries(Array.from(ingredientKeyMap.values()).map((v) => [String(v.id), v]));
  const attributeKeys = Object.fromEntries(Array.from(attributeKeyMap.values()).map((v) => [String(v.id), v]));
  return mapProduct(product, ingredientKeys, attributeKeys);
}

export async function fetchAdminCategories(): Promise<ProductCategory[]> {
  const rows = await api<ApiCategory[]>("/catalog/categories");
  return rows.map(mapCategory);
}

export async function createAdminCategory(name: string, description: string): Promise<ProductCategory> {
  const created = await api<ApiCategory>("/catalog/categories", {
    method: "POST",
    body: JSON.stringify({
      status: "active",
      translations: LANGUAGES.map((lang) => ({
        languageCode: lang.code,
        name,
        slug: slugify(`${name}-${lang.code}`),
        description,
      })),
    }),
  });
  return mapCategory(created);
}

export async function updateAdminCategory(category: ProductCategory): Promise<ProductCategory> {
  const updated = await api<ApiCategory>(`/catalog/categories/${category.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      translations: LANGUAGES.map((lang) => ({
        languageCode: lang.code,
        name: category.name,
        slug: slugify(`${category.name}-${lang.code}`),
        description: category.description || "",
      })),
    }),
  });
  return mapCategory(updated);
}

export async function deleteAdminCategory(categoryId: string): Promise<void> {
  await api(`/catalog/categories/${categoryId}`, { method: "DELETE" });
}

export function upsertTranslation(
  translations: ProductTranslation[],
  lang: LanguageCode,
  patch: Partial<ProductTranslation>,
): ProductTranslation[] {
  const existing = translations.find((item) => item.lang === lang);
  if (!existing) {
    return [...translations, { lang, name: "", shortDescription: "", description: "", ...patch }];
  }
  return translations.map((item) => (item.lang === lang ? { ...item, ...patch } : item));
}

export const createIngredient = (): ProductIngredient => ({ id: uid(), name: "", note: "" });
export const createAttribute = (): ProductAttribute => ({ id: uid(), key: "", value: "" });
