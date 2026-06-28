# Woven SFX — Design Spec

**Date:** 2026-06-28  
**Status:** Draft — pending user review  
**Domain:** `sfx.woven.video`  
**Repo:** `woven-sfx` (FOSS monorepo, separate from `woven-video` and `woven-harness`)

---

## 1. Purpose

Woven SFX is an **agent-first, open-source sound effects registry**. Humans visit `sfx.woven.video` to install; AI agents use MCP tools + a skill to search, resolve, and pull `.wav` files into local cache for video edits (via `/edit-plan` → `/assemble`).

**Not in scope for v0:**
- User accounts / auth
- Paid tiers / license gates
- Hosted remote MCP Worker (stdio MCP only in v0)
- Harness native install button (manual install via site; harness integration is v1)
- Streaming audio into Remotion at render time (local files required)

---

## 2. Product decisions (brainstormed & locked)

| Decision | Choice |
|---|---|
| Visual direction | **Audio-forward** — dark stone palette, waveforms, sound as hero |
| Page structure | Install on top, catalog below |
| Hero layout | **Split:** install (left) + vertical story timeline (right) |
| Install UX | **One-liner + expand** — `curl \| bash` prominent; manual MCP/skill/paths collapsed |
| Catalog item | **Waveform card** with **large play button** (~40px) |
| Accounts | None |
| License | MIT (code) + CC0 (sounds) |
| Local cache path | `~/.local/share/woven-sfx/library/` |
| Skill path | `~/.claude/skills/woven-sfx/SKILL.md` |
| Distribution | Skill (workflow) + MCP tools (mechanics) — both required |

---

## 3. Architecture approaches

### Option A — Astro + Cloudflare Pages ✅ Recommended

- Static site on Cloudflare Pages; `catalog.json` + site assets on Pages or R2
- Audio files on **R2** served via CDN (`sfx.woven.video/sfx/*` or `media.wovenlabs.net/sfx/*`)
- Monorepo: `apps/web` (Astro), `packages/core`, `packages/mcp`, `packages/skill`
- Waveform peaks generated at build/CI, committed or published alongside catalog

**Pros:** Fast, cheap egress (R2), ideal for static landing + JSON API surface. Small bundle.  
**Cons:** Separate from `woven-video` Next.js patterns.

### Option B — Next.js static export + Cloudflare Pages

- Reuse Geist/shadcn patterns from `woven-video`
- `output: 'export'` for Pages compatibility

**Pros:** Design system parity with woven.video.  
**Cons:** Heavier toolchain for a single landing page; Cloudflare adapter friction vs Astro.

### Option C — Static HTML only

**Pros:** Minimal.  
**Cons:** Poor fit once catalog search, waveform cards, and install expand need client JS.

**Decision:** **Option A (Astro)** for `apps/web`. Shared `packages/core` consumed by MCP server and (later) harness sidecar.

---

## 4. System architecture

```
┌─────────────────────────────────────────────────────────────┐
│  sfx.woven.video (Cloudflare Pages — Astro)                 │
│  Landing · catalog browser · install.sh · catalog.json       │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│  R2 / CDN                                                    │
│  *.wav · catalog.json (versioned) · peaks/*.json             │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
  ~/.claude/skills/   npx @woven/sfx-mcp   ~/.local/share/
  woven-sfx/SKILL.md  (stdio MCP)         woven-sfx/library/
         │                 │                 │
         └─────────────────┴─────────────────┘
                           │
                           ▼
              Agent pipeline (/edit-plan → /assemble)
              Remotion shared-assets/sfx (copy at render)
```

### Units & boundaries

| Unit | Responsibility | Interface |
|---|---|---|
| `packages/core` | Catalog types, resolve pairing, pull/download, paths | TS imports |
| `packages/mcp` | MCP tools wrapping core | stdio MCP |
| `packages/skill` | SKILL.md workflow | File install |
| `apps/web` | Landing + browser | HTTP static |
| `catalog/` | Source-of-truth per sound | JSON → build → `catalog.json` |
| `scripts/` | `install.sh`, peak generation | Shell |

---

## 5. Landing page — sections & components

Single page `/` with hash nav. Mobile: hero stacks (install → story → catalog).

### 5.1 Layout shell

| Component | Responsibility |
|---|---|
| `SiteShell` | Page wrapper, dark theme |
| `SiteHeader` | Logo, anchors (Sounds, For agents, GitHub) |
| `SiteFooter` | GitHub, MIT + CC0, woven.video credit, catalog version |

### 5.2 Hero (split)

| Component | Responsibility |
|---|---|
| `Hero` | Eyebrow (MIT · CC0), headline, subhead |
| `HeroSplit` | Two-column grid: install \| story |
| `InstallPanel` | One-liner curl + copy + path hints |
| `InstallExpand` | Collapsible: MCP JSON, skill command, cache paths |
| `HowItWorksTimeline` | Vertical story — 3 steps with dots + connector line |

**Timeline steps (copy):**
1. **Install skill + MCP** — Agent gets `/woven-sfx` and `sfx_*` tools
2. **Agent resolves a sound** — `sfx_resolve({ transition: "pull-in" })` + mini waveform
3. **File lands locally** — `~/.local/share/woven-sfx/library/` → ready for `/assemble`

### 5.3 Catalog

| Component | Responsibility |
|---|---|
| `CatalogSection` | Section heading + search |
| `CatalogSearch` | shadcn `Input`, client-side filter |
| `CatalogGrid` | Responsive 2–4 col grid |
| `SfxCard` | Waveform + large play button + name + duration + tag |
| `SfxWaveform` | `@wavesurfer/react` + precomputed peaks |
| `SfxPreview` | Play/pause; one-at-a-time state in `CatalogSection` |
| `CopyButton` | Copy sound `id` |

**SfxCard layout:**
```
┌─────────────────────────┐
│  [mini waveform bar]    │
│  (▶ 40px)  fast-whoosh  │
│            420ms · whoosh│
│            [copy id]     │
└─────────────────────────┘
```

### 5.4 For agents

| Component | Responsibility |
|---|---|
| `AgentDocsStrip` | Links: `/catalog.json`, `/llms.txt`, GitHub, `/install.sh` |
| `ToolList` | Static list: `sfx_search`, `sfx_pull`, `sfx_resolve`, `sfx_list_installed` |

### 5.5 Shared primitives

`Section`, `Badge`, `CodeBlock`, `CopyButton` — shadcn `Button`, `Card`, `Input`, `Collapsible` for install expand.

---

## 6. Audio UI

- **No** ElevenLabs UI (wrong product signal)
- **shadcn** for chrome; **custom** play state
- **@wavesurfer/react** for waveform bars in `SfxCard`
- **Peaks precomputed in CI** (`catalog/foo.peaks.json`) — no client-side waveform generation
- Only one sound plays at a time (state lifted to `CatalogSection`)

---

## 7. MCP tools (`packages/mcp`)

| Tool | Input | Output |
|---|---|---|
| `sfx_search` | `{ tag?, transition?, query? }` | Matching catalog entries |
| `sfx_pull` | `{ id }` | Downloads to `SFX_LIBRARY`, returns `localPath` |
| `sfx_resolve` | `{ transition, moment? }` | Pairing logic + pull if missing; returns `id`, `file`, `localPath`, `duration_ms`, `suggested_volume` |
| `sfx_list_installed` | — | Files in `SFX_LIBRARY` |

Pairing rules live in **core** (ported from `/edit-plan` table), not in skill prose.

MCP config (install expand):
```json
{
  "mcpServers": {
    "woven-sfx": {
      "command": "npx",
      "args": ["-y", "@woven/sfx-mcp"]
    }
  }
}
```

---

## 8. Skill (`packages/skill`)

**Name:** `woven-sfx`  
**Triggers:** During `/edit-plan` step 4; before `/assemble` (ensure files cached).

**Skill covers (workflow only):**
- When to call `sfx_resolve` per transition
- Volume defaults from resolve response
- Call `sfx_pull` for any missing IDs before assemble
- `sfx_sync_for_render` (v1) — copy to remotion `shared-assets/sfx/`

**Skill does not:** duplicate pairing tables or bash curl chains.

---

## 9. Catalog schema

```json
{
  "version": "1.0.0",
  "sounds": [
    {
      "id": "fast-whoosh",
      "file": "fast-whoosh.wav",
      "tags": ["whoosh", "transition"],
      "duration_ms": 420,
      "pairings": { "transition": ["pull-in", "pull-out"] },
      "default_volume": 0.45,
      "url": "https://sfx.woven.video/sfx/fast-whoosh.wav",
      "peaks_url": "https://sfx.woven.video/peaks/fast-whoosh.json"
    }
  ]
}
```

**v0 seed:** ~27 sounds from existing `/edit-plan` list.

---

## 10. Install script (`install.sh`)

```bash
curl -fsSL https://sfx.woven.video/install.sh | bash
```

1. Create `~/.local/share/woven-sfx/library/`
2. Install skill to `~/.claude/skills/woven-sfx/`
3. Download core sound pack from CDN
4. Print MCP config snippet + next steps

---

## 11. Cloudflare deployment

| Asset | Host |
|---|---|
| Site | Cloudflare Pages (`apps/web` build) |
| `catalog.json` | Pages `public/` or R2 (synced on release) |
| `.wav` files | R2 bucket, public CDN route |
| `install.sh` | Pages static or Worker route |
| `llms.txt` | Pages `public/` |

DNS: `sfx.woven.video` → Pages project.

---

## 12. v0 scope & build order

1. **Monorepo scaffold** — pnpm workspaces, licenses, `.gitignore` (+ `.superpowers/`)
2. **`packages/core`** — paths, catalog loader, resolve, pull
3. **`catalog/`** — seed 27 sounds + peak generation script
4. **R2 upload** — manual or CI script for v0
5. **`packages/skill`** + **`install.sh`**
6. **`packages/mcp`** — stdio server
7. **`apps/web`** — landing page per component spec above
8. **Deploy** — Cloudflare Pages + R2
9. **Defer:** harness Settings install, remote MCP Worker, premium packs, `sfx_sync_for_render`

---

## 13. Error handling

| Case | Behavior |
|---|---|
| Sound not in catalog | `sfx_resolve` returns actionable error + nearest tag matches |
| Download fails | Retry once; clear message with CDN URL |
| Peaks missing | Fallback: play button + duration only (no waveform bar) |
| Offline catalog | Bundled `catalog.json` in MCP package as fallback |
| Play collision | Only one preview active; clicking new card stops previous |

---

## 14. Testing

| Layer | Approach |
|---|---|
| `packages/core` | Unit tests for resolve pairing + paths |
| `packages/mcp` | Tool contract tests (input → output shape) |
| `apps/web` | Manual QA: install copy, preview play, search filter, mobile stack |
| `install.sh` | Smoke test in CI (dry-run mode) |

No E2E harness in v0.

---

## 15. Open questions (non-blocking)

- Exact R2 public URL prefix (`sfx.woven.video` vs `media.wovenlabs.net/sfx`)
- npm package name (`@woven/sfx-mcp` vs `@woven-labs/sfx-mcp`)
- Whether to add `sfx_sync_for_render` in v0 or v1

---

## 16. Success criteria

- [ ] `sfx.woven.video` live on Cloudflare
- [ ] One-click install places skill + sounds + prints MCP config
- [ ] Catalog grid previews all seeded sounds with waveforms
- [ ] MCP `sfx_resolve({ transition: "pull-in" })` returns correct sound + local path after pull
- [ ] Agent following skill can complete `/edit-plan` SFX step without guessing filenames
- [ ] FOSS repo public with MIT + CC0