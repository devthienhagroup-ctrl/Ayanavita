import React, { useEffect } from "react";

export function Modal({
  open,
  onClose,
  title,
  subTitle,
  children,
  maxWidthClass = "max-w-3xl",
  zIndexClass = "z-[80]",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  subTitle?: string;
  children: React.ReactNode;
  maxWidthClass?: string;
  zIndexClass?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/60 ${zIndexClass} flex items-center justify-center p-4`}
      onMouseDown={(e) => {
        // close when click backdrop
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`card w-full ${maxWidthClass} overflow-hidden`}>
        {(title || subTitle) ? (
          <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-3">
            <div>
              {subTitle ? <div className="text-xs font-extrabold text-slate-500">{subTitle}</div> : null}
              {title ? <div className="text-lg font-extrabold">{title}</div> : null}
            </div>
            <button className="btn w-11 h-11 p-0" type="button" onClick={onClose} aria-label="Close">
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        ) : null}

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
