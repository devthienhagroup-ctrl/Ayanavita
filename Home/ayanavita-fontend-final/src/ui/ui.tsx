// src/ui/ui.tsx
import React, { type CSSProperties, HTMLAttributes, type ReactNode, useMemo, useState } from "react";

export const theme = {
  colors: {
    brand1: "#4F46E5",
    brand2: "#7C3AED",
    accent1: "#F59E0B",
    accent2: "#FBBF24",
    ink: "#0B1220",
  },
  radius: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export type Tone = "brand" | "accent" | "success" | "warning" | "danger" | "muted";
export type Variant = "solid" | "ghost" | "soft";

export function AppShell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("min-h-screen bg-slate-50 text-slate-900", className)}>{children}</div>;
}

export function Container({
  children,
  className,
  size = "7xl",
}: {
  children: ReactNode;
  className?: string;
  size?: "6xl" | "7xl";
}) {
  const max = size === "6xl" ? "max-w-6xl" : "max-w-7xl";
  return <div className={cn("mx-auto w-full px-4", max, className)}>{children}</div>;
}

export function Card({
  children,
  className,
  style,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(
        "relative rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(2,6,23,0.06)]",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}


export function Hr({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-slate-200", className)} />;
}

export function Title({ children, className }: { children: ReactNode; className?: string }) {
  return <h1 className={cn("text-2xl sm:text-3xl font-extrabold tracking-tight", className)}>{children}</h1>;
}

export function SubTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("text-sm font-extrabold text-slate-500", className)}>{children}</div>;
}

export function Muted({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("text-sm text-slate-500", className)}>{children}</span>;
}

function badgeClass(tone: Tone) {
  switch (tone) {
    case "brand":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";
    case "accent":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "warning":
      return "border-orange-200 bg-orange-50 text-orange-800";
    case "danger":
      return "border-rose-200 bg-rose-50 text-rose-800";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-extrabold",
        badgeClass(tone),
        className
      )}
    >
      {children}
    </span>
  );
}

function buttonClass(variant: Variant, tone: Tone) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 font-extrabold transition focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed";

  const ring =
    tone === "brand"
      ? "focus:ring-indigo-500/15"
      : tone === "accent"
      ? "focus:ring-amber-500/15"
      : "focus:ring-slate-500/10";

  if (variant === "ghost") {
    return cn(base, ring, "border border-slate-200 bg-white hover:bg-slate-50 text-slate-900");
  }

  if (variant === "soft") {
    if (tone === "brand")
      return cn(base, ring, "border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100/70");
    if (tone === "accent")
      return cn(base, ring, "border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100/70");
    return cn(base, ring, "border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100/70");
  }

  // solid
  if (tone === "brand")
    return cn(
      base,
      ring,
      "border border-white/10 text-white shadow-[0_12px_24px_rgba(79,70,229,0.22)]",
      "bg-[linear-gradient(135deg,#4F46E5,#7C3AED)] hover:brightness-[1.04]"
    );

  if (tone === "accent")
    return cn(
      base,
      ring,
      "border border-slate-900/10 text-slate-900 shadow-[0_12px_24px_rgba(245,158,11,0.18)]",
      "bg-[linear-gradient(135deg,#F59E0B,#FBBF24)] hover:brightness-[1.02]"
    );

  return cn(base, ring, "border border-slate-200 bg-slate-900 text-white hover:bg-slate-800");
}

// ✅ FIX: cho phép onClick nhận event (để dùng onClick={(e)=>...} không lỗi TS)
// vẫn tương thích onClick={() => ...} vì tham số là optional
export type ButtonOnClick = (e?: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;

export function Button({
  children,
  onClick,
  disabled,
  variant = "ghost",
  tone = "muted",
  type = "button",
  className,
  title,
  style,
}: {
  children: ReactNode;
  onClick?: ButtonOnClick;
  disabled?: boolean;
  variant?: Variant;
  tone?: Tone;
  type?: "button" | "submit" | "reset";
  className?: string;
  title?: string;
  style?: CSSProperties;
}) {
  const [loading, setLoading] = useState(false);

  const isDisabled = !!disabled || loading;

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onClick) return;

    try {
      const r = onClick(e);
      if (r && typeof (r as any).then === "function") {
        setLoading(true);
        await r;
      }
    } finally {
      setLoading(false);
    }
  };

  const cls = useMemo(() => cn(buttonClass(variant, tone), className), [variant, tone, className]);

  return (
    <button type={type} className={cls} onClick={handleClick} disabled={isDisabled} title={title} style={style}>
      {children}
    </button>
  );
}

/**
 * Tooltip tối giản: wrap children và dùng title attribute.
 * (Sau này muốn fancy thì thay bằng popover)
 */
export function Tooltip({
  content,
  children,
  className,
}: {
  content: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex", className)} title={content}>
      {children}
    </span>
  );
}
