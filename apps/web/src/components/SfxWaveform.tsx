import { useEffect, useState } from "react";
import WavesurferPlayer from "@wavesurfer/react";
import type WaveSurfer from "wavesurfer.js";

type SfxWaveformProps = {
  id: string;
  url: string;
  durationMs: number;
  playing: boolean;
  onFinish: () => void;
  onPeaksAvailable: (available: boolean) => void;
  wsRef: React.MutableRefObject<WaveSurfer | null>;
};

export default function SfxWaveform({
  id,
  url,
  durationMs,
  playing,
  onFinish,
  onPeaksAvailable,
  wsRef,
}: SfxWaveformProps) {
  const [peaks, setPeaks] = useState<number[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPeaks(null);

    fetch(`/peaks/${id}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Peaks not found");
        }
        return response.json() as Promise<number[]>;
      })
      .then((data) => {
        if (!cancelled) {
          setPeaks(data);
          onPeaksAvailable(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          onPeaksAvailable(false);
        }
      });

    return () => {
      cancelled = true;
      wsRef.current = null;
    };
  }, [id, onPeaksAvailable, wsRef]);

  useEffect(() => {
    const ws = wsRef.current;
    if (!ws) {
      return;
    }

    if (playing) {
      void ws.play();
      return;
    }

    ws.pause();
    ws.seekTo(0);
  }, [playing, wsRef]);

  if (!peaks) {
    return null;
  }

  return (
    <WavesurferPlayer
      url={url}
      peaks={[peaks]}
      duration={durationMs / 1000}
      height={32}
      waveColor="#57534e"
      progressColor="#fafafa"
      cursorWidth={0}
      interact={false}
      barWidth={2}
      barGap={1}
      normalize
      onReady={(ws) => {
        wsRef.current = ws;
        if (playing) {
          void ws.play();
        }
      }}
      onFinish={onFinish}
    />
  );
}