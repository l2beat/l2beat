import { createHash } from 'crypto'
import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import path from 'path'
import { getDb } from '~/server/database'

// `l2b audit-coverage` hashes the flat source exactly as discovery flattens
// it, without the two-line header discovery prepends to its .flat files, so
// a flat source can be looked up by that hash wherever discovery output is
// kept: the FlatSources table the backend fills, or, on a developer machine
// without that table, the project's .flat directory in packages/config
// (refreshed with `l2b fetch-flat-sources` or a discovery run).

const HEADER =
  /^\/\/ SPDX-License-Identifier: Unknown\npragma solidity [^\n]*;\n\n/

export function stripFlatHeader(content: string): string {
  return content.replace(HEADER, '')
}

export function sha256(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}

/** Flat sources by the sha256 of their header-less content. */
export function indexFlatSources(
  flat: Record<string, string>,
): Map<string, string> {
  const index = new Map<string, string>()
  for (const content of Object.values(flat)) {
    const stripped = stripFlatHeader(content)
    index.set(sha256(stripped), stripped)
  }
  return index
}

/** Every .sol file below `dir`, by path. */
export function readFlatDirectory(dir: string): Record<string, string> {
  const files: Record<string, string> = {}
  const walk = (current: string) => {
    for (const name of readdirSync(current).sort()) {
      const full = path.join(current, name)
      const stat = statSync(full)
      if (stat.isDirectory()) walk(full)
      else if (name.endsWith('.sol')) files[full] = readFileSync(full, 'utf8')
    }
  }
  walk(dir)
  return files
}

interface CachedIndex {
  key: string
  index: Map<string, string>
}

const databaseCache = new Map<string, CachedIndex>()
const localCache = new Map<string, CachedIndex>()

/**
 * The header-less flat source with this hash among the project's current
 * flat sources, or undefined when neither the database nor the local
 * discovery output holds such a source: the contract changed since the
 * coverage was generated. A database failure is reported only when there is
 * no local discovery output to fall back to.
 */
export async function getDeployedFlat(
  projectId: string,
  flatHash: string,
): Promise<string | undefined> {
  let databaseError: unknown
  try {
    const fromDatabase = await getFromDatabase(projectId, flatHash)
    if (fromDatabase !== undefined) return fromDatabase
  } catch (e) {
    databaseError = e
  }
  const localDir = localDiscoveryDirectory(projectId)
  if (localDir === undefined) {
    if (databaseError !== undefined) throw databaseError
    return undefined
  }
  return getFromLocalDiscovery(projectId, localDir, flatHash)
}

async function getFromDatabase(
  projectId: string,
  flatHash: string,
): Promise<string | undefined> {
  const record = await getDb().flatSources.get(projectId)
  if (!record) return undefined
  let cached = databaseCache.get(projectId)
  if (!cached || cached.key !== record.contentHash) {
    cached = { key: record.contentHash, index: indexFlatSources(record.flat) }
    databaseCache.set(projectId, cached)
  }
  return cached.index.get(flatHash)
}

/** `packages/config/src/projects/<project>/.flat`, when checked out next to the frontend. */
function localDiscoveryDirectory(projectId: string): string | undefined {
  const dir = path.resolve(
    process.cwd(),
    '../config/src/projects',
    projectId,
    '.flat',
  )
  return existsSync(dir) ? dir : undefined
}

function getFromLocalDiscovery(
  projectId: string,
  dir: string,
  flatHash: string,
): string | undefined {
  const key = String(statSync(dir).mtimeMs)
  let cached = localCache.get(projectId)
  if (!cached || cached.key !== key) {
    cached = { key, index: indexFlatSources(readFlatDirectory(dir)) }
    localCache.set(projectId, cached)
  }
  return cached.index.get(flatHash)
}
