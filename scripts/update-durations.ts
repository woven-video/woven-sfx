import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { execSync } from "node:child_process";

const CATALOG_SOUNDS = join(import.meta.dirname, "../catalog/sounds");
const SOUNDS_DIR = join(import.meta.dirname, "../sounds");

function durationMs(wavPath: string): number {
  const out = execSync(
    `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${wavPath}"`,
    { encoding: "utf-8" },
  ).trim();
  return Math.round(parseFloat(out) * 1000);
}

async function main() {
  const files = (await readdir(CATALOG_SOUNDS)).filter((f) =>
    f.endsWith(".json"),
  );
  let updated = 0;

  for (const file of files) {
    const path = join(CATALOG_SOUNDS, file);
    const sound = JSON.parse(await readFile(path, "utf-8"));
    const wav = join(SOUNDS_DIR, `${sound.id}.wav`);
    try {
      const ms = durationMs(wav);
      if (sound.duration_ms !== ms) {
        sound.duration_ms = ms;
        await writeFile(path, `${JSON.stringify(sound, null, 2)}\n`);
        updated++;
        console.error(`  ${sound.id}: ${ms}ms`);
      }
    } catch {
      console.error(`  skip ${sound.id} (no wav)`);
    }
  }

  console.error(`Updated ${updated} catalog entries`);
}

main();