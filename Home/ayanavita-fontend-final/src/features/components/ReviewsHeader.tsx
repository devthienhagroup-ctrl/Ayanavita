import React from "react";
import { Button, Container } from "../../ui/ui";

export function ReviewsHeader({
  onOpenWrite,
  onOpenSaved,
}: {
  onOpenWrite: () => void;
  onOpenSaved: () => void;
}) {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <Container className="py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[linear-gradient(135deg,#4F46E5,#7C3AED)] flex items-center justify-center text-white font-extrabold shadow-lg shadow-indigo-500/25">
            A
          </div>
          <div>
            <div className="text-lg font-extrabold leading-tight">AYANAVITA</div>
            <div className="text-xs font-extrabold text-slate-500">Đánh giá dịch vụ & sản phẩm</div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Button tone="brand" variant="solid" onClick={onOpenWrite}>
            Viết đánh giá
          </Button>
          <Button variant="ghost" onClick={onOpenSaved}>
            Đã lưu
          </Button>
        </div>

        <div className="lg:hidden flex gap-2">
          <Button tone="brand" variant="solid" onClick={onOpenWrite}>
            Viết
          </Button>
          <Button variant="ghost" onClick={onOpenSaved}>
            Lưu
          </Button>
        </div>
      </Container>
    </div>
  );
}
