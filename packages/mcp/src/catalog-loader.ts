import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Catalog } from "@woven-sfx/core";

let cache: Catalog | null = null;

export async function loadCatalog(): Promise<Catalog> {
  if (cache) return cache;
  const dir = dirname(fileURLToPath(import.meta.url));
  const raw = await readFile(join(dir, "../catalog.json"), "utf-8");
  cache = JSON.parse(raw) as Catalog;
  return cache;
}