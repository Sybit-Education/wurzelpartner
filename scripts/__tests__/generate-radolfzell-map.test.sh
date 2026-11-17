#!/usr/bin/env bash
set -euo pipefail

output=$(bash scripts/generate-radolfzell-map.sh invalid 2>&1) && {
  echo "Expected invalid source date to fail" >&2
  exit 1
}
grep -Eq '^Usage: .*YYYYMMDD$' <<<"$output"
