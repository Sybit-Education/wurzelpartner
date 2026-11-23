#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
backend_dir="${MIDDLEWARE_DIR:-$project_dir/../nocodb-middleware}"
env_file="$project_dir/.env.middleware"

usage() {
  printf '%s\n' \
    'Verwendung: bash scripts/start-backend.sh [Optionen]' \
    '  --backend-dir PFAD  Middleware-Checkout (Standard: ../nocodb-middleware)' \
    '  --env-file PFAD     Server-Env-Datei (Standard: .env.middleware im Projekt)' \
    '  --help              Hilfe anzeigen' \
    'Startet npm run start:dev. Node >=24.9 und npm ci im Backend erforderlich.'
}

fail() {
  printf 'Fehler: %s\n' "$1" >&2
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --backend-dir|--env-file)
      if [[ $# -lt 2 || -z "$2" || "$2" == --* ]]; then
        printf 'Fehlender Wert fuer %s\n' "$1" >&2
        exit 2
      fi
      if [[ "$1" == --backend-dir ]]; then
        backend_dir="$2"
      else
        env_file="$2"
      fi
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      printf 'Unbekannte Option: %s\n' "$1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

command -v node >/dev/null || fail 'Node >=24.9 fehlt.'
node -e 'const [major, minor] = process.versions.node.split(".").map(Number); process.exit(major > 24 || (major === 24 && minor >= 9) ? 0 : 1)' \
  || fail 'Node >=24.9 erforderlich; vorher nvm use ausfuehren.'
npm_cli="$(command -v npm)" || fail 'npm fehlt.'
[[ -r "$env_file" ]] || fail 'Env-Datei fehlt oder ist nicht lesbar; .env.middleware.example als Vorlage verwenden.'
env_file="$(cd -- "$(dirname -- "$env_file")" && pwd)/$(basename -- "$env_file")"
[[ -f "$backend_dir/package.json" ]] || fail 'Middleware-Checkout fehlt; --backend-dir angeben.'
backend_dir="$(cd -- "$backend_dir" && pwd)"
node -e 'process.exit(require(process.argv[1]).name === "nocodb-middleware" ? 0 : 1)' "$backend_dir/package.json" \
  || fail 'Das Backend-Verzeichnis ist kein nocodb-middleware-Checkout.'
[[ -d "$backend_dir/node_modules" ]] || fail 'Backend-Abhaengigkeiten fehlen; dort zuerst npm ci ausfuehren.'

export NODE_ENV=development
node --env-file="$env_file" --input-type=commonjs <<'NODE'
const required = ['NOCODB_API_URL', 'NOCODB_API_TOKEN', 'NOCODB_BASE_ID', 'JWT_SECRET', 'CORS_ORIGINS'];
const missing = required.filter((key) => !process.env[key]?.trim());
if (missing.length) {
  console.error(`Fehlende Server-Konfiguration: ${missing.join(', ')}`);
  process.exit(1);
}
try {
  const url = new URL(process.env.NOCODB_API_URL);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
} catch {
  console.error('NOCODB_API_URL muss eine HTTP(S)-URL sein.');
  process.exit(1);
}
if (process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET muss mindestens 32 Zeichen enthalten.');
  process.exit(1);
}
const port = process.env.PORT ?? '3000';
if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
  console.error('PORT muss zwischen 1 und 65535 liegen.');
  process.exit(1);
}
NODE

cd -- "$backend_dir"
printf 'Starte Middleware im Entwicklungsmodus: %s\n' "$backend_dir"
exec node --env-file="$env_file" "$npm_cli" run start:dev