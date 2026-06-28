#!/usr/bin/env bash
set -euo pipefail

LIB_DIR="${HOME}/.local/share/woven-sfx/library"
CDN="${SFX_CDN_BASE:-https://sfx.woven.video}"

mkdir -p "$LIB_DIR"

echo "Pulling sounds from $CDN → $LIB_DIR"

CATALOG=$(curl -fsSL "$CDN/catalog.json")
node -e "
const fs=require('fs');const path=require('path');const https=require('https');const http=require('http');
const catalog=JSON.parse(process.argv[1]);const lib=process.argv[2];
async function dl(url, dest) {
  if (fs.existsSync(dest)) { console.log('  skip ' + path.basename(dest)); return; }
  await new Promise((res,rej)=>{(url.startsWith('https')?https:http).get(url,r=>{const d=[];r.on('data',c=>d.push(c));r.on('end',()=>{fs.writeFileSync(dest,Buffer.concat(d));res();});}).on('error',rej);});
}
(async()=>{for(const s of catalog.sounds){await dl(s.url, path.join(lib,s.file));console.log('  '+s.id);}})();
" "$CATALOG" "$LIB_DIR"

echo ""
echo "✓ Library ready at $LIB_DIR"