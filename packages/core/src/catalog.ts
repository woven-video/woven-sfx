import type { Catalog, Sound } from "./types.js";

export function searchCatalog(
  catalog: Catalog,
  opts: { tag?: string; transition?: string; query?: string },
): Sound[] {
  let results = catalog.sounds;
  if (opts.tag) {
    const t = opts.tag.toLowerCase();
    results = results.filter((s) => s.tags.some((tag) => tag.toLowerCase() === t));
  }
  if (opts.transition) {
    const tr = opts.transition.toLowerCase();
    results = results.filter((s) =>
      s.pairings?.transition?.some((p) => p.toLowerCase() === tr),
    );
  }
  if (opts.query) {
    const q = opts.query.toLowerCase();
    results = results.filter(
      (s) => s.id.includes(q) || s.tags.some((t) => t.includes(q)),
    );
  }
  return results;
}