import type { Catalog, Sound } from "./types.js";

export type SearchCatalogOptions = {
  tag?: string;
  query?: string;
  limit?: number;
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokens(value: string): string[] {
  return normalize(value).split(/\s+/).filter(Boolean);
}

function searchableText(sound: Sound): string {
  return normalize([sound.id, sound.file, ...sound.tags].join(" "));
}

function scoreSound(sound: Sound, query: string): number {
  const q = normalize(query);
  if (!q) return 0;

  const terms = tokens(query);
  const id = normalize(sound.id);
  const file = normalize(sound.file);
  const tagText = normalize(sound.tags.join(" "));
  const text = searchableText(sound);

  let score = 0;
  if (id === q) score += 100;
  if (id.startsWith(q)) score += 60;
  if (id.includes(q)) score += 40;
  if (file.includes(q)) score += 25;
  if (sound.tags.some((tag) => normalize(tag) === q)) score += 35;
  if (tagText.includes(q)) score += 20;

  const matchedTerms = terms.filter((term) => text.includes(term)).length;
  if (matchedTerms === terms.length) score += 30 + matchedTerms;
  else score += matchedTerms * 4;

  return score;
}

export function searchCatalog(
  catalog: Catalog,
  opts: SearchCatalogOptions,
): Sound[] {
  let results = catalog.sounds;

  if (opts.tag) {
    const tag = normalize(opts.tag);
    results = results.filter((sound) =>
      sound.tags.some((candidate) => normalize(candidate) === tag),
    );
  }

  if (opts.query) {
    results = results
      .map((sound, index) => ({ sound, index, score: scoreSound(sound, opts.query!) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .map((entry) => entry.sound);
  }

  if (opts.limit && opts.limit > 0) {
    results = results.slice(0, opts.limit);
  }

  return results;
}
