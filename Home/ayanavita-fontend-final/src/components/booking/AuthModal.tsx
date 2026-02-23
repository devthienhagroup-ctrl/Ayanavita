// src/components/booking/AuthModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { AuthUser } from "../../services/auth.storage";
import { getAuth, setAuth } from "../../services/auth.storage";

type Mode = "login" | "register";

export function AuthModal({
  open,
  onClose,
  onAuthed,
  toast,
}: {
  open: boolean;
  onClose: () => void;
  onAuthed: (u: AuthUser | null) => void;
  toast: (t: string, d?: string) => void;
}) {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    if (!open) return;
    setMode("login");
    setName("");
    setEmail("");
    setPass("");
    setRemember(true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const title = mode === "login" ? "Đăng nhập" : "Đăng ký";
  const switchText = mode === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?";
  const switchBtn = mode === "login" ? "Đăng ký" : "Đăng nhập";

  const submit = () => {
    const e = email.trim();
    const p = pass.trim();
    const n = name.trim();

    if (!e || !p) return toast("Thiếu thông tin", "Vui lòng nhập email và mật khẩu.");
    if (mode === "register" && !n) return toast("Thiếu thông tin", "Vui lòng nhập họ và tên.");

    const existing = getAuth();
    const user: AuthUser = {
      email: e,
      name: mode === "register" ? n : existing?.name || "Khách hàng",
      remember,
    };

    if (remember) setAuth(user);
    onAuthed(user);
    toast("Thành công", mode === "login" ? "Đăng nhập (demo)." : "Đăng ký (demo).");
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden="false"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <div className="text-xs font-extrabold text-slate-500">AYANAVITA</div>
            <div className="text-lg font-extrabold">{title}</div>
          </div>
          <button className="h-10 w-10 rounded-2xl border border-slate-200 bg-white font-extrabold" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="grid gap-4 p-6">
          <div className="grid gap-3 md:grid-cols-2">
            {mode === "register" ? (
              <div>
                <label className="text-sm font-extrabold text-slate-700">Họ và tên</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-100"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            ) : null}

            <div className={mode === "register" ? "md:col-span-2" : "md:col-span-2"}>
              <label className="text-sm font-extrabold text-slate-700">Email</label>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-100"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-extrabold text-slate-700">Mật khẩu</label>
              <input
                type="password"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-100"
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Ghi nhớ đăng nhập (prototype – lưu localStorage)
          </label>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              {switchText}
              <button
                type="button"
                className="ml-1 font-extrabold text-indigo-600 hover:underline"
                onClick={() => setMode((m) => (m === "login" ? "register" : "login"))}
              >
                {switchBtn}
              </button>
            </div>
            <button
              type="button"
              className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-3 text-sm font-extrabold text-white ring-1 ring-indigo-200 hover:opacity-95"
              onClick={submit}
            >
              Tiếp tục
            </button>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-700">
            Gợi ý: nhấn <span className="rounded-xl bg-slate-900 px-2 py-0.5 text-xs font-extrabold text-white">Esc</span>{" "}
            để đóng modal.
          </div>
        </div>
      </div>
    </div>
  );
}
