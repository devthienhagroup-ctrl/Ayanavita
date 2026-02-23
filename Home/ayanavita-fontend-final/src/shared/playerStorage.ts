const NS = "aya_player_v1";

export function key(courseId: string, lessonId: string, k: string) {
  return `${NS}:${courseId}:${lessonId}:${k}`;
}

export function getResume(courseId: string, lessonId: string) {
  const raw = localStorage.getItem(key(courseId, lessonId, "resume"));
  return Number(raw || 0);
}
export function setResume(courseId: string, lessonId: string, t: number) {
  try { localStorage.setItem(key(courseId, lessonId, "resume"), String(t || 0)); } catch {}
}

export function getNote(courseId: string, lessonId: string) {
  return localStorage.getItem(key(courseId, lessonId, "note")) || "";
}
export function setNote(courseId: string, lessonId: string, v: string) {
  localStorage.setItem(key(courseId, lessonId, "note"), v || "");
}

// Prototype quiz bank
export type QuizQuestion = {
  id: string;
  text: string;
  point: number;
  answers: { A: string; B: string; C?: string; D?: string };
  correct: "A" | "B" | "C" | "D";
  explain?: string;
};

export function getQuiz(courseId: string, lessonId: string): QuizQuestion[] {
  try {
    return JSON.parse(localStorage.getItem(key(courseId, lessonId, "quiz")) || "[]");
  } catch { return []; }
}
export function addQuiz(courseId: string, lessonId: string, q: QuizQuestion) {
  const all = getQuiz(courseId, lessonId);
  all.push(q);
  localStorage.setItem(key(courseId, lessonId, "quiz"), JSON.stringify(all));
}

// Prototype assignment submission
export type AssignmentSubmission = {
  link?: string;
  note?: string;
  fileName?: string;
  submittedAt: string;
};
export function getSubmission(courseId: string, lessonId: string): AssignmentSubmission | null {
  try {
    return JSON.parse(localStorage.getItem(key(courseId, lessonId, "submission")) || "null");
  } catch { return null; }
}
export function setSubmission(courseId: string, lessonId: string, s: AssignmentSubmission) {
  localStorage.setItem(key(courseId, lessonId, "submission"), JSON.stringify(s));
}

export function uid(prefix="ID") {
  return prefix + "-" + Math.random().toString(16).slice(2, 8).toUpperCase();
}
