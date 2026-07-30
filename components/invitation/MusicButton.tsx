"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Music2, Pause } from "lucide-react";

interface MusicContextValue {
  canPlay: boolean;
  isPlaying: boolean;
  play: () => void;
  toggle: () => void;
}

const MusicContext = createContext<MusicContextValue>({
  canPlay: false,
  isPlaying: false,
  play: () => undefined,
  toggle: () => undefined,
});

const musicSource = process.env.NEXT_PUBLIC_WEDDING_MUSIC_SRC?.trim() || "";

export const roundControlButtonClassName =
  "flex size-[34px] items-center justify-center rounded-full bg-white text-black shadow-sm transition-transform focus-visible:ring-2 focus-visible:ring-black/35 focus-visible:outline-none enabled:active:scale-95 disabled:cursor-default disabled:opacity-70";

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const canPlay = Boolean(musicSource);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !canPlay) return;

    void audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [canPlay]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !canPlay) return;

    if (audio.paused) {
      play();
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [canPlay, play]);

  const value = useMemo(
    () => ({ canPlay, isPlaying, play, toggle }),
    [canPlay, isPlaying, play, toggle]
  );

  return (
    <MusicContext.Provider value={value}>
      {children}
      {canPlay ? (
        <audio
          ref={audioRef}
          src={musicSource}
          loop
          preload="none"
          onEnded={() => setIsPlaying(false)}
        />
      ) : null}
    </MusicContext.Provider>
  );
}

export function useWeddingMusic() {
  return useContext(MusicContext);
}

export default function MusicButton({ className = "" }: { className?: string }) {
  const { canPlay, isPlaying, toggle } = useContext(MusicContext);
  const label = canPlay
    ? isPlaying
      ? "Pause background music"
      : "Play background music"
    : "Background music will be available soon";

  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      disabled={!canPlay}
      onClick={toggle}
      animate={isPlaying ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={
        isPlaying
          ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.2, ease: "easeOut" }
      }
      whileTap={canPlay ? { scale: 0.94 } : undefined}
      className={`${roundControlButtonClassName} relative overflow-visible ${className}`}
      data-music-state={canPlay ? (isPlaying ? "playing" : "paused") : "disabled"}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-[-5px] rounded-full border border-[#7C5649]/35 ${
          isPlaying ? "animate-ping motion-reduce:animate-none" : "opacity-0"
        }`}
      />
      <motion.span
        aria-hidden="true"
        animate={isPlaying ? { rotate: [0, -8, 8, 0] } : { rotate: 0 }}
        transition={
          isPlaying
            ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.2, ease: "easeOut" }
        }
        className="relative z-10 flex items-center justify-center"
      >
        {isPlaying ? <Pause size={17} fill="currentColor" /> : <Music2 size={19} />}
      </motion.span>
      {!canPlay ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute z-20 h-px w-[22px] rotate-45 bg-current opacity-60"
        />
      ) : null}
    </motion.button>
  );
}
