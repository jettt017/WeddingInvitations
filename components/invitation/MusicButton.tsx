"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Music2, Pause } from "lucide-react";

interface MusicContextValue {
  canPlay: boolean;
  isPlaying: boolean;
  toggle: () => void;
}

const MusicContext = createContext<MusicContextValue>({
  canPlay: false,
  isPlaying: false,
  toggle: () => undefined,
});

const musicSource = process.env.NEXT_PUBLIC_WEDDING_MUSIC_SRC?.trim() || "";

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const canPlay = Boolean(musicSource);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !canPlay) return;

    if (audio.paused) {
      void audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [canPlay]);

  const value = useMemo(() => ({ canPlay, isPlaying, toggle }), [canPlay, isPlaying, toggle]);

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

export default function MusicButton({ className = "" }: { className?: string }) {
  const { canPlay, isPlaying, toggle } = useContext(MusicContext);
  const label = canPlay
    ? isPlaying
      ? "Pause background music"
      : "Play background music"
    : "Background music will be available soon";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={!canPlay}
      onClick={toggle}
      className={`absolute z-30 flex size-[34px] items-center justify-center rounded-full bg-white text-black shadow-sm transition-transform enabled:active:scale-95 disabled:cursor-default ${className}`}
    >
      {isPlaying ? (
        <Pause aria-hidden="true" size={17} fill="currentColor" />
      ) : (
        <Music2 aria-hidden="true" size={19} />
      )}
    </button>
  );
}
