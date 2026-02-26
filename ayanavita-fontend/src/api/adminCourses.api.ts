import { del, get, patch, post } from './http'

export type CourseTopic = {
  id: number
  name: string
  description?: string | null
  _count?: { courses: number }
}

export type CourseAdmin = {
  id: number
  topicId?: number | null
  title: string
  slug: string
  published: boolean
  price: number
  topic?: { id: number; name: string } | null
}

export const adminCoursesApi = {
  listTopics: () => get<CourseTopic[]>('/admin/course-topics', { auth: true }),
  createTopic: (body: { name: string; description?: string }) => post<CourseTopic>('/admin/course-topics', body, { auth: true }),
  updateTopic: (id: number, body: { name?: string; description?: string }) => patch<CourseTopic>(`/admin/course-topics/${id}`, body, { auth: true }),
  deleteTopic: (id: number) => del<{ id: number }>(`/admin/course-topics/${id}`, { auth: true }),
  listCourses: () => get<CourseAdmin[]>('/courses', { auth: true }),
}
