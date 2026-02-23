// src/components/home/ContactSection.tsx
import React, { useState } from "react";

export type ContactLead = {
  name: string;
  phone: string;
  email: string;
  need: string;
  note: string;
};

export type ContactSectionProps = {
  /** bạn truyền onSubmit từ HomePage -> component sẽ gọi khi submit */
  onSubmit?: (lead: ContactLead) => void | Promise<void>;
};

export const ContactSection: React.FC<ContactSectionProps> = ({ onSubmit }) => {
  const [lead, setLead] = useState<ContactLead>({
    name: "",
    phone: "",
    email: "",
    need: "",
    note: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (onSubmit) await onSubmit(lead);
      if (!onSubmit) window.alert("Đã nhận yêu cầu tư vấn (prototype). Sau này nối API lưu lead.");
    } catch (err: any) {
      window.alert(err?.message ?? "Gửi yêu cầu thất bại");
    }
  };

  return (
    <section id="contact" className="w-full pb-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 ring-1 ring-slate-200 shadow-sm">
            <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <div className="text-xs font-semibold text-slate-500">Địa chỉ</div>
              <div className="mt-1 font-extrabold text-slate-900">AYANAVITA – Trung tâm đào tạo</div>
              <div className="mt-1 text-sm text-slate-700">Số 123, Đường ABC, Quận 1, TP.HCM</div>

              <div className="mt-4 grid gap-2 text-sm text-slate-700">
                <div className="flex items-center gap-2"><i className="fa-solid fa-phone"></i>
                  <span>(028) 1234 5678</span></div>
                <div className="flex items-center gap-2"><i className="fa-solid fa-envelope"></i>
                  <span>support@ayanavita.vn</span></div>
                <div className="flex items-center gap-2"><i className="fa-solid fa-business-time"></i> <span>8:00 – 18:00 (T2 – T7)</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm font-semibold text-slate-900">Gửi yêu cầu tư vấn</div>
              <p className="mt-1 text-sm text-slate-600">Prototype UI: sau này nối API lưu lead vào DB/CRM.</p>

              <form className="mt-4 grid gap-3" onSubmit={submit}>
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-indigo-100 focus:ring-4"
                    placeholder="Họ tên"
                    value={lead.name}
                    onChange={(e) => setLead((s) => ({ ...s, name: e.target.value }))}
                  />
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-indigo-100 focus:ring-4"
                    placeholder="Số điện thoại"
                    value={lead.phone}
                    onChange={(e) => setLead((s) => ({ ...s, phone: e.target.value }))}
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-indigo-100 focus:ring-4"
                    placeholder="Email"
                    value={lead.email}
                    onChange={(e) => setLead((s) => ({ ...s, email: e.target.value }))}
                  />
                  <select
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-indigo-100 focus:ring-4"
                    value={lead.need}
                    onChange={(e) => setLead((s) => ({ ...s, need: e.target.value }))}
                  >
                    <option value="">Nhu cầu</option>
                    <option>Triển khai LMS bán khóa học</option>
                    <option>Thiết kế Landing + Catalog + Checkout</option>
                    <option>Làm App Flutter</option>
                    <option>Tư vấn Business / Doanh nghiệp</option>
                  </select>
                </div>

                <textarea
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-indigo-100 focus:ring-4"
                  style={{ minHeight: 120 }}
                  placeholder="Mô tả nhu cầu..."
                  value={lead.note}
                  onChange={(e) => setLead((s) => ({ ...s, note: e.target.value }))}
                />

                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-300 px-6 py-3 font-extrabold text-slate-900 shadow hover:opacity-95"
                >
                  Gửi yêu cầu
                </button>
              </form>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <div className="text-sm font-semibold text-slate-900">Bản đồ</div>
              <div className="text-sm text-slate-600">Vị trí AYANAVITA</div>
            </div>

            <div className="p-4">
              <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
                <iframe
                  title="AYANAVITA Map"
                  width="100%"
                  height="420"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=So%20123%20Duong%20ABC%20Quan%201%20TPHCM&output=embed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
