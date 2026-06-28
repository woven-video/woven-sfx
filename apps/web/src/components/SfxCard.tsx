import { useCallback, useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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

function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }

  const seconds = ms / 1000;
  return seconds < 10 ? `${seconds.toFixed(1)}s` : `${Math.round(seconds)}s`;
}

export default function SfxCard({
  sound,
  isPlaying,
  onPlay,
  onFinish,
}: SfxCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);

  const setAudioRef = useCallback((node: HTMLAudioElement | null) => {
    audioRef.current = node;
    setAudioEl(node);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.currentTime = 0;
      void audio.play().catch(() => onFinish());
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isPlaying, onFinish]);

  const metadata = [
    isPlaying ? "Playing" : formatDuration(sound.duration_ms),
    ...sound.tags,
  ].join(" · ");

  return (
    <Card className="group/card gap-0 overflow-hidden py-0">
      <CardContent className="flex flex-col gap-3 pt-4 pb-4">
        <div className="flex min-w-0 items-center gap-0.5">
          <p
            className="min-w-0 truncate font-mono text-base font-semibold text-foreground"
            title={sound.id}
          >
            {sound.id}
          </p>
          <CopyButton
            text={sound.id}
            label="sound id"
            variant="icon"
            className="shrink-0 text-muted-foreground opacity-70 transition-opacity hover:text-foreground group-hover/card:opacity-100"
          />
        </div>

        <p className="truncate text-sm text-muted-foreground" title={metadata}>
          {metadata}
        </p>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              "size-8 shrink-0 rounded-full",
              isPlaying &&
                "border-foreground/25 bg-muted text-foreground hover:bg-muted",
            )}
            onClick={() => onPlay(sound.id)}
            aria-label={isPlaying ? `Pause ${sound.id}` : `Play ${sound.id}`}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </Button>

          <div className="min-h-10 min-w-0 flex-1 overflow-hidden">
            <SfxWaveform
              id={sound.id}
              durationMs={sound.duration_ms}
              media={audioEl}
              height={40}
            />
          </div>
        </div>
      </CardContent>

      <audio
        ref={setAudioRef}
        src={sound.url}
        preload="none"
        onEnded={onFinish}
        className="hidden"
      />
    </Card>
  );
}
