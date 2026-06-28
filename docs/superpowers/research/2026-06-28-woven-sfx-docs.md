# Docs Digest — Woven SFX — 2026-06-28

## @modelcontextprotocol/server — v1.x (to install)
- Package split: use `@modelcontextprotocol/server` (not legacy `@modelcontextprotocol/sdk` alone).
- Server: `import { McpServer } from '@modelcontextprotocol/server'`
- Stdio: `import { StdioServerTransport } from '@modelcontextprotocol/server/stdio'`
- Register tools: `server.registerTool(name, { title, description, inputSchema: z.object({...}) }, async (input) => ({ content: [{ type: 'text', text: '...' }] }))`
- Run: `const transport = new StdioServerTransport(); await server.connect(transport);`
- **Gotcha:** Use `console.error()` only — stdout is JSON-RPC.
- MCP config: `{ "command": "node", "args": ["path/to/build/index.js"] }` or `npx woven-sfx-mcp`
- Source: https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/docs/server-quickstart.md

## Astro + Cloudflare Workers (static assets) — v5.x
- Static Astro: `output: 'static'` (default), build to `./dist`
- Deploy: `wrangler.jsonc` with `{ "assets": { "directory": "./dist" } }`
- Commands: `pnpm astro build && pnpm wrangler deploy`
- React islands: `@astrojs/react` + `client:load` for interactive catalog
- **Gotcha:** Disable Cloudflare Auto Minify if hydration mismatches
- Source: https://docs.astro.build/en/guides/deploy/cloudflare/

## @wavesurfer/react — v1.x
- `import WavesurferPlayer from '@wavesurfer/react'`
- Props: `url`, `waveColor`, `progressColor`, `height`, `peaks` (optional precomputed array)
- Use `onReady` to get wavesurfer instance for play/pause control
- Source: wavesurfer.js docs (peaks as number[] or [number[], number[]])

## pnpm workspaces
- Root `pnpm-workspace.yaml`: `packages:\n  - 'packages/*'\n  - 'apps/*'`
- Internal dep: `"@woven-sfx/core": "workspace:*"`