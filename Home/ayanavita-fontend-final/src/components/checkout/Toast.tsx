import React, { useEffect } from "react";

export function Toast({
  open,
  title,
  message,
  onClose,
  autoMs = 2800,
}: {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  autoMs?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(onClose, autoMs);
    return () => window.clearTimeout(t);
  }, [open, autoMs, onClose]);

  if (!open) return null;

  return (
    <div className="toastWrap">
      <div className="card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-extrabold">{title}</div>
            <div className="text-sm text-slate-700 mt-1">{message}</div>
          </div>
          <button className="btn w-11 h-11 p-0" type="button" onClick={onClose} aria-label="close">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      </div>
    </div>
  );
}
