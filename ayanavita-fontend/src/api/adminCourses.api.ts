import { del, get, patch, post } from './http'

export type CourseTopicTranslations = Record<string, { name?: string; description?: string | null }>

export type CourseTopic = {
  id: number
  name: string
  description?: string | null
  translations?: CourseTopicTranslations
  _count?: { courses: number }
}

export type LocalizedText = { vi?: string; 'en-US'?: string; de?: string }

export type LessonVideoPayload = {
  title: string
  description?: string
  titleI18n?: LocalizedText
  descriptionI18n?: LocalizedText
  sourceUrl?: string
  durationSec?: number
  order?: number
  published?: boolean
}

export type LessonModulePayload = {
  title: string
  description?: string
  titleI18n?: LocalizedText
  descriptionI18n?: LocalizedText
  order?: number
  published?: boolean
  videos?: LessonVideoPayload[]
}

export type LessonPayload = {
  title: string
  slug: string
  description?: string
  titleI18n?: LocalizedText
  descriptionI18n?: LocalizedText
  content?: string
  videoUrl?: string
  modules?: LessonModulePayload[]
  order?: number
  published?: boolean
}

export type LessonVideoAdmin = LessonVideoPayload & { id: number; hlsPlaylistKey?: string }
export type LessonModuleAdmin = LessonModulePayload & { id: number; videos: LessonVideoAdmin[] }

export type LessonAdmin = {
  id: number
  courseId: number
  title: string
  slug: string
  description?: string
  titleI18n?: LocalizedText
  descriptionI18n?: LocalizedText
  content?: string
  order?: number
  published: boolean
  createdAt?: string
  updatedAt?: string
}

export type LessonDetailAdmin = LessonAdmin & { modules: LessonModuleAdmin[] }

export type CourseAdmin = {
  id: number
  topicId?: number | null
  title: string
  slug: string
  description?: string | null
  thumbnail?: string | null
  published: boolean
  price: number
  topic?: { id: number; name: string } | null
  titleI18n?: LocalizedText
  descriptionI18n?: LocalizedText
  shortDescriptionI18n?: LocalizedText
  objectives?: string[]
  targetAudience?: string[]
  benefits?: string[]
  ratingAvg?: number
  ratingCount?: number
  enrollmentCount?: number
  _count?: { lessons?: number }
}

export type TopicPayload = {
  name?: string
  description?: string
  translations?: {
    vi?: { name?: string; description?: string }
    'en-US'?: { name?: string; description?: string }
    de?: { name?: string; description?: string }
  }
}

export type CoursePayload = {
  topicId?: number
  title: string
  slug: string
  description?: string
  thumbnail?: string
  price?: number
  published?: boolean
  titleI18n?: LocalizedText
  descriptionI18n?: LocalizedText
  shortDescriptionI18n?: LocalizedText
  objectives?: string[]
  targetAudience?: string[]
  benefits?: string[]
  ratingAvg?: number
  ratingCount?: number
  enrollmentCount?: number
}

export const adminCoursesApi = {
  listTopics: () => get<CourseTopic[]>('/admin/course-topics', { auth: true }),
  createTopic: (body: TopicPayload) => post<CourseTopic>('/admin/course-topics', body, { auth: true }),
  updateTopic: (id: number, body: TopicPayload) => patch<CourseTopic>(`/admin/course-topics/${id}`, body, { auth: true }),
  deleteTopic: (id: number) => del<{ id: number }>(`/admin/course-topics/${id}`, { auth: true }),
  listCourses: () => get<CourseAdmin[]>('/courses', { auth: true }),
  createCourse: (body: CoursePayload) => post<CourseAdmin>('/courses', body, { auth: true }),
  updateCourse: (id: number, body: Partial<CoursePayload>) => patch<CourseAdmin>(`/courses/${id}`, body, { auth: true }),
  deleteCourse: (id: number) => del<{ id: number }>(`/courses/${id}`, { auth: true }),

  listCourseLessons: (courseId: number) => get<LessonAdmin[]>(`/courses/${courseId}/lessons-outline`, { auth: true }),
  getLessonDetail: (lessonId: number) => get<LessonDetailAdmin>(`/lessons/${lessonId}`, { auth: true }),
  createLesson: (courseId: number, body: LessonPayload) => post<LessonAdmin>(`/courses/${courseId}/lessons`, body, { auth: true }),
  updateLesson: (lessonId: number, body: Partial<LessonPayload>) => patch<LessonAdmin>(`/lessons/${lessonId}`, body, { auth: true }),
  deleteLesson: (lessonId: number) => del<{ id: number }>(`/lessons/${lessonId}`, { auth: true }),

  uploadModuleVideo: (lessonId: number, moduleId: string | number, file: File) => {
    const body = new FormData()
    body.append('file', file)
    return post<{ moduleId: string; lessonId: number; hlsPlaylistKey: string; segmentCount: number; storage: string }>(
      `/lessons/${lessonId}/modules/${moduleId}/videos/upload`,
      body,
      { auth: true },
    )
  },
}
