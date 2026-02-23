import { useEffect, useMemo, useRef, useState } from "react";
import { getResume, setResume } from "../shared/playerStorage";

export function useVideoPlayer(args: {
  courseId: string;
  lessonId: string;
  src?: string;
  enabled: boolean; // chỉ true khi Enrollment ACTIVE + lesson type video
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [speed, setSpeed] = useState(1);

  // apply speed
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    try { v.playbackRate = Number(speed || 1); } catch {}
  }, [speed, args.lessonId]);

  // restore resume
  useEffect(() => {
    if (!args.enabled) return;
    const v = videoRef.current;
    if (!v) return;

    const t = getResume(args.courseId, args.lessonId);
    if (!(t > 2)) return;

    const onMeta = () => {
      const max = Math.max(0, (v.duration || 0) - 2);
      v.currentTime = Math.min(t, max);
      v.removeEventListener("loadedmetadata", onMeta);
    };

    v.addEventListener("loadedmetadata", onMeta);
    return () => v.removeEventListener("loadedmetadata", onMeta);
  }, [args.courseId, args.lessonId, args.enabled]);

  // persist resume throttle
  useEffect(() => {
    if (!args.enabled) return;
    const v = videoRef.current;
    if (!v) return;

    let last = 0;
    const onTime = () => {
      const now = Date.now();
      if (now - last < 1500) return;
      last = now;
      setResume(args.courseId, args.lessonId, v.currentTime || 0);
    };

    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [args.courseId, args.lessonId, args.enabled]);

  const toggleFullscreen = async () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await wrap.requestFullscreen();
    } catch {
      window.alert("Fullscreen không khả dụng.");
    }
  };

  const togglePiP = async () => {
    const v = videoRef.current as any;
    if (!v) return;
    try {
      if ((document as any).pictureInPictureElement) {
        await (document as any).exitPictureInPicture();
      } else {
        await v.requestPictureInPicture();
      }
    } catch {
      window.alert("PiP không khả dụng trên trình duyệt này.");
    }
  };

  return { videoRef, wrapRef, speed, setSpeed, toggleFullscreen, togglePiP };
}
