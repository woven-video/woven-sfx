import { readdir } from "node:fs/promises";
import { getSfxLibrary } from "./paths.js";

export async function listInstalled(): Promise<string[]> {
  try {
    const files = await readdir(getSfxLibrary());
    return files.filter((f) => f.endsWith(".wav")).sort();
  } catch {
    return [];
  }
}