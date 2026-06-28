import { access, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Catalog } from "@woven-sfx/core";

let cache: Catalog | null = null;

async function resolveCatalogPath(dir: string): Promise<string> {
  const candidates = [join(dir, "catalog.json"), join(dir, "../catalog.json")];
  for (const path of candidates) {
    try {
      await access(path);
      return path;
    } catch {
      /* try next */
    }
  }
  return candidates[1];
}

export async function loadCatalog(): Promise<Catalog> {
  if (cache) return cache;
  const dir = dirname(fileURLToPath(import.meta.url));
  const raw = await readFile(await resolveCatalogPath(dir), "utf-8");
  cache = JSON.parse(raw) as Catalog;
  return cache;
}