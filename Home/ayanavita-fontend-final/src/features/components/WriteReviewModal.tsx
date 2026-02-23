import React from "react";
import { Button, Card, SubTitle } from "../../../ui/ui";
import type { ReviewCategory } from "../reviews.types";
import { StarPicker } from "./Stars";

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

export function WriteReviewModal({
  open,
  onClose,
  form,
  setForm,
  onDemo,
  onSubmit,
  onFileChange,
}: {
  open: boolean;
  onClose: () => void;

  form: {
    name: string;
    cat: ReviewCategory;
    item: string;
    branch: string;
    text: string;
    verified: boolean;
    anonymous: boolean;
    stars: number;
    imgPreview: string;
  };
  setForm: (updater: (prev: any) => any) => void;

  onDemo: () => void;
  onSubmit: () => void;
  onFileChange: (file?: File) => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
            <div>
              <SubTitle>Write</SubTitle>
              <div className="text-lg font-extrabold">Viết đánh giá</div>
            </div>
            <Button variant="ghost" onClick={onClose}>
              Đóng
            </Button>
          </div>

          <div className="p-6 grid gap-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <div className="text-sm font-extrabold text-slate-700">Họ và tên</div>
                <div className="mt-2">
                  <Input value={form.name} onChange={(v) => setForm((p: any) => ({ ...p, name: v }))} placeholder="Nguyễn Văn A" />
                </div>
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-700">Danh mục</div>
                <div className="mt-2">
                  <Select value={form.cat} onChange={(v) => setForm((p: any) => ({ ...p, cat: v as ReviewCategory }))}>
                    <option value="service">Dịch vụ</option>
                    <option value="product">Sản phẩm</option>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <div className="text-sm font-extrabold text-slate-700">Tên dịch vụ/sản phẩm</div>
                <div className="mt-2">
                  <Input value={form.item} onChange={(v) => setForm((p: any) => ({ ...p, item: v }))} placeholder="VD: Facial Luxury, Serum AYA..." />
                </div>
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-700">Chi nhánh (tuỳ chọn)</div>
                <div className="mt-2">
                  <Input value={form.branch} onChange={(v) => setForm((p: any) => ({ ...p, branch: v }))} placeholder="VD: Q.1 / Hà Nội..." />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="text-sm font-extrabold text-slate-700">Chấm sao</div>
              <StarPicker value={form.stars} onChange={(v) => setForm((p: any) => ({ ...p, stars: v }))} />
              <div className="text-sm text-slate-600 mt-1">Chọn 1–5 sao.</div>
            </div>

            <div>
              <div className="text-sm font-extrabold text-slate-700">Nội dung đánh giá</div>
              <textarea
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-400"
                rows={4}
                value={form.text}
                onChange={(e) => setForm((p: any) => ({ ...p, text: e.target.value }))}
                placeholder="Chia sẻ trải nghiệm..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3 items-start">
              <div>
                <div className="text-sm font-extrabold text-slate-700">Ảnh minh hoạ (demo)</div>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  onChange={(e) => onFileChange(e.target.files?.[0])}
                />
                <div className="text-xs text-slate-500 mt-2">Ảnh chỉ preview trong trình duyệt, không upload server.</div>
              </div>

              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <div className="text-sm font-extrabold">Preview ảnh</div>
                <div className="mt-3 overflow-hidden rounded-2xl ring-1 ring-slate-200">
                  <img alt="preview" className="w-full h-40 object-cover" src={form.imgPreview} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold">
                <input
                  type="checkbox"
                  checked={form.verified}
                  onChange={(e) => setForm((p: any) => ({ ...p, verified: e.target.checked }))}
                />
                Đã xác thực (demo)
              </label>
              <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold">
                <input
                  type="checkbox"
                  checked={form.anonymous}
                  onChange={(e) => setForm((p: any) => ({ ...p, anonymous: e.target.checked }))}
                />
                Ẩn danh
              </label>
            </div>

            <div className="flex gap-2">
              <Button tone="accent" variant="solid" className="flex-1" onClick={onDemo}>
                Demo
              </Button>
              <Button tone="brand" variant="solid" className="flex-1" onClick={onSubmit}>
                Gửi
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
