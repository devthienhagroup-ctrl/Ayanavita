import type { Lesson } from "../api/courses.api";
import type { CourseProgressRes } from "../api/progress.api";

export type LessonStatusUI = "locked" | "new" | "done" | "active" | "in_progress";

export function buildSequentialRows(lessons: Lesson[]) {
  // giả định lessons đã theo order; nếu chưa có order thì giữ nguyên
  return [...lessons];
}

function setsFromProgress(progress?: CourseProgressRes | null) {
  const doneSet = new Set<string>(progress?.doneLessonIds ?? []);
  const inProgressSet = new Set<string>(progress?.inProgressLessonIds ?? []);
  const lockedSet = new Set<string>(progress?.lockedLessonIds ?? []);
  return { doneSet, inProgressSet, lockedSet };
}

// ✅ cho phép truyền (doneSet/inProgressSet/lockedSet) HOẶC truyền progress (như LessonDetailPage của bạn đang làm)
export function statusOf(args: {
  lessonId: string;
  activeLessonId?: string | null;

  // mode A (sets)
  doneSet?: Set<string>;
  inProgressSet?: Set<string>;
  lockedSet?: Set<string>;

  // mode B (progress)
  progress?: CourseProgressRes | null;
}): LessonStatusUI {
  const { lessonId, activeLessonId } = args;

  const sets =
    args.progress || (!args.doneSet && !args.inProgressSet && !args.lockedSet)
      ? setsFromProgress(args.progress)
      : {
          doneSet: args.doneSet ?? new Set<string>(),
          inProgressSet: args.inProgressSet ?? new Set<string>(),
          lockedSet: args.lockedSet ?? new Set<string>(),
        };

  if (lessonId === activeLessonId) return "active";
  if (sets.doneSet.has(lessonId)) return "done";
  if (sets.inProgressSet.has(lessonId)) return "in_progress";
  if (sets.lockedSet.has(lessonId)) return "locked";
  return "new";
}

export function getLessonNavFromRows(rows: Lesson[], activeLessonId: string) {
  const idx = rows.findIndex((x) => x.id === activeLessonId);
  return {
    prev: idx > 0 ? rows[idx - 1] : null,
    next: idx >= 0 && idx < rows.length - 1 ? rows[idx + 1] : null,
    idx,
    total: rows.length,
  };
}
