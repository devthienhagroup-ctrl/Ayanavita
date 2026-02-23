// src/components/course-player/modals/QuizBuilderModal.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { addLessonQuiz, markDone, uid, type QuizQuestion } from "../../../services/coursePlayer.storage";
import { useEscapeKey, useOutsideClick, useScrollLock } from "../../../hooks/useUiGuards";

export function QuizBuilderModal({
  open,
  onClose,
  courseId,
  lessonId,
}: {
  open: boolean;
  onClose: () => void;
  courseId: string;
  lessonId: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useScrollLock(open);
  useEscapeKey(() => open && onClose(), open);
  useOutsideClick(ref, () => open && onClose(), open);

  const [text, setText] = useState("");
  const [point, setPoint] = useState(1);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");
  const [correct, setCorrect] = useState<"A" | "B" | "C" | "D">("A");
  const [explain, setExplain] = useState("");

  useEffect(() => {
    if (!open) return;
    setText("");
    setPoint(1);
    setA(""); setB(""); setC(""); setD("");
    setCorrect("A");
    setExplain("");
  }, [open]);

  const canSave = useMemo(() => {
    if (!text.trim()) return false;
    if (!a.trim() || !b.trim()) return false;
    return true;
  }, [text, a, b]);

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div ref={ref} className="card w-full max-w-4xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-extrabold text-slate-500">Quiz Builder</div>
            <div className="text-lg font-extrabold">Tạo/Sửa câu hỏi</div>
          </div>
          <button className="btn h-10 w-10 p-0" onClick={onClose} type="button">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="p-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="text-sm font-extrabold text-slate-700">Câu hỏi *</label>
              <input className="field mt-2" value={text} onChange={(e) => setText(e.target.value)} placeholder="Ví dụ: JWT là gì?" />
            </div>
            <div>
              <label className="text-sm font-extrabold text-slate-700">Điểm</label>
              <input className="field mt-2" type="number" min={0} value={point} onChange={(e) => setPoint(Number(e.target.value))} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="font-extrabold">Đáp án</div>
              <div className="mt-3 grid gap-2">
                <input className="field" value={a} onChange={(e) => setA(e.target.value)} placeholder="A) ..." />
                <input className="field" value={b} onChange={(e) => setB(e.target.value)} placeholder="B) ..." />
                <input className="field" value={c} onChange={(e) => setC(e.target.value)} placeholder="C) ..." />
                <input className="field" value={d} onChange={(e) => setD(e.target.value)} placeholder="D) ..." />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="font-extrabold">Chấm điểm</div>
              <div className="mt-3 grid gap-2 text-sm text-slate-700">
                <label className="font-extrabold text-slate-700">Đáp án đúng</label>
                <select className="field" value={correct} onChange={(e) => setCorrect(e.target.value as any)}>
                  <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                </select>

                <label className="font-extrabold text-slate-700 mt-2">Giải thích (tuỳ chọn)</label>
                <textarea className="field" rows={4} value={explain} onChange={(e) => setExplain(e.target.value)} placeholder="Vì sao đáp án đúng là..." />

                <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200 text-xs text-slate-600">
                  Prototype: lưu quiz vào localStorage theo lesson.
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">Mỗi lesson (type=quiz) có nhiều câu hỏi.</div>
            <div className="flex gap-2">
              <button className="btn" onClick={onClose} type="button">Hủy</button>
              <button
                className="btn btn-primary"
                disabled={!canSave}
                onClick={() => {
                  if (!canSave) return;
                  const q: QuizQuestion = {
                    id: uid("Q"),
                    text: text.trim(),
                    point: Number(point || 0),
                    answers: { A: a.trim(), B: b.trim(), C: c.trim(), D: d.trim() },
                    correct,
                    explain: explain.trim(),
                  };
                  addLessonQuiz(courseId, lessonId, q);
                  markDone(courseId, lessonId);
                  onClose();
                  window.alert("Đã lưu câu hỏi quiz (prototype).");
                }}
                type="button"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
