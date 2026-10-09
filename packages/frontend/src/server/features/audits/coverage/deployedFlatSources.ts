import { createHash } from 'crypto'
import { getDb } from '~/server/database'

// `l2b audit-coverage` hashes the flat source exactly as discovery flattens
// it, without the two-line header discovery prepends to its .flat files, so
// the project's FlatSources row can be looked up by that hash.

const HEADER =
  /^\/\/ SPDX-License-Identifier: Unknown\npragma solidity [^\n]*;\n\n/

export function stripFlatHeader(content: string): string {
  return content.replace(HEADER, '')
}

export function sha256(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}

/** Flat sources of one project by the sha256 of their header-less content. */
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

interface CachedIndex {
  contentHash: string
  index: Map<string, string>
}

const cache = new Map<string, CachedIndex>()

/**
 * The header-less flat source with this hash among the project's current
 * flat sources, or undefined when the database holds no such source: the
 * contract changed since the coverage was generated, or the row is missing.
 */
export async function getDeployedFlat(
  projectId: string,
  flatHash: string,
): Promise<string | undefined> {
  const record = await getDb().flatSources.get(projectId)
  if (!record) return undefined
  let cached = cache.get(projectId)
  if (!cached || cached.contentHash !== record.contentHash) {
    cached = {
      contentHash: record.contentHash,
      index: indexFlatSources(record.flat),
    }
    cache.set(projectId, cached)
  }
  return cached.index.get(flatHash)
}
