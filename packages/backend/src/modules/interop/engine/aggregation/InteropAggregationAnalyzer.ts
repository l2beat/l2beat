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

export interface SnapshotTotals {
  transferCount: number
  identifiedCount: number
  srcVolumeUsd: number
  dstVolumeUsd: number
}

export interface SnapshotTotalsPoint extends SnapshotTotals {
  timestamp: UnixTime
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

    const suspiciousGroups = (
      await Promise.all(
        [...groupedTransfers.values()].map(async (group) => {
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
            return undefined
          }

          return {
            id: group.id,
            bridgeType: group.bridgeType,
            srcChain: group.srcChain,
            dstChain: group.dstChain,
            reasons,
          } satisfies SuspiciousAggregationGroup
        }),
      )
    ).filter((group) => group !== undefined)

    return {
      checkedGroups: groupedTransfers.size,
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
    'Count',
    dailySeries.map((point) => point.transferCount),
  )

  if (!isVolumeReliable(candidate)) {
    return reasons
  }

  reasons.push(
    ...analyzeZScore(
      'Src volume',
      dailySeries.map((point) =>
        isVolumeReliable(point) ? point.srcVolumeUsd : 0,
      ),
    ),
  )
  reasons.push(
    ...analyzeZScore(
      'Dst volume',
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
  const grouped = new Map<
    string,
    {
      id: string
      bridgeType: InteropBridgeType
      srcChain: string
      dstChain: string
      metrics: SnapshotTotals
    }
  >()

  for (const transfer of transfers) {
    const key = [
      transfer.id,
      transfer.bridgeType,
      transfer.srcChain,
      transfer.dstChain,
    ].join('::')
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

function safeDivide(a: number, b: number) {
  if (b === 0) {
    return a === 0 ? 1 : Number.POSITIVE_INFINITY
  }
  return a / b
}

function analyzeZScore(label: string, values: number[]): string[] {
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

  return [`${label} z-score=${zScore.toFixed(2)}`]
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
