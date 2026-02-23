import React from "react";

export function BlogTopStrip() {
  return (
    <div className="gradient-primary text-white">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-sm font-extrabold">
          <i className="fa-solid fa-crown mr-2" />AYANAVITA • Knowledge Blog
        </div>
        <div className="text-sm text-white/90">
          Hotline: <b>090x xxx xxx</b> • CSKH: <b>support@ayanavita.vn</b>
        </div>
      </div>
    </div>
  );
}
