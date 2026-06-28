# MCP setup

Add the woven-sfx stdio MCP server to your agent config.

## Cursor / Claude Desktop

Add to `~/.cursor/mcp.json` or Claude Desktop MCP settings:

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

## Tools

| Tool | Purpose |
|------|---------|
| `sfx_search` | Search catalog by tag, transition, or query |
| `sfx_pull` | Download a sound by id to local cache |
| `sfx_resolve` | Resolve + pull the best sound for a transition |
| `sfx_list_installed` | List cached `.wav` files |

## Local paths

- **Library:** `~/.local/share/woven-sfx/library/`
- **Catalog:** `https://sfx.woven.video/catalog.json`