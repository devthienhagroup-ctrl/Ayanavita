import React from "react";
import { Container } from "src/ui/ui";

export function TopStrip() {
  return (
    <div className="bg-[linear-gradient(135deg,#4F46E5,#7C3AED)] text-white">
      <Container className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-sm font-extrabold">AYANAVITA • Reviews Center</div>
        <div className="text-sm text-white/90">
          Hotline: <b>090x xxx xxx</b> • CSKH: <b>support@ayanavita.vn</b>
        </div>
      </Container>
    </div>
  );
}
