import { join } from "node:path";
import { TRANSITION_NONE, TRANSITION_PRIMARY } from "./pairings.js";
import type { Catalog, ResolvedSound } from "./types.js";
import { getSfxLibrary } from "./paths.js";

export function resolveForTransition(
  catalog: Catalog,
  transition: string,
): Omit<ResolvedSound, "localPath"> | null {
  const key = transition.toLowerCase();
  if (TRANSITION_NONE.has(key)) return null;

  const primaryId = TRANSITION_PRIMARY[key];
  if (!primaryId) return null;

  const sound = catalog.sounds.find((s) => s.id === primaryId);
  if (!sound) return null;

  return {
    id: sound.id,
    file: sound.file,
    duration_ms: sound.duration_ms,
    suggested_volume: sound.default_volume,
    url: sound.url,
  };
}

export function withLocalPath(
  resolved: Omit<ResolvedSound, "localPath">,
): ResolvedSound {
  return {
    ...resolved,
    localPath: join(getSfxLibrary(), resolved.file),
  };
}