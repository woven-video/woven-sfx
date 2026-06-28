import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  DEFAULT_LIBRARY_RELATIVE,
  findProjectSfxLibrary,
  getSfxLibrary,
} from "./paths.js";

const originalEnv = process.env.WOVEN_SFX_LIBRARY;

afterEach(() => {
  if (originalEnv === undefined) delete process.env.WOVEN_SFX_LIBRARY;
  else process.env.WOVEN_SFX_LIBRARY = originalEnv;
});

describe("paths", () => {
  it("defaults to sounds/sfx under cwd", () => {
    const cwd = "/tmp/my-reel";
    expect(getSfxLibrary(cwd)).toBe(join(cwd, DEFAULT_LIBRARY_RELATIVE));
  });

  it("respects WOVEN_SFX_LIBRARY env", () => {
    process.env.WOVEN_SFX_LIBRARY = "assets/sfx";
    expect(getSfxLibrary("/tmp/reel")).toBe("/tmp/reel/assets/sfx");
  });

  it("reads sfx-library from nearest project.md", async () => {
    const root = await mkdtemp(join(tmpdir(), "woven-sfx-test-"));
    const reelDir = join(root, "content", "reels", "week-26", "hook");
    await mkdir(join(root, ".claude"), { recursive: true });
    await mkdir(reelDir, { recursive: true });
    await writeFile(
      join(root, ".claude", "project.md"),
      "---\nname: test\n---\n\nsfx-library: assets/sfx/\n",
    );

    expect(findProjectSfxLibrary(reelDir)).toBe(join(root, "assets", "sfx"));
    expect(getSfxLibrary(reelDir)).toBe(join(root, "assets", "sfx"));
  });

  it("expands tilde paths from project.md", async () => {
    const root = await mkdtemp(join(tmpdir(), "woven-sfx-test-"));
    await mkdir(join(root, ".claude"), { recursive: true });
    await writeFile(
      join(root, ".claude", "project.md"),
      "sfx-library: ~/projects/remotion/shared-assets/sfx/\n",
    );

    expect(findProjectSfxLibrary(root)).toMatch(/remotion\/shared-assets\/sfx$/);
  });
});