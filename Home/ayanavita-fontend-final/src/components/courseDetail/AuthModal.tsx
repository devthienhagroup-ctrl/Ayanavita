// src/components/courseDetail/AuthModal.tsx
import React, { useMemo, useState } from "react";
import { useEscapeKey, useScrollLock } from "../../hooks/useUiGuards";

export type DemoUser = { name: string; email: string; remember: boolean };
export type AuthMode = "login" | "register";

const AUTH_KEY = "aya_lms_auth_v1";

export function readSavedAuth(): DemoUser | null {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
  } catch {
    return null;
  }
}
export function writeSavedAuth(u: DemoUser | null) {
  if (!u) localStorage.removeItem(AUTH_KEY);
  else localStorage.setItem(AUTH_KEY, JSON.stringify(u));
}

export function AuthModal({
  open,
  mode,
  onClose,
  onModeChange,
  onSubmit,
}: {
  open: boolean;
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (m: AuthMode) => void;
  onSubmit: (u: DemoUser) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(true);

  const title = useMemo(() => (mode === "login" ? "Đăng nhập" : "Đăng ký"), [mode]);

  useScrollLock(open);
  useEscapeKey(onClose, open);

  if (!open) return null;

  const isRegister = mode === "register";

  function submit() {
    const e = email.trim();
    const p = pass.trim();
    const n = name.trim();

    if (!e || !p) {
      window.alert("Vui lòng nhập email và mật khẩu");
      return;
    }
    if (isRegister && !n) {
      window.alert("Vui lòng nhập họ và tên");
      return;
    }

    const user: DemoUser = {
      email: e,
      name: isRegister ? n : (readSavedAuth()?.name || "Admin"),
      remember,
    };

    if (user.remember) writeSavedAuth(user);
    onSubmit(user);
    onClose();
    window.alert(`Đã ${isRegister ? "đăng ký" : "đăng nhập"} (prototype).`);
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/55"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden={!open}
    >
      <div className="card w-full max-w-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-extrabold text-slate-500">AYANAVITA</div>
            <div className="text-lg font-extrabold">{title}</div>
          </div>
          <button className="btn h-10 w-10 p-0" onClick={onClose} type="button" aria-label="close">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="p-6 grid gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            {isRegister ? (
              <div className="md:col-span-2">
                <label className="text-sm font-extrabold text-slate-700">Họ và tên</label>
                <input className="field mt-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" />
              </div>
            ) : null}

            <div className="md:col-span-2">
              <label className="text-sm font-extrabold text-slate-700">Email</label>
              <input className="field mt-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-extrabold text-slate-700">Mật khẩu</label>
              <input
                type="password"
                className="field mt-2"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className="text-sm text-slate-600">Ghi nhớ đăng nhập (prototype – lưu localStorage)</span>
          </label>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
              <button
                className="ml-1 text-indigo-600 font-extrabold hover:underline"
                type="button"
                onClick={() => onModeChange(isRegister ? "login" : "register")}
              >
                {isRegister ? "Đăng nhập" : "Đăng ký"}
              </button>
            </div>
            <button className="btn btn-primary" type="button" onClick={submit}>
              Tiếp tục
            </button>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-700">
            Gợi ý: nhấn <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-white text-xs font-extrabold">Esc</span> để đóng modal.
          </div>
        </div>
      </div>
    </div>
  );
}
