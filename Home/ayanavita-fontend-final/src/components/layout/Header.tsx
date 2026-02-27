import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthModal } from "../home/AuthModal";
import { SuccessModal } from "../home/SuccessModal";

type DropdownKey = "products" | "pricing" | null;
type AuthTab = "login" | "register";
type Language = "vi" | "en" | "de";

type HeaderCMSData = {
  brandText: string;
  productsDropdownLabel: string;
  productsDropdownItems: Array<{ label: string; to: string } | { separator: true }>;
  pricingDropdownLabel: string;
  pricingDropdownItems: Array<{ label: string; to: string } | { separator: true }>;
  navLinks: Array<{ label: string; to: string }>;
  loginButtonText: string;
  registerButtonText: string;
  languageOptions?: Array<{ code: string; label: string; flag: string }>;
};

type HeaderProps = {
  brandHref?: string;
  cmsData?: HeaderCMSData;
};

const defaultCMSData: HeaderCMSData = {
  brandText: "AYANAVITA",
  productsDropdownLabel: "Sản phẩm",
  productsDropdownItems: [
    { label: "Danh mục sản phẩm", to: "/category" },
    { label: "Sản phẩm nổi bật", to: "/products" },
    { label: "Tìm sản phẩm phù hợp", to: "/quiz-fit" },
    { separator: true },
    { label: "Giỏ hàng", to: "/cart" },
  ],
  pricingDropdownLabel: "Gói & Giá",
  pricingDropdownItems: [
    { label: "Dịch vụ Spa", to: "/services" },
    { label: "Đặt lịch", to: "/booking" },
    { separator: true },
    { label: "Nhượng quyền", to: "/franchise" },
    { label: "Bộ tài liệu nhượng quyền", to: "/franchise-docs" },
  ],
  navLinks: [
    { label: "Đánh giá", to: "/reviews" },
    { label: "Blog kiến thức", to: "/blog" },
    { label: "Liên hệ", to: "/contact" },
  ],
  loginButtonText: "Đăng nhập",
  registerButtonText: "Đăng ký",
  languageOptions: [
    { code: "vi", label: "Tiếng Việt", flag: "fi-vn" },
    { code: "en", label: "English", flag: "fi-gb" },
    { code: "de", label: "Deutsch", flag: "fi-de" },
  ],
};

export function Header({ brandHref = "/", cmsData }: HeaderProps) {
  const cms = cmsData ?? defaultCMSData;
  const location = useLocation();

  const [openDd, setOpenDd] = useState<DropdownKey>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>("login");
  const [success, setSuccess] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("preferred-language") as Language;
    return saved || "vi";
  });

  const [langOpen, setLangOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem("preferred-language", language);
    window.dispatchEvent(
        new CustomEvent("languageChange", { detail: { language } })
    );
  }, [language]);

  const isActiveLink = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isProductsActive = useMemo(() => {
    return cms.productsDropdownItems.some(
        (item) => !("separator" in item) && location.pathname.startsWith(item.to)
    );
  }, [location.pathname, cms.productsDropdownItems]);

  const isPricingActive = useMemo(() => {
    return cms.pricingDropdownItems.some(
        (item) => !("separator" in item) && location.pathname.startsWith(item.to)
    );
  }, [location.pathname, cms.pricingDropdownItems]);

  const toggleDd = (k: Exclude<DropdownKey, null>) => {
    setOpenDd((cur) => (cur === k ? null : k));
  };

  const openAuth = (tab: AuthTab) => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const openSuccess = (message: string) => {
    setSuccess({ open: true, message });
  };

  const handleLoginSuccess = () => {
    setAuthOpen(false);
    openSuccess("Đăng nhập thành công.");
  };

  const handleRegisterSuccess = () => {
    setAuthOpen(false);
    openSuccess("Đăng ký thành công.");
  };

  const languageOptions = cms.languageOptions ?? defaultCMSData.languageOptions!;

  return (
      <>
        <div
            ref={rootRef}
            className="sticky top-0 z-[80] border-b border-slate-200/60 bg-white/80 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3">
            {/* Brand */}
            <Link to={brandHref} className="flex items-center gap-3">
              <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl font-black text-white"
                  style={{
                    background:
                        "linear-gradient(135deg,var(--aya-primary-1),var(--aya-primary-2))",
                  }}
              >
                A
              </div>
              <div className="font-black text-slate-900">
                {cms.brandText}
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden flex-1 justify-center gap-2 lg:flex">
              {/* Products */}
              <div className="relative">
                <button
                    onClick={() => toggleDd("products")}
                    className="rounded-xl px-3 py-2 font-extrabold"
                >
                  {cms.productsDropdownLabel} ▾
                </button>

                {openDd === "products" && (
                    <div className="absolute left-0 mt-2 min-w-[220px] rounded-xl border bg-white shadow-lg">
                      {cms.productsDropdownItems.map((item, i) =>
                          "separator" in item ? (
                              <div key={i} className="my-1 h-px bg-slate-200" />
                          ) : (
                              <Link
                                  key={item.to}
                                  to={item.to}
                                  onClick={() => setOpenDd(null)}
                                  className="block px-4 py-2 hover:bg-slate-50"
                              >
                                {item.label}
                              </Link>
                          )
                      )}
                    </div>
                )}
              </div>

              {/* Pricing */}
              <div className="relative">
                <button
                    onClick={() => toggleDd("pricing")}
                    className="rounded-xl px-3 py-2 font-extrabold"
                >
                  {cms.pricingDropdownLabel} ▾
                </button>

                {openDd === "pricing" && (
                    <div className="absolute left-0 mt-2 min-w-[220px] rounded-xl border bg-white shadow-lg">
                      {cms.pricingDropdownItems.map((item, i) =>
                          "separator" in item ? (
                              <div key={i} className="my-1 h-px bg-slate-200" />
                          ) : (
                              <Link
                                  key={item.to}
                                  to={item.to}
                                  onClick={() => setOpenDd(null)}
                                  className="block px-4 py-2 hover:bg-slate-50"
                              >
                                {item.label}
                              </Link>
                          )
                      )}
                    </div>
                )}
              </div>

              {cms.navLinks.map((link) => (
                  <Link
                      key={link.to}
                      to={link.to}
                      className="rounded-xl px-3 py-2 font-extrabold"
                  >
                    {link.label}
                  </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                  onClick={() => openAuth("login")}
                  className="hidden rounded-full border px-4 py-2 sm:inline-flex"
              >
                {cms.loginButtonText}
              </button>

              <button
                  onClick={() => openAuth("register")}
                  className="rounded-full px-4 py-2 font-black"
                  style={{
                    background:
                        "linear-gradient(135deg,var(--aya-accent-1),var(--aya-accent-2))",
                  }}
              >
                {cms.registerButtonText}
              </button>
            </div>
          </div>
        </div>

        <AuthModal
            open={authOpen}
            tab={authTab}
            onClose={() => setAuthOpen(false)}
            onSwitchTab={setAuthTab}
            onLoginSuccess={handleLoginSuccess}
            onRegisterSuccess={handleRegisterSuccess}
        />

        <SuccessModal
            open={success.open}
            message={success.message}
            onClose={() => setSuccess({ open: false, message: "" })}
        />
      </>
  );
}