import React from "react";

export function BlogFooter(props: { onOpenSaved: () => void }) {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-6">
        <div>
          <div className="text-white font-extrabold">AYANAVITA</div>
          <p className="text-sm mt-2 text-slate-400">
            Luxury Spa – Products – Training. Blog kiến thức đồng hành cùng khách hàng.
          </p>
          <div className="mt-4 flex gap-3 text-xl text-slate-300">
            <i className="fa-brands fa-facebook" />
            <i className="fa-brands fa-instagram" />
            <i className="fa-brands fa-youtube" />
          </div>
        </div>

        <div>
          <div className="text-white font-extrabold">Blog</div>
          <ul className="mt-3 text-sm space-y-2 text-slate-400">
            <li><a className="hover:text-white" href="#latest">Bài mới</a></li>
            <li><a className="hover:text-white" href="#topics">Chủ đề</a></li>
            <li><button className="hover:text-white" onClick={props.onOpenSaved}>Saved</button></li>
          </ul>
        </div>

        <div>
          <div className="text-white font-extrabold">Dịch vụ</div>
          <ul className="mt-3 text-sm space-y-2 text-slate-400">
            <li>Chăm sóc da</li>
            <li>Massage trị liệu</li>
            <li>Body detox</li>
            <li>Sản phẩm spa</li>
          </ul>
        </div>

        <div>
          <div className="text-white font-extrabold">Liên hệ</div>
          <ul className="mt-3 text-sm space-y-2 text-slate-400">
            <li><i className="fa-solid fa-phone mr-2" />090x xxx xxx</li>
            <li><i className="fa-solid fa-envelope mr-2" />support@ayanavita.vn</li>
            <li><i className="fa-solid fa-location-dot mr-2" />Việt Nam</li>
          </ul>
          <div className="mt-4">
            <button className="btn btn-accent w-full" onClick={props.onOpenSaved}>
              <i className="fa-solid fa-bookmark" /> Xem Saved
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 pb-8">
        © 2025 AYANAVITA • Blog Prototype (React)
      </div>
    </footer>
  );
}
