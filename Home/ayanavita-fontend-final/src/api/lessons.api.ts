import { http } from "./http";
import type { Lesson } from "./courses.api";

export type LessonDetail = Lesson & {
  contentMd?: string | null;
  videoUrl?: string | null;
  attachments?: { name: string; url: string }[];
};

function normalizeLesson(x: any): Lesson {
  return {
    id: String(x?.id ?? ""),
    courseId: x?.courseId ? String(x.courseId) : undefined,
    title: String(x?.title ?? "Untitled"),
    type: (x?.type ?? "video") as Lesson["type"],
    duration: x?.duration ?? null,
    order: x?.order ?? null,
  };
}

export const lessonsApi = {
  /**
   * Backend chuẩn bạn đã list: GET /courses/:id/lessons
   */
  async listByCourse(courseId: string): Promise<Lesson[]> {
    const { data } = await http.get(`/courses/${courseId}/lessons`);
    const raw: any[] = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
    const lessons: Lesson[] = raw.map(normalizeLesson);
    return lessons.sort((a: Lesson, b: Lesson) => (a.order ?? 0) - (b.order ?? 0));
  },

  /**
   * Nếu backend có endpoint chi tiết lesson:
   * - GET /courses/:courseId/lessons/:lessonId
   * Nếu chưa có, bạn có thể fallback sang listByCourse + find.
   */
  async getDetail(courseId: string, lessonId: string): Promise<LessonDetail> {
    try {
      const { data } = await http.get(`/courses/${courseId}/lessons/${lessonId}`);
      return data as LessonDetail;
    } catch {
      const arr = await this.listByCourse(courseId);
      const found = arr.find((x) => x.id === lessonId);
      if (!found) throw new Error("Lesson not found");
      return found as LessonDetail;
    }
  },

  // ✅ Alias để LessonDetailPage khỏi đổi code
  async getLessonDetail(courseId: string, lessonId: string): Promise<LessonDetail> {
    return this.getDetail(courseId, lessonId);
  },
};
