"use client";
import { useRef, useEffect } from "react";

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  return (
    <div className="!fixed top-0 left-0 z-0 w-full h-full overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="https://cdn.pixabay.com/video/2024/06/07/215694_large.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 via-transparent to-slate-950/20" />
    </div>
  );
}