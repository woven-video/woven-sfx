/**
 * Generate waveform peak JSON for catalog cards.
 *
 * For each sound in catalog/sounds:
 * - If sounds/{id}.wav exists AND audiowaveform is installed → real peaks via audiowaveform
 * - Otherwise → synthetic 32-bar peaks derived from sound id hash (dev fallback)
 *
 * Output: apps/web/public/peaks/{id}.json
 *
 * Install audiowaveform for real peaks: brew install audiowaveform
 */
import {
  readdir,
  readFile,
  writeFile,
  mkdir,
  access,
} from "node:fs/promises";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { constants } from "node:fs";
import { tmpdir } from "node:os";

const CATALOG_SOUNDS = join(import.meta.dirname, "../catalog/sounds");
const SOUNDS = join(import.meta.dirname, "../sounds");
const OUT = join(import.meta.dirname, "../apps/web/public/peaks");

const SYNTHETIC_BAR_COUNT = 32;

function hasAudiowaveform(): boolean {
  try {
    execSync("audiowaveform --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/** Deterministic 32-bar peaks from sound id (0–1 range for wavesurfer). */
function syntheticPeaksFromId(id: string): number[] {
  let seed = 0;
  for (let i = 0; i < id.length; i++) {
    seed = (seed * 31 + id.charCodeAt(i)) >>> 0;
  }

  const peaks: number[] = [];
  for (let i = 0; i < SYNTHETIC_BAR_COUNT; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const noise = (seed & 0xffff) / 0xffff;
    const envelope = Math.sin((i / SYNTHETIC_BAR_COUNT) * Math.PI);
    const bar = 0.15 + noise * 0.7 * envelope;
    peaks.push(Math.round(bar * 1000) / 1000);
  }
  return peaks;
}

async function realPeaksFromWav(wavPath: string, id: string): Promise<number[]> {
  const tmpOut = join(tmpdir(), `woven-sfx-peaks-${id}.json`);
  execSync(
    `audiowaveform -i "${wavPath}" -o "${tmpOut}" -b 8`,
    { stdio: "pipe" },
  );
  const raw = await readFile(tmpOut, "utf-8");
  const data = JSON.parse(raw) as { data?: number[] } | number[];
  const peaks = Array.isArray(data) ? data : (data.data ?? []);
  return peaks.map((v) => (typeof v === "number" ? v / 128 : 0));
}

async function loadSoundIds(): Promise<string[]> {
  const files = (await readdir(CATALOG_SOUNDS)).filter((f) =>
    f.endsWith(".json"),
  );
  const ids = await Promise.all(
    files.map(async (f) => {
      const sound = JSON.parse(
        await readFile(join(CATALOG_SOUNDS, f), "utf-8"),
      ) as { id: string };
      return sound.id;
    }),
  );
  return ids.sort((a, b) => a.localeCompare(b));
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const ids = await loadSoundIds();
  const audiowaveformAvailable = hasAudiowaveform();
  let realCount = 0;
  let syntheticCount = 0;

  for (const id of ids) {
    const wavPath = join(SOUNDS, `${id}.wav`);
    const useReal =
      audiowaveformAvailable && (await fileExists(wavPath));

    const peaks = useReal
      ? await realPeaksFromWav(wavPath, id)
      : syntheticPeaksFromId(id);

    await writeFile(join(OUT, `${id}.json`), JSON.stringify(peaks));
    console.error(`peaks: ${id}${useReal ? "" : " (synthetic)"}`);

    if (useReal) realCount++;
    else syntheticCount++;
  }

  console.error(
    `Generated ${ids.length} peak files (${realCount} real, ${syntheticCount} synthetic)`,
  );
  if (syntheticCount > 0 && !audiowaveformAvailable) {
    console.error(
      "Note: audiowaveform not found — using synthetic peaks. Install: brew install audiowaveform",
    );
  }
}

main();