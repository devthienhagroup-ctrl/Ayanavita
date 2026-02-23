// src/components/course-player/modals/AssignmentModal.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getSubmission, markDone, setSubmission, type Submission } from "../../../services/coursePlayer.storage";
import { useEscapeKey, useOutsideClick, useScrollLock } from "../../../hooks/useUiGuards";

export function AssignmentModal({
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

  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (!open) return;
    const exist = getSubmission(courseId, lessonId);
    setLink(exist?.link || "");
    setNote(exist?.note || "");
    setFileName(exist?.fileName || "");
  }, [open, courseId, lessonId]);

  const canSave = useMemo(() => true, []);

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div ref={ref} className="card w-full max-w-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-extrabold text-slate-500">Assignment</div>
            <div className="text-lg font-extrabold">Nộp bài</div>
          </div>
          <button className="btn h-10 w-10 p-0" onClick={onClose} type="button">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="p-6 grid gap-4">
          <div>
            <label className="text-sm font-extrabold text-slate-700">
              Link bài làm (Google Drive/GitHub/Notion)
            </label>
            <input className="field mt-2" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="font-extrabold text-sm">Upload file (prototype)</div>
            <div className="mt-2 text-sm text-slate-600">
              Chỉ mô phỏng: chọn file để hiển thị tên; không upload thật.
            </div>
            <input
              type="file"
              className="mt-3 block w-full text-sm"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setFileName(f ? f.name : fileName);
              }}
            />
            <div className="mt-2 text-sm font-extrabold text-slate-700">
              {fileName ? `File: ${fileName}` : ""}
            </div>
          </div>

          <div>
            <label className="text-sm font-extrabold text-slate-700">Ghi chú</label>
            <textarea className="field mt-2" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Mô tả cách làm, yêu cầu hỗ trợ..." />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">Prototype: lưu submission vào localStorage.</div>
            <div className="flex gap-2">
              <button className="btn" onClick={onClose} type="button">Hủy</button>
              <button
                className="btn btn-primary"
                disabled={!canSave}
                onClick={() => {
                  const s: Submission = {
                    link: link.trim(),
                    note: note.trim(),
                    fileName: fileName || "",
                    submittedAt: new Date().toISOString(),
                  };
                  setSubmission(courseId, lessonId, s);
                  markDone(courseId, lessonId);
                  onClose();
                  window.alert("Đã nộp bài (prototype).");
                }}
                type="button"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
