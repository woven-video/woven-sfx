# Woven SFX

Agent-first, open-source sound effects registry for video editing workflows.

**Site:** [sfx.woven.video](https://sfx.woven.video) · **Skills:** [skills.sh](https://skills.sh)

## Install

```bash
npx skills add woven-labs/woven-sfx --skill woven-sfx -g -y
```

Then add the MCP server (see `skills/woven-sfx/references/mcp-setup.md`) and optionally pull sounds:

```bash
bash ~/.agents/skills/woven-sfx/scripts/pull-library.sh
```

**Advanced:** `curl -fsSL https://sfx.woven.video/install.sh | bash` — skill + library + MCP instructions in one shot.

## Monorepo layout

```
woven-sfx/
├── skills/
│   └── woven-sfx/    # Agent skill (SKILL.md, scripts, references)
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
pnpm sync:skill   # copy SKILL.md → apps/web/public/skill.md
```

### Waveform peaks

```bash
pnpm generate:peaks
```

Writes `apps/web/public/peaks/{id}.json` for every catalog sound. When `sounds/{id}.wav` files exist and [audiowaveform](https://github.com/bbc/audiowaveform) is installed (`brew install audiowaveform`), peaks are generated from the audio. Otherwise the script emits deterministic 32-bar synthetic peaks derived from each sound id (dev fallback until source WAVs are present).

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

WAV files are served from Cloudflare R2 at `https://sfx.woven.video/sfx/{id}.wav`. Upload is manual for v0:

```bash
# Authenticate once
npx wrangler login

# Upload each sound (repeat per file)
npx wrangler r2 object put woven-sfx/sfx/fast-whoosh.wav --file=sounds/fast-whoosh.wav
```

Configure the R2 bucket for public access and bind the custom domain `sfx.woven.video` in the Cloudflare dashboard.

## License

- Code: [MIT](LICENSE)
- Sounds: [CC0 1.0](SOUNDS_LICENSE)