// src/components/home/RegisterSection.tsx
import React, { useMemo, useState } from "react";

export type RegisterPayload = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  interest?: string;
};

export type RegisterSectionProps = {
  /** gọi khi đăng ký thành công (prototype) */
  onRegisterSuccess?: () => void;

  /** nếu bạn muốn tự handle submit: nhận payload, return void/Promise */
  onSubmit?: (payload: RegisterPayload) => void | Promise<void>;
};

export const RegisterSection: React.FC<RegisterSectionProps> = ({
  onRegisterSuccess,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    interest: "",
    terms: false,
  });

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

    if (!form.fullName.trim()) e.fullName = "Vui lòng nhập họ tên";
    if (!phoneRegex.test(form.phone.replace(/\s/g, ""))) e.phone = "Số điện thoại không hợp lệ";
    if (!emailRegex.test(form.email)) e.email = "Email không hợp lệ";
    if (form.password.length < 8) e.password = "Mật khẩu phải có ít nhất 8 ký tự";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Mật khẩu không khớp";
    if (!form.terms) e.terms = "Vui lòng đồng ý Điều khoản";
    return e;
  }, [form]);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (Object.keys(errors).length) {
      window.alert("Form chưa hợp lệ. Kiểm tra các trường bắt buộc.");
      return;
    }

    const payload: RegisterPayload = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      password: form.password,
      interest: form.interest || undefined,
    };

    try {
      if (onSubmit) await onSubmit(payload);
      // prototype default behavior
      if (!onSubmit) window.alert("Đăng ký thành công (prototype). Sau này nối API.");
      onRegisterSuccess?.();
    } catch (err: any) {
      window.alert(err?.message ?? "Đăng ký thất bại");
    }
  };

  return (
    <section id="register" className="w-full py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-xl">
          <div className="grid md:grid-cols-2">
            <div className="p-10 text-white">
              <h2 className="text-3xl font-extrabold">Đăng ký thành viên AYANAVITA</h2>
              <p className="mt-4 text-white/90">Nhận ưu đãi đặc biệt khi đăng ký tài khoản mới:</p>
              <ul className="mt-6 space-y-3 text-white/95">
                <li className="flex items-center gap-2"><i className="fa-regular fa-circle-check"></i> Truy cập miễn phí
                  3 khóa học cơ bản
                </li>
                <li className="flex items-center gap-2"><i className="fa-regular fa-circle-check"></i> Giảm 20% cho khóa
                  học đầu tiên
                </li>
                <li className="flex items-center gap-2"><i className="fa-regular fa-circle-check"></i> Lộ trình học tập cá nhân hóa</li>
                <li className="flex items-center gap-2"><i className="fa-regular fa-circle-check"></i> Cộng đồng học viên VIP</li>
              </ul>

              <div className="mt-8 rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
                <div className="text-sm font-medium">Ưu đãi có hiệu lực trong:</div>
                <div className="mt-2 flex gap-2">
                  {[
                    { v: "03", l: "Ngày" },
                    { v: "15", l: "Giờ" },
                    { v: "42", l: "Phút" },
                  ].map((x) => (
                    <div
                      key={x.l}
                      className="rounded-lg bg-white/15 px-3 py-2 text-center ring-1 ring-white/10"
                    >
                      <div className="text-xl font-extrabold">{x.v}</div>
                      <div className="text-xs">{x.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-10">
              <h3 className="text-2xl font-extrabold text-slate-900">Điền thông tin đăng ký</h3>

              <form className="mt-6" onSubmit={submit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Họ và tên *</label>
                    <input
                      className={`mt-2 w-full rounded-2xl border px-4 py-3 outline-none ring-indigo-100 focus:ring-4 ${
                        errors.fullName ? "border-red-400" : "border-slate-200"
                      }`}
                      value={form.fullName}
                      onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))}
                      placeholder="Nguyễn Văn A"
                    />
                    {errors.fullName ? <div className="mt-1 text-xs text-red-500">{errors.fullName}</div> : null}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">Số điện thoại *</label>
                    <input
                      className={`mt-2 w-full rounded-2xl border px-4 py-3 outline-none ring-indigo-100 focus:ring-4 ${
                        errors.phone ? "border-red-400" : "border-slate-200"
                      }`}
                      value={form.phone}
                      onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                      placeholder="0912 345 678"
                    />
                    {errors.phone ? <div className="mt-1 text-xs text-red-500">{errors.phone}</div> : null}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-semibold text-slate-700">Email *</label>
                  <input
                    className={`mt-2 w-full rounded-2xl border px-4 py-3 outline-none ring-indigo-100 focus:ring-4 ${
                      errors.email ? "border-red-400" : "border-slate-200"
                    }`}
                    value={form.email}
                    onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                  {errors.email ? <div className="mt-1 text-xs text-red-500">{errors.email}</div> : null}
                </div>

                <div className="mt-4">
                  <label className="text-sm font-semibold text-slate-700">Mật khẩu *</label>
                  <input
                    type="password"
                    className={`mt-2 w-full rounded-2xl border px-4 py-3 outline-none ring-indigo-100 focus:ring-4 ${
                      errors.password ? "border-red-400" : "border-slate-200"
                    }`}
                    value={form.password}
                    onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                    placeholder="Ít nhất 8 ký tự"
                  />
                  {errors.password ? <div className="mt-1 text-xs text-red-500">{errors.password}</div> : null}
                </div>

                <div className="mt-4">
                  <label className="text-sm font-semibold text-slate-700">Xác nhận mật khẩu *</label>
                  <input
                    type="password"
                    className={`mt-2 w-full rounded-2xl border px-4 py-3 outline-none ring-indigo-100 focus:ring-4 ${
                      errors.confirmPassword ? "border-red-400" : "border-slate-200"
                    }`}
                    value={form.confirmPassword}
                    onChange={(e) => setForm((s) => ({ ...s, confirmPassword: e.target.value }))}
                    placeholder="Nhập lại mật khẩu"
                  />
                  {errors.confirmPassword ? (
                    <div className="mt-1 text-xs text-red-500">{errors.confirmPassword}</div>
                  ) : null}
                </div>

                <div className="mt-4">
                  <label className="text-sm font-semibold text-slate-700">Bạn quan tâm lĩnh vực nào?</label>
                  <select
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-indigo-100 focus:ring-4"
                    value={form.interest}
                    onChange={(e) => setForm((s) => ({ ...s, interest: e.target.value }))}
                  >
                    <option value="">Chọn lĩnh vực quan tâm</option>
                    <option value="tech">Công nghệ thông tin</option>
                    <option value="business">Kinh doanh & Marketing</option>
                    <option value="design">Thiết kế & Sáng tạo</option>
                    <option value="language">Ngoại ngữ</option>
                    <option value="softskills">Kỹ năng mềm</option>
                  </select>
                </div>

                <label className="mt-5 flex items-start gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                    checked={form.terms}
                    onChange={(e) => setForm((s) => ({ ...s, terms: e.target.checked }))}
                  />
                  <span>
                    Tôi đồng ý với <span className="font-semibold text-indigo-600">Điều khoản</span> và{" "}
                    <span className="font-semibold text-indigo-600">Chính sách bảo mật</span>
                  </span>
                </label>
                {errors.terms ? <div className="mt-1 text-xs text-red-500">{errors.terms}</div> : null}

                <button
                  type="submit"
                  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-300 py-4 font-extrabold text-slate-900 shadow hover:opacity-95"
                >
                  Đăng ký tài khoản miễn phí
                </button>

                <div className="mt-4 text-sm text-slate-600">
                  Đã có tài khoản?{" "}
                  <a href="#top" className="font-semibold text-indigo-600 hover:underline">
                    Đăng nhập
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
