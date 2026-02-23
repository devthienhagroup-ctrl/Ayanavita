import { http } from "./http";

export type EnrollmentStatus = "ACTIVE" | "CANCELED" | "PENDING" | "EXPIRED";

export type MyEnrollmentRes = {
  id: string;
  courseId: string;
  status: EnrollmentStatus;
};

export const enrollmentsApi = {
  async getMyEnrollment(courseId: string): Promise<MyEnrollmentRes> {
    // theo backend của bạn: /me/courses là list enrollment
    // nhưng để tiện, mình tạo endpoint giả định /courses/:id/enrollment
    // Nếu backend chưa có, bạn đổi sang gọi /me/courses rồi find.
    const { data } = await http.get(`/courses/${courseId}/enrollment`);
    return data;
  },

  async myCourses(): Promise<MyEnrollmentRes[]> {
    const { data } = await http.get("/me/courses");
    return Array.isArray(data) ? data : data?.items ?? [];
  },
};
