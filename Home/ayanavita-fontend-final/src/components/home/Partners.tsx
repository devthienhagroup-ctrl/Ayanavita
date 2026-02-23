// src/components/home/Partners.tsx
import React, { useMemo, useState, useEffect } from "react";

export type Partner = {
    name: string;
    domain: string;
    imageUrl?: string;
    logoUrl?: string;
};

type FallbackMode = "text" | "dummy";

type PartnersProps = {
    gridItems?: Partner[];
    marqueeItems?: Partner[];
    useClearbit?: boolean;
    fallbackMode?: FallbackMode;
    logoBase?: string;
};

const TextLogo: React.FC<{ name: string }> = ({ name }) => {
    return (
        <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">
                {name.trim().slice(0, 1).toUpperCase()}
            </div>
            <div className="text-sm font-extrabold text-slate-700">{name}</div>
        </div>
    );
};

const LogoTile: React.FC<{
    p: Partner;
    width?: number;
    useClearbit: boolean;
    fallbackMode: FallbackMode;
    logoBase: string;
}> = ({ p, width, useClearbit, fallbackMode, logoBase }) => {
    const [useFallback, setUseFallback] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        // Reset fallback khi partner thay đổi
        setUseFallback(false);
        setImageError(false);
    }, [p]);

    // Debug: log để kiểm tra dữ liệu
    console.log('Rendering partner:', {
        name: p.name,
        domain: p.domain,
        imageUrl: p.imageUrl,
        logoUrl: p.logoUrl,
        hasImage: !!(p.imageUrl || p.logoUrl)
    });

    // ✅ Xác định nguồn ảnh
    let remoteSrc = '';

    if (p.imageUrl) {
        remoteSrc = p.imageUrl;
        console.log(`Using imageUrl for ${p.name}:`, p.imageUrl);
    } else if (p.logoUrl) {
        remoteSrc = p.logoUrl;
        console.log(`Using logoUrl for ${p.name}:`, p.logoUrl);
    } else if (useClearbit) {
        remoteSrc = `${logoBase.replace(/\/$/, "")}/${p.domain}`;
        console.log(`Using Clearbit for ${p.name}:`, remoteSrc);
    }

    const dummy =
        `https://dummyimage.com/160x48/0b1220/ffffff&text=` +
        encodeURIComponent(p.name);

    // ✅ Kiểm tra có nên hiển thị ảnh không
    const hasValidImage = !!(p.imageUrl || p.logoUrl || (useClearbit && p.domain));
    const showImage = hasValidImage && !useFallback && !imageError && !!remoteSrc;

    const tileStyle = width ? { width } : undefined;

    return (
        <div
            className="flex h-16 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow"
            style={tileStyle}
        >
            {showImage ? (
                <img
                    loading="lazy"
                    alt={p.name}
                    className="h-7 w-auto object-contain opacity-80 grayscale hover:opacity-100 hover:grayscale-0 transition"
                    src={remoteSrc}
                    onError={(e) => {
                        console.log(`❌ Image failed to load for ${p.name}:`, remoteSrc);
                        setImageError(true);
                        setUseFallback(true);
                    }}
                    onLoad={() => {
                        console.log(`✅ Image loaded successfully for ${p.name}:`, remoteSrc);
                        setImageError(false);
                    }}
                />
            ) : (
                <div className="px-4">
                    {fallbackMode === "dummy" ? (
                        <img
                            loading="lazy"
                            alt={p.name}
                            className="h-7 w-auto object-contain opacity-90"
                            src={dummy}
                            onError={(e) => {
                                console.log(`Dummy image failed for ${p.name}`);
                            }}
                        />
                    ) : (
                        <TextLogo name={p.name} />
                    )}
                </div>
            )}
        </div>
    );
};

export const Partners: React.FC<PartnersProps> = ({
                                                      gridItems,
                                                      marqueeItems,
                                                      useClearbit = false,
                                                      fallbackMode = "text",
                                                      logoBase = "https://logo.clearbit.com",
                                                  }) => {
    // Debug props
    console.log('Partners props:', { gridItems, marqueeItems, useClearbit, fallbackMode });

    // Hardcode data để test
    const defaultPartners: Partner[] = [
        {
            name: "Coursera",
            domain: "coursera.org",
            imageUrl: "https://logos-world.net/wp-content/uploads/2023/08/Coursera-Logo.png"
        },
        {
            name: "Udemy",
            domain: "udemy.com",
            imageUrl: "/images/partners/udemy.svg"
        },
        {
            name: "edX",
            domain: "edx.org",
            imageUrl: "/images/partners/edx.svg"
        },
        {
            name: "Skillshare",
            domain: "skillshare.com",
            imageUrl: "/images/partners/skillshare.svg"
        },
        {
            name: "LinkedIn Learning",
            domain: "linkedin.com",
            imageUrl: "/images/partners/linkedin-learning.svg"
        },
        {
            name: "Pluralsight",
            domain: "pluralsight.com",
            imageUrl: "/images/partners/pluralsight.svg"
        },
    ];

    const defaultMarquee: Partner[] = [
        { name: "Coursera", domain: "coursera.org", imageUrl: "https://logos-world.net/wp-content/uploads/2023/08/Coursera-Logo.png" },
        { name: "Udemy", domain: "udemy.com", imageUrl: "/images/partners/udemy.svg" },
        { name: "edX", domain: "edx.org", imageUrl: "/images/partners/edx.svg" },
        { name: "Skillshare", domain: "skillshare.com", imageUrl: "/images/partners/skillshare.svg" },
        { name: "LinkedIn Learning", domain: "linkedin.com", imageUrl: "/images/partners/linkedin-learning.svg" },
        { name: "Pluralsight", domain: "pluralsight.com", imageUrl: "/images/partners/pluralsight.svg" },
        { name: "Teachable", domain: "teachable.com", imageUrl: "/images/partners/teachable.svg" },
        { name: "Thinkific", domain: "thinkific.com", imageUrl: "/images/partners/thinkific.svg" },
        { name: "Kajabi", domain: "kajabi.com", imageUrl: "/images/partners/kajabi.svg" },
        { name: "MasterClass", domain: "masterclass.com", imageUrl: "/images/partners/masterclass.svg" },
        { name: "Udacity", domain: "udacity.com", imageUrl: "/images/partners/udacity.svg" },
        { name: "Khan Academy", domain: "khanacademy.org", imageUrl: "/images/partners/khan-academy.svg" },
    ];

    // Sử dụng data mặc định nếu không có props
    const partners = gridItems || defaultPartners;
    const marquee = marqueeItems || defaultMarquee;

    // Log để kiểm tra
    console.log('Final partners data:', partners);
    console.log('Final marquee data:', marquee);

    return (
        <section className="w-full pb-6">
            <div className="mx-auto max-w-6xl px-4">
                <div className="rounded-3xl bg-white p-8 ring-1 ring-slate-200 shadow-sm">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">
                                Đối tác & nền tảng bán khoá học
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">
                                Logo demo. Nếu mạng chặn Clearbit, component sẽ tự fallback (không spam console).
                            </p>
                        </div>
                        <div className="text-sm text-slate-600">Trusted by learners worldwide</div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 items-center gap-6 md:grid-cols-6">
                        {partners.map((p, index) => (
                            <LogoTile
                                key={`${p.domain}-${p.name}-${index}`}
                                p={p}
                                useClearbit={useClearbit}
                                fallbackMode={fallbackMode}
                                logoBase={logoBase}
                            />
                        ))}
                    </div>

                    {/* marquee */}
                    <div className="mt-6 overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                        <div
                            className="flex w-max gap-4 p-4 animate-[marquee_28s_linear_infinite] hover:[animation-play-state:paused]"
                            style={{ willChange: "transform" }}
                        >
                            {marquee.map((p, idx) => (
                                <div key={`${p.domain}-${idx}`} className="flex-none" style={{ width: 180 }}>
                                    <LogoTile
                                        p={p}
                                        width={180}
                                        useClearbit={useClearbit}
                                        fallbackMode={fallbackMode}
                                        logoBase={logoBase}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes marquee { 
          from { transform: translateX(0); } 
          to { transform: translateX(-50%); } 
        }
      `}</style>
        </section>
    );
};