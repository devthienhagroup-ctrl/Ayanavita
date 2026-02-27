// src/components/home/Outcomes.tsx
import React from "react";

export const Outcomes: React.FC = () => {
  const cards = [
    {
      title: "Thiết kế UI chuẩn LMS",
      items: ["Landing dài + proof + CTA", "Catalog + filter + sorting", "Course detail + outline + review"],
    },
    {
      title: "Xây luồng học tập",
      items: ["Player + danh sách bài", "Tiến độ & tiếp tục bài học", "Dashboard học viên"],
    },
    {
      title: "Luồng mua & thanh toán",
      items: ["Checkout tối giản", "Voucher/ưu đãi", "Lịch sử đơn hàng"],
    },
    {
      title: "Sẵn sàng mở rộng",
      items: ["Quiz/assignment", "Certificate", "Instructor/Admin panel"],
    },
  ];

  return (
    <section id="outcomes" className="w-full pb-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl bg-white p-8 ring-1 ring-slate-200 shadow-sm">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Học xong làm được gì?</h2>
              <p className="mt-2 text-slate-600">
                Đánh trực tiếp vào “kết quả” — yếu tố quan trọng nhất để chốt mua.
              </p>
            </div>

            <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
              {cards.map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-5 ring-1 ring-slate-200"
                >
                  <div className="font-semibold text-slate-900">{c.title}</div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {c.items.map((it) => (
                      <li key={it} className="flex items-start gap-2">
                        <span className="font-extrabold text-amber-600">•</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
