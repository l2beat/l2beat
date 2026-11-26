import type { Database, WatchMonitorRecord } from '@l2beat/database'
import {
  countPendingItems,
  diffWatched,
  stripPendingItems,
  type WatchDiff,
  type Watched,
  type WatchLocation,
  type WatchReader,
} from '@l2beat/discovery'
import type { UnixTime } from '@l2beat/shared-pure'

export interface PendingWatchDiff {
  name: string
  kind: WatchLocation['kind']
  runTimestamp: UnixTime
  pendingItems: number
  changedPaths: number
  diff: WatchDiff[]
}

export function computePendingWatchDiff(
  location: WatchLocation,
  latest: WatchMonitorRecord,
  committed: Watched | undefined,
): PendingWatchDiff | undefined {
  if (latest.timestamp === null || latest.values === null) {
    return undefined
  }
  const committedValues = committed?.values ?? {}
  const diff = diffWatched(committedValues, latest.values)
  const pendingItems = countPendingItems(latest.values)
  const acceptedDiff = diffWatched(
    committedValues,
    stripPendingItems(latest.values),
  )
  const changedPaths = countChanges(acceptedDiff)

  if (diff.length === 0 && pendingItems === 0) {
    return undefined
  }

  return {
    name: location.name,
    kind: location.kind,
    runTimestamp: latest.timestamp,
    pendingItems,
    changedPaths,
    diff,
  }
}

// Built purely from the last stored run and the committed watched.json:
// never triggers network calls or template runs.
export async function getPendingWatchDiffs(
  reader: WatchReader,
  db: Database,
): Promise<PendingWatchDiff[]> {
  const stored = new Map(
    (await db.watchMonitor.getAll()).map((record) => [record.name, record]),
  )
  const result: PendingWatchDiff[] = []

  for (const location of reader.readAllWatches()) {
    const latest = stored.get(location.name)
    if (latest === undefined) {
      continue
    }
    const pending = computePendingWatchDiff(
      location,
      latest,
      reader.readWatched(location.name),
    )
    if (pending !== undefined) {
      result.push(pending)
    }
  }

  return result
}

function countChanges(diff: WatchDiff[]): number {
  return diff.reduce((sum, { changes }) => sum + changes.length, 0)
}
