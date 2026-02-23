// src/services/lmsImage.utils.ts
import type { LmsCourse, LmsLesson } from "../data/lmsCourses.data";

export function imgSeed(seed: string, w = 1400, h = 800) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

export function courseSeed(course: Pick<LmsCourse, "id">) {
  return String(course?.id || "CR-0000").replace(/[^a-zA-Z0-9-]/g, "");
}

export function lessonSeed(course: Pick<LmsCourse, "id">, lesson: Pick<LmsLesson, "id">) {
  return `${courseSeed(course)}-${lesson?.id || "L"}`;
}

export function personSeed(name: string) {
  return `person-${(name || "user").toLowerCase().replace(/\s+/g, "-")}`;
}
