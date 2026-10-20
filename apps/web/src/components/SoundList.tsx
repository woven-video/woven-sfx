import { useCallback, useState } from "react";

import SfxCard, { type Sound } from "./SfxCard";

type SoundListProps = {
  sounds: Sound[];
};

/** Playable, downloadable cards for a fixed set of sounds (used by sound-type pages). */
export default function SoundList({ sounds }: SoundListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handlePlay = useCallback((id: string) => {
    setActiveId((current) => (current === id ? null : id));
  }, []);

  const handleFinish = useCallback(() => {
    setActiveId(null);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sounds.map((sound) => (
        <div key={sound.id} id={sound.id} className="scroll-mt-20">
          <SfxCard
            sound={sound}
            isPlaying={activeId === sound.id}
            onPlay={handlePlay}
            onFinish={handleFinish}
            downloadable
          />
        </div>
      ))}
    </div>
  );
}
