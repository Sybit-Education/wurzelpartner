#!/usr/bin/env bash
set -euo pipefail

entry=$(find dist/assets -maxdepth 1 -type f -name 'index-*.js' -print -quit)
if [[ -z "$entry" ]]; then
  echo "Production entry bundle not found; run npm run build first" >&2
  exit 1
fi

map_resource='/maps/radolfzell.pmtiles'
if grep -Fq "$map_resource" "$entry"; then
  echo "Offline basemap code must not be included in the initial app bundle" >&2
  exit 1
fi

if ! grep -Fq "$map_resource" dist/assets/*.js; then
  echo "Offline basemap code was not found in a production JavaScript bundle" >&2
  exit 1
fi
