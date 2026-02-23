import { http } from "./http";

export type LessonProgressItem = {
  lessonId: string;
  completed?: boolean;
  percent?: number | null;
  updatedAt?: string;
};

export type CourseProgressRes = {
  courseId: string;
  doneLessonIds: string[];
  inProgressLessonIds?: string[];
  lockedLessonIds?: string[];
  percent?: number | null;
};


export const progressApi = {
  // GET /me/courses/:courseId/progress
  async getMyCourseProgress(courseId: string): Promise<CourseProgressRes> {
    return (await http.get(`/me/courses/${courseId}/progress`)).data;
  },

  // POST /lessons/:id/progress
  async setProgress(lessonId: string, payload: { percent?: number; seconds?: number }): Promise<any> {
    return (await http.post(`/lessons/${lessonId}/progress`, payload)).data;
  },

  // POST /lessons/:id/complete
  async complete(lessonId: string): Promise<any> {
    return (await http.post(`/lessons/${lessonId}/complete`)).data;
  },

  // ✅ Alias nếu code cũ gọi tên khác
  async getMyCourseProgressLegacy(courseId: string): Promise<CourseProgressRes> {
    return this.getMyCourseProgress(courseId);
  },

  // ✅ alias cho code cũ
async completeLesson(lessonId: string): Promise<any> {
  return this.complete(lessonId);
},

};
