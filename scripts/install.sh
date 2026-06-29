#!/usr/bin/env bash
set -euo pipefail

echo "Installing add-sfx skill via skills CLI..."
npx skills add woven-video/skills --skill add-sfx -g -y < /dev/null

SKILL_DIR="${HOME}/.agents/skills/add-sfx"
PULL_SCRIPT="${SKILL_DIR}/scripts/pull-library.sh"

echo ""
echo "Pulling sounds into project library (run from your project root)..."
if [[ -x "$PULL_SCRIPT" ]]; then
  bash "$PULL_SCRIPT"
else
  echo "Pull script not found at $PULL_SCRIPT — run it manually after cd'ing to your project."
fi

cat <<'EOF'

✓ add-sfx skill installed (Woven SFX)

Next: add the MCP server (required for sfx_* tools)

  Cursor:         ~/.cursor/mcp.json
  Claude Code:    .mcp.json in your project
  Claude Desktop: Settings → Developer → MCP

{
  "mcpServers": {
    "woven-sfx": {
      "command": "npx",
      "args": ["-y", "woven-sfx-mcp"]
    }
  }
}

Merge into existing mcpServers if needed. Restart your agent.

Full paths: ~/.agents/skills/add-sfx/references/mcp-setup.md
Catalog:    https://sfx.woven.video/catalog.json
EOF
