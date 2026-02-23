import React from "react";
import { Badge, Button, Card, Muted } from "../../ui/ui";
import type { Review } from "../reviews/reviews.types";
import { StarsRow } from "./Stars";

function formatDateVi(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export function ReviewCard({
  review,
  savedOn,
  voted,
  onToggleSave,
  onToggleHelpful,
  onReport,
}: {
  review: Review;
  savedOn: boolean;
  voted: boolean;
  onToggleSave: () => void;
  onToggleHelpful: () => void;
  onReport: () => void;
}) {
  const r = review;
  const displayName = r.anonymous ? "Ẩn danh" : r.name || "Khách hàng";

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img src={r.img} alt={r.item} className="w-full h-44 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 to-transparent" />
        <div className="absolute left-4 bottom-4 flex flex-wrap gap-2">
          <Badge tone={r.category === "service" ? "brand" : "accent"}>{r.category === "service" ? "Dịch vụ" : "Sản phẩm"}</Badge>
          {r.verified && <Badge tone="success">Đã xác thực</Badge>}
          <Badge tone="accent">{r.rating}.0</Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-extrabold">{r.item}</div>
            <div className="text-sm text-slate-600 mt-1">
              <b>{displayName}</b> {r.branch ? `• ${r.branch}` : ""} • <Muted>{formatDateVi(r.createdAt)}</Muted>
            </div>
          </div>

          <Button
            variant="ghost"
            title="Lưu"
            className={savedOn ? "border-indigo-200 bg-indigo-50 text-indigo-700" : ""}
            onClick={onToggleSave}
          >
            {savedOn ? "Đã lưu" : "Lưu"}
          </Button>
        </div>

        <div className="mt-3">
          <StarsRow value={r.rating} />
        </div>

        <p className="mt-3 text-slate-700 leading-relaxed whitespace-pre-line">{r.text}</p>

        {r.reply && (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="text-sm font-extrabold text-slate-800">AYANAVITA phản hồi</div>
            <div className="text-sm text-slate-700 mt-2 whitespace-pre-line">{r.reply.text}</div>
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button tone={voted ? "brand" : "muted"} variant={voted ? "solid" : "ghost"} onClick={onToggleHelpful}>
            Hữu ích ({r.helpful || 0})
          </Button>
          <Button variant="ghost" onClick={onReport}>
            Báo cáo
          </Button>
        </div>
      </div>
    </Card>
  );
}
