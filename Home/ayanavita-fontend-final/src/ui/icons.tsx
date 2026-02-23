// src/ui/icons.tsx
import React from "react";

function IconBase({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className ?? "h-5 w-5"}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconArrowLeft({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M15 18l-6-6 6-6" />
    </IconBase>
  );
}

export function IconArrowRight({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M9 18l6-6-6-6" />
    </IconBase>
  );
}

export function IconPlay({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M8 5v14l11-7z" />
    </IconBase>
  );
}

export function IconCheck({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M20 6L9 17l-5-5" />
    </IconBase>
  );
}

export function IconLock({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M7 11V8a5 5 0 0 1 10 0v3" />
      <rect x="5" y="11" width="14" height="10" rx="2" />
    </IconBase>
  );
}

export function IconInfo({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </IconBase>
  );
}

export function IconRefresh({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v6h-6" />
    </IconBase>
  );
}
