import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const SOUNDS_DIR = join(import.meta.dirname, "../catalog/sounds");
const OUT_PATHS = [
  join(import.meta.dirname, "../apps/web/public/catalog.json"),
  join(import.meta.dirname, "../packages/mcp/catalog.json"),
];
const SFX_ASSET_BASE_URL =
  process.env.SFX_ASSET_BASE_URL ?? "https://assets.sfx.woven.video";
const SFX_SITE_URL =
  process.env.SFX_SITE_URL ?? "https://www.woven.video/sfx";

async function main() {
  const files = (await readdir(SOUNDS_DIR)).filter((f) => f.endsWith(".json"));
  const sounds = await Promise.all(
    files.map(async (f) => {
      const raw = await readFile(join(SOUNDS_DIR, f), "utf-8");
      const sound = JSON.parse(raw);
      return {
        ...sound,
        file: sound.file ?? `${sound.id}.wav`,
        url: sound.url ?? `${SFX_ASSET_BASE_URL}/sfx/${sound.id}.wav`,
        peaks_url: sound.peaks_url ?? `${SFX_SITE_URL}/peaks/${sound.id}.json`,
      };
    }),
  );
  sounds.sort((a, b) => a.id.localeCompare(b.id));
  const catalog = { version: "1.0.0", sounds };
  for (const out of OUT_PATHS) {
    await mkdir(join(out, ".."), { recursive: true });
    await writeFile(out, JSON.stringify(catalog, null, 2));
  }
  console.error(`Built catalog with ${sounds.length} sounds`);
}

main();
