import React from "react";

export function BlogHeader(props: {
  mobileOpen: boolean;
  onToggleMobile: () => void;
  onOpenSaved: () => void;
}) {
  return (
    <header className="bg-white sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl gradient-primary flex items-center justify-center text-white font-extrabold shadow-lg shadow-indigo-500/25">
            A
          </div>
          <div>
            <div className="text-lg font-extrabold leading-tight">AYANAVITA</div>
            <div className="text-xs font-extrabold text-slate-500">Blog kiến thức • Beauty • Health</div>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-extrabold text-slate-700">
          <a href="#latest" className="hover:text-indigo-600">Bài mới</a>
          <a href="#topics" className="hover:text-indigo-600">Chủ đề</a>
          <a href="#newsletter" className="hover:text-indigo-600">Nhận bản tin</a>
          <button className="btn" onClick={props.onOpenSaved}>
            <i className="fa-solid fa-bookmark" /> Saved
          </button>
        </nav>

        <button className="btn lg:hidden" onClick={props.onToggleMobile}>
          <i className="fa-solid fa-bars" /> Menu
        </button>
      </div>

      {props.mobileOpen ? (
        <div className="border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 grid gap-2">
            <a className="btn justify-between" href="#latest" onClick={props.onToggleMobile}>
              <span>Bài mới</span><i className="fa-solid fa-chevron-right text-slate-400" />
            </a>
            <a className="btn justify-between" href="#topics" onClick={props.onToggleMobile}>
              <span>Chủ đề</span><i className="fa-solid fa-chevron-right text-slate-400" />
            </a>
            <a className="btn justify-between" href="#newsletter" onClick={props.onToggleMobile}>
              <span>Nhận bản tin</span><i className="fa-solid fa-chevron-right text-slate-400" />
            </a>
            <button className="btn" onClick={() => { props.onToggleMobile(); props.onOpenSaved(); }}>
              <i className="fa-solid fa-bookmark" /> Saved
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
