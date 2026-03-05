import type {
  AggregatedInteropTransferRecord,
  Database,
} from '@l2beat/database'
import type { InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import { log1Plus, zRobust } from '../dashboard/statsComputation'

const HARD_VOLUME_CAP_USD = 100_000_000_000
const LARGE_RATIO_SPIKE = 8
const LARGE_RATIO_DROP = 0.2
const EXTREME_Z_SCORE = 8
const MIN_COUNT_FOR_RATIO = 100
const MIN_VOLUME_FOR_RATIO_USD = 1_000_000
const MIN_VOLUME_IDENTIFICATION_RATE = 0.5
const DRIFT_ALERT_THRESHOLD = 0.35
const LOOKBACK_POINTS = 20
const MIN_Z_SCORE_WINDOW = 7
const MAX_SUMMARY_REASONS = 100

export interface AggregationGateState {
  candidateTimestamp: UnixTime
  autoPromoted: boolean
  promotionRequired: boolean
  checkedGroups: number
  failingGroups: number
  reasons: string[]
  failedGroups: FailedAggregationGroup[]
}

export interface SnapshotTotals {
  transferCount: number
  identifiedCount: number
  srcVolumeUsd: number
  dstVolumeUsd: number
}

export interface FailedAggregationGroup {
  id: string
  bridgeType: InteropBridgeType
  srcChain: string
  dstChain: string
  reasons: string[]
}

export interface InteropAggregationQualityGate {
  evaluate(
    candidateTimestamp: UnixTime,
    candidateTransfers: AggregatedInteropTransferRecord[],
  ): Promise<AggregationGateState>
}

export class DefaultInteropAggregationQualityGate
  implements InteropAggregationQualityGate
{
  constructor(private readonly db: Database) {}

  async evaluate(
    candidateTimestamp: UnixTime,
    candidateTransfers: AggregatedInteropTransferRecord[],
  ): Promise<AggregationGateState> {
    const groupedTransfers = groupTransfers(candidateTransfers)
    const failedGroups = (
      await Promise.all(
        [...groupedTransfers.values()].map(async (group) => {
          const historicalStats =
            await this.db.aggregatedInteropTransfer.getRecentStatsForGroup(
              LOOKBACK_POINTS,
              group.id,
              group.bridgeType,
              group.srcChain,
              group.dstChain,
              {
                before: candidateTimestamp,
                promotedOnly: true,
              },
            )

          const history = [...historicalStats].reverse().map((record) => ({
            transferCount: record.transferCount,
            identifiedCount: record.identifiedCount,
            srcVolumeUsd: record.srcVolumeUsd,
            dstVolumeUsd: record.dstVolumeUsd,
          }))

          const reasons = evaluateQualitySignals({
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
          } satisfies FailedAggregationGroup
        }),
      )
    ).filter((group) => group !== undefined)

    const reasons = summarizeFailedGroups(failedGroups)

    return {
      candidateTimestamp,
      autoPromoted: failedGroups.length === 0,
      promotionRequired: failedGroups.length > 0,
      checkedGroups: groupedTransfers.size,
      failingGroups: failedGroups.length,
      reasons,
      failedGroups,
    }
  }
}

export function evaluateQualitySignals(input: {
  candidate: SnapshotTotals
  history: SnapshotTotals[]
}): string[] {
  const reasons: string[] = []
  const { candidate, history } = input
  const previous = history.at(-1)

  reasons.push(...analyzeHardCap(candidate))
  reasons.push(...analyzeCountRatio(candidate, previous))
  reasons.push(
    ...analyzeRobustZScore('Count', [
      ...history.map((h) => h.transferCount),
      candidate.transferCount,
    ]),
  )

  if (!isVolumeReliable(candidate)) {
    return reasons
  }

  const previousReliableVolume =
    previous !== undefined && isVolumeReliable(previous) ? previous : undefined
  reasons.push(
    ...analyzeVolumeRatio(
      'Src',
      candidate.srcVolumeUsd,
      previousReliableVolume?.srcVolumeUsd,
    ),
  )
  reasons.push(
    ...analyzeVolumeRatio(
      'Dst',
      candidate.dstVolumeUsd,
      previousReliableVolume?.dstVolumeUsd,
    ),
  )

  const reliableHistory = history.filter((point) => isVolumeReliable(point))
  reasons.push(
    ...analyzeRobustZScore('Src volume', [
      ...reliableHistory.map((h) => h.srcVolumeUsd),
      candidate.srcVolumeUsd,
    ]),
  )
  reasons.push(
    ...analyzeRobustZScore('Dst volume', [
      ...reliableHistory.map((h) => h.dstVolumeUsd),
      candidate.dstVolumeUsd,
    ]),
  )

  reasons.push(...analyzeDrift(candidate))

  return reasons
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

function summarizeFailedGroups(failedGroups: FailedAggregationGroup[]) {
  const summarized = failedGroups.flatMap((group) =>
    group.reasons.map(
      (reason) =>
        `${group.id}:${group.bridgeType}:${group.srcChain}->${group.dstChain}: ${reason}`,
    ),
  )

  if (summarized.length <= MAX_SUMMARY_REASONS) {
    return summarized
  }

  return [
    ...summarized.slice(0, MAX_SUMMARY_REASONS),
    `...and ${summarized.length - MAX_SUMMARY_REASONS} more`,
  ]
}

function safeDivide(a: number, b: number) {
  if (b === 0) {
    return a === 0 ? 1 : Number.POSITIVE_INFINITY
  }
  return a / b
}

function analyzeHardCap(candidate: SnapshotTotals): string[] {
  const reasons: string[] = []
  if (candidate.srcVolumeUsd > HARD_VOLUME_CAP_USD) {
    reasons.push(
      `Hard cap exceeded (src): volume=${Math.round(candidate.srcVolumeUsd).toLocaleString()} USD`,
    )
  }
  if (candidate.dstVolumeUsd > HARD_VOLUME_CAP_USD) {
    reasons.push(
      `Hard cap exceeded (dst): volume=${Math.round(candidate.dstVolumeUsd).toLocaleString()} USD`,
    )
  }

  return reasons
}

function analyzeCountRatio(
  candidate: SnapshotTotals,
  previous: SnapshotTotals | undefined,
): string[] {
  const reasons: string[] = []
  if (previous === undefined || previous.transferCount < MIN_COUNT_FOR_RATIO) {
    return reasons
  }

  const ratio = safeDivide(candidate.transferCount, previous.transferCount)
  if (ratio > LARGE_RATIO_SPIKE) {
    reasons.push(`Count spike vs previous: x${ratio.toFixed(2)}`)
  }
  if (ratio < LARGE_RATIO_DROP) {
    reasons.push(`Count drop vs previous: x${ratio.toFixed(2)}`)
  }

  return reasons
}

function analyzeVolumeRatio(
  side: 'Src' | 'Dst',
  candidateVolumeUsd: number,
  previousVolumeUsd: number | undefined,
): string[] {
  const reasons: string[] = []
  if (
    previousVolumeUsd === undefined ||
    previousVolumeUsd < MIN_VOLUME_FOR_RATIO_USD
  ) {
    return reasons
  }

  const ratio = safeDivide(candidateVolumeUsd, previousVolumeUsd)
  if (ratio > LARGE_RATIO_SPIKE) {
    reasons.push(`${side} volume spike vs previous: x${ratio.toFixed(2)}`)
  }
  if (ratio < LARGE_RATIO_DROP) {
    reasons.push(`${side} volume drop vs previous: x${ratio.toFixed(2)}`)
  }

  return reasons
}

function analyzeRobustZScore(label: string, values: number[]): string[] {
  const reasons: string[] = []
  if (values.length < MIN_Z_SCORE_WINDOW) {
    return reasons
  }

  const zScore = zRobust(values.map(log1Plus))
  if (
    zScore !== null &&
    Number.isFinite(zScore) &&
    Math.abs(zScore) > EXTREME_Z_SCORE
  ) {
    reasons.push(`${label} robust z-score=${zScore.toFixed(2)}`)
  }

  return reasons
}

function analyzeDrift(candidate: SnapshotTotals): string[] {
  const reasons: string[] = []
  const maxVolume = Math.max(candidate.srcVolumeUsd, candidate.dstVolumeUsd)
  if (maxVolume < MIN_VOLUME_FOR_RATIO_USD) {
    return reasons
  }

  const drift = getSrcDstDrift(candidate.srcVolumeUsd, candidate.dstVolumeUsd)
  if (drift >= DRIFT_ALERT_THRESHOLD) {
    reasons.push(`Src/Dst volume drift is high: ${(drift * 100).toFixed(1)}%`)
  }

  return reasons
}

function isVolumeReliable(point: SnapshotTotals): boolean {
  return (
    safeDivide(point.identifiedCount, point.transferCount) >=
    MIN_VOLUME_IDENTIFICATION_RATE
  )
}

function getSrcDstDrift(srcVolumeUsd: number, dstVolumeUsd: number): number {
  const maxVolume = Math.max(srcVolumeUsd, dstVolumeUsd)
  if (maxVolume === 0) {
    return 0
  }
  return Math.abs(srcVolumeUsd - dstVolumeUsd) / maxVolume
}
