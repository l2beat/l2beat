import type {
  AggregatedInteropTransferRecord,
  Database,
} from '@l2beat/database'
import { type InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import {
  type AnomalyEvaluation,
  type BridgeTotal,
  evaluateAnomalies,
  formatAnomalyReasons,
  type SeriesPoint,
} from '../anomalies'
import { Z_WINDOW_DAYS } from '../zScore'

interface GroupedTransferCandidate {
  id: string
  bridgeType: InteropBridgeType
  srcChain: string
  dstChain: string
  metrics: CandidateMetrics
}

interface CandidateMetrics {
  transferCount: number
  identifiedCount: number
  srcVolumeUsd: number
  dstVolumeUsd: number
}

export interface SuspiciousAggregationGroup {
  id: string
  bridgeType: InteropBridgeType
  srcChain: string
  dstChain: string
  reasons: string[]
  evaluation: AnomalyEvaluation
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
    const bridgeTotals = computeBridgeTotals(groupedTransfers)
    const candidateDay = UnixTime.toStartOf(candidateTimestamp, 'day')
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

      const series = buildSeries(candidateDay, group.metrics, historicalStats)
      const evaluation = evaluateAnomalies(series, bridgeTotals.get(group.id))
      if (evaluation.signals.length === 0 && !evaluation.sideMismatch) {
        continue
      }

      suspiciousGroups.push({
        id: group.id,
        bridgeType: group.bridgeType,
        srcChain: group.srcChain,
        dstChain: group.dstChain,
        reasons: formatAnomalyReasons(evaluation),
        evaluation,
      })
    }

    return {
      checkedGroups: candidateGroups.size,
      suspiciousGroups,
    }
  }
}

function buildSeries(
  candidateDay: UnixTime,
  candidate: CandidateMetrics,
  history: Array<{
    timestamp: UnixTime
    transferCount: number
    identifiedCount: number
    srcVolumeUsd: number
    dstVolumeUsd: number
  }>,
): SeriesPoint[] {
  const historyByDay = new Map(
    history.map((point) => [UnixTime.toStartOf(point.timestamp, 'day'), point]),
  )
  const startDay = candidateDay - (Z_WINDOW_DAYS - 1) * UnixTime.DAY
  const series: SeriesPoint[] = []

  for (let day = startDay; day < candidateDay; day += UnixTime.DAY) {
    const point = historyByDay.get(day)
    series.push(
      point
        ? {
            day,
            transferCount: point.transferCount,
            identifiedCount: point.identifiedCount,
            srcVolumeUsd: point.srcVolumeUsd,
            dstVolumeUsd: point.dstVolumeUsd,
          }
        : {
            day,
            transferCount: 0,
            identifiedCount: 0,
            srcVolumeUsd: 0,
            dstVolumeUsd: 0,
          },
    )
  }

  series.push({
    day: candidateDay,
    transferCount: candidate.transferCount,
    identifiedCount: candidate.identifiedCount,
    srcVolumeUsd: candidate.srcVolumeUsd,
    dstVolumeUsd: candidate.dstVolumeUsd,
  })

  return series
}

function computeBridgeTotals(
  groupedTransfers: Map<string, GroupedTransferCandidate>,
): Map<string, BridgeTotal> {
  const totals = new Map<string, BridgeTotal>()
  for (const group of groupedTransfers.values()) {
    const existing = totals.get(group.id) ?? {
      transferCount: 0,
      volumeUsd: 0,
    }
    existing.transferCount += group.metrics.transferCount
    existing.volumeUsd +=
      group.metrics.srcVolumeUsd + group.metrics.dstVolumeUsd
    totals.set(group.id, existing)
  }
  return totals
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
      metrics: {
        transferCount: 0,
        identifiedCount: 0,
        srcVolumeUsd: 0,
        dstVolumeUsd: 0,
      },
    })
  }

  return groupedTransfers
}

function toGroupKey(group: {
  id: string
  bridgeType: InteropBridgeType
  srcChain: string
  dstChain: string
}) {
  return [group.id, group.bridgeType, group.srcChain, group.dstChain].join('::')
}
