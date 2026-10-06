import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { createHash } from 'crypto'
import { constants, zstdDecompressSync } from 'zlib'
import type { AuditIndex } from './AuditIndex'

const AuditObjectsJson = v.record(v.string(), v.string())
const WINDOW_LOG_MAX = 31

export type AuditObjects = Map<string, string>

export function parseAuditObjects(
  compressed: Buffer,
  index: AuditIndex,
): AuditObjects {
  const decompressed = zstdDecompressSync(compressed, {
    params: { [constants.ZSTD_d_windowLogMax]: WINDOW_LOG_MAX },
  })
  const json = JSON.parse(decompressed.toString('utf8'))
  const objects = new Map(Object.entries(AuditObjectsJson.parse(json)))
  for (const object of referencedObjects(index)) {
    const content = objects.get(object)
    assert(content !== undefined, `Object ${object} is missing from bundle`)
    assert(
      gitBlobIdStartsWith(Buffer.from(content, 'utf8'), object),
      `Object ${object} does not hash to its id`,
    )
  }
  return objects
}

function referencedObjects(index: AuditIndex): Set<string> {
  const objects = new Set<string>()
  for (const byCommit of Object.values(index.repositories)) {
    for (const snapshot of Object.values(byCommit)) {
      for (const object of Object.values(snapshot.files)) {
        objects.add(object)
      }
    }
  }
  return objects
}

function gitBlobIdStartsWith(bytes: Buffer, object: string): boolean {
  return ['sha1', 'sha256'].some((algorithm) =>
    createHash(algorithm)
      .update(`blob ${bytes.length}\0`)
      .update(bytes)
      .digest('hex')
      .startsWith(object),
  )
}
