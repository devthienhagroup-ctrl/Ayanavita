import React, { useMemo, useState } from "react";
import { Modal } from "../common/Modal";

export function ReviewModal({
  open,
  onClose,
  productName,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  productName: string;
  onSubmit: (x: { name: string; stars: number; text: string }) => void;
}) {
  const [name, setName] = useState("");
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");

  const title = useMemo(() => (productName ? `Đánh giá: ${productName}` : "Viết đánh giá"), [productName]);

  function submit() {
    if (!text.trim()) {
      window.alert("Vui lòng nhập nội dung đánh giá.");
      return;
    }
    onSubmit({ name: name.trim(), stars, text: text.trim() });
    setMsg("Đã gửi đánh giá (demo). Cảm ơn bạn.");
    setTimeout(() => setMsg(""), 2000);
  }

  return (
    <Modal open={open} onClose={onClose} subTitle="Viết đánh giá" title={title} maxWidthClass="max-w-xl" zIndexClass="z-[90]">
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-extrabold text-slate-700">Tên của bạn</label>
          <input className="field mt-2" placeholder="Ví dụ: Minh Anh" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-extrabold text-slate-700">Số sao</label>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {[1,2,3,4,5].map((s) => (
              <button key={s} className={`btn w-11 h-11 p-0 ${stars >= s ? "ring-2 ring-amber-200" : ""}`} type="button" onClick={() => setStars(s)}>
                <i className="fa-solid fa-star" />
              </button>
            ))}
            <span className="chip">Bạn chọn: <span className="ml-1">{stars}</span>★</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-extrabold text-slate-700">Nội dung</label>
          <textarea className="field mt-2" rows={4} placeholder="Kết cấu, mùi, hiệu quả..." value={text} onChange={(e) => setText(e.target.value)} />
        </div>

        <button className="btn btn-primary w-full" type="button" onClick={submit}>
          <i className="fa-solid fa-paper-plane mr-2" /> Gửi đánh giá
        </button>

        {msg ? (
          <div className="rounded-2xl bg-emerald-50 text-emerald-800 p-4 ring-1 ring-emerald-200 text-sm font-extrabold">
            {msg}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
