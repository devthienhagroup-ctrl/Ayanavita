import React from "react";
import { Card } from "src/ui/ui";

export function StatTiles({
  avg,
  count,
  verified,
  helpful,
}: {
  avg: number;
  count: number;
  verified: number;
  helpful: number;
}) {
  const vAvg = count ? avg.toFixed(1) : "—";
  const vCount = count ? String(count) : "—";
  const vVerified = count ? String(verified) : "—";
  const vHelpful = count ? String(helpful) : "—";

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Card className="bg-white/10 border-white/15 text-white">
        <div className="p-4">
          <div className="text-xs font-extrabold text-white/70">Điểm TB</div>
          <div className="text-2xl font-extrabold">{vAvg}</div>
          <div className="text-xs text-white/70 mt-1">/ 5</div>
        </div>
      </Card>

      <Card className="bg-white/10 border-white/15 text-white">
        <div className="p-4">
          <div className="text-xs font-extrabold text-white/70">Tổng đánh giá</div>
          <div className="text-2xl font-extrabold">{vCount}</div>
          <div className="text-xs text-white/70 mt-1">bài</div>
        </div>
      </Card>

      <Card className="bg-white/10 border-white/15 text-white">
        <div className="p-4">
          <div className="text-xs font-extrabold text-white/70">Đã xác thực</div>
          <div className="text-2xl font-extrabold">{vVerified}</div>
          <div className="text-xs text-white/70 mt-1">bài</div>
        </div>
      </Card>

      <Card className="bg-white/10 border-white/15 text-white">
        <div className="p-4">
          <div className="text-xs font-extrabold text-white/70">Hữu ích</div>
          <div className="text-2xl font-extrabold">{vHelpful}</div>
          <div className="text-xs text-white/70 mt-1">lượt</div>
        </div>
      </Card>
    </div>
  );
}
