import { homedir } from "node:os";
import { join } from "node:path";

export function getSfxHome(): string {
  const base = process.env.XDG_DATA_HOME ?? join(homedir(), ".local", "share");
  return join(base, "woven-sfx");
}

export function getSfxLibrary(): string {
  return join(getSfxHome(), "library");
}

export const DEFAULT_CDN_BASE = "https://sfx.woven.video";