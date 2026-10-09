import { REUSABLE_CACHE_INVOCATIONS, type SQLiteCache } from '@l2beat/discovery'
import { formatSI } from '@l2beat/shared'
import { assert, formatSeconds } from '@l2beat/shared-pure'
import type { CliLogger } from '../common/CliLogger'
import { decodeStringDump } from './decodeStringDump'

export const FETCHED_KINDS: string[] = Object.values(REUSABLE_CACHE_INVOCATIONS)

const BATCH_SIZE = 200

export interface DumpSource {
  scan(
    cursor: number,
    pattern: string,
  ): Promise<{ cursor: number; keys: string[] }>
  dump(key: string): Promise<Buffer | null>
}

export interface FetchStats {
  keysScanned: number
  keysFetched: number
  keysEvicted: number
  bytesTransferred: number
  bytesDecoded: number
}

export async function fetchDiscoveryCache(
  cli: CliLogger,
  sources: DumpSource[],
  cache: SQLiteCache,
): Promise<FetchStats> {
  assert(
    sources.length === FETCHED_KINDS.length,
    'Expected one source per fetched kind',
  )
  const startedAtMs = Date.now()
  const statsPerKind = await Promise.all(
    FETCHED_KINDS.map((kind, i) => fetchKind(cli, sources[i], cache, kind)),
  )
  const total = emptyStats()
  for (const stats of statsPerKind) {
    addStats(total, stats)
  }
  cli.log(
    `${formatStats('Total', total)} in ${formatSeconds((Date.now() - startedAtMs) / 1000)}`,
  )
  return total
}

async function fetchKind(
  cli: CliLogger,
  source: DumpSource,
  cache: SQLiteCache,
  kind: string,
): Promise<FetchStats> {
  const status = cli.status()
  const stats = emptyStats()
  let cursor = 0
  do {
    const page = await source.scan(cursor, `*.${kind}.*`)
    cursor = page.cursor
    stats.keysScanned += page.keys.length
    for (let start = 0; start < page.keys.length; start += BATCH_SIZE) {
      const keys = page.keys.slice(start, start + BATCH_SIZE)
      addStats(stats, await fetchBatch(source, cache, keys))
      status.update(formatStats(kind, stats))
    }
  } while (cursor !== 0)
  status.done(formatStats(kind, stats))
  return stats
}

async function fetchBatch(
  source: DumpSource,
  cache: SQLiteCache,
  keys: string[],
): Promise<FetchStats> {
  const stats = emptyStats()
  const missingKeys = await cache.findMissingKeys(keys)
  const dumps = await Promise.all(missingKeys.map((key) => source.dump(key)))
  const entries: { key: string; value: string }[] = []
  for (const [i, key] of missingKeys.entries()) {
    const dump = dumps[i]
    if (dump === null) {
      stats.keysEvicted += 1
      continue
    }
    const value = decodeStringDump(dump)
    entries.push({ key, value })
    stats.keysFetched += 1
    stats.bytesTransferred += dump.length
    stats.bytesDecoded += Buffer.byteLength(value)
  }
  await cache.setMany(entries)
  return stats
}

function emptyStats(): FetchStats {
  return {
    keysScanned: 0,
    keysFetched: 0,
    keysEvicted: 0,
    bytesTransferred: 0,
    bytesDecoded: 0,
  }
}

function addStats(target: FetchStats, source: FetchStats): void {
  target.keysScanned += source.keysScanned
  target.keysFetched += source.keysFetched
  target.keysEvicted += source.keysEvicted
  target.bytesTransferred += source.bytesTransferred
  target.bytesDecoded += source.bytesDecoded
}

function formatStats(label: string, stats: FetchStats): string {
  return (
    `${label}: fetched ${stats.keysFetched} of ${stats.keysScanned} keys, ` +
    `${formatSI(stats.bytesTransferred, 'B')} transferred, ` +
    `${formatSI(stats.bytesDecoded, 'B')} decoded, ` +
    `${stats.keysEvicted} evicted`
  )
}
