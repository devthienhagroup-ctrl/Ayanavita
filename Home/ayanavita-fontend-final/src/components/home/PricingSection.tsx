import React, {useMemo, useState} from "react";

type Billing = "monthly" | "yearly";

function fmtPrice(vnd: number) {
    // đơn giản: 399000 -> "399k"
    const k = Math.round(vnd / 1000);
    return `${k}k`;
}

export function PricingSection() {
    const [billing, setBilling] = useState<Billing>("monthly");

    const prices = useMemo(() => {
        const monthly = {starter: 199_000, pro: 399_000};
        const yearly = {starter: Math.round(monthly.starter * 0.8), pro: Math.round(monthly.pro * 0.8)};
        return {monthly, yearly};
    }, []);

    const starter = billing === "monthly" ? prices.monthly.starter : prices.yearly.starter;
    const pro = billing === "monthly" ? prices.monthly.pro : prices.yearly.pro;

    return (
        <section id="pricing" className="mx-auto max-w-6xl px-4 pb-16">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                        Bảng giá AYANAVITA
                    </h2>
                    <p className="mt-2 max-w-2xl text-slate-600">
                        Chọn gói phù hợp theo quy mô vận hành và mục tiêu bán khoá học. Bạn có thể bắt đầu nhỏ
                        (Starter),
                        nâng lên Pro khi cần tăng chuyển đổi, hoặc chọn Business nếu muốn triển khai theo mô hình trung
                        tâm/doanh nghiệp.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <div
                            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 ring-1 ring-slate-200">
                            <span className="text-amber-600"><i className="fa-solid fa-shield-halved"></i></span>
                            <span className="text-sm text-slate-700"><b>Hoàn tiền 7 ngày</b> nếu không phù hợp</span>
                        </div>
                        <div
                            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 ring-1 ring-slate-200">
                            <span className="text-indigo-600"><i className="fa-solid fa-headphones"></i></span>
                            <span className="text-sm text-slate-700">Hỗ trợ triển khai <b>8:00–18:00</b></span>
                        </div>
                        <div
                            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 ring-1 ring-slate-200">
                            <span className="text-emerald-600"><i className="fa-solid fa-bolt"></i></span>
                            <span
                                className="text-sm text-slate-700">Sẵn sàng chuyển sang React/NestJS sau khi chốt UI</span>
                        </div>
                    </div>
                </div>

                {/* Billing Toggle */}
                <div className="card p-4 md:p-5">
                    <div className="text-sm font-semibold text-slate-900">Chu kỳ thanh toán</div>
                    <p className="mt-1 text-sm text-slate-600">Gói năm tiết kiệm hơn, phù hợp triển khai dài hạn.</p>

                    <div className="mt-3 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setBilling("monthly")}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                billing === "monthly"
                                    ? "bg-slate-900 text-white hover:opacity-90"
                                    : "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            Theo tháng
                        </button>

                        <button
                            type="button"
                            onClick={() => setBilling("yearly")}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                billing === "yearly"
                                    ? "bg-slate-900 text-white hover:opacity-90"
                                    : "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            Theo năm{" "}
                            <span
                                className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                -20%
              </span>
                        </button>
                    </div>

                    <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="text-xs font-semibold text-slate-500">Gợi ý chọn gói nhanh</div>
                        <ul className="mt-2 space-y-1 text-sm text-slate-700">
                            <li className="flex items-start gap-2"><span
                                className="font-bold text-amber-600">•</span> Mới bắt đầu bán khóa: <b>Starter</b></li>
                            <li className="flex items-start gap-2"><span
                                className="font-bold text-amber-600">•</span> Tăng chuyển đổi, upsell: <b>Pro</b></li>
                            <li className="flex items-start gap-2"><span
                                className="font-bold text-amber-600">•</span> Trung tâm/doanh nghiệp: <b>Business</b>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="mt-8 grid gap-4 md:grid-cols-3">
                {/* Starter */}
                <div className="card p-7 flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="text-sm font-semibold text-slate-900">Starter</div>
                            <p className="mt-1 text-sm text-slate-600">Cho cá nhân/nhóm nhỏ bắt đầu bán khóa học.</p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100">
                            <span className="text-indigo-700"><i className="fa-solid fa-seedling"></i></span>
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="flex items-end gap-2">
                            <div className="text-4xl font-extrabold text-slate-900">{fmtPrice(starter)}</div>
                            <div
                                className="pb-1 text-sm text-slate-600">{billing === "monthly" ? "/tháng" : "/tháng (năm)"}</div>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                            Tập trung vào những thứ quan trọng nhất: catalog, trang chi tiết khóa học, và trải nghiệm
                            học cơ bản.
                            Phù hợp làm prototype HTML → chốt layout → chuyển React.
                        </p>
                    </div>

                    <ul className="mt-5 space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2"><span
                            className="font-bold text-amber-600">•</span> Catalog + lọc theo danh mục
                        </li>
                        <li className="flex items-start gap-2"><span
                            className="font-bold text-amber-600">•</span> Course detail (outline + CTA)
                        </li>
                        <li className="flex items-start gap-2"><span
                            className="font-bold text-amber-600">•</span> Player video + progress cơ bản
                        </li>
                        <li className="flex items-start gap-2"><span className="font-bold text-amber-600">•</span> 1
                            admin, phân quyền cơ bản
                        </li>
                        <li className="flex items-start gap-2"><span className="font-bold text-amber-600">•</span> Hỗ
                            trợ email trong giờ hành chính
                        </li>
                    </ul>

                    <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="text-xs font-semibold text-slate-500">Phù hợp nếu</div>
                        <p className="mt-1 text-sm text-slate-700">
                            Bạn đang ở giai đoạn launch nhanh, cần landing + catalog + flow học đơn giản để bắt đầu bán.
                        </p>
                    </div>
                    <div className="mt-auto">
                        <a
                            href="#register"
                            className="mt-6 inline-flex w-full justify-center rounded-2xl btn-primary px-5 py-3 text-sm font-semibold"
                        >
                            Chọn gói Starter
                        </a>

                        <p className="mt-3 text-center text-xs text-slate-500">Có thể nâng cấp lên Pro bất kỳ lúc
                            nào.</p>
                    </div>
                </div>

                {/* Pro */}
                <div className="relative rounded-3xl p-7 shadow-lg ring-2 ring-amber-300/60 gradient-primary">
                    <div
                        className="absolute -top-3 -right-3 rounded-full px-4 py-1 text-xs font-bold text-slate-900 shadow-lg gradient-accent">
                        Phổ biến nhất
                    </div>

                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="text-sm font-semibold text-white">Pro</div>
                            <p className="mt-1 text-sm text-white/85">Tối ưu chuyển đổi, phù hợp bán khóa học nghiêm
                                túc.</p>
                        </div>
                        <div
                            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/15">
                            <span className="text-yellow-300"><i className="fa-solid fa-bolt"></i></span>
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="flex items-end gap-2">
                            <div className="text-4xl font-extrabold text-white">{fmtPrice(pro)}</div>
                            <div
                                className="pb-1 text-sm text-white/80">{billing === "monthly" ? "/tháng" : "/tháng (năm)"}</div>
                        </div>
                        <p className="mt-2 text-sm text-white/90">
                            Dành cho mô hình “bán khóa học”: tăng trust (review/proof), tối ưu CTA & checkout,
                            voucher/khuyến mãi,
                            dashboard học viên và báo cáo cơ bản để soi conversion.
                        </p>
                    </div>

                    <ul className="mt-5 space-y-2 text-sm text-white/90">
                        <li className="flex items-start gap-2"><span className="font-bold text-yellow-300">•</span> Tất
                            cả tính năng Starter
                        </li>
                        <li className="flex items-start gap-2"><span
                            className="font-bold text-yellow-300">•</span> Course detail “đẩy mua”: proof, FAQ
                        </li>
                        <li className="flex items-start gap-2"><span
                            className="font-bold text-yellow-300">•</span> Checkout + voucher/ưu đãi
                        </li>
                        <li className="flex items-start gap-2"><span
                            className="font-bold text-yellow-300">•</span> Dashboard học viên + lịch sử học
                        </li>
                        <li className="flex items-start gap-2"><span className="font-bold text-yellow-300">•</span> SEO
                            cơ bản & landing dài
                        </li>
                        <li className="flex items-start gap-2"><span
                            className="font-bold text-yellow-300">•</span> Priority support
                        </li>
                    </ul>

                    <div className="mt-6 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                        <div className="text-xs font-semibold text-white/80">Kết quả thường thấy</div>
                        <ul className="mt-2 space-y-1 text-sm text-white/90">
                            <li className="flex items-start gap-2"><span
                                className="font-bold text-yellow-300">•</span> Tăng tỷ lệ đăng ký/lead nhờ proof
                            </li>
                            <li className="flex items-start gap-2"><span
                                className="font-bold text-yellow-300">•</span> Giảm bỏ giỏ nhờ checkout ít bước
                            </li>
                            <li className="flex items-start gap-2"><span
                                className="font-bold text-yellow-300">•</span> Tăng retention nhờ progress rõ
                            </li>
                        </ul>
                    </div>

                    <a
                        href="#register"
                        className="mt-6 inline-flex w-full justify-center rounded-2xl btn-accent px-5 py-3 text-sm font-semibold"
                    >
                        Chọn gói Pro
                    </a>

                    <p className="mt-3 text-center text-xs text-white/80">Tặng bộ template landing + checklist triển
                        khai LMS.</p>
                </div>

                {/* Business */}
                <div className="card p-7">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="text-sm font-semibold text-slate-900">Business</div>
                            <p className="mt-1 text-sm text-slate-600">Cho trung tâm/doanh nghiệp cần vận hành quy
                                mô.</p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100">
                            <span className="text-emerald-700"><i className="fa-solid fa-city"></i></span>
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="text-4xl font-extrabold text-slate-900">Liên hệ</div>
                        <p className="mt-2 text-sm text-slate-600">
                            Dành cho nhu cầu tuỳ biến: nhiều giảng viên, phân quyền sâu, báo cáo/đối soát, tích hợp
                            (CRM, payment, SSO...).
                            Bạn sẽ nhận tư vấn giải pháp và báo giá theo scope.
                        </p>
                    </div>

                    <ul className="mt-5 space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2"><span className="font-bold text-amber-600">•</span> Tất
                            cả tính năng Pro
                        </li>
                        <li className="flex items-start gap-2"><span
                            className="font-bold text-amber-600">•</span> Instructor/Admin nâng cao
                        </li>
                        <li className="flex items-start gap-2"><span className="font-bold text-amber-600">•</span> RBAC
                            + audit log
                        </li>
                        <li className="flex items-start gap-2"><span className="font-bold text-amber-600">•</span> Báo
                            cáo nâng cao
                        </li>
                        <li className="flex items-start gap-2"><span className="font-bold text-amber-600">•</span> Tích
                            hợp CRM/SSO/Payment
                        </li>
                        <li className="flex items-start gap-2"><span className="font-bold text-amber-600">•</span> SLA
                            theo thỏa thuận
                        </li>
                    </ul>

                    <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="text-xs font-semibold text-slate-500">Bạn sẽ nhận được</div>
                        <ul className="mt-2 space-y-1 text-sm text-slate-700">
                            <li className="flex items-start gap-2"><span
                                className="font-bold text-amber-600">•</span> Roadmap triển khai + scope
                            </li>
                            <li className="flex items-start gap-2"><span
                                className="font-bold text-amber-600">•</span> Đề xuất kiến trúc React/NestJS/Prisma
                            </li>
                            <li className="flex items-start gap-2"><span
                                className="font-bold text-amber-600">•</span> Kế hoạch vận hành & phân quyền
                            </li>
                        </ul>
                    </div>

                    <a
                        href="#contact"
                        className="mt-6 inline-flex w-full justify-center rounded-2xl btn-primary px-5 py-3 text-sm font-semibold"
                    >
                        Nhận tư vấn Business
                    </a>
                </div>
            </div>

            {/* Feature Comparison */}
            <div className="mt-10 card p-8">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">So sánh tính năng nhanh</h3>
                        <p className="mt-1 text-sm text-slate-600">
                            Bảng dưới giúp bạn nhìn rõ khác biệt giữa các gói, tránh phải đoán khi ra quyết định.
                        </p>
                    </div>
                    <a href="#register" className="text-sm font-semibold text-indigo-600 hover:underline">
                        Đăng ký để nhận ưu đãi
                    </a>
                </div>

                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-[760px] w-full text-sm">
                        <thead>
                        <tr className="text-left text-slate-600">
                            <th className="py-3 pr-4">Tính năng</th>
                            <th className="py-3 px-3">Starter</th>
                            <th className="py-3 px-3">Pro</th>
                            <th className="py-3 pl-3">Business</th>
                        </tr>
                        </thead>
                        <tbody className="text-slate-700">
                        {[
                            ["Catalog + Search + Filter", "✓", "✓", "✓"],
                            ["Course Detail (proof + FAQ)", "Cơ bản", "✓", "✓"],
                            ["Checkout + Voucher", "—", "✓", "✓"],
                            ["Dashboard học viên", "Cơ bản", "✓", "✓"],
                            ["Admin panel + RBAC nâng cao", "—", "Giới hạn", "✓"],
                            ["Tích hợp (CRM/SSO/Payment)", "—", "Tuỳ chọn", "✓"],
                        ].map(([feat, s, p, b]) => (
                            <tr key={feat} className="border-t border-slate-200">
                                <td className="py-3 pr-4 font-medium text-slate-900">{feat}</td>
                                <td className="py-3 px-3">{s === "✓" ? <span className="text-emerald-600">✓</span> :
                                    <span className="text-slate-400">{s}</span>}</td>
                                <td className="py-3 px-3">{p === "✓" ? <span className="text-emerald-600">✓</span> :
                                    <span className="text-slate-400">{p}</span>}</td>
                                <td className="py-3 pl-3">{b === "✓" ? <span className="text-emerald-600">✓</span> :
                                    <span className="text-slate-400">{b}</span>}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm text-slate-600">
                        Bạn muốn thêm gói “Team” hoặc “Enterprise”? Có thể mở rộng tuỳ theo chiến lược kinh doanh.
                    </div>
                    <div className="flex gap-2">
                        <a href="#register" className="rounded-xl btn-accent px-5 py-3 text-sm font-semibold">Bắt đầu
                            ngay</a>
                        <a href="#contact"
                           className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50">
                            Tư vấn gói phù hợp
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
