#!/usr/bin/env bash
set -euo pipefail

CDN="${SFX_CDN_BASE:-https://sfx.woven.video}"

echo "Installing woven-sfx skill via skills CLI..."
npx skills add woven-video/woven-sfx --skill woven-sfx -g -y

SKILL_DIR="${HOME}/.agents/skills/woven-sfx"
PULL_SCRIPT="${SKILL_DIR}/scripts/pull-library.sh"

echo ""
echo "Pulling sounds into project library (run from your project root)..."
if [[ -x "$PULL_SCRIPT" ]]; then
  bash "$PULL_SCRIPT"
else
  echo "Pull script not found at $PULL_SCRIPT — run it manually after cd'ing to your project."
fi

cat <<EOF

✓ Woven SFX installed

  Skill:   $SKILL_DIR
  Sounds:  project-local (see .claude/project.md sfx-library or ./sounds/sfx/)

Add MCP to ~/.cursor/mcp.json (or Claude Desktop config):

{
  "mcpServers": {
    "woven-sfx": {
      "command": "npx",
      "args": ["-y", "woven-sfx-mcp"]
    }
  }
}

Catalog: $CDN/catalog.json
EOF