// src/components/course-player/TabsPanel.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { Course } from "../../data/coursePlayer.demo";
import { getNote, setNote, clearNote } from "../../services/coursePlayer.storage";

export type PlayerTab = "overview" | "notes" | "qa" | "reviews";

export function TabsPanel({
  course,
  lessonId,
}: {
  course: Course;
  lessonId: string;
}) {
  const [tab, setTab] = useState<PlayerTab>("overview");
  const [note, setNoteState] = useState("");

  useEffect(() => {
    setNoteState(getNote(course.id, lessonId));
  }, [course.id, lessonId]);

  const info = useMemo(() => {
    const updatedAt = "2025-12-21";
    return { updatedAt };
  }, []);

  return (
    <div className="card p-4">
      <div className="flex flex-wrap gap-2">
        <button className={`tab-btn ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")}>
          <i className="fa-solid fa-circle-info" /> Tổng quan
        </button>
        <button className={`tab-btn ${tab === "notes" ? "active" : ""}`} onClick={() => setTab("notes")}>
          <i className="fa-solid fa-note-sticky" /> Ghi chú
        </button>
        <button className={`tab-btn ${tab === "qa" ? "active" : ""}`} onClick={() => setTab("qa")}>
          <i className="fa-solid fa-comments" /> Q&A
        </button>
        <button className={`tab-btn ${tab === "reviews" ? "active" : ""}`} onClick={() => setTab("reviews")}>
          <i className="fa-solid fa-star" /> Reviews
        </button>
      </div>

      <div className="mt-4">
        {tab === "overview" ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <div className="font-extrabold">Giới thiệu khóa học</div>
              <div className="mt-2 text-sm text-slate-700 leading-relaxed">
                Prototype “Udemy-like” cho Course Detail + Player: curriculum rõ ràng, done/locked, resume video,
                autoplay next, quiz/assignment. Khi bạn chuyển sang React/NestJS thật, thay state localStorage bằng API.
              </div>
              <div className="mt-3 text-sm text-slate-700">
                <b>Mẹo</b>: tách Player/Curriculum/Quiz/Assignment thành module UI riêng để dùng lại cho web + mobile.
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <div className="font-extrabold">Thông tin</div>
              <div className="mt-3 text-sm text-slate-700 grid gap-2">
                <div className="flex items-center justify-between"><span>Ngôn ngữ</span><b>Tiếng Việt</b></div>
                <div className="flex items-center justify-between"><span>Cấp độ</span><b>{course.level}</b></div>
                <div className="flex items-center justify-between"><span>Chứng chỉ</span><b>Có</b></div>
                <div className="flex items-center justify-between"><span>Cập nhật</span><b>{info.updatedAt}</b></div>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "notes" ? (
          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <div className="font-extrabold">Ghi chú của bạn</div>
            <textarea
              className="field mt-3"
              rows={6}
              value={note}
              onChange={(e) => setNoteState(e.target.value)}
              placeholder="Ghi chú theo bài học..."
            />
            <div className="mt-3 flex gap-2">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setNote(course.id, lessonId, note);
                  window.alert("Đã lưu ghi chú.");
                }}
              >
                <i className="fa-solid fa-floppy-disk mr-2" />
                Lưu
              </button>
              <button
                className="btn"
                onClick={() => {
                  if (!confirm("Xóa ghi chú của lesson này?")) return;
                  setNoteState("");
                  clearNote(course.id, lessonId);
                }}
              >
                <i className="fa-solid fa-trash mr-2" />
                Xóa
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-500">Prototype: lưu note theo lesson trong localStorage.</div>
          </div>
        ) : null}

        {tab === "qa" ? (
          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <div className="font-extrabold">Hỏi đáp (prototype)</div>
            <div className="mt-3 grid gap-3">
              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <div className="font-extrabold text-sm">Hỏi: Có giống Udemy không?</div>
                <div className="mt-1 text-sm text-slate-700">Trả lời: Có (resume/autoplay/locked/done + curriculum UX).</div>
              </div>
              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <div className="font-extrabold text-sm">Hỏi: Khi nào nối API?</div>
                <div className="mt-1 text-sm text-slate-700">Trả lời: Sau khi chốt UI, map localStorage → endpoint NestJS.</div>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "reviews" ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <div className="font-extrabold">{course.rating}/5</div>
              <div className="mt-2 text-sm text-slate-700">Dựa trên review demo</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="chip"><i className="fa-solid fa-star text-amber-500" /> UI rõ</span>
                <span className="chip"><i className="fa-solid fa-star text-amber-500" /> Player mượt</span>
                <span className="chip"><i className="fa-solid fa-star text-amber-500" /> Flow giống Udemy</span>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <div className="font-extrabold">Một số review</div>
              <div className="mt-3 grid gap-2 text-sm text-slate-700">
                <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                  <b>Học viên A</b> • “Curriculum + done/locked nhìn rất Udemy.”
                </div>
                <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                  <b>Học viên B</b> • “Quiz/assignment giúp flow giống nền tảng bán khóa học.”
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
