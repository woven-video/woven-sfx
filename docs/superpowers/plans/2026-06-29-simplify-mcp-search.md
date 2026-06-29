# Simplify MCP Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Woven SFX sound-first: users and agents search for sound effects directly, then pull the chosen sound by id. Remove the public transition-resolve workflow.

**Architecture:** Keep `packages/core` responsible for catalog search and local-library mechanics. Keep `packages/mcp` as a thin stdio wrapper over core. Remove the public `sfx_resolve` MCP tool and delete unused transition resolver code so docs, MCP metadata, and implementation all describe the same simple flow.

**Tech Stack:** TypeScript, Vitest, Node built-in test runner, `@modelcontextprotocol/server@2.0.0-alpha.3`, Zod, Astro static site.

**Docs digest:** `docs/superpowers/research/2026-06-29-mcp-search-docs.md`

---

## File Map

| Path | Responsibility |
|---|---|
| `packages/core/src/catalog.ts` | Sound-first search and ranking |
| `packages/core/src/catalog.test.ts` | Search behavior tests |
| `packages/core/src/index.ts` | Public core exports |
| `packages/core/src/pairings.ts` | Delete; transition defaults are leaving public behavior |
| `packages/core/src/resolve.ts` | Delete; no public resolve workflow |
| `packages/core/src/resolve.test.ts` | Delete with resolver |
| `packages/core/src/types.ts` | Remove unused `ResolvedSound`; keep `Sound.pairings` as optional catalog metadata |
| `packages/mcp/src/index.ts` | Register only `sfx_search`, `sfx_pull`, `sfx_list_installed` |
| `packages/mcp/package.json` | Bump to `0.2.0`; add MCP surface test script |
| `packages/mcp/test/public-tools.test.mjs` | JSON-RPC smoke test for public tool list and search |
| `skills/woven-sfx/SKILL.md` | Teach search + pull workflow |
| `skills/woven-sfx/references/mcp-setup.md` | Update required tool list |
| `skills/woven-sfx/references/pairings.md` | Delete |
| `apps/web/public/skill.md` | Sync from skill |
| `apps/web/public/llms.txt` | Public agent summary |
| `apps/web/src/components/Hero.astro` | Hero subhead: search/pull, not resolve/transition |
| `apps/web/src/components/McpToolsList.tsx` | Show three tools |
| `apps/web/src/components/HowItWorksTimeline.tsx` | Explain search -> pull -> local file |
| `apps/web/src/lib/seo/constants.ts` | Remove transition-first copy |
| `apps/web/src/lib/seo/faqs.ts` | Update MCP tools and workflow FAQ |
| `apps/web/src/lib/seo/schema.ts` | Update feature/tool text |
| `README.md` | Update public usage and tool list |
| `apps/web/public/og-image.png` | Refresh only if visible copy changes in the preview screenshot |

---

### Task 1: Make Core Search Sound-First

**Files:**
- Modify: `packages/core/src/catalog.test.ts`
- Modify: `packages/core/src/catalog.ts`

- [ ] **Step 1: Write failing tests for ranked plain-language search**

Replace `packages/core/src/catalog.test.ts` with:

```ts
import { describe, it, expect } from "vitest";
import { searchCatalog } from "./catalog.js";
import type { Catalog } from "./types.js";

const catalog: Catalog = {
  version: "1.0.0",
  sounds: [
    {
      id: "fast-whoosh",
      file: "fast-whoosh.wav",
      tags: ["whoosh", "movement"],
      duration_ms: 420,
      default_volume: 0.45,
      url: "",
    },
    {
      id: "camera-shutter-release",
      file: "camera-shutter-release.wav",
      tags: ["camera", "shutter", "ui"],
      duration_ms: 650,
      default_volume: 0.4,
      url: "",
    },
    {
      id: "camera-analog",
      file: "camera-analog.wav",
      tags: ["camera", "film"],
      duration_ms: 859,
      default_volume: 0.4,
      url: "",
    },
    {
      id: "beep-short",
      file: "beep-short.wav",
      tags: ["ui", "beep"],
      duration_ms: 697,
      default_volume: 0.4,
      url: "",
    },
    {
      id: "glitch-logo",
      file: "glitch-logo.wav",
      tags: ["glitch", "digital"],
      duration_ms: 320,
      default_volume: 0.4,
      url: "",
    },
  ],
};

describe("searchCatalog", () => {
  it("returns all sounds when no filters are provided", () => {
    expect(searchCatalog(catalog, {}).map((s) => s.id)).toEqual([
      "fast-whoosh",
      "camera-shutter-release",
      "camera-analog",
      "beep-short",
      "glitch-logo",
    ]);
  });

  it("filters by exact tag", () => {
    expect(searchCatalog(catalog, { tag: "glitch" }).map((s) => s.id)).toEqual([
      "glitch-logo",
    ]);
  });

  it("finds sounds by id, tag, and file text from one query field", () => {
    expect(searchCatalog(catalog, { query: "beep" }).map((s) => s.id)).toEqual([
      "beep-short",
    ]);
  });

  it("ranks multi-word matches above partial matches", () => {
    expect(searchCatalog(catalog, { query: "camera shutter" }).map((s) => s.id)).toEqual([
      "camera-shutter-release",
      "camera-analog",
    ]);
  });

  it("normalizes punctuation, hyphens, and case", () => {
    expect(searchCatalog(catalog, { query: "FAST whoosh!" }).map((s) => s.id)).toEqual([
      "fast-whoosh",
    ]);
  });

  it("limits results when requested", () => {
    expect(searchCatalog(catalog, { query: "camera", limit: 1 }).map((s) => s.id)).toEqual([
      "camera-shutter-release",
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm --filter @woven-sfx/core test -- catalog.test.ts
```

Expected: FAIL because `limit` is not accepted and multi-word ranked search is not implemented.

- [ ] **Step 3: Implement minimal ranked search**

Replace `packages/core/src/catalog.ts` with:

```ts
import type { Catalog, Sound } from "./types.js";

export type SearchCatalogOptions = {
  tag?: string;
  query?: string;
  limit?: number;
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokens(value: string): string[] {
  return normalize(value).split(/\s+/).filter(Boolean);
}

function searchableText(sound: Sound): string {
  return normalize([sound.id, sound.file, ...sound.tags].join(" "));
}

function scoreSound(sound: Sound, query: string): number {
  const q = normalize(query);
  if (!q) return 0;

  const terms = tokens(query);
  const id = normalize(sound.id);
  const file = normalize(sound.file);
  const tagText = normalize(sound.tags.join(" "));
  const text = searchableText(sound);

  let score = 0;
  if (id === q) score += 100;
  if (id.startsWith(q)) score += 60;
  if (id.includes(q)) score += 40;
  if (file.includes(q)) score += 25;
  if (sound.tags.some((tag) => normalize(tag) === q)) score += 35;
  if (tagText.includes(q)) score += 20;

  const matchedTerms = terms.filter((term) => text.includes(term)).length;
  if (matchedTerms === terms.length) score += 30 + matchedTerms;
  else score += matchedTerms * 4;

  return score;
}

export function searchCatalog(catalog: Catalog, opts: SearchCatalogOptions): Sound[] {
  let results = catalog.sounds;

  if (opts.tag) {
    const tag = normalize(opts.tag);
    results = results.filter((sound) =>
      sound.tags.some((candidate) => normalize(candidate) === tag),
    );
  }

  if (opts.query) {
    results = results
      .map((sound, index) => ({ sound, index, score: scoreSound(sound, opts.query!) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .map((entry) => entry.sound);
  }

  if (opts.limit && opts.limit > 0) {
    results = results.slice(0, opts.limit);
  }

  return results;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
pnpm --filter @woven-sfx/core test -- catalog.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add packages/core/src/catalog.ts packages/core/src/catalog.test.ts
git commit -m "feat(core): make sound search query-first"
```

---

### Task 2: Remove Transition Resolver From Core

**Files:**
- Delete: `packages/core/src/pairings.ts`
- Delete: `packages/core/src/resolve.ts`
- Delete: `packages/core/src/resolve.test.ts`
- Modify: `packages/core/src/index.ts`
- Modify: `packages/core/src/types.ts`

- [ ] **Step 1: Remove unused resolver exports**

Edit `packages/core/src/index.ts` to:

```ts
export * from "./paths.js";
export * from "./types.js";
export * from "./catalog.js";
export * from "./pull.js";
export * from "./installed.js";
```

- [ ] **Step 2: Remove unused resolved type**

Edit `packages/core/src/types.ts` to:

```ts
export type Sound = {
  id: string;
  file: string;
  tags: string[];
  duration_ms: number;
  pairings?: { transition?: string[]; moment?: string[] };
  default_volume: number;
  url: string;
  peaks_url?: string;
};

export type Catalog = {
  version: string;
  sounds: Sound[];
};
```

- [ ] **Step 3: Delete resolver files**

Run:

```bash
rm packages/core/src/pairings.ts packages/core/src/resolve.ts packages/core/src/resolve.test.ts
```

- [ ] **Step 4: Run core tests and build**

Run:

```bash
pnpm --filter @woven-sfx/core test
pnpm --filter @woven-sfx/core build
```

Expected: PASS, no TypeScript errors.

- [ ] **Step 5: Commit**

Run:

```bash
git add packages/core/src
git commit -m "refactor(core): remove transition resolver"
```

---

### Task 3: Simplify MCP Public Tool Surface

**Files:**
- Modify: `packages/mcp/src/index.ts`
- Modify: `packages/mcp/package.json`
- Create: `packages/mcp/test/public-tools.test.mjs`

- [ ] **Step 1: Add failing MCP public surface test**

Add `packages/mcp/test/public-tools.test.mjs`:

```js
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { test } from "node:test";

function parseMessages(buffer) {
  return buffer
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function send(child, message) {
  child.stdin.write(`${JSON.stringify(message)}\n`);
}

test("public MCP tools are search, pull, and list installed", async () => {
  const child = spawn("node", ["dist/bundle.js"], {
    cwd: new URL("..", import.meta.url),
    stdio: ["pipe", "pipe", "pipe"],
  });

  let stdout = "";
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
  });

  send(child, {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "woven-sfx-test", version: "0.0.0" },
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 150));
  send(child, { jsonrpc: "2.0", method: "notifications/initialized", params: {} });
  send(child, { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });

  await new Promise((resolve) => setTimeout(resolve, 500));
  child.kill("SIGTERM");

  const listResponse = parseMessages(stdout).find((message) => message.id === 2);
  const names = listResponse.result.tools.map((tool) => tool.name);
  assert.deepEqual(names, ["sfx_search", "sfx_pull", "sfx_list_installed"]);

  const search = listResponse.result.tools.find((tool) => tool.name === "sfx_search");
  assert.equal(search.inputSchema.properties.transition, undefined);
  assert.ok(search.description.includes("Search"));
  assert.ok(search.description.includes("sound"));
});
```

Update `packages/mcp/package.json` scripts:

```json
"scripts": {
  "build": "tsc",
  "build:bundle": "node scripts/build-bundle.mjs",
  "prepublishOnly": "pnpm --filter @woven-sfx/core build && pnpm build:bundle",
  "start": "node dist/index.js",
  "test": "node --test test/*.test.mjs"
}
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm --dir packages/mcp build:bundle
pnpm --dir packages/mcp test
```

Expected: FAIL because `sfx_resolve` still appears and `sfx_search` still exposes `transition`.

- [ ] **Step 3: Remove resolve tool and update search schema**

Edit `packages/mcp/src/index.ts` so imports from core are:

```ts
import {
  searchCatalog,
  pullSound,
  findSoundById,
  listInstalled,
} from "@woven-sfx/core";
```

Set server version:

```ts
const server = new McpServer({ name: "woven-sfx", version: "0.2.0" });
```

Update `sfx_search` registration:

```ts
server.registerTool(
  "sfx_search",
  {
    title: "Search sound effects",
    description:
      "Search Woven SFX directly by normal words, sound id, or tag. Use this first to find sound effects such as beep, camera shutter, glitch, pop, impact, or whoosh.",
    inputSchema: z.object({
      query: z.string().optional(),
      tag: z.string().optional(),
      limit: z.number().int().positive().max(50).optional(),
    }),
  },
  async (input) => {
    const catalog = await loadCatalog();
    return textResult(searchCatalog(catalog, input));
  },
);
```

Delete the full `server.registerTool("sfx_resolve", ...)` block.

Update `packages/mcp/package.json` version:

```json
"version": "0.2.0"
```

- [ ] **Step 4: Run MCP build and test**

Run:

```bash
pnpm --dir packages/mcp build:bundle
pnpm --dir packages/mcp test
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add packages/mcp
git commit -m "feat(mcp): simplify public sound tools"
```

---

### Task 4: Rewrite Skill and Agent Docs Around Search + Pull

**Files:**
- Modify: `skills/woven-sfx/SKILL.md`
- Modify: `skills/woven-sfx/references/mcp-setup.md`
- Delete: `skills/woven-sfx/references/pairings.md`
- Modify: `apps/web/public/skill.md`
- Modify: `apps/web/public/llms.txt`

- [ ] **Step 1: Verify the current skill fails the new trigger model**

Run:

```bash
rg -n "sfx_resolve|transition|/edit-plan|/assemble" skills/woven-sfx/SKILL.md
```

Expected: output shows the current skill is scoped to `/edit-plan`, transitions, and `sfx_resolve`. That is the baseline failure this task fixes.

Use these acceptance scenarios after rewriting the skill:

| User request | Expected skill behavior |
|---|---|
| "Add a camera shutter sound to this app demo" | Search `camera shutter`, pick an id, pull by id |
| "Find a short beep for this button click" | Search `beep` or `ui beep`, pull by id |
| "Before assemble, make sure the planned SFX are local" | List installed files, pull missing ids |
| "Add a whoosh to this transition" | Search `whoosh`, pull by id; do not call `sfx_resolve` |

- [ ] **Step 2: Replace the skill with a universal search-first version**

Replace `skills/woven-sfx/SKILL.md` with:

````md
---
name: woven-sfx
description: Use when a video edit, motion graphic, app demo, reel, short, animation, or interface needs sound effects, audio cues, whooshes, impacts, beeps, glitches, camera sounds, applause, or local .wav files.
license: MIT
compatibility: Requires Node.js, network access to sfx.woven.video, and woven-sfx-mcp MCP server.
metadata:
  author: woven-video
  version: "0.2"
  site: https://sfx.woven.video
---

# Woven SFX

Search and cache Woven sound effects for projects that need local `.wav` files.

## When To Use

- A video edit, reel, short, animation, product demo, or UI needs a sound effect.
- The user asks for a whoosh, pop, beep, glitch, impact, camera sound, applause, ding, scratch, or similar audio cue.
- An edit plan already names sound ids and the files must exist locally before assembly or render.

Do not use this skill for background music, voiceover, lip sync, audio cleanup, or generated songs.

## Prerequisites

1. **MCP server configured** - skill install alone does not enable tools. If `sfx_*` tools are missing, direct the user to [references/mcp-setup.md](references/mcp-setup.md), then restart the agent.
2. **Project-local sound library** - resolved in order: `WOVEN_SFX_LIBRARY` env -> `sfx-library` in `.claude/project.md` -> `./sounds/sfx/` under cwd.

## Workflow

### 1. Search For Sounds

Call `sfx_search` with normal words. Prefer concrete sound words over editing abstractions.

```js
sfx_search({ query: "fast whoosh", limit: 5 })
sfx_search({ query: "camera shutter", limit: 5 })
sfx_search({ query: "short beep", limit: 5 })
sfx_search({ query: "glitch", limit: 5 })
```

Pick the closest result by `id`, tags, duration, and default volume. Do not invent sound ids or filenames.

### 2. Pull The Selected Sound

```js
sfx_pull({ id: "<sound-id>" })
```

Use the returned `localPath` wherever the project needs the `.wav`.

### 3. Verify Local Cache

Before assembly or render, confirm planned sounds are present:

```js
sfx_list_installed({})
```

If a planned id is missing, call `sfx_pull({ id: "<sound-id>" })`.

## Search Hints

| Need | Good queries |
|---|---|
| Transition movement | `whoosh`, `fast whoosh`, `deep whoosh` |
| UI feedback | `beep`, `click`, `ding`, `notification` |
| Camera moment | `camera`, `camera shutter`, `camera flash` |
| Digital break | `glitch`, `scratch`, `record scratch` |
| Impact or emphasis | `impact`, `drop`, `thud`, `pop` |
| Crowd reaction | `applause`, `cheers`, `gasp` |

## Recording Results

When writing an edit plan or handoff, include:

- `id` - catalog sound id
- `file` - `.wav` filename from the search result
- `localPath` - returned by `sfx_pull`
- `duration_ms` - clip length for timing
- `default_volume` - starting gain; adjust only when the mix needs it

## Common Mistakes

- Do not start from transition labels like `pull-in` or `fade`; search for the sound you want.
- Do not use a resolver workflow. Search first, then pull by returned `id`.
- Do not guess filenames. Search first, then pull by returned `id`.
- Do not use Woven SFX for music beds or voice tracks.
````

- [ ] **Step 3: Run skill quality checks**

Run:

```bash
wc -w skills/woven-sfx/SKILL.md
rg -n "sfx_resolve|resolve a sound|transition in the edit plan|pairings.md" skills/woven-sfx/SKILL.md
```

Expected: word count stays reasonably compact for a workflow skill; `rg` returns no stale resolver or transition-first instructions.

- [ ] **Step 4: Update setup docs**

In `skills/woven-sfx/references/mcp-setup.md`, replace every required tool list with:

```md
sfx_search, sfx_pull, and sfx_list_installed
```

Remove references that say `sfx_resolve` is required.

- [ ] **Step 5: Delete pairings reference**

Run:

```bash
rm skills/woven-sfx/references/pairings.md
```

- [ ] **Step 6: Sync public skill and update llms.txt**

Run:

```bash
pnpm sync:skill
```

Then edit `apps/web/public/llms.txt` tool section to:

```md
## MCP tools
sfx_search, sfx_pull, sfx_list_installed
```

- [ ] **Step 7: Search for stale public references**

Run:

```bash
rg -n "sfx_resolve|transition-first|Resolve SFX|pairings.md" skills apps/web/public README.md
```

Expected: no stale public references. Product words like "transition" may remain only if they describe video editing generally, not the MCP workflow.

- [ ] **Step 8: Commit**

Run:

```bash
git add skills apps/web/public
git commit -m "docs(skill): teach search and pull workflow"
```

---

### Task 5: Update Website Copy and SEO

**Files:**
- Modify: `apps/web/src/components/Hero.astro`
- Modify: `apps/web/src/components/McpToolsList.tsx`
- Modify: `apps/web/src/components/HowItWorksTimeline.tsx`
- Modify: `apps/web/src/lib/seo/constants.ts`
- Modify: `apps/web/src/lib/seo/faqs.ts`
- Modify: `apps/web/src/lib/seo/schema.ts`
- Modify: `README.md`

- [ ] **Step 1: Update visible website copy**

Use this hero subhead:

```txt
Open source library of whooshes, pops, and glitches built for agent video edits. Install the skill and MCP server once. Your agent searches the catalog and pulls the right .wav when it needs a sound.
```

Update the MCP tools list to:

```ts
const tools = [
  {
    name: "sfx_search",
    input: "{ query?, tag?, limit? }",
    description: "Search sounds directly by normal words, sound id, or tag.",
  },
  {
    name: "sfx_pull",
    input: "{ id }",
    description: "Download a selected sound by id to ./sounds/sfx/ in your project.",
  },
  {
    name: "sfx_list_installed",
    input: "{}",
    description: "List .wav files already cached in the local SFX library.",
  },
] as const;
```

Update the timeline example from `sfx_resolve({ transition: "pull-in" })` to:

```txt
sfx_search({ query: "fast whoosh" }) -> sfx_pull({ id: "fast-whoosh" })
```

- [ ] **Step 2: Update SEO constants, FAQ, and schema**

Use these public claims consistently:

```txt
MCP tools: sfx_search, sfx_pull, sfx_list_installed
Agents search the catalog with normal words, choose a sound id, then pull the .wav into the project library.
```

- [ ] **Step 3: Update README quickstart**

Add a usage example:

```md
Search and pull sounds:

```js
sfx_search({ query: "camera shutter", limit: 5 })
sfx_pull({ id: "camera-shutter-release" })
```
```

Remove `sfx_resolve` from README tool lists.

- [ ] **Step 4: Verify stale references**

Run:

```bash
rg -n "sfx_resolve|Resolve SFX|transition type|every transition" apps README.md
```

Expected: no stale website or README copy.

- [ ] **Step 5: Build web**

Run:

```bash
pnpm --dir apps/web build
```

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add apps README.md
git commit -m "docs(web): make MCP workflow search-first"
```

---

### Task 6: Refresh Social Preview if Needed

**Files:**
- Modify: `apps/web/public/og-image.png` only if the old transition copy appears in the preview image.

- [ ] **Step 1: Inspect current preview image**

Open or inspect `apps/web/public/og-image.png`.

Expected: if the image visibly contains stale "resolves and pulls the right .wav for every transition" copy, refresh it.

- [ ] **Step 2: Run local web preview**

Run:

```bash
pnpm --dir apps/web dev --host 127.0.0.1
```

Expected: dev server URL appears.

- [ ] **Step 3: Capture 1200x630 screenshot**

Use agent-browser or Playwright to capture the first viewport at `1200x630`, matching the existing social preview dimensions.

- [ ] **Step 4: Replace `apps/web/public/og-image.png`**

Save the resized screenshot to `apps/web/public/og-image.png`.

- [ ] **Step 5: Commit if changed**

Run:

```bash
git add apps/web/public/og-image.png
git commit -m "chore(web): refresh social preview"
```

---

### Task 7: Full Verification and Release Prep

**Files:**
- No source files expected unless verification finds an issue.

- [ ] **Step 1: Run full test/build suite**

Run:

```bash
pnpm --filter @woven-sfx/core test
pnpm --dir packages/mcp build:bundle
pnpm --dir packages/mcp test
pnpm -r build
```

Expected: all commands pass.

- [ ] **Step 2: Probe local MCP search behavior**

Run a JSON-RPC probe against `packages/mcp/dist/bundle.js`:

```json
{"name":"sfx_search","arguments":{"query":"beep","limit":3}}
```

Expected: response includes `beep-short` and does not require transition language.

- [ ] **Step 3: Verify git state**

Run:

```bash
git status --short
git log --oneline -5
```

Expected: clean tree after commits, recent commits reflect the cleanup tasks.

- [ ] **Step 4: Publish only after explicit approval**

Do not publish during implementation unless the user explicitly approves. When approved:

```bash
pnpm publish:mcp
```

Expected: npm publishes `woven-sfx-mcp@0.2.0`.

- [ ] **Step 5: Post-publish client restart**

Tell users to restart their MCP client. Existing Codex config uses:

```toml
[mcp_servers.woven-sfx]
command = "npx"
args = ["-y", "woven-sfx-mcp"]
```

After restart, `npx -y woven-sfx-mcp` should resolve to `0.2.0` and expose only:

```txt
sfx_search
sfx_pull
sfx_list_installed
```

---

## Self-Review

- Spec coverage: the plan removes public transition resolve behavior, improves direct sound search, updates docs/site/skill, adds MCP surface verification, and prepares the package bump.
- Placeholder scan: no TODO/TBD placeholders remain.
- Type consistency: `SearchCatalogOptions` supports `query`, `tag`, and `limit`; MCP `sfx_search` uses the same fields.
- Scope check: one subsystem, the Woven SFX public MCP/search workflow.
