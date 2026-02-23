import React, { useMemo } from "react";
import { Badge, Button, Card, Container, Hr, SubTitle } from "../../ui/ui";
import type { ReviewsState } from "../reviews/reviews.types";
import type { ReturnTypeCalcStats } from "../reviews/reviews.utils.types";
import { StarsRow } from "./Stars";

function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={"inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-extrabold " + className}>
      {children}
    </span>
  );
}

const LUX_BG =
  "relative overflow-hidden bg-slate-950 text-white " +
  "before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(11,18,32,.92),rgba(17,24,39,.84),rgba(11,18,32,.65))] before:content-['']";

function starIconsCount(avg: number) {
  return Math.max(0, Math.min(5, Math.round(avg)));
}

export function HeroSummary({
  stats,
  onOpenWrite,
  onJumpReviews,
  onSetFilters,
}: {
  stats: ReturnTypeCalcStats;
  onOpenWrite: () => void;
  onJumpReviews: () => void;
  onSetFilters: (updater: (prev: ReviewsState) => ReviewsState) => void;
}) {
  const avgStars = useMemo(() => starIconsCount(stats.avg), [stats.avg]);

  return (
    <section className={LUX_BG}>
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=2200&q=80"
          className="w-full h-full object-cover opacity-55"
          alt="Spa"
        />
      </div>

      {/* gold lines */}
      <div className="pointer-events-none absolute left-0 right-0 top-10 h-[2px] bg-[linear-gradient(90deg,rgba(212,175,55,0),rgba(212,175,55,.85),rgba(212,175,55,0))] opacity-80" />
      <div className="pointer-events-none absolute left-0 right-0 bottom-12 h-[2px] bg-[linear-gradient(90deg,rgba(212,175,55,0),rgba(212,175,55,.55),rgba(212,175,55,0))] opacity-60" />

      <Container className="relative py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <Chip className="bg-white/10 border-white/15 text-white">Verified Reviews</Chip>
              <Chip className="bg-white/10 border-white/15 text-white">CSKH hỗ trợ</Chip>
              <Chip className="bg-white/10 border-white/15 text-white">Ưu đãi theo hạng</Chip>
            </div>

            <h1 className="mt-5 text-4xl lg:text-5xl font-extrabold leading-tight">
              Khách hàng nói gì về <span className="text-amber-300">AYANAVITA</span>
            </h1>

            <p className="mt-4 text-white/90 text-lg leading-relaxed">
              Xem đánh giá thực tế về <b>dịch vụ</b>, <b>sản phẩm</b> và trải nghiệm tại cơ sở. Bạn cũng có thể viết đánh giá để
              nhận voucher (demo).
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Button tone="accent" variant="solid" onClick={onJumpReviews}>
                Xem danh sách
              </Button>
              <Button tone="brand" variant="solid" onClick={onOpenWrite}>
                Viết đánh giá ngay
              </Button>
            </div>

            {/* tiles được tách ra StatTiles (bạn import ở page) */}
          </div>

          <Card className="p-6 shadow-[0_18px_60px_rgba(2,6,23,0.10)]" id="summary">
            <div className="flex items-center justify-between">
              <div>
                <SubTitle>Tổng quan</SubTitle>
                <div className="text-xl font-extrabold">Xếp hạng & phân bố sao</div>
              </div>
              <Badge tone="brand">Live</Badge>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-4 items-start">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-center gap-3">
                  <div className="text-4xl font-extrabold">{stats.count ? stats.avg.toFixed(1) : "—"}</div>
                  <div className="flex-1">
                    <StarsRow value={avgStars} size="lg" />
                    <div className="text-sm text-slate-600 mt-1">
                      Dựa trên <b>{stats.count || "—"}</b> đánh giá.
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button tone="brand" variant="solid" className="w-full" onClick={onOpenWrite}>
                    Viết đánh giá
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <div className="text-sm font-extrabold text-slate-800">Phân bố theo sao</div>

                <div className="mt-3 grid gap-2">
                  {([5, 4, 3, 2, 1] as const).map((k) => {
                    const v = stats.dist[k] || 0;
                    const max = Math.max(1, ...Object.values(stats.dist));
                    const pct = Math.round((v / max) * 100);

                    return (
                      <button
                        key={k}
                        type="button"
                        className="w-full text-left rounded-2xl hover:bg-slate-50 p-2 transition"
                        onClick={() => {
                          onSetFilters((p) => ({ ...p, star: String(k) as any }));
                          onJumpReviews();
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-10 font-extrabold">{k}★</div>
                          <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div className="h-2 rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="w-10 text-right text-sm text-slate-600">{v}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Hr className="mt-4" />

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="ghost" onClick={() => onSetFilters((p) => ({ ...p, verifiedOnly: true }))}>
                    Chỉ xác thực
                  </Button>
                  <Button variant="ghost" onClick={() => onSetFilters((p) => ({ ...p, star: "all", verifiedOnly: false }))}>
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-700">
              Prototype: Khi có backend, bạn có thể lưu review theo “serviceId/productId”, trạng thái “verified”, và moderation.
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
