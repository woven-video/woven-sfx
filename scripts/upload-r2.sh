#!/usr/bin/env bash
# Upload .wav sound files to Cloudflare R2. Landing, catalog, and peaks stay with the static site.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUCKET="${WOVEN_SFX_R2_BUCKET:-woven-sfx}"

if ! command -v wrangler >/dev/null 2>&1; then
  WRANGLER="pnpm --dir $ROOT/apps/web exec wrangler"
else
  WRANGLER="wrangler"
fi

echo "Uploading sounds to R2 bucket: $BUCKET"

for wav in "$ROOT"/sounds/*.wav; do
  name="$(basename "$wav")"
  echo "  sfx/$name"
  $WRANGLER r2 object put "$BUCKET/sfx/$name" \
    --file="$wav" \
    --remote \
    --content-type "audio/wav" \
    --cache-control "public, max-age=31536000, immutable"
done

echo ""
echo "✓ $(ls "$ROOT"/sounds/*.wav | wc -l | tr -d ' ') sounds uploaded"
echo "  Served at https://assets.sfx.woven.video/sfx/{id}.wav via public R2 custom domain"
