import { execSync } from 'child_process'
import { createHash } from 'crypto'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join, resolve } from 'path'

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
  // --prod to ignore dev-only deps if they don't affect runtime/DAL
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

// 3) Hash DAL migrations (or any SQL/schema files that influence queries)
function dirContentHash(dir: string, exts: string[]): string {
  const files: string[] = []
  const walk = (d: string) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name)
      const st = statSync(p)
      if (st.isDirectory()) {
        walk(p)
      } else if (exts.some((e) => p.endsWith(e))) files.push(p)
    }
  }
  try {
    walk(dir)
  } catch {
    return '' // migrations dir optional
  }
  files.sort()
  const h = createHash('sha256')
  for (const f of files) h.update(readFileSync(f))
  return h.digest('hex')
}

function buildCacheKey(opts: {
  pkgDir: string
  pnpmFilter: string
  migrationsDir: string
  pnpmLockFile: string
  env: Record<string, unknown>
}) {
  const { pkgDir, pnpmFilter, migrationsDir, env, pnpmLockFile } = opts
  const lock = sha256Hex(readFileSync(resolve(pnpmLockFile), 'utf8')).slice(
    0,
    12,
  )
  const dirty = gitDirtyHash().slice(0, 12)
  const tree = gitTreeHash(pkgDir).slice(0, 12)
  const deps = depsHash(pnpmFilter).slice(0, 12)
  const mig = (
    migrationsDir ? dirContentHash(migrationsDir, ['.sql']) : ''
  ).slice(0, 12)
  const envHash = sha256Hex(JSON.stringify(env)).slice(0, 12)

  const parts = [
    `dirty-${dirty}`,
    `src-${tree}`,
    `deps-${deps}`,
    `mig-${mig}`,
    `env-${envHash}`,
    `lock-${lock}`,
  ]
  return sha256Hex(parts.join(':')).slice(0, 12)
}

export const getPackageHash = (env: Record<string, unknown>) =>
  buildCacheKey({
    pkgDir: 'packages/dal',
    pnpmFilter: '@l2beat/dal',
    migrationsDir: '../database/prisma/migrations',
    pnpmLockFile: '../../pnpm-lock.yaml',
    env,
  })
