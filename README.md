# Woven SFX

Agent-first, open-source sound effects registry for video editing workflows.

**Site:** [sfx.woven.video](https://sfx.woven.video) · **Skill:** [skills.sh/woven-video/skills/woven-sfx](https://skills.sh/woven-video/skills/woven-sfx)

## Install

```bash
npx skills add woven-video/skills --skill woven-sfx -g -y
```

Then add the MCP server (see `skills/woven-sfx/references/mcp-setup.md`) and pull sounds into your project:

```bash
cd your-reel-project
bash ~/.agents/skills/woven-sfx/scripts/pull-library.sh
```

Sounds land in `./sounds/sfx/` by default, or wherever `sfx-library` points in `.claude/project.md`.

**Advanced:** `curl -fsSL https://sfx.woven.video/install.sh | bash` — skill + library + MCP instructions in one shot.

## Monorepo layout

```
woven-sfx/
├── skills/
│   └── woven-sfx/    # Skill source — sync to woven-video/skills for skills.sh
├── apps/
│   └── web/          # Astro landing page (sfx.woven.video)
├── packages/
│   ├── core/         # Catalog, resolve, pull — shared library
│   └── mcp/          # stdio MCP server
├── catalog/          # Sound metadata (JSON)
├── sounds/           # Source .wav files
└── scripts/          # Build catalog, generate peaks, install
```

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm sync:skill      # copy SKILL.md → apps/web/public/skill.md
pnpm sync:skills-repo  # copy skill → ../woven-video-skills for skills.sh
pnpm seed:sounds     # generate v0 placeholder .wav files (replace with finals later)
pnpm update:durations
pnpm generate:peaks
```

### Local site

**Why Astro?** Static landing page (hero, catalog, docs) built to `dist/` and served by the Cloudflare Worker alongside `catalog.json` and peaks. React islands handle the interactive catalog. Astro keeps the marketing shell fast and deployable as static assets.

**Audio lives in R2 only** — catalog URLs point directly at the public R2 custom domain `https://assets.sfx.woven.video/sfx/*`. Local dev and production use the same public asset URLs.

```bash
# UI work (most of the time): Astro HMR, audio loaded from assets.sfx.woven.video
cd apps/web && pnpm dev:ui

# Full Worker/static-assets stack locally (needs wrangler login)
cd apps/web && pnpm dev
```

### Ship checklist

```bash
# 1. Auth (one-time)
wrangler login
npm login

# 2. Create R2 bucket for sound files
wrangler r2 bucket create woven-sfx

# 3. Upload .wav files to R2 (served at assets.sfx.woven.video/sfx/*)
pnpm upload:r2

# 4. Publish MCP to npm
cd packages/mcp && npm publish --access public

# 5. Deploy landing (Workers — catalog, peaks, site; not .wav files)
cd apps/web && pnpm deploy
```

### Waveform peaks

```bash
pnpm generate:peaks
```

Writes `apps/web/public/peaks/{id}.json` for every catalog sound. When `sounds/{id}.wav` files exist and [audiowaveform](https://github.com/bbc/audiowaveform) is installed (`brew install audiowaveform`), peaks are generated from the audio. Otherwise the script emits deterministic 32-bar synthetic peaks derived from each sound id.

**Source:** Real files copied from `Woven.app/Contents/Resources/Remotion/shared-assets/sfx/` (woven-harness bundle). `pnpm seed:sounds` is only a dev fallback if that path is unavailable.

## Deploy (Cloudflare)

The landing page deploys to Cloudflare Workers via [Wrangler](https://developers.cloudflare.com/workers/wrangler/). Config lives in `apps/web/wrangler.jsonc` (static assets from `dist/`).

### Site

```bash
cd apps/web
pnpm install
pnpm deploy
```

`pnpm preview` builds and runs `wrangler dev` locally. After deploy, point DNS `sfx.woven.video` at the Workers subdomain from the wrangler output (CNAME).

### Sound files (R2)

WAV files live in R2 only and are served directly from the public R2 custom domain `assets.sfx.woven.video`. Landing, `catalog.json`, and peaks deploy with Workers static assets.

```bash
pnpm upload:r2   # uploads sounds/*.wav → R2
cd apps/web && pnpm deploy
```

## License

- Code: [MIT](LICENSE)
- Sounds: [CC0 1.0](SOUNDS_LICENSE)
