// src/data/courseDetail.demo.ts
export type CourseCategory = "tech" | "business" | "design";
export type LessonType = "video" | "doc" | "quiz" | "live";
export type LessonStatus = "published" | "draft";

export type Lesson = {
  id: string;
  title: string;
  type: LessonType;
  duration: number; // minutes
  preview: "yes" | "no";
  status: LessonStatus;
  source?: string;
  note?: string;
};

export type CourseModule = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Instructor = {
  name: string;
  bio: string;
};

export type LandingConfig = {
  hero: { subtitle: string; cta: string; highlight: string };
  proof: { text: string; bullets: string[] };
  faq: { q1: string; a1: string; q2: string; a2: string };
};

export type CourseSales = {
  basePrice: number;
  defaultDiscount: number; // %
  landing: LandingConfig;
};

export type CourseDetail = {
  id: string;
  title: string;
  category: CourseCategory;
  price: number;
  students: number;
  rating: number;
  status: "published" | "draft";
  updatedAt: string;
  desc: string;
  instructor: Instructor;
  modules: CourseModule[];
  sales: CourseSales;
};

export type Voucher = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  limit: number;
  used: number;
  expire: string; // YYYY-MM-DD
  scope: "all" | "course";
  courseId: string | null;
  active: boolean;
};

export const DEMO_COURSE_DETAIL_STATE: { courses: CourseDetail[]; vouchers: Voucher[] } = {
  courses: [
    {
      id: "CR-1001",
      title: "Flutter LMS App",
      category: "tech",
      price: 799000,
      students: 3120,
      rating: 4.9,
      status: "published",
      updatedAt: "2025-12-18",
      desc: "Player, offline cache, đồng bộ tiến độ.",
      instructor: { name: "Ayanavita Team", bio: "Flutter • Player • Offline cache" },
      modules: [
        {
          id: "M-01",
          title: "Giới thiệu & Setup",
          lessons: [
            {
              id: "L-01",
              title: "Tổng quan App LMS",
              type: "video",
              duration: 12,
              preview: "yes",
              status: "published",
              source: "https://...",
              note: "Mục tiêu và flow.",
            },
            {
              id: "L-02",
              title: "Kiến trúc dự án",
              type: "doc",
              duration: 8,
              preview: "no",
              status: "draft",
              source: "docs",
              note: "Folder structure.",
            },
          ],
        },
        {
          id: "M-02",
          title: "Player & Progress",
          lessons: [
            {
              id: "L-03",
              title: "Video player cơ bản",
              type: "video",
              duration: 18,
              preview: "no",
              status: "draft",
              source: "https://...",
              note: "Controls.",
            },
          ],
        },
      ],
      sales: {
        basePrice: 799000,
        defaultDiscount: 0,
        landing: {
          hero: {
            subtitle: "Học mọi lúc mọi nơi trên mọi thiết bị",
            cta: "Mua ngay – học liền",
            highlight: "Offline cache + đồng bộ tiến độ",
          },
          proof: {
            text: "4.9★ từ 2.1k đánh giá • 3.120 học viên",
            bullets: ["Player mượt", "Progress rõ", "Hỗ trợ nhanh"],
          },
          faq: {
            q1: "Học được trên iOS/Android?",
            a1: "Có. Flutter hỗ trợ cả hai.",
            q2: "Có offline không?",
            a2: "Có, có cache bài học.",
          },
        },
      },
    },
    {
      id: "CR-1002",
      title: "NestJS + Prisma (LMS API)",
      category: "tech",
      price: 599000,
      students: 2150,
      rating: 4.7,
      status: "published",
      updatedAt: "2025-12-17",
      desc: "Auth, courses, orders, RBAC.",
      instructor: { name: "Ayanavita Backend", bio: "NestJS • Prisma • MySQL • RBAC" },
      modules: [
        {
          id: "M-01",
          title: "Auth & RBAC",
          lessons: [
            {
              id: "L-01",
              title: "JWT + Guards",
              type: "video",
              duration: 16,
              preview: "yes",
              status: "published",
              source: "https://...",
              note: "Auth core.",
            },
            {
              id: "L-02",
              title: "Role-based Access Control",
              type: "video",
              duration: 22,
              preview: "no",
              status: "draft",
              source: "https://...",
              note: "Roles & permissions.",
            },
          ],
        },
      ],
      sales: {
        basePrice: 599000,
        defaultDiscount: 10,
        landing: {
          hero: { subtitle: "Xây API LMS chuẩn production", cta: "Đăng ký khóa API", highlight: "Auth + Orders + Progress" },
          proof: { text: "4.7★ • 2.150 học viên", bullets: ["Prisma schema chuẩn", "RBAC rõ", "Deploy Docker"] },
          faq: { q1: "Có code mẫu không?", a1: "Có. Repo demo.", q2: "Có payment không?", a2: "Có hướng dẫn tích hợp." },
        },
      },
    },
  ],
  vouchers: [
    { id: "V-01", code: "AYA20", type: "percent", value: 20, limit: 200, used: 32, expire: "2026-01-15", scope: "all", courseId: null, active: true },
    { id: "V-02", code: "FLUTTER100K", type: "fixed", value: 100000, limit: 120, used: 10, expire: "2026-02-10", scope: "course", courseId: "CR-1001", active: true },
  ],
};
