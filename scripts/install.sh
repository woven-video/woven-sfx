#!/usr/bin/env bash
set -euo pipefail

LIB_DIR="${HOME}/.local/share/woven-sfx/library"
CDN="${SFX_CDN_BASE:-https://sfx.woven.video}"

echo "Installing woven-sfx skill via skills CLI..."
npx skills add woven-labs/woven-sfx --skill woven-sfx -g -y

SKILL_DIR="${HOME}/.agents/skills/woven-sfx"
PULL_SCRIPT="${SKILL_DIR}/scripts/pull-library.sh"

if [[ -x "$PULL_SCRIPT" ]]; then
  bash "$PULL_SCRIPT"
else
  echo "Pull script not found — downloading library directly..."
  mkdir -p "$LIB_DIR"
  CATALOG=$(curl -fsSL "$CDN/catalog.json")
  node -e "
const fs=require('fs');const path=require('path');const https=require('https');const http=require('http');
const catalog=JSON.parse(process.argv[1]);const lib=process.argv[2];
async function dl(url, dest) {
  if (fs.existsSync(dest)) return;
  await new Promise((res,rej)=>{(url.startsWith('https')?https:http).get(url,r=>{const d=[];r.on('data',c=>d.push(c));r.on('end',()=>{fs.writeFileSync(dest,Buffer.concat(d));res();});}).on('error',rej);});
}
(async()=>{for(const s of catalog.sounds){await dl(s.url, path.join(lib,s.file));console.log('  '+s.id);}})();
" "$CATALOG" "$LIB_DIR"
fi

cat <<EOF

✓ Woven SFX installed

  Skill:   $SKILL_DIR
  Sounds:  $LIB_DIR

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