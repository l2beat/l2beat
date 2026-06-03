import type {
  ActivityRecord,
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
  TokenValueRecord,
} from '@l2beat/database'
import {
  getInteropTransferValue,
  type ProjectId,
  type UnixTime,
} from '@l2beat/shared-pure'

export interface AggregatedInteropTopPathByVolume {
  timestamp: UnixTime
  srcChain: string
  dstChain: string
  volumeUsd: number
  transferCount: number
  protocolCount: number
}

export interface AggregatedInteropChainInflow {
  timestamp: UnixTime
  chain: string
  volumeUsd: number
  transferCount: number
  protocolCount: number
}

export interface AggregatedInteropChainVolumeIncrease {
  timestamp: UnixTime
  chain: string
  currentVolumeUsd: number
  previousVolumeUsd: number
  increaseUsd: number
}

export interface AggregatedInteropProtocolVolumeIncrease {
  timestamp: UnixTime
  id: string
  currentVolumeUsd: number
  previousVolumeUsd: number
  increaseUsd: number
}

export interface AggregatedInteropTokenVolumeIncrease {
  timestamp: UnixTime
  abstractTokenId: string
  currentVolumeUsd: number
  previousVolumeUsd: number
  increaseUsd: number
}

export interface ActivityUopsCountIncrease {
  timestamp: UnixTime
  projectId: ProjectId
  currentUopsCount: number
  previousUopsCount: number
  increase: number
  increasePercent: number
}

export interface TokenValueTvsIncrease {
  timestamp: UnixTime
  projectId: string
  currentTvsUsd: number
  previousTvsUsd: number
  increaseUsd: number
}

export function getTopPathByVolumeAtTimestamp(
  records: AggregatedInteropTransferRecord[],
  timestamp: UnixTime,
): AggregatedInteropTopPathByVolume | undefined {
  const paths = groupAggregate(
    records,
    (record) =>
      record.srcChain === record.dstChain
        ? undefined
        : {
            key: `${record.srcChain}:${record.dstChain}`,
            srcChain: record.srcChain,
            dstChain: record.dstChain,
          },
    (record) => getInteropTransferValue(record) ?? 0,
  )

  const top = maxBy(paths, (a, b) => {
    if (a.volumeUsd !== b.volumeUsd) {
      return b.volumeUsd - a.volumeUsd
    }
    if (a.transferCount !== b.transferCount) {
      return b.transferCount - a.transferCount
    }
    if (a.srcChain !== b.srcChain) {
      return a.srcChain.localeCompare(b.srcChain)
    }
    return a.dstChain.localeCompare(b.dstChain)
  })

  if (!top) {
    return undefined
  }

  return {
    timestamp,
    srcChain: top.srcChain,
    dstChain: top.dstChain,
    volumeUsd: top.volumeUsd,
    transferCount: top.transferCount,
    protocolCount: top.protocolIds.size,
  }
}

export function getTopDestinationChainByInflowAtTimestamp(
  records: AggregatedInteropTransferRecord[],
  timestamp: UnixTime,
): AggregatedInteropChainInflow | undefined {
  const chains = groupAggregate(
    records,
    (record) =>
      record.srcChain === record.dstChain
        ? undefined
        : { key: record.dstChain, chain: record.dstChain },
    (record) => record.dstValueUsd ?? record.srcValueUsd ?? 0,
  )

  const top = maxBy(chains, (a, b) => {
    if (a.volumeUsd !== b.volumeUsd) {
      return b.volumeUsd - a.volumeUsd
    }
    if (a.transferCount !== b.transferCount) {
      return b.transferCount - a.transferCount
    }
    return a.chain.localeCompare(b.chain)
  })

  if (!top) {
    return undefined
  }

  return {
    timestamp,
    chain: top.chain,
    volumeUsd: top.volumeUsd,
    transferCount: top.transferCount,
    protocolCount: top.protocolIds.size,
  }
}

function groupAggregate<TGroup extends { key: string }>(
  records: AggregatedInteropTransferRecord[],
  keyOf: (record: AggregatedInteropTransferRecord) => TGroup | undefined,
  volumeOf: (record: AggregatedInteropTransferRecord) => number,
): (TGroup & {
  volumeUsd: number
  transferCount: number
  protocolIds: Set<string>
})[] {
  const groups = new Map<
    string,
    TGroup & {
      volumeUsd: number
      transferCount: number
      protocolIds: Set<string>
    }
  >()

  for (const record of records) {
    const groupKey = keyOf(record)
    if (groupKey === undefined) {
      continue
    }

    const group = groups.get(groupKey.key) ?? {
      ...groupKey,
      volumeUsd: 0,
      transferCount: 0,
      protocolIds: new Set<string>(),
    }

    group.volumeUsd += volumeOf(record)
    group.transferCount += record.transferCount
    group.protocolIds.add(record.id)
    groups.set(groupKey.key, group)
  }

  return [...groups.values()]
}

export function getLargestSourceChainVolumeIncrease(
  currentRecords: AggregatedInteropTransferRecord[],
  previousRecords: AggregatedInteropTransferRecord[],
  timestamp: UnixTime,
): AggregatedInteropChainVolumeIncrease | undefined {
  const top = largestVolumeIncrease(
    currentRecords,
    previousRecords,
    (record) =>
      record.srcChain === record.dstChain ? undefined : record.srcChain,
    (record) => getInteropTransferValue(record) ?? 0,
    timestamp,
  )

  if (!top) {
    return undefined
  }

  return {
    timestamp: top.timestamp,
    chain: top.key,
    currentVolumeUsd: top.currentVolumeUsd,
    previousVolumeUsd: top.previousVolumeUsd,
    increaseUsd: top.increaseUsd,
  }
}

export function getLargestProtocolVolumeIncrease(
  currentRecords: AggregatedInteropTransferRecord[],
  previousRecords: AggregatedInteropTransferRecord[],
  timestamp: UnixTime,
): AggregatedInteropProtocolVolumeIncrease | undefined {
  const top = largestVolumeIncrease(
    currentRecords,
    previousRecords,
    (record) => (record.srcChain === record.dstChain ? undefined : record.id),
    (record) => getInteropTransferValue(record) ?? 0,
    timestamp,
  )

  if (!top) {
    return undefined
  }

  return {
    timestamp: top.timestamp,
    id: top.key,
    currentVolumeUsd: top.currentVolumeUsd,
    previousVolumeUsd: top.previousVolumeUsd,
    increaseUsd: top.increaseUsd,
  }
}

export function getLargestTokenVolumeIncrease(
  currentRecords: AggregatedInteropTokenRecord[],
  previousRecords: AggregatedInteropTokenRecord[],
  timestamp: UnixTime,
): AggregatedInteropTokenVolumeIncrease | undefined {
  const top = largestVolumeIncrease(
    currentRecords,
    previousRecords,
    (record) =>
      record.srcChain === record.dstChain ? undefined : record.abstractTokenId,
    (record) => record.volume,
    timestamp,
  )

  if (!top) {
    return undefined
  }

  return {
    timestamp: top.timestamp,
    abstractTokenId: top.key,
    currentVolumeUsd: top.currentVolumeUsd,
    previousVolumeUsd: top.previousVolumeUsd,
    increaseUsd: top.increaseUsd,
  }
}

function largestVolumeIncrease<T>(
  currentRecords: T[],
  previousRecords: T[],
  keyOf: (record: T) => string | undefined,
  volumeOf: (record: T) => number,
  timestamp: UnixTime,
):
  | {
      timestamp: UnixTime
      key: string
      currentVolumeUsd: number
      previousVolumeUsd: number
      increaseUsd: number
    }
  | undefined {
  const currentVolumes = new Map<string, number>()
  const previousVolumes = new Map<string, number>()

  for (const record of currentRecords) {
    const key = keyOf(record)
    if (key === undefined) {
      continue
    }
    currentVolumes.set(key, (currentVolumes.get(key) ?? 0) + volumeOf(record))
  }

  for (const record of previousRecords) {
    const key = keyOf(record)
    if (key === undefined) {
      continue
    }
    previousVolumes.set(key, (previousVolumes.get(key) ?? 0) + volumeOf(record))
  }

  const increases = [...currentVolumes.entries()]
    .map(([key, currentVolumeUsd]) => {
      const previousVolumeUsd = previousVolumes.get(key) ?? 0
      const increaseUsd = currentVolumeUsd - previousVolumeUsd
      return {
        timestamp,
        key,
        currentVolumeUsd,
        previousVolumeUsd,
        increaseUsd,
      }
    })
    .filter((entry) => entry.increaseUsd > 0)

  const top = maxBy(increases, (a, b) => {
    if (a.increaseUsd !== b.increaseUsd) {
      return b.increaseUsd - a.increaseUsd
    }
    return a.key.localeCompare(b.key)
  })

  return top ?? undefined
}

export function getLargestUopsCountIncrease(
  currentRecords: ActivityRecord[],
  previousRecords: ActivityRecord[],
  olderRecords: ActivityRecord[],
  timestamp: UnixTime,
  projectIds?: ReadonlySet<string>,
): ActivityUopsCountIncrease | undefined {
  const isIncluded = (projectId: string) =>
    projectIds === undefined || projectIds.has(projectId)

  const top = largestSnapshotIncrease(
    currentRecords,
    previousRecords,
    olderRecords,
    (record) => record.projectId,
    (record) => record.uopsCount ?? record.count,
    (projectId) => isIncluded(projectId.toString()),
    (_, value) => value,
    (projectId, currentUopsCount, previousUopsCount) => {
      if (previousUopsCount <= 0) {
        return undefined
      }

      const increase = currentUopsCount - previousUopsCount
      if (increase <= 0) {
        return undefined
      }

      return {
        projectId,
        currentUopsCount,
        previousUopsCount,
        increase,
        increasePercent: (increase / previousUopsCount) * 100,
      }
    },
    (a, b) => {
      if (a.increasePercent !== b.increasePercent) {
        return b.increasePercent - a.increasePercent
      }
      return a.projectId.toString().localeCompare(b.projectId.toString())
    },
  )

  if (!top) {
    return undefined
  }

  return {
    timestamp,
    projectId: top.projectId,
    currentUopsCount: top.currentUopsCount,
    previousUopsCount: top.previousUopsCount,
    increase: top.increase,
    increasePercent: top.increasePercent,
  }
}

export function getLargestTvsIncrease(
  currentRecords: TokenValueRecord[],
  previousRecords: TokenValueRecord[],
  olderRecords: TokenValueRecord[],
  timestamp: UnixTime,
  projectIds?: ReadonlySet<string>,
): TokenValueTvsIncrease | undefined {
  const isIncluded = (projectId: string) =>
    projectIds === undefined || projectIds.has(projectId)

  const top = largestSnapshotIncrease(
    currentRecords,
    previousRecords,
    olderRecords,
    (record) => record.projectId,
    (record) => record.valueForProject,
    isIncluded,
    (previousValue, value) => (previousValue ?? 0) + value,
    (projectId, currentTvsUsd, previousTvsUsd) => {
      const increaseUsd = currentTvsUsd - previousTvsUsd
      if (increaseUsd <= 0) {
        return undefined
      }

      return {
        projectId,
        currentTvsUsd,
        previousTvsUsd,
        increaseUsd,
      }
    },
    (a, b) => {
      if (a.increaseUsd !== b.increaseUsd) {
        return b.increaseUsd - a.increaseUsd
      }
      return a.projectId.localeCompare(b.projectId)
    },
  )

  if (!top) {
    return undefined
  }

  return {
    timestamp,
    projectId: top.projectId,
    currentTvsUsd: top.currentTvsUsd,
    previousTvsUsd: top.previousTvsUsd,
    increaseUsd: top.increaseUsd,
  }
}

function largestSnapshotIncrease<TRecord, TKey extends string, TEntry>(
  currentRecords: TRecord[],
  previousRecords: TRecord[],
  olderRecords: TRecord[],
  keyOf: (record: TRecord) => TKey,
  metricOf: (record: TRecord) => number,
  isIncluded: (key: TKey) => boolean,
  combine: (previousValue: number | undefined, value: number) => number,
  toIncrease: (
    key: TKey,
    currentValue: number,
    previousValue: number,
  ) => TEntry | undefined,
  compare: (a: TEntry, b: TEntry) => number,
): TEntry | undefined {
  const keysWithOlderSnapshot = new Set(
    olderRecords.map(keyOf).filter((key) => isIncluded(key)),
  )
  const previousValues = aggregateSnapshotValues(
    previousRecords,
    keyOf,
    metricOf,
    isIncluded,
    combine,
  )
  const currentValues = aggregateSnapshotValues(
    currentRecords,
    keyOf,
    metricOf,
    isIncluded,
    combine,
  )

  const increases = [...currentValues.entries()]
    .filter(([key]) => keysWithOlderSnapshot.has(key))
    .map(([key, currentValue]) => {
      const previousValue = previousValues.get(key)
      if (previousValue === undefined) {
        return undefined
      }

      return toIncrease(key, currentValue, previousValue)
    })
    .filter((entry): entry is TEntry => entry !== undefined)

  return maxBy(increases, compare) ?? undefined
}

function aggregateSnapshotValues<TRecord, TKey extends string>(
  records: TRecord[],
  keyOf: (record: TRecord) => TKey,
  metricOf: (record: TRecord) => number,
  isIncluded: (key: TKey) => boolean,
  combine: (previousValue: number | undefined, value: number) => number,
) {
  const values = new Map<TKey, number>()

  for (const record of records) {
    const key = keyOf(record)
    if (!isIncluded(key)) {
      continue
    }

    values.set(key, combine(values.get(key), metricOf(record)))
  }

  return values
}

function maxBy<T>(items: T[], compare: (a: T, b: T) => number) {
  if (items.length === 0) {
    return undefined
  }

  return items.reduce((best, current) =>
    compare(current, best) < 0 ? current : best,
  )
}
