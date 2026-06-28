# Woven SFX

Agent-first, open-source sound effects registry for video editing workflows.

**Site:** [sfx.woven.video](https://sfx.woven.video)

## Install

```bash
curl -fsSL https://sfx.woven.video/install.sh | bash
```

## Monorepo layout

```
woven-sfx/
├── apps/
│   └── web/          # Astro landing page (sfx.woven.video)
├── packages/
│   ├── core/         # Catalog, resolve, pull — shared library
│   ├── mcp/          # stdio MCP server
│   └── skill/        # Agent skill (SKILL.md)
├── catalog/          # Sound metadata (JSON)
├── sounds/           # Source .wav files
└── scripts/          # Build catalog, generate peaks, install
```

## Development

```bash
pnpm install
pnpm build
pnpm test
```

### Waveform peaks

```bash
pnpm generate:peaks
```

Writes `apps/web/public/peaks/{id}.json` for every catalog sound. When `sounds/{id}.wav` files exist and [audiowaveform](https://github.com/bbc/audiowaveform) is installed (`brew install audiowaveform`), peaks are generated from the audio. Otherwise the script emits deterministic 32-bar synthetic peaks derived from each sound id (dev fallback until source WAVs are present).

## License

- Code: [MIT](LICENSE)
- Sounds: [CC0 1.0](SOUNDS_LICENSE)