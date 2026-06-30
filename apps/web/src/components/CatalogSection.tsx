import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { withSiteBase } from "@/lib/site-paths";
import SfxCard, { type Sound } from "./SfxCard";

type Catalog = {
  version: string;
  sounds: Sound[];
};

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
    return true;
  }

  return target.isContentEditable;
}

export default function CatalogSection() {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(withSiteBase("/catalog.json"))
      .then((response) => response.json() as Promise<Catalog>)
      .then((catalog) => setSounds(catalog.sounds))
      .catch(() => setSounds([]));
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key !== "/" ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      if (isTypingTarget(event.target)) {
        return;
      }

      event.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.select();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  const handlePlay = useCallback((id: string) => {
    setActiveId((current) => (current === id ? null : id));
  }, []);

  const handleFinish = useCallback(() => {
    setActiveId(null);
  }, []);

  const showSearchShortcut = !query && !searchFocused;

  return (
    <section id="catalog" className="mx-auto max-w-6xl px-6 py-5 md:py-6">
      <div className="mb-5 flex flex-col gap-3">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-[-0.025em] leading-[1.05] md:text-3xl">
            Browse sounds
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Preview waveforms and copy sound ids for your agent.
          </p>
        </div>

        <div className="relative">
          <label className="block w-full">
            <span className="sr-only">Search sounds</span>
            <Input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search by id or tag…"
              className="h-11 rounded-xl bg-card px-4 pr-12"
            />
          </label>
          {showSearchShortcut ? (
            <kbd className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
              /
            </kbd>
          ) : null}
        </div>
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
        <p className="rounded-2xl bg-muted px-4 py-8 text-center text-sm text-muted-foreground ring-1 ring-border">
          No sounds match your search.
        </p>
      ) : null}
    </section>
  );
}
