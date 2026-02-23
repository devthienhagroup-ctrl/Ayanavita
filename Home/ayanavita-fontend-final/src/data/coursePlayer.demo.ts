// src/data/coursePlayer.demo.ts

export type LessonType = "video" | "doc" | "quiz" | "assignment";

export type CourseLesson = {
  id: string;
  title: string;
  type: LessonType;
  duration: number; // minutes
  desc: string;
  res1?: string;
  res2?: string;
  video?: string; // for video
};

export type CourseModule = {
  id: string;
  title: string;
  lessons: CourseLesson[];
};

export type Course = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  rating: number;
  students: number;
  level: string;
  cover: string;
  modules: CourseModule[];
};

export const DEMO_COURSE: Course = {
  id: "CR-1003",
  title: "React UI Systems cho LMS (Udemy-like)",
  subtitle:
    "Từ prototype HTML → UI/UX giống Udemy: player + curriculum + quiz + assignment + progress.",
  price: 399000,
  rating: 4.8,
  students: 1680,
  level: "Beginner",
  cover:
    "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=1400&q=80",
  modules: [
    {
      id: "M-01",
      title: "Giới thiệu & Setup",
      lessons: [
        {
          id: "L-01",
          title: "Tổng quan UX Udemy-like",
          type: "video",
          duration: 10,
          desc: "Vì sao bố cục này chuyển đổi tốt.",
          res1: "https://tailwindcss.com",
          res2: "https://developer.mozilla.org",
          video:
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        },
        {
          id: "L-02",
          title: "Thiết kế layout: player + curriculum",
          type: "doc",
          duration: 8,
          desc: "Cấu trúc states, mapping UI → API.",
          res1:
            "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage",
          res2: "https://fontawesome.com",
        },
      ],
    },
    {
      id: "M-02",
      title: "Player features",
      lessons: [
        {
          id: "L-03",
          title: "Resume + Speed + Theater",
          type: "video",
          duration: 14,
          desc: "Lưu currentTime, playbackRate, theater mode.",
          res1:
            "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video",
          res2:
            "https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API",
          video:
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        },
        {
          id: "L-04",
          title: "Autoplay next + Auto-complete",
          type: "video",
          duration: 12,
          desc: "Tự chuyển bài + đánh dấu hoàn thành.",
          res1:
            "https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event",
          res2:
            "https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event",
          video:
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        },
      ],
    },
    {
      id: "M-03",
      title: "Quiz & Assignment",
      lessons: [
        {
          id: "L-05",
          title: "Quiz: câu hỏi + đáp án + chấm điểm",
          type: "quiz",
          duration: 10,
          desc: "Tạo câu hỏi, đáp án đúng, tính điểm.",
          res1:
            "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON",
          res2:
            "https://developer.mozilla.org/en-US/docs/Web/API/Storage",
        },
        {
          id: "L-06",
          title: "Assignment: nộp link/file (prototype)",
          type: "assignment",
          duration: 12,
          desc: "Mô phỏng upload/link submission.",
          res1:
            "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file",
          res2:
            "https://developer.mozilla.org/en-US/docs/Web/API/FormData",
        },
      ],
    },
  ],
};

export function flattenLessons(course: Course) {
  const out: { module: CourseModule; lesson: CourseLesson }[] = [];
  for (const m of course.modules) for (const l of m.lessons) out.push({ module: m, lesson: l });
  return out;
}
