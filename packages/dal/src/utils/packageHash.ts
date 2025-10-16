import { execSync } from 'child_process'
import { createHash } from 'crypto'
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
  const sortedEnv = Object.keys(env)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = env[key]
      return acc
    }, {})
  return sha256Hex(JSON.stringify(sortedEnv)).slice(0, 12)
}

function buildCacheKey(envs: Record<string, unknown>) {
  const dirty = gitDirtyHash().slice(0, 12)
  const precomputedHash = readFileSync(
    path.join(__dirname, '../package-hash.txt'),
    'utf8',
  )

  const env = envHash(envs).slice(0, 12)

  const parts = [precomputedHash, `dirty-${dirty}`, `env-${env}`]
  return parts.join(':')
}

export const getPackageHash = (env: Record<string, unknown>) =>
  buildCacheKey(env)
