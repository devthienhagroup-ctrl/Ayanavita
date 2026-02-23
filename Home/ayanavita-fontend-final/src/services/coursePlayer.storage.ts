// src/services/coursePlayer.storage.ts
import { lsGet, lsSet, lsRemove } from "./ls";

export const KEYS = {
  progress: "aya_course_progress_v1",
  video: "aya_player_video_progress_v1",
  notes: "aya_player_notes_v1",
  quiz: "aya_quiz_bank_v1",
  submit: "aya_assignment_submissions_v1",
  order: "aya_orders_v1",
} as const;

export type ProgressState = { courseId: string; done: string[] };

export type QuizQuestion = {
  id: string;
  text: string;
  point: number;
  answers: { A: string; B: string; C?: string; D?: string };
  correct: "A" | "B" | "C" | "D";
  explain?: string;
};

export type Submission = {
  link?: string;
  note?: string;
  fileName?: string;
  submittedAt: string;
};

export type Order = {
  id: string;
  courseId: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  createdAt: string;
};

export function uid(prefix = "ID") {
  return prefix + "-" + Math.random().toString(16).slice(2, 8).toUpperCase();
}

export function moneyVND(n: number) {
  return "₫ " + new Intl.NumberFormat("vi-VN").format(Number(n || 0));
}

export function keyOf(base: string, courseId: string, lessonId: string) {
  return `${base}:${courseId}:${lessonId}`;
}

// Progress
export function getProgress(courseId: string) {
  return lsGet<ProgressState>(KEYS.progress, { courseId, done: [] });
}
export function setProgress(p: ProgressState) {
  lsSet(KEYS.progress, p);
}
export function isDone(courseId: string, lessonId: string) {
  return getProgress(courseId).done.includes(lessonId);
}
export function markDone(courseId: string, lessonId: string) {
  const p = getProgress(courseId);
  if (!p.done.includes(lessonId)) p.done.push(lessonId);
  setProgress(p);
}
export function resetProgress(courseId: string) {
  setProgress({ courseId, done: [] });
}

// Resume time
export function getResume(courseId: string, lessonId: string) {
  const raw = localStorage.getItem(keyOf(KEYS.video, courseId, lessonId));
  return Number(raw || 0);
}
export function setResume(courseId: string, lessonId: string, timeSec: number) {
  try {
    localStorage.setItem(keyOf(KEYS.video, courseId, lessonId), String(timeSec || 0));
  } catch {}
}
export function clearResume(courseId: string, lessonId: string) {
  lsRemove(keyOf(KEYS.video, courseId, lessonId));
}

// Notes
export function getNote(courseId: string, lessonId: string) {
  return localStorage.getItem(keyOf(KEYS.notes, courseId, lessonId)) || "";
}
export function setNote(courseId: string, lessonId: string, note: string) {
  localStorage.setItem(keyOf(KEYS.notes, courseId, lessonId), note || "");
}
export function clearNote(courseId: string, lessonId: string) {
  lsRemove(keyOf(KEYS.notes, courseId, lessonId));
}

// Quiz bank: { [courseId:lessonId]: QuizQuestion[] }
export function getQuizBank() {
  return lsGet<Record<string, QuizQuestion[]>>(KEYS.quiz, {});
}
export function getLessonQuiz(courseId: string, lessonId: string) {
  return getQuizBank()[`${courseId}:${lessonId}`] || [];
}
export function addLessonQuiz(courseId: string, lessonId: string, q: QuizQuestion) {
  const bank = getQuizBank();
  const k = `${courseId}:${lessonId}`;
  bank[k] = bank[k] || [];
  bank[k].push(q);
  lsSet(KEYS.quiz, bank);
}
export function clearLessonQuiz(courseId: string, lessonId: string) {
  const bank = getQuizBank();
  delete bank[`${courseId}:${lessonId}`];
  lsSet(KEYS.quiz, bank);
}

// Submission bank: { [courseId:lessonId]: Submission }
export function getSubmissions() {
  return lsGet<Record<string, Submission>>(KEYS.submit, {});
}
export function getSubmission(courseId: string, lessonId: string) {
  return getSubmissions()[`${courseId}:${lessonId}`] || null;
}
export function setSubmission(courseId: string, lessonId: string, s: Submission) {
  const all = getSubmissions();
  all[`${courseId}:${lessonId}`] = s;
  lsSet(KEYS.submit, all);
}
export function clearSubmission(courseId: string, lessonId: string) {
  const all = getSubmissions();
  delete all[`${courseId}:${lessonId}`];
  lsSet(KEYS.submit, all);
}

// Orders: { [courseId]: Order }
export function getOrders() {
  return lsGet<Record<string, Order>>(KEYS.order, {});
}
export function getCourseOrder(courseId: string) {
  return getOrders()[courseId] || null;
}
export function setCourseOrder(courseId: string, o: Order | null) {
  const all = getOrders();
  if (!o) delete all[courseId];
  else all[courseId] = o;
  lsSet(KEYS.order, all);
}
