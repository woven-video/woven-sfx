import { useEffect, useMemo, useState } from "react";

import { withSiteBase } from "@/lib/site-paths";

type SfxWaveformProps = {
  id: string;
  durationMs: number;
  media: HTMLAudioElement | null;
  height?: number;
  skeletonHeights?: number[];
};

const DEFAULT_BAR_HEIGHTS = [
  40, 65, 50, 80, 55, 70, 45, 60, 75, 50, 65, 40,
];

function WaveformSkeleton({
  height,
  barHeights,
}: {
  height: number;
  barHeights: number[];
}) {
  return (
    <div
      className="flex items-end gap-1"
      style={{ height }}
      aria-hidden="true"
    >
      {barHeights.map((barHeight, index) => (
        <div
          key={index}
          className="w-0.5 flex-1 animate-pulse rounded-full bg-muted-foreground/25"
          style={{ height: `${barHeight}%` }}
        />
      ))}
    </div>
  );
}

function WaveformBars({
  barHeights,
  tone,
}: {
  barHeights: number[];
  tone: "base" | "progress";
}) {
  return (
    <div className="flex h-full items-end gap-1">
      {barHeights.map((barHeight, index) => (
        <div
          key={`${tone}-${index}`}
          className={[
            "w-0.5 flex-1 rounded-full",
            tone === "progress"
              ? "bg-foreground/80"
              : "bg-muted-foreground/30 group-hover/card:bg-muted-foreground/45",
          ].join(" ")}
          style={{ height: `${barHeight}%` }}
        />
      ))}
    </div>
  );
}

export default function SfxWaveform({
  id,
  durationMs,
  media,
  height = 32,
  skeletonHeights,
}: SfxWaveformProps) {
  const [peaks, setPeaks] = useState<number[] | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setPeaks(null);

    fetch(withSiteBase(`/peaks/${id}.json`))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Peaks not found");
        }
        return response.json() as Promise<number[]>;
      })
      .then((data) => {
        if (!cancelled) {
          setPeaks(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPeaks([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!media) {
      setProgress(0);
      return;
    }

    let frame = 0;
    const durationSeconds = durationMs / 1000 || media.duration || 1;

    function updateProgress() {
      setProgress(Math.max(0, Math.min(1, media.currentTime / durationSeconds)));
    }

    function tick() {
      updateProgress();

      if (!media.paused && !media.ended) {
        frame = window.requestAnimationFrame(tick);
      }
    }

    function handlePlay() {
      window.cancelAnimationFrame(frame);
      tick();
    }

    function handleEnded() {
      setProgress(0);
    }

    updateProgress();
    media.addEventListener("play", handlePlay);
    media.addEventListener("pause", updateProgress);
    media.addEventListener("timeupdate", updateProgress);
    media.addEventListener("ended", handleEnded);

    if (!media.paused && !media.ended) {
      tick();
    }

    return () => {
      window.cancelAnimationFrame(frame);
      media.removeEventListener("play", handlePlay);
      media.removeEventListener("pause", updateProgress);
      media.removeEventListener("timeupdate", updateProgress);
      media.removeEventListener("ended", handleEnded);
    };
  }, [durationMs, media]);

  const barHeights = useMemo(() => {
    if (!peaks?.length) {
      return skeletonHeights ?? DEFAULT_BAR_HEIGHTS;
    }

    const maxPeak = Math.max(...peaks.map((peak) => Math.abs(peak)), 0.01);
    return peaks.map((peak) => {
      const normalized = Math.abs(peak) / maxPeak;
      return Math.max(16, Math.round(normalized * 100));
    });
  }, [peaks, skeletonHeights]);

  if (peaks === null) {
    return (
      <WaveformSkeleton
        height={height}
        barHeights={barHeights}
      />
    );
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{ height }}
      aria-label={`${id} waveform preview`}
    >
      <WaveformBars barHeights={barHeights} tone="base" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: `inset(0 ${Math.round((1 - progress) * 1000) / 10}% 0 0)`,
        }}
        aria-hidden="true"
      >
        <WaveformBars barHeights={barHeights} tone="progress" />
      </div>
    </div>
  );
}
