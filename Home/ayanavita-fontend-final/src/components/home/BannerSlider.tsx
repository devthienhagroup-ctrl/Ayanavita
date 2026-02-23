// src/components/home/BannerSlider.tsx
import React, { useEffect, useMemo, useState } from "react";

export type Slide = {
  id: string;
  bgUrl: string;
  badge: { icon?: string; text: string };
  title: string;
  desc: string;
  ctaPrimary: { label: string; href?: string; action?: "OPEN_AUTH_REGISTER" };
  ctaSecondary: { label: string; href: string };
};

export function BannerSlider({
  slides,
  onAction,
  intervalMs = 5200,
}: {
  slides: Slide[];
  onAction?: (action: Slide["ctaPrimary"]["action"]) => void;
  intervalMs?: number;
}) {
  const safeSlides = slides || [];
  const [idx, setIdx] = useState(0);

  // guard
  const hasSlides = safeSlides.length > 0;
  const current = hasSlides ? safeSlides[Math.min(idx, safeSlides.length - 1)] : null;

  // keep idx in range if slides length changes
  useEffect(() => {
    if (!hasSlides) return;
    if (idx > safeSlides.length - 1) setIdx(0);
  }, [hasSlides, idx, safeSlides.length]);

  // auto play (only if >=2 slides)
  useEffect(() => {
    if (!hasSlides) return;
    if (safeSlides.length < 2) return;

    const t = window.setInterval(() => {
      setIdx((i) => (i + 1) % safeSlides.length);
    }, intervalMs);

    return () => window.clearInterval(t);
  }, [hasSlides, safeSlides.length, intervalMs]);

  const indicators = useMemo(() => safeSlides.map((s) => s.id), [safeSlides]);

  if (!current) return null;

  return (
    <section className="full-section py-8">
      <div className="inner">
        <div className="relative overflow-hidden rounded-[24px] h-[520px] card">
          {safeSlides.map((s, i) => (
            <div
              key={s.id}
              className={[
                "absolute inset-0 transition-opacity duration-1000",
                i === idx ? "opacity-100" : "opacity-0",
              ].join(" ")}
              style={{
                backgroundImage: `url('${s.bgUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              aria-hidden={i !== idx}
            >
              <div
                className="h-full text-white flex flex-col justify-center px-[60px] max-md:px-[20px]"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(11,18,32,0.88) 0%, rgba(79,70,229,0.35) 55%, rgba(245,158,11,0.15) 100%)",
                }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/10 w-fit">
                  <span className="text-amber-300">
                    {s.badge?.icon ? <i className={s.badge.icon} /> : "✦"}
                  </span>
                  <span>{s.badge?.text}</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-4 whitespace-pre-line">
                  {s.title}
                </h1>

                {/* Desc */}
                <p className="text-lg md:text-xl mb-6 max-w-2xl text-white/90">
                  {s.desc}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  {s.ctaPrimary.href ? (
                    <a
                      href={s.ctaPrimary.href}
                      className="btn-accent rounded-xl inline-flex items-center gap-2 px-6 py-3 w-fit font-extrabold"
                    >
                      {s.ctaPrimary.label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="btn-accent rounded-xl inline-flex items-center gap-2 px-6 py-3 w-fit font-extrabold"
                      onClick={() => s.ctaPrimary.action && onAction?.(s.ctaPrimary.action)}
                    >
                      {s.ctaPrimary.label}
                    </button>
                  )}

                  <a
                    href={s.ctaSecondary.href}
                    className="inline-flex items-center gap-2 px-6 py-3 w-fit font-extrabold rounded-[14px] bg-white/10 ring-1 ring-white/15 hover:bg-white/15 transition"
                  >
                    {s.ctaSecondary.label}
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Prev / Next */}
          <button
            type="button"
            className="absolute top-1/2 -translate-y-1/2 left-3 z-10 h-11 w-11 rounded-[14px] bg-white/90 ring-1 ring-slate-200 hover:bg-white transition font-extrabold"
            onClick={() => setIdx((i) => (i - 1 + safeSlides.length) % safeSlides.length)}
            aria-label="Previous slide"
          >
            ‹
          </button>

          <button
            type="button"
            className="absolute top-1/2 -translate-y-1/2 right-3 z-10 h-11 w-11 rounded-[14px] bg-white/90 ring-1 ring-slate-200 hover:bg-white transition font-extrabold"
            onClick={() => setIdx((i) => (i + 1) % safeSlides.length)}
            aria-label="Next slide"
          >
            ›
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
            {indicators.map((id, i) => (
              <button
                key={id}
                type="button"
                className={[
                  "h-3 w-3 rounded-full transition",
                  i === idx ? "bg-amber-500 scale-110" : "bg-white/50 hover:bg-white/70",
                ].join(" ")}
                onClick={() => setIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
