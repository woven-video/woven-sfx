import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";

/** Default when no project.md or env override — relative to process cwd. */
export const DEFAULT_LIBRARY_RELATIVE = "sounds/sfx";

export function expandHome(path: string): string {
  if (path === "~") return homedir();
  if (path.startsWith("~/")) return join(homedir(), path.slice(2));
  return path;
}

function resolveLibraryPath(raw: string, baseDir: string): string {
  const expanded = expandHome(raw.trim()).replace(/\/+$/, "");
  return isAbsolute(expanded) ? expanded : resolve(baseDir, expanded);
}

/** Walk up from startDir for `.claude/project.md` and read `sfx-library`. */
export function findProjectSfxLibrary(
  startDir: string = process.cwd(),
): string | undefined {
  let dir = resolve(startDir);
  const root = resolve("/");

  while (true) {
    const projectMd = join(dir, ".claude", "project.md");
    if (existsSync(projectMd)) {
      const content = readFileSync(projectMd, "utf8");
      const match = content.match(/^sfx-library:\s*(.+)$/m);
      if (match) return resolveLibraryPath(match[1], dir);
      return undefined;
    }
    if (dir === root) break;
    const parent = resolve(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }

  return undefined;
}

/**
 * Resolve where pulled .wav files live. Priority:
 * 1. WOVEN_SFX_LIBRARY env (absolute or relative to cwd)
 * 2. sfx-library in nearest .claude/project.md (same as /edit-plan)
 * 3. ./sounds/sfx/ under cwd
 */
export function getSfxLibrary(cwd: string = process.cwd()): string {
  const env = process.env.WOVEN_SFX_LIBRARY;
  if (env) return resolveLibraryPath(env, cwd);

  const fromProject = findProjectSfxLibrary(cwd);
  if (fromProject) return fromProject;

  return resolve(cwd, DEFAULT_LIBRARY_RELATIVE);
}

/** @deprecated Global home path — prefer getSfxLibrary() for project-local storage. */
export function getSfxHome(): string {
  return join(
    process.env.XDG_DATA_HOME ?? join(homedir(), ".local", "share"),
    "woven-sfx",
  );
}