import { execSync } from 'child_process'
import { createHash } from 'crypto'
import { compact } from 'es-toolkit/compat'
import { readFileSync } from 'fs'
import path from 'path'

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

function envHash(env: Record<string, unknown>) {
  if (Object.keys(env).length === 0) return undefined
  const sortedEnv = Object.keys(env)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = env[key]
      return acc
    }, {})
  return sha256Hex(JSON.stringify(sortedEnv)).slice(0, 12)
}

function buildCacheKey(dbUrl: string, envs?: Record<string, unknown>) {
  const dirty = gitDirtyHash().slice(0, 12)
  const precomputedHash = readFileSync(
    path.join(__dirname, '../package-hash.txt'),
    'utf8',
  )

  const env = envs ? envHash(envs) : undefined
  const dbHash = sha256Hex(dbUrl).slice(0, 12)

  const parts = compact([
    precomputedHash,
    `dirty-${dirty}`,
    `db-${dbHash}`,
    env && `env-${env}`,
  ])
  return parts.join(':')
}

export const getPackageHash = (dbUrl: string, envs?: Record<string, unknown>) =>
  buildCacheKey(dbUrl, envs)
