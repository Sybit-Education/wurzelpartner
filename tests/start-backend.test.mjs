import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { appendFileSync, mkdtempSync, mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, test } from 'node:test'

const projectDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const script = join(projectDir, 'scripts/start-backend.sh')
let fixtureDir
let backendDir
let envFile
let environment

beforeEach(() => {
  fixtureDir = mkdtempSync(join(tmpdir(), 'wurzelpartner backend '))
  backendDir = join(fixtureDir, 'middleware source')
  envFile = join(fixtureDir, 'server config.env')
  mkdirSync(join(backendDir, 'node_modules'), { recursive: true })
  writeFileSync(
    join(backendDir, 'package.json'),
    JSON.stringify({
      name: 'nocodb-middleware',
      scripts: { 'start:dev': 'node probe.cjs' },
    }),
  )
  writeFileSync(
    join(backendDir, 'probe.cjs'),
    `console.log(JSON.stringify({ cwd: process.cwd(), url: process.env.NOCODB_API_URL, token: process.env.NOCODB_API_TOKEN, mode: process.env.NODE_ENV, port: process.env.PORT })); process.exit(Number(process.env.PROBE_EXIT_CODE || 0));`,
  )
  writeFileSync(
    envFile,
    `NOCODB_API_URL=http://127.0.0.1:8080
NOCODB_API_TOKEN='literal$token#with spaces'
NOCODB_BASE_ID=test-base
JWT_SECRET=test-only-not-a-real-secret-123456789
CORS_ORIGINS=http://localhost:5173
PORT=3123
NODE_ENV=development
`,
  )
  environment = { ...process.env }
  for (const key of Object.keys(environment)) {
    if (/^(NOCODB_|JWT_|CORS_|AUTH_PROVIDER|NODE_ENV|PORT$|MIDDLEWARE_)/.test(key)) {
      delete environment[key]
    }
  }
})

afterEach(() => rmSync(fixtureDir, { recursive: true, force: true }))

function run(...args) {
  return spawnSync('bash', [script, ...args], {
    cwd: tmpdir(),
    env: environment,
    encoding: 'utf8',
    timeout: 15000,
  })
}

test('help works without a backend checkout or env file', () => {
  const result = run('--help')
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /--backend-dir/)
  assert.match(result.stdout, /--env-file/)
})

test('starts the requested checkout from another directory with dotenv literals intact', () => {
  const result = run('--backend-dir', backendDir, '--env-file', envFile)
  assert.equal(result.status, 0, result.stderr)
  const probe = JSON.parse(result.stdout.trim().split('\n').at(-1))
  assert.deepEqual(probe, {
    cwd: backendDir,
    url: 'http://127.0.0.1:8080',
    token: 'literal$token#with spaces',
    mode: 'development',
    port: '3123',
  })
})

test('refuses missing server configuration without starting the backend', () => {
  const result = run('--backend-dir', backendDir, '--env-file', join(fixtureDir, 'missing.env'))
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /Env-Datei/)
  assert.doesNotMatch(result.stdout, /probe.cjs/)
})

test('reports missing required values without printing secrets', () => {
  writeFileSync(envFile, 'NOCODB_API_TOKEN=do-not-log-this-token\n')
  const result = run('--backend-dir', backendDir, '--env-file', envFile)
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /NOCODB_API_URL/)
  assert.match(result.stderr, /CORS_ORIGINS/)
  assert.doesNotMatch(result.stdout + result.stderr, /do-not-log-this-token/)
})

test('does not execute shell expressions in the env file', () => {
  const marker = join(fixtureDir, 'must-not-exist')
  const token = `$(touch "${marker}")`
  appendFileSync(envFile, `NOCODB_API_TOKEN='${token}'\n`)
  const result = run('--backend-dir', backendDir, '--env-file', envFile)
  assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(result.stdout.trim().split('\n').at(-1)).token, token)
  assert.equal(existsSync(marker), false)
})

test('preserves the backend exit code', () => {
  environment.PROBE_EXIT_CODE = '17'
  const result = run('--backend-dir', backendDir, '--env-file', envFile)
  assert.equal(result.status, 17, result.stderr)
})

test('reports missing option values and unknown arguments', () => {
  for (const args of [['--env-file'], ['--backend-dir'], ['--unknown']]) {
    const result = run(...args)
    assert.equal(result.status, 2)
  }
})
