import { useEffect, useRef, useState } from "react";
import type WaveSurfer from "wavesurfer.js";
import CopyButton from "./CopyButton";
import SfxWaveform from "./SfxWaveform";

export type Sound = {
  id: string;
  file: string;
  tags: string[];
  duration_ms: number;
  default_volume: number;
  url: string;
  peaks_url?: string;
};

type SfxCardProps = {
  sound: Sound;
  isPlaying: boolean;
  onPlay: (id: string) => void;
  onFinish: () => void;
};

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  );
}

export default function SfxCard({
  sound,
  isPlaying,
  onPlay,
  onFinish,
}: SfxCardProps) {
  const wsRef = useRef<WaveSurfer | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [peaksAvailable, setPeaksAvailable] = useState<boolean | null>(null);
  const primaryTag = sound.tags[0] ?? "sfx";

  useEffect(() => {
    if (peaksAvailable !== false) {
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      void audio.play();
      return;
    }

    audio.pause();
    audio.currentTime = 0;
  }, [isPlaying, peaksAvailable]);

  return (
    <article className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
      {peaksAvailable !== false ? (
        <div className="mb-3 min-h-8 overflow-hidden rounded-md bg-stone-950/60">
          <SfxWaveform
            id={sound.id}
            url={sound.url}
            durationMs={sound.duration_ms}
            playing={isPlaying}
            onFinish={onFinish}
            onPeaksAvailable={setPeaksAvailable}
            wsRef={wsRef}
          />
        </div>
      ) : null}

      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onPlay(sound.id)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-700 bg-stone-950 text-stone-200 transition-colors hover:border-stone-600 hover:bg-stone-800"
          aria-label={isPlaying ? `Pause ${sound.id}` : `Play ${sound.id}`}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-sm font-medium text-stone-200">
            {sound.id}
          </p>
          <p className="mt-0.5 text-sm text-stone-500">
            {sound.duration_ms}ms · {primaryTag}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <CopyButton text={sound.id} label="sound id" />
      </div>

      {peaksAvailable === false ? (
        <audio
          ref={audioRef}
          src={sound.url}
          preload="none"
          onEnded={onFinish}
          className="hidden"
        />
      ) : null}
    </article>
  );
}