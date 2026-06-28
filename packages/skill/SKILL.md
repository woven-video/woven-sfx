---
name: woven-sfx
description: Resolve and pull Woven sound effects for video edits. Use during /edit-plan (step 4 SFX placement) and before /assemble (ensure files cached). Requires woven-sfx MCP tools (sfx_resolve, sfx_pull, sfx_list_installed).
---

# Woven SFX

Resolve and cache sound effects for video edits using the woven-sfx MCP server.

## When to use

- **During `/edit-plan` (step 4 — SFX placement):** resolve a sound for each transition in the edit plan.
- **Before `/assemble`:** confirm every required sound is cached locally; pull any missing files.

## Prerequisites

MCP server configured with `sfx_resolve`, `sfx_pull`, and `sfx_list_installed`:

```json
{
  "mcpServers": {
    "woven-sfx": {
      "command": "npx",
      "args": ["-y", "woven-sfx-mcp"]
    }
  }
}
```

Local library path: `~/.local/share/woven-sfx/library/`

## Workflow

### 1. Resolve sounds during edit planning

For each transition in the edit plan, call:

```
sfx_resolve({ transition: "<transition-type>" })
```

Examples:

- Pull-in: `sfx_resolve({ transition: "pull-in" })`
- Pull-out: `sfx_resolve({ transition: "pull-out" })`
- Flash: `sfx_resolve({ transition: "flash" })`
- Glitch: `sfx_resolve({ transition: "glitch" })`

**Opening whoosh:** place at **0.1s** on the timeline using:

```
sfx_resolve({ transition: "whoosh" })
```

Use the `suggested_volume` from each resolve response when writing SFX entries in the edit plan. Pairing logic lives in the MCP server — do not guess filenames or duplicate pairing tables.

Transitions like `fade` and `none` have no default SFX; skip them unless the user requests otherwise.

### 2. Verify cache before assemble

Before running `/assemble`, ensure all planned sounds exist locally:

1. Call `sfx_list_installed` to list cached `.wav` files.
2. Compare installed files against the sound IDs in the edit plan.
3. For any missing ID, call `sfx_pull({ id: "<sound-id>" })`.

Each pull returns `localPath` — use that path when referencing audio in the render pipeline.

### 3. Reference paths in the edit plan

Record resolved values in the edit plan:

- `id` — catalog sound ID
- `file` — filename (e.g. `fast-whoosh.wav`)
- `localPath` — absolute path under `~/.local/share/woven-sfx/library/`
- `duration_ms` — clip length for placement
- `suggested_volume` — default gain (override only when the user asks)

## Error handling

If `sfx_resolve` returns an error for an unknown transition, check `suggestions` in the response or use `sfx_search` to find alternatives. Do not invent sound filenames.