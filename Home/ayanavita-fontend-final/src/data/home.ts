// src/data/home.ts

export const bannerSlides = [
  {
    id: "s1",
    badge: { icon: "sparkles", text: "Học tập thông minh • Tiến bộ nhanh" },
    title: "Học tập thông minh,\nTiến bộ vượt bậc",
    desc: "Nền tảng LMS hiện đại: 120+ khóa học, lộ trình cá nhân hóa, học mọi nơi và hỗ trợ 24/7.",
    ctaPrimary: { label: "Bắt đầu học ngay", action: "OPEN_AUTH_REGISTER" as const },
    ctaSecondary: { label: "Xem khóa nổi bật", href: "#courseGallery" },
    bgUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "s2",
    badge: { icon: "chart", text: "Lộ trình cá nhân hóa" },
    title: "Lộ trình cá nhân hóa,\nPhù hợp mọi trình độ",
    desc: "Gợi ý lộ trình tối ưu dựa theo mục tiêu và thời gian của bạn.",
    ctaPrimary: { label: "Xem tính năng", href: "#product" },
    ctaSecondary: { label: "Xem đánh giá", href: "#reviews" },
    bgUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "s3",
    badge: { icon: "mobile", text: "Học mọi lúc mọi nơi" },
    title: "Học mọi lúc, mọi nơi\nTrên mọi thiết bị",
    desc: "Web + Mobile đồng bộ tiến độ học tập, phù hợp triển khai LMS bán khoá học.",
    ctaPrimary: { label: "Trải nghiệm ngay", href: "#pricing" },
    ctaSecondary: { label: "Hỏi tư vấn", href: "#contact" },
    bgUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
  },
];

export const partners = [
  { name: "Coursera", domain: "coursera.org" },
  { name: "Udemy", domain: "udemy.com" },
  { name: "edX", domain: "edx.org" },
  { name: "Skillshare", domain: "skillshare.com" },
  { name: "LinkedIn Learning", domain: "linkedin.com" },
  { name: "Pluralsight", domain: "pluralsight.com" },
  { name: "Teachable", domain: "teachable.com" },
  { name: "Thinkific", domain: "thinkific.com" },
  { name: "Kajabi", domain: "kajabi.com" },
  { name: "MasterClass", domain: "masterclass.com" },
  { name: "Udacity", domain: "udacity.com" },
  { name: "Khan Academy", domain: "khanacademy.org" },
];

