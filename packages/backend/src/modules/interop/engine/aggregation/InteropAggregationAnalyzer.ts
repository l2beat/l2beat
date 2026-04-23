import type {
  AggregatedInteropTransferRecord,
  Database,
} from '@l2beat/database'
import { type InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import {
  getWindowedLogZScore,
  Z_CLASSIC_THRESHOLD,
  Z_WINDOW_DAYS,
} from '../zScore'

const MIN_VOLUME_IDENTIFICATION_RATE = 0.5
const dollarsFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})
const countFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

export interface SnapshotTotals {
  transferCount: number
  identifiedCount: number
  srcVolumeUsd: number
  dstVolumeUsd: number
}

export interface SnapshotTotalsPoint extends SnapshotTotals {
  timestamp: UnixTime
}

interface GroupedTransferCandidate {
  id: string
  bridgeType: InteropBridgeType
  srcChain: string
  dstChain: string
  metrics: SnapshotTotals
}

export interface SuspiciousAggregationGroup {
  id: string
  bridgeType: InteropBridgeType
  srcChain: string
  dstChain: string
  reasons: string[]
}

export interface InteropAggregationAnalysis {
  checkedGroups: number
  suspiciousGroups: SuspiciousAggregationGroup[]
}

export interface InteropAggregationAnalyzer {
  analyze(
    candidateTimestamp: UnixTime,
    candidateTransfers: AggregatedInteropTransferRecord[],
  ): Promise<InteropAggregationAnalysis>
}

export class DefaultInteropAggregationAnalyzer
  implements InteropAggregationAnalyzer
{
  constructor(private readonly db: Database) {}

  async analyze(
    candidateTimestamp: UnixTime,
    candidateTransfers: AggregatedInteropTransferRecord[],
  ): Promise<InteropAggregationAnalysis> {
    const groupedTransfers = groupTransfers(candidateTransfers)
    const candidateDay = getDay(candidateTimestamp)
    const historyFrom = candidateDay - (Z_WINDOW_DAYS - 1) * UnixTime.DAY
    const historicalGroups =
      await this.db.aggregatedInteropTransfer.getGroupsWithStatsInTimeRange(
        historyFrom,
        candidateDay,
      )
    const candidateGroups = addMissingHistoricalGroups(
      groupedTransfers,
      historicalGroups,
    )
    const suspiciousGroups: SuspiciousAggregationGroup[] = []

    for (const group of candidateGroups.values()) {
      const historicalStats =
        await this.db.aggregatedInteropTransfer.getDailyStatsForGroupInTimeRange(
          group.id,
          group.bridgeType,
          group.srcChain,
          group.dstChain,
          historyFrom,
          candidateDay,
        )

      const history = historicalStats.map((record) => ({
        timestamp: record.timestamp,
        transferCount: record.transferCount,
        identifiedCount: record.identifiedCount,
        srcVolumeUsd: record.srcVolumeUsd,
        dstVolumeUsd: record.dstVolumeUsd,
      }))

      const reasons = evaluateQualitySignals({
        candidateTimestamp,
        candidate: group.metrics,
        history,
      })

      if (reasons.length === 0) {
        continue
      }

      suspiciousGroups.push({
        id: group.id,
        bridgeType: group.bridgeType,
        srcChain: group.srcChain,
        dstChain: group.dstChain,
        reasons,
      })
    }

    return {
      checkedGroups: candidateGroups.size,
      suspiciousGroups,
    }
  }
}

export function evaluateQualitySignals(input: {
  candidateTimestamp: UnixTime
  candidate: SnapshotTotals
  history: SnapshotTotalsPoint[]
}): string[] {
  const { candidate, candidateTimestamp, history } = input
  const dailySeries = materializeDailySeries(
    candidateTimestamp,
    candidate,
    history,
  )
  const reasons = analyzeZScore(
    'count',
    dailySeries.map((point) => point.transferCount),
  )

  if (!isVolumeReliable(candidate)) {
    return reasons
  }

  reasons.push(
    ...analyzeZScore(
      'srcVolume',
      dailySeries.map((point) =>
        isVolumeReliable(point) ? point.srcVolumeUsd : 0,
      ),
    ),
  )
  reasons.push(
    ...analyzeZScore(
      'dstVolume',
      dailySeries.map((point) =>
        isVolumeReliable(point) ? point.dstVolumeUsd : 0,
      ),
    ),
  )

  return reasons
}

function materializeDailySeries(
  candidateTimestamp: UnixTime,
  candidate: SnapshotTotals,
  history: SnapshotTotalsPoint[],
) {
  const candidateDay = getDay(candidateTimestamp)
  const startDay = candidateDay - (Z_WINDOW_DAYS - 1) * UnixTime.DAY
  const historyByDay = new Map(
    history.map((point) => [getDay(point.timestamp), point] as const),
  )
  const series: SnapshotTotals[] = []

  for (let day = startDay; day < candidateDay; day += UnixTime.DAY) {
    const point = historyByDay.get(day)
    series.push(
      point ?? {
        transferCount: 0,
        identifiedCount: 0,
        srcVolumeUsd: 0,
        dstVolumeUsd: 0,
      },
    )
  }

  series.push(candidate)

  return series
}

function groupTransfers(transfers: AggregatedInteropTransferRecord[]) {
  const grouped = new Map<string, GroupedTransferCandidate>()

  for (const transfer of transfers) {
    const key = toGroupKey(transfer)
    const current = grouped.get(key)
    if (!current) {
      grouped.set(key, {
        id: transfer.id,
        bridgeType: transfer.bridgeType,
        srcChain: transfer.srcChain,
        dstChain: transfer.dstChain,
        metrics: {
          transferCount: transfer.transferCount,
          identifiedCount: transfer.identifiedCount,
          srcVolumeUsd: transfer.srcValueUsd ?? transfer.dstValueUsd ?? 0,
          dstVolumeUsd: transfer.dstValueUsd ?? transfer.srcValueUsd ?? 0,
        },
      })
      continue
    }

    current.metrics.transferCount += transfer.transferCount
    current.metrics.identifiedCount += transfer.identifiedCount
    current.metrics.srcVolumeUsd +=
      transfer.srcValueUsd ?? transfer.dstValueUsd ?? 0
    current.metrics.dstVolumeUsd +=
      transfer.dstValueUsd ?? transfer.srcValueUsd ?? 0
  }

  return grouped
}

function addMissingHistoricalGroups(
  groupedTransfers: Map<string, GroupedTransferCandidate>,
  historicalGroups: Array<{
    id: string
    bridgeType: InteropBridgeType
    srcChain: string
    dstChain: string
  }>,
) {
  for (const group of historicalGroups) {
    const key = toGroupKey(group)
    if (groupedTransfers.has(key)) {
      continue
    }

    groupedTransfers.set(key, {
      ...group,
      metrics: zeroSnapshotTotals(),
    })
  }

  return groupedTransfers
}

function zeroSnapshotTotals(): SnapshotTotals {
  return {
    transferCount: 0,
    identifiedCount: 0,
    srcVolumeUsd: 0,
    dstVolumeUsd: 0,
  }
}

function toGroupKey(group: {
  id: string
  bridgeType: InteropBridgeType
  srcChain: string
  dstChain: string
}) {
  return [group.id, group.bridgeType, group.srcChain, group.dstChain].join('::')
}

function safeDivide(a: number, b: number) {
  if (b === 0) {
    return a === 0 ? 1 : Number.POSITIVE_INFINITY
  }
  return a / b
}

function analyzeZScore(
  metric: 'count' | 'srcVolume' | 'dstVolume',
  values: number[],
): string[] {
  // Route-level daily histories are often flat. In those cases robust z-score
  // returns null because MAD is zero, so alerting uses the shared classic score.
  const zScore = getWindowedLogZScore(values).classic
  if (
    zScore === null ||
    !Number.isFinite(zScore) ||
    Math.abs(zScore) <= Z_CLASSIC_THRESHOLD
  ) {
    return []
  }

  const current = values.at(-1) ?? 0
  const baselineValues = values.slice(0, -1)
  const baseline =
    baselineValues.reduce((sum, value) => sum + value, 0) /
    baselineValues.length

  return [formatReadableReason(metric, baseline, current)]
}

function formatReadableReason(
  metric: 'count' | 'srcVolume' | 'dstVolume',
  baseline: number,
  current: number,
): string {
  const direction = current >= baseline ? 'increase' : 'decrease'
  const formattedChange = formatChange(
    baseline,
    current,
    metric === 'count' ? formatCount : formatDollars,
  )

  if (metric === 'count') {
    return `significant ${direction} in transfer count (${formattedChange})`
  }

  const label = metric === 'srcVolume' ? 'src volume' : 'dst volume'
  return `${label} ${direction === 'increase' ? 'increased' : 'decreased'} ${formattedChange}`
}

function formatChange(
  baseline: number,
  current: number,
  formatter: (value: number) => string,
): string {
  const changePercent = getChangePercent(baseline, current)
  const changePrefix =
    changePercent === null ? '' : `${Math.abs(changePercent).toFixed(2)}%, `

  return `${changePrefix}from ${formatter(baseline)} to ${formatter(current)}`
}

function getChangePercent(baseline: number, current: number): number | null {
  if (baseline === 0) {
    return current === 0 ? 0 : null
  }

  return ((current - baseline) / baseline) * 100
}

function formatDollars(value: number): string {
  return dollarsFormatter.format(value)
}

function formatCount(value: number): string {
  return countFormatter.format(Math.round(value))
}

function isVolumeReliable(point: SnapshotTotals): boolean {
  return (
    safeDivide(point.identifiedCount, point.transferCount) >=
    MIN_VOLUME_IDENTIFICATION_RATE
  )
}

function getDay(timestamp: UnixTime): UnixTime {
  return UnixTime.toStartOf(timestamp, 'day')
}
