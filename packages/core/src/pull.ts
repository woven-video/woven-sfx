import { mkdir, writeFile, access } from "node:fs/promises";
import { join } from "node:path";
import { getSfxLibrary, resolveAssetUrl } from "./paths.js";
import type { Catalog, Sound } from "./types.js";

export async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function pullSound(sound: Sound): Promise<string> {
  const dir = getSfxLibrary();
  await mkdir(dir, { recursive: true });
  const dest = join(dir, sound.file);
  if (await fileExists(dest)) return dest;

  const downloadUrl = resolveAssetUrl(sound.url);
  const res = await fetch(downloadUrl);
  if (!res.ok) {
    throw new Error(`Failed to download ${downloadUrl}: ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return dest;
}

export function findSoundById(catalog: Catalog, id: string): Sound | undefined {
  return catalog.sounds.find((s) => s.id === id);
}