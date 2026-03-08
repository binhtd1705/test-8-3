"use client";

import { useState, useRef, useEffect } from "react";

export function DiskPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  return (
    <>
      {/* Audio element - using a royalty-free wedding music URL */}
      <audio
        ref={audioRef}
        loop
        preload="none"
        src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"
      />

      <button
        onClick={toggle}
        className="disk-player"
        title={playing ? "Tạm dừng nhạc" : "Phát nhạc"}
        aria-label={playing ? "Tạm dừng nhạc" : "Phát nhạc"}
      >
        <div className={`disk-inner ${playing ? "disk-playing" : ""}`}
          style={playing ? { animation: "diskRotate 3s linear infinite" } : {}}>
          <div className="disk-center" />
        </div>
      </button>
    </>
  );
}
