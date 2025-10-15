import { execSync } from 'child_process'
import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import { resolve } from 'path'

function sha256Hex(s: string) {
  return createHash('sha256').update(s).digest('hex')
}

export function gitDirtyHash(): string {
  try {
    // Get diff of unstaged + staged changes
    const diff = execSync('git diff HEAD', { encoding: 'utf8' })
    if (!diff.trim()) return ''
    return sha256Hex(diff)
  } catch {
    return ''
  }
}

// 1) Hash only THIS workspace's tracked files (fast & precise)
function gitTreeHash(pkgDir: string): string {
  // Tree object hash for the directory at HEAD (changes when any file under it changes)
  const hash = execSync(`git rev-parse HEAD:${pkgDir}`, {
    encoding: 'utf8',
  }).trim()
  return hash
}

// 2) Hash the resolved dep graph for this workspace using pnpm
//    We ask pnpm for the filtered dependency tree and hash name@version pairs deterministically.
function depsHash(pkgNameOrFilter: string): string {
  const json = execSync(`pnpm ls --prod --json --filter "${pkgNameOrFilter}"`, {
    encoding: 'utf8',
  })
  // pnpm returns an array of trees; flatten to unique "name@version"
  const trees: Record<string, unknown> = JSON.parse(json)[0].dependencies

  const depsHashes = Object.keys(trees)
    .filter((key) => key.startsWith('@l2beat'))
    .map((key) => key.replace('@l2beat', 'packages'))
    .map((key) => gitTreeHash(key))

  return sha256Hex(depsHashes.join(':'))
}

function envHash(env: Record<string, unknown>) {
  const sortedEnv = Object.keys(env)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = env[key]
      return acc
    }, {})
  return sha256Hex(JSON.stringify(sortedEnv)).slice(0, 12)
}

function buildCacheKey(opts: {
  pkgDir: string
  pnpmFilter: string
  pnpmLockFile: string
  envs: Record<string, unknown>
}) {
  const { pkgDir, pnpmFilter, envs, pnpmLockFile } = opts
  const lock = sha256Hex(readFileSync(resolve(pnpmLockFile), 'utf8')).slice(
    0,
    12,
  )
  const dirty = gitDirtyHash().slice(0, 12)
  const tree = gitTreeHash(pkgDir).slice(0, 12)
  const deps = depsHash(pnpmFilter).slice(0, 12)

  const env = envHash(envs).slice(0, 12)

  const parts = [
    `dirty-${dirty}`,
    `src-${tree}`,
    `deps-${deps}`,
    `env-${env}`,
    `lock-${lock}`,
  ]
  return parts.join(':')
}

export const getPackageHash = (env: Record<string, unknown>) =>
  buildCacheKey({
    pkgDir: 'packages/dal',
    pnpmFilter: '@l2beat/dal',
    pnpmLockFile: '../../pnpm-lock.yaml',
    envs: env,
  })
