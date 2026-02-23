import { http } from "./http";

export type LessonType = "video" | "doc" | "quiz" | "assignment";

export type Course = {
  id: string;
  title: string;
  subtitle?: string | null;
  price?: number | null;
  coverImage?: string | null;
  level?: string | null;
};

export type Lesson = {
  id: string;
  courseId?: string;
  title: string;
  type: LessonType;
  duration?: number | null;
  order?: number | null;
};

export const coursesApi = {
  list: async (): Promise<Course[]> => (await http.get("/courses")).data,
  get: async (id: string): Promise<Course> => (await http.get(`/courses/${id}`)).data,
  lessons: async (courseId: string): Promise<Lesson[]> =>
    (await http.get(`/courses/${courseId}/lessons`)).data,

  // ✅ Aliases để LessonDetailPage khỏi đổi code
  getCourse: async (id: string): Promise<Course> => (await http.get(`/courses/${id}`)).data,
  getCourseLessons: async (courseId: string): Promise<Lesson[]> =>
    (await http.get(`/courses/${courseId}/lessons`)).data,

  // Orders: POST /courses/:id/order
  order: async (courseId: string): Promise<{ id: string; status: string }> =>
    (await http.post(`/courses/${courseId}/order`)).data,
};
