#!/usr/bin/env bash
# Generate v0 placeholder .wav files for every catalog sound id.
# Replace with final mastered assets when available — filenames must stay {id}.wav.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/sounds"
mkdir -p "$OUT"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required (brew install ffmpeg)" >&2
  exit 1
fi

render() {
  local id="$1"
  local filter="$2"
  local dur="${3:-0.5}"
  local out="$OUT/${id}.wav"
  ffmpeg -y -hide_banner -loglevel error \
    -f lavfi -i "$filter" -t "$dur" \
    -ar 44100 -ac 1 -c:a pcm_s16le "$out"
  echo "  $id (${dur}s)"
}

whoosh() {
  local id="$1" dur="${2:-0.45}"
  render "$id" "anoisesrc=color=white:duration=${dur},afade=t=in:st=0:d=0.02,afade=t=out:st=0.3:d=0.12,asetrate=48000*0.4,aresample=44100" "$dur"
}

glitch() {
  local id="$1" dur="${2:-0.35}"
  render "$id" "anoisesrc=color=white:duration=${dur},aphaser=type=t:speed=0.8:decay=0.4,acrusher=level_in=8:level_out=18:bits=6:mode=log" "$dur"
}

ding() {
  local id="$1" freq="${2:-880}" dur="${3:-0.6}"
  render "$id" "sine=frequency=${freq}:duration=${dur},afade=t=in:st=0:d=0.01,afade=t=out:st=0.35:d=0.25" "$dur"
}

click() {
  local id="$1" dur="${2:-0.08}"
  render "$id" "sine=frequency=1200:duration=${dur},afade=t=out:st=0:d=${dur}" "$dur"
}

impact() {
  local id="$1" dur="${2:-0.7}"
  render "$id" "sine=frequency=80:duration=${dur},afade=t=in:st=0:d=0.01,afade=t=out:st=0.05:d=0.65" "$dur"
}

typing() {
  local id="$1" dur="${2:-1.2}"
  render "$id" "anoisesrc=color=pink:duration=${dur},lowpass=f=1200,highpass=f=200,volume=0.35" "$dur"
}

echo "Seeding sounds → $OUT"

whoosh fast-whoosh 0.42
whoosh deep-whoosh 0.65
whoosh swish-whoosh-large 0.55
glitch glitch-logo 0.32
glitch record-scratch 0.28
glitch record-needle-scratch 0.4
glitch dj-scratch 0.5
glitch sideways-record-needle 0.38
impact bass-impact 1.1
impact base-drop 0.9
ding airplane-ding 800 1.0
ding elevator-ding 660 0.9
ding notification-ding 1046 0.45
ding beep-short 1400 0.15
ding message-pop-reply 1200 0.25
click mouse-click-1 0.06
click mouse-click-2 0.07
click tick-sound 0.05
click camera-shutter-release 0.12
render camera-flash "anoisesrc=color=white:duration=0.18,afade=t=in:st=0:d=0.01,afade=t=out:st=0.02:d=0.16,volume=2.5" 0.18
render camera-analog "anoisesrc=color=white:duration=0.35,lowpass=f=900,afade=t=out:st=0.1:d=0.2" 0.35
render pop-hand "sine=frequency=400:duration=0.2,afade=t=out:st=0:d=0.2" 0.2
typing keyboard-typing 1.4
typing keyboard-typing-realistic 2.0
render several-coins "sine=frequency=2000:duration=0.15,afade=t=out:st=0:d=0.15" 0.15
render money-chalking "anoisesrc=color=pink:duration=0.6,highpass=f=800,volume=0.5" 0.6
render frog-ribbit "sine=frequency=150:duration=0.5,afade=t=out:st=0.2:d=0.3,vibrato=f=12:d=0.3" 0.5

echo ""
echo "✓ $(ls "$OUT"/*.wav | wc -l | tr -d ' ') sounds in $OUT"
echo "  Run: pnpm update:durations && pnpm generate:peaks"