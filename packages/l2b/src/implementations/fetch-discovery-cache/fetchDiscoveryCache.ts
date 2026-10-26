import { REUSABLE_CACHE_INVOCATIONS, type SQLiteCache } from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import type { CliLogger } from '../common/CliLogger'
import { decodeStringDump } from './decodeStringDump'
import {
  formatFetchingRow,
  formatHeader,
  formatScanningRow,
  formatTotalRow,
} from './progressTable'

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
  keysMissing: number
  keysFetched: number
  keysEvicted: number
  bytesTransferred: number
  bytesDecoded: number
}

interface KindProgress {
  scanning: boolean
  stats: FetchStats
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
  const nameWidth = Math.max(...FETCHED_KINDS.map((kind) => kind.length))
  cli.log(formatHeader(nameWidth))
  const statuses = FETCHED_KINDS.map(() => cli.status())
  const statsPerKind = await Promise.all(
    FETCHED_KINDS.map((kind, i) =>
      fetchKind(sources[i], cache, kind, (progress) =>
        statuses[i].update(formatRow(kind, nameWidth, progress)),
      ),
    ),
  )

  const total = emptyStats()
  for (const [i, stats] of statsPerKind.entries()) {
    statuses[i].done(formatFetchingRow(FETCHED_KINDS[i], nameWidth, stats))
    addStats(total, stats)
  }
  cli.log(formatTotalRow(nameWidth, total, Date.now() - startedAtMs))
  return total
}

async function fetchKind(
  source: DumpSource,
  cache: SQLiteCache,
  kind: string,
  report: (progress: KindProgress) => void,
): Promise<FetchStats> {
  const stats = emptyStats()
  report({ scanning: true, stats })
  const keys = new Set<string>()
  let cursor = 0
  do {
    const page = await source.scan(cursor, `*.${kind}.*`)
    cursor = page.cursor
    for (const key of page.keys) {
      keys.add(key)
    }
    stats.keysScanned = keys.size
    report({ scanning: true, stats })
  } while (cursor !== 0)

  const missingKeys = await findMissingKeysInBatches(cache, [...keys])
  stats.keysMissing = missingKeys.length
  report({ scanning: false, stats })
  for (let start = 0; start < missingKeys.length; start += BATCH_SIZE) {
    const batch = missingKeys.slice(start, start + BATCH_SIZE)
    addStats(stats, await fetchBatch(source, cache, batch))
    report({ scanning: false, stats })
  }
  assert(
    stats.keysFetched + stats.keysEvicted === stats.keysMissing,
    'Every missing key is either fetched or evicted',
  )
  return stats
}

async function findMissingKeysInBatches(
  cache: SQLiteCache,
  keys: string[],
): Promise<string[]> {
  const missingKeys: string[] = []
  for (let start = 0; start < keys.length; start += BATCH_SIZE) {
    const batch = keys.slice(start, start + BATCH_SIZE)
    missingKeys.push(...(await cache.findMissingKeys(batch)))
  }
  return missingKeys
}

async function fetchBatch(
  source: DumpSource,
  cache: SQLiteCache,
  keys: string[],
): Promise<FetchStats> {
  const stats = emptyStats()
  const dumps = await Promise.all(keys.map((key) => source.dump(key)))
  const entries: { key: string; value: string }[] = []
  for (const [i, key] of keys.entries()) {
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

function formatRow(
  kind: string,
  nameWidth: number,
  progress: KindProgress,
): string {
  if (progress.scanning) {
    return formatScanningRow(kind, nameWidth, progress.stats.keysScanned)
  }
  return formatFetchingRow(kind, nameWidth, progress.stats)
}

function emptyStats(): FetchStats {
  return {
    keysScanned: 0,
    keysMissing: 0,
    keysFetched: 0,
    keysEvicted: 0,
    bytesTransferred: 0,
    bytesDecoded: 0,
  }
}

function addStats(target: FetchStats, source: FetchStats): void {
  target.keysScanned += source.keysScanned
  target.keysMissing += source.keysMissing
  target.keysFetched += source.keysFetched
  target.keysEvicted += source.keysEvicted
  target.bytesTransferred += source.bytesTransferred
  target.bytesDecoded += source.bytesDecoded
}
