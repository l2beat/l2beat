// Stage 1: pragma → solc version → standard-JSON compile (AST + storage layout).
//
// Mirrors what l2beat/analyze's `shared/solc.py` and l2b's FlattenerValidator already do:
// read every `pragma solidity` constraint, prefer an already-downloaded compiler that
// satisfies all of them, otherwise pick the newest release that does and fetch it
// (native linux binary from binaries.soliditylang.org, via @ethereum-sourcify/compilers).

import {
  getSolcExecutable,
  useSolidityCompiler,
} from '@ethereum-sourcify/compilers'
import type {
  SolidityJsonInput,
  SolidityOutput,
} from '@ethereum-sourcify/compilers-types'
import { createHash } from 'crypto'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs'
import { join } from 'path'
import semver from 'semver'

const PLATFORM = 'linux-amd64'
const RELEASE_LIST_URL = `https://binaries.soliditylang.org/${PLATFORM}/list.json`

export type Backend = 'native' | 'solcjs'

export interface CompileRequest {
  /** Name of the source unit inside the standard JSON input (e.g. `Flat.sol`). */
  fileName: string
  source: string
  cacheDir: string
  backend: Backend
  /** Exact version override (e.g. `0.8.20`); skips pragma resolution. */
  solcVersion?: string
}

export interface CompileResult {
  /** The standard-JSON request sent to solc. */
  input: SolidityJsonInput
  output: SolidityOutput
  /** Full version, e.g. `0.8.20+commit.a1b79de6`. */
  solcVersion: string
  constraints: string[]
  resolvedFrom: 'cache' | 'release-list' | 'override' | 'bundled-solcjs'
  /** resolveMs includes downloading and verifying the binary on first use. */
  timings: { resolveMs: number; compileMs: number }
  warnings: number
}

/** Every `pragma solidity <constraint>;` in the file, comments stripped (a flattened file may carry several). */
export function extractPragmaConstraints(source: string): string[] {
  const noComments = source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/[^\n]*/g, '')
  const constraints: string[] = []
  for (const match of noComments.matchAll(/pragma\s+solidity\s+([^;]+);/g)) {
    const constraint = match[1]?.trim()
    if (constraint) constraints.push(constraint)
  }
  return constraints
}

function satisfiesAll(version: string, constraints: string[]): boolean {
  return constraints.every((c) => semver.satisfies(version, c))
}

function pickNewest(
  versions: string[],
  constraints: string[],
): string | undefined {
  const ok = versions.filter(
    (v) => semver.valid(v) && satisfiesAll(v, constraints),
  )
  return semver.rsort(ok)[0]
}

interface ReleaseList {
  releases: Record<string, string>
  latestRelease: string
  builds: Array<{ path: string; longVersion: string; sha256: string }>
}

async function loadReleaseList(cacheDir: string): Promise<ReleaseList> {
  const path = join(cacheDir, `solc-${PLATFORM}-list.json`)
  if (existsSync(path)) {
    return JSON.parse(readFileSync(path, 'utf8')) as ReleaseList
  }
  const res = await fetch(RELEASE_LIST_URL)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${RELEASE_LIST_URL}: ${res.status}`)
  }
  const text = await res.text()
  mkdirSync(cacheDir, { recursive: true })
  writeFileSync(path, text)
  return JSON.parse(text) as ReleaseList
}

/** Versions whose native binary is already in the cache, as `x.y.z+commit.hash`. */
function cachedVersions(cacheDir: string): string[] {
  const dir = join(cacheDir, 'solc')
  if (!existsSync(dir)) return []
  const out: string[] = []
  for (const file of readdirSync(dir)) {
    const m = /^solc-linux-amd64-v(\d+\.\d+\.\d+\+commit\.[0-9a-f]+)$/.exec(
      file,
    )
    if (m?.[1]) out.push(m[1])
  }
  return out
}

export async function resolveSolcVersion(
  constraints: string[],
  cacheDir: string,
): Promise<{ version: string; resolvedFrom: 'cache' | 'release-list' }> {
  // 1. Anything already downloaded that satisfies the pragma wins (works offline).
  const cached = cachedVersions(cacheDir)
  const cachedPick = pickNewest(
    cached.map((v) => v.split('+')[0] ?? v),
    constraints,
  )
  if (cachedPick) {
    const full = cached.find((v) => v.startsWith(`${cachedPick}+`))
    if (full) return { version: full, resolvedFrom: 'cache' }
  }
  // 2. Otherwise the newest release satisfying every constraint.
  const list = await loadReleaseList(cacheDir)
  const pick = pickNewest(Object.keys(list.releases), constraints)
  if (!pick) {
    throw new Error(`No released solc satisfies ${JSON.stringify(constraints)}`)
  }
  const file = list.releases[pick] ?? ''
  const full = file.replace(/^solc-linux-amd64-v/, '')
  return { version: full, resolvedFrom: 'release-list' }
}

/**
 * Makes sure the native binary for `version` is in the cache (downloading it if needed, exactly
 * like packages/l2b does) and that its sha256 matches the hash published in list.json.
 * The sourcify helper itself does not verify downloads, so we do it here before first use.
 */
async function ensureVerifiedSolc(
  cacheDir: string,
  version: string,
): Promise<string> {
  const path = await getSolcExecutable(
    join(cacheDir, 'solc'),
    PLATFORM,
    version,
  )
  if (!path) throw new Error(`could not obtain solc ${version} for ${PLATFORM}`)
  const list = await loadReleaseList(cacheDir)
  const build = list.builds.find((b) => b.longVersion === version)
  if (!build) throw new Error(`solc ${version} is not in ${RELEASE_LIST_URL}`)
  const actual = `0x${createHash('sha256').update(readFileSync(path)).digest('hex')}`
  if (actual !== build.sha256.toLowerCase()) {
    unlinkSync(path)
    throw new Error(
      `sha256 mismatch for ${path}: expected ${build.sha256}, got ${actual}; file removed`,
    )
  }
  return path
}

function buildInput(fileName: string, source: string): SolidityJsonInput {
  return {
    language: 'Solidity',
    sources: { [fileName]: { content: source } },
    settings: {
      optimizer: { enabled: false },
      outputSelection: {
        '*': {
          '': ['ast'],
          '*': ['storageLayout', 'evm.methodIdentifiers'],
        },
      },
    },
  }
}

interface SolcError {
  severity: string
  formattedMessage?: string
  message?: string
}

function checkErrors(output: SolidityOutput): number {
  const errors = (output.errors ?? []) as SolcError[]
  const fatal = errors.filter((e) => e.severity === 'error')
  if (fatal.length > 0) {
    throw new Error(
      `solc reported ${fatal.length} error(s):\n${fatal
        .map((e) => e.formattedMessage ?? e.message ?? '')
        .join('\n')}`,
    )
  }
  return errors.length - fatal.length
}

export async function compile(req: CompileRequest): Promise<CompileResult> {
  const constraints = extractPragmaConstraints(req.source)
  if (constraints.length === 0) {
    throw new Error(`No 'pragma solidity' directive found in ${req.fileName}`)
  }
  const input = buildInput(req.fileName, req.source)

  if (req.backend === 'solcjs') {
    // Offline dev fallback: the solc-js (wasm) build that is already in node_modules.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const solc = (await import('solc')).default
    const t0 = performance.now()
    const output = JSON.parse(
      solc.compile(JSON.stringify(input)),
    ) as SolidityOutput
    const compileMs = performance.now() - t0
    const warnings = checkErrors(output)
    return {
      input,
      output,
      solcVersion: solc.version(),
      constraints,
      resolvedFrom: 'bundled-solcjs',
      timings: { resolveMs: 0, compileMs },
      warnings,
    }
  }

  const t0 = performance.now()
  const resolved = req.solcVersion
    ? {
        ...(await resolveSolcVersion([`=${req.solcVersion}`], req.cacheDir)),
        resolvedFrom: 'override' as const,
      }
    : await resolveSolcVersion(constraints, req.cacheDir)
  await ensureVerifiedSolc(req.cacheDir, resolved.version)
  const t1 = performance.now()
  const output = await useSolidityCompiler(
    join(req.cacheDir, 'solc'),
    join(req.cacheDir, 'soljson'),
    resolved.version,
    input,
    false,
  )
  const t2 = performance.now()
  const warnings = checkErrors(output)
  return {
    input,
    output,
    solcVersion: resolved.version,
    constraints,
    resolvedFrom: resolved.resolvedFrom,
    timings: { resolveMs: t1 - t0, compileMs: t2 - t1 },
    warnings,
  }
}
