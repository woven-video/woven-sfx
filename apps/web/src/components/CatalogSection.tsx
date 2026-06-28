import { useEffect, useMemo, useState } from "react";
import SfxCard, { type Sound } from "./SfxCard";

type Catalog = {
  version: string;
  sounds: Sound[];
};

export default function CatalogSection() {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/catalog.json")
      .then((response) => response.json() as Promise<Catalog>)
      .then((catalog) => setSounds(catalog.sounds))
      .catch(() => setSounds([]));
  }, []);

  const filteredSounds = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return sounds;
    }

    return sounds.filter(
      (sound) =>
        sound.id.toLowerCase().includes(normalizedQuery) ||
        sound.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)),
    );
  }, [query, sounds]);

  function handlePlay(id: string) {
    setActiveId((current) => (current === id ? null : id));
  }

  function handleFinish() {
    setActiveId(null);
  }

  return (
    <section
      id="catalog"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
            Catalog
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-200">
            Sounds
          </h2>
          <p className="mt-2 text-sm text-stone-400">
            Preview waveforms and copy sound ids for your agent.
          </p>
        </div>

        <label className="w-full sm:max-w-xs">
          <span className="sr-only">Search sounds</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by id or tag…"
            className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-200 placeholder:text-stone-600 focus:border-stone-600 focus:outline-none"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSounds.map((sound) => (
          <SfxCard
            key={sound.id}
            sound={sound}
            isPlaying={activeId === sound.id}
            onPlay={handlePlay}
            onFinish={handleFinish}
          />
        ))}
      </div>

      {filteredSounds.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-800 px-4 py-8 text-center text-sm text-stone-500">
          No sounds match your search.
        </p>
      ) : null}
    </section>
  );
}