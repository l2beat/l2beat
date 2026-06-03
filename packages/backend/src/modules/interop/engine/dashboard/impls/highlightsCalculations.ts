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
  const paths = new Map<
    string,
    {
      srcChain: string
      dstChain: string
      volumeUsd: number
      transferCount: number
      protocolIds: Set<string>
    }
  >()

  for (const record of records) {
    if (record.srcChain === record.dstChain) {
      continue
    }

    const key = `${record.srcChain}:${record.dstChain}`
    const path = paths.get(key) ?? {
      srcChain: record.srcChain,
      dstChain: record.dstChain,
      volumeUsd: 0,
      transferCount: 0,
      protocolIds: new Set<string>(),
    }

    path.volumeUsd += getInteropTransferValue(record) ?? 0
    path.transferCount += record.transferCount
    path.protocolIds.add(record.id)
    paths.set(key, path)
  }

  const top = maxBy([...paths.values()], (a, b) => {
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
  const chains = new Map<
    string,
    {
      chain: string
      volumeUsd: number
      transferCount: number
      protocolIds: Set<string>
    }
  >()

  for (const record of records) {
    if (record.srcChain === record.dstChain) {
      continue
    }

    const chain = chains.get(record.dstChain) ?? {
      chain: record.dstChain,
      volumeUsd: 0,
      transferCount: 0,
      protocolIds: new Set<string>(),
    }

    chain.volumeUsd += record.dstValueUsd ?? record.srcValueUsd ?? 0
    chain.transferCount += record.transferCount
    chain.protocolIds.add(record.id)
    chains.set(record.dstChain, chain)
  }

  const top = maxBy([...chains.values()], (a, b) => {
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

  const projectsWithOlderSnapshot = new Set(
    olderRecords
      .filter((record) => isIncluded(record.projectId.toString()))
      .map((record) => record.projectId.toString()),
  )
  const previousCounts = new Map(
    previousRecords
      .filter((record) => isIncluded(record.projectId.toString()))
      .map((record) => [
        record.projectId.toString(),
        record.uopsCount ?? record.count,
      ]),
  )

  const increases = currentRecords
    .filter(
      (record) =>
        isIncluded(record.projectId.toString()) &&
        projectsWithOlderSnapshot.has(record.projectId.toString()),
    )
    .map((record) => {
      const projectId = record.projectId.toString()
      const previousUopsCount = previousCounts.get(projectId)
      if (previousUopsCount === undefined || previousUopsCount <= 0) {
        return undefined
      }

      const currentUopsCount = record.uopsCount ?? record.count
      const increase = currentUopsCount - previousUopsCount
      if (increase <= 0) {
        return undefined
      }

      return {
        projectId: record.projectId,
        currentUopsCount,
        previousUopsCount,
        increase,
        increasePercent: (increase / previousUopsCount) * 100,
      }
    })
    .filter(
      (
        entry,
      ): entry is {
        projectId: ProjectId
        currentUopsCount: number
        previousUopsCount: number
        increase: number
        increasePercent: number
      } => entry !== undefined,
    )

  const top = maxBy(increases, (a, b) => {
    if (a.increasePercent !== b.increasePercent) {
      return b.increasePercent - a.increasePercent
    }
    return a.projectId.toString().localeCompare(b.projectId.toString())
  })

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

  const projectsWithOlderSnapshot = new Set(
    olderRecords
      .filter((record) => isIncluded(record.projectId))
      .map((record) => record.projectId),
  )
  const previousTvs = new Map<string, number>()

  for (const record of previousRecords) {
    if (!isIncluded(record.projectId)) {
      continue
    }

    previousTvs.set(
      record.projectId,
      (previousTvs.get(record.projectId) ?? 0) + record.valueForProject,
    )
  }

  const currentTvs = new Map<string, number>()
  for (const record of currentRecords) {
    if (!isIncluded(record.projectId)) {
      continue
    }

    currentTvs.set(
      record.projectId,
      (currentTvs.get(record.projectId) ?? 0) + record.valueForProject,
    )
  }

  const increases = [...currentTvs.entries()]
    .filter(([projectId]) => projectsWithOlderSnapshot.has(projectId))
    .map(([projectId, currentTvsUsd]) => {
      const previousTvsUsd = previousTvs.get(projectId)
      if (previousTvsUsd === undefined) {
        return undefined
      }

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
    })
    .filter(
      (
        entry,
      ): entry is {
        projectId: string
        currentTvsUsd: number
        previousTvsUsd: number
        increaseUsd: number
      } => entry !== undefined,
    )

  const top = maxBy(increases, (a, b) => {
    if (a.increaseUsd !== b.increaseUsd) {
      return b.increaseUsd - a.increaseUsd
    }
    return a.projectId.localeCompare(b.projectId)
  })

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

function maxBy<T>(items: T[], compare: (a: T, b: T) => number) {
  if (items.length === 0) {
    return undefined
  }

  return items.reduce((best, current) =>
    compare(current, best) < 0 ? current : best,
  )
}
