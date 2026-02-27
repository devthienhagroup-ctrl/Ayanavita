// src/pages/HomePage.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { TopBanner } from "../components/home/TopBanner";
import { Stats } from "../components/home/Stats";
import { Partners } from "../components/home/Partners";
import { CourseGallery } from "../components/home/CourseGallery";
import { RegisterSection } from "../components/home/RegisterSection";
import { ProductSection } from "../components/home/ProductSection";
import { Outcomes } from "../components/home/Outcomes";
import { Reviews } from "../components/home/Reviews";
import { PricingSection } from "../components/home/PricingSection";
import { ContactSection } from "../components/home/ContactSection";
import { BannerSlider } from "../components/home/BannerSlider";

import { partners } from "../data/home";
import { http } from "../api/http";

export default function HomePage() {
    const [homeData, setHomeData] = useState<any>(null);

    const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
        return localStorage.getItem("preferred-language") || "vi";
    });

    /* ================= Language Listener ================= */

    useEffect(() => {
        const handleLanguageChange = (event: CustomEvent) => {
            setCurrentLanguage(event.detail.language);
        };

        window.addEventListener(
            "languageChange",
            handleLanguageChange as EventListener
        );

        return () => {
            window.removeEventListener(
                "languageChange",
                handleLanguageChange as EventListener
            );
        };
    }, []);

    /* ================= Fetch Home CMS ================= */

    useEffect(() => {
        let alive = true;

        const fetchHome = async () => {
            try {
                const res = await http.get(
                    `/public/pages/home?lang=${currentLanguage}`
                );
                if (!alive) return;
                setHomeData(res.data);
            } catch (error) {
                console.error("Lỗi gọi API home:", error);
            }
        };

        fetchHome();

        return () => {
            alive = false;
        };
    }, [currentLanguage]);

    /* ================= Banner Action ================= */

    const onSlideAction = useCallback((action: unknown) => {
        console.log("Slide action:", action);
    }, []);

    const marqueeItems = useMemo(() => [...partners, ...partners], []);

    /* ================= Render ================= */

    return (
        <div className="bg-slate-50 text-slate-900">
            <div className="page-content">
                <TopBanner
                    cmsData={homeData?.sections?.[0]?.data}
                    onConsult={() =>
                        document
                            .getElementById("contact")
                            ?.scrollIntoView({ behavior: "smooth" })
                    }
                />

                <BannerSlider
                    slides={homeData?.sections?.[1]?.data?.bannerSlides}
                    onAction={onSlideAction}
                />

                <Stats cmsData={homeData?.sections?.[2]?.data} />

                <Partners cmsData={homeData?.sections?.[3]?.data} />

                <CourseGallery
                    cmsData={homeData?.sections?.[4]?.data}
                    onGetDeal={() => {}}
                />

                <RegisterSection
                    cmsData={homeData?.sections?.[5]?.data}
                    onRegisterSuccess={() => {}}
                />

                <ProductSection cmsData={homeData?.sections?.[6]?.data} />

                <Outcomes cmsData={homeData?.sections?.[7]?.data} />

                <ContactSection
                    cmsData={homeData?.sections?.[8]?.data}
                    onSubmit={() => {}}
                />

                <Reviews cmsData={homeData?.sections?.[9]?.data} />

                <PricingSection cmsData={homeData?.sections?.[10]?.data} />
            </div>
        </div>
    );
}