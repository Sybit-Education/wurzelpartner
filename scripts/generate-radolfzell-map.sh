#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 || ! "$1" =~ ^[0-9]{8}$ ]]; then
  printf 'Usage: %s YYYYMMDD\n' "$0" >&2
  exit 2
fi

if ! command -v pmtiles >/dev/null 2>&1; then
  echo "The PMTiles CLI v1.31.2 is required; see docs/MAP-DATA.md." >&2
  exit 127
fi

source_date=$1
mkdir -p public/maps

pmtiles extract \
  "https://build.protomaps.com/${source_date}.pmtiles" \
  public/maps/radolfzell.pmtiles \
  --bbox=8.9,47.71,9.1,47.87
