import type {
  AggregatedInteropTransferRecord,
  Database,
} from '@l2beat/database'
import type { InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import {
  lastNValues,
  log1Plus,
  ratioDrop,
  ratioSpike,
  zRobust,
} from '../dashboard/statsComputation'

const HARD_VOLUME_CAP_USD = 1_000_000_000_000
const LARGE_RATIO_SPIKE = 8
const LARGE_RATIO_DROP = 0.2
const EXTREME_Z_SCORE = 8
const MIN_BASELINE_COUNT = 100
const MIN_BASELINE_VOLUME_USD = 1_000_000
const MIN_VOLUME_IDENTIFICATION_RATE = 0.5
const DRIFT_ALERT_THRESHOLD = 0.35
const DRIFT_SPIKE_FACTOR = 3
const MIN_DRIFT_DELTA = 0.2
const DRIFT_EPSILON = 0.01
const LOOKBACK_POINTS = 20
const SIGNAL_WINDOW = 14
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
              },
            )
          const baseline = historicalStats.at(0)
            ? {
                transferCount: historicalStats[0].transferCount,
                identifiedCount: historicalStats[0].identifiedCount,
                srcVolumeUsd: historicalStats[0].srcVolumeUsd,
                dstVolumeUsd: historicalStats[0].dstVolumeUsd,
              }
            : undefined
          const history = [...historicalStats].reverse().map((record) => ({
            transferCount: record.transferCount,
            srcVolumeUsd: record.srcVolumeUsd,
            dstVolumeUsd: record.dstVolumeUsd,
          }))

          const reasons = evaluateQualitySignals({
            candidate: group.metrics,
            baseline,
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
  baseline?: SnapshotTotals
  history: {
    transferCount: number
    srcVolumeUsd: number
    dstVolumeUsd: number
  }[]
}): string[] {
  const reasons: string[] = []
  const { candidate, baseline, history } = input
  const candidateIdentificationRate = safeDivide(
    candidate.identifiedCount,
    candidate.transferCount,
  )

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

  if (baseline) {
    if (baseline.transferCount >= MIN_BASELINE_COUNT) {
      const ratio = safeDivide(candidate.transferCount, baseline.transferCount)
      if (ratio > LARGE_RATIO_SPIKE) {
        reasons.push(`Count spike vs baseline: x${ratio.toFixed(2)}`)
      }
      if (ratio < LARGE_RATIO_DROP) {
        reasons.push(`Count drop vs baseline: x${ratio.toFixed(2)}`)
      }
    }
  }

  if (candidateIdentificationRate >= MIN_VOLUME_IDENTIFICATION_RATE) {
    evaluateVolumeSignals('src', {
      candidateVolumeUsd: candidate.srcVolumeUsd,
      baselineVolumeUsd: baseline?.srcVolumeUsd,
      historyVolumeUsd: history.map((h) => h.srcVolumeUsd),
      reasons,
    })
    evaluateVolumeSignals('dst', {
      candidateVolumeUsd: candidate.dstVolumeUsd,
      baselineVolumeUsd: baseline?.dstVolumeUsd,
      historyVolumeUsd: history.map((h) => h.dstVolumeUsd),
      reasons,
    })
    evaluateDriftSignals({
      candidate,
      baseline,
      history,
      reasons,
    })
  }

  const countSeries = [
    ...history.map((h) => h.transferCount),
    candidate.transferCount,
  ]
  const countWindow = lastNValues(countSeries, SIGNAL_WINDOW)
  const countLogWindow = countWindow.map(log1Plus)
  const countZRobust =
    countLogWindow.length >= MIN_Z_SCORE_WINDOW ? zRobust(countLogWindow) : null

  if (countZRobust !== null && Math.abs(countZRobust) > EXTREME_Z_SCORE) {
    reasons.push(`Count robust z-score=${countZRobust.toFixed(2)}`)
  }
  if (ratioSpike(countWindow, LARGE_RATIO_SPIKE)) {
    reasons.push('Count ratio spike in recent window')
  }
  if (ratioDrop(countWindow, LARGE_RATIO_DROP)) {
    reasons.push('Count ratio drop in recent window')
  }

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

function evaluateVolumeSignals(
  side: 'src' | 'dst',
  input: {
    candidateVolumeUsd: number
    baselineVolumeUsd?: number
    historyVolumeUsd: number[]
    reasons: string[]
  },
) {
  const sideLabel = side === 'src' ? 'Src' : 'Dst'
  const { candidateVolumeUsd, baselineVolumeUsd, historyVolumeUsd, reasons } =
    input

  if (
    baselineVolumeUsd !== undefined &&
    baselineVolumeUsd >= MIN_BASELINE_VOLUME_USD
  ) {
    const ratio = safeDivide(candidateVolumeUsd, baselineVolumeUsd)
    if (ratio > LARGE_RATIO_SPIKE) {
      reasons.push(
        `Volume spike vs baseline (${sideLabel}): x${ratio.toFixed(2)}`,
      )
    }
    if (ratio < LARGE_RATIO_DROP) {
      reasons.push(
        `Volume drop vs baseline (${sideLabel}): x${ratio.toFixed(2)}`,
      )
    }
  }

  const volumeSeries = [...historyVolumeUsd, candidateVolumeUsd]
  const volumeWindow = lastNValues(volumeSeries, SIGNAL_WINDOW)
  const volumeLogWindow = volumeWindow.map(log1Plus)
  const volumeZRobust =
    volumeLogWindow.length >= MIN_Z_SCORE_WINDOW
      ? zRobust(volumeLogWindow)
      : null

  if (volumeZRobust !== null && Math.abs(volumeZRobust) > EXTREME_Z_SCORE) {
    reasons.push(
      `Volume robust z-score (${sideLabel})=${volumeZRobust.toFixed(2)}`,
    )
  }
  if (ratioSpike(volumeWindow, LARGE_RATIO_SPIKE)) {
    reasons.push(`Volume ratio spike in recent window (${sideLabel})`)
  }
  if (ratioDrop(volumeWindow, LARGE_RATIO_DROP)) {
    reasons.push(`Volume ratio drop in recent window (${sideLabel})`)
  }
}

function evaluateDriftSignals(input: {
  candidate: SnapshotTotals
  baseline?: SnapshotTotals
  history: { srcVolumeUsd: number; dstVolumeUsd: number }[]
  reasons: string[]
}) {
  const { candidate, baseline, history, reasons } = input
  const candidateMaxVolumeUsd = Math.max(
    candidate.srcVolumeUsd,
    candidate.dstVolumeUsd,
  )

  if (candidateMaxVolumeUsd < MIN_BASELINE_VOLUME_USD) {
    return
  }

  const candidateDrift = getSrcDstDrift(
    candidate.srcVolumeUsd,
    candidate.dstVolumeUsd,
  )
  if (candidateDrift >= DRIFT_ALERT_THRESHOLD) {
    reasons.push(
      `Src/Dst volume drift is high: ${formatPercent(candidateDrift)}`,
    )
  }

  if (baseline !== undefined) {
    const baselineMaxVolumeUsd = Math.max(
      baseline.srcVolumeUsd,
      baseline.dstVolumeUsd,
    )
    if (baselineMaxVolumeUsd >= MIN_BASELINE_VOLUME_USD) {
      const baselineDrift = getSrcDstDrift(
        baseline.srcVolumeUsd,
        baseline.dstVolumeUsd,
      )
      const driftRatio = safeDivide(
        candidateDrift + DRIFT_EPSILON,
        baselineDrift + DRIFT_EPSILON,
      )

      if (
        candidateDrift - baselineDrift >= MIN_DRIFT_DELTA &&
        driftRatio >= DRIFT_SPIKE_FACTOR
      ) {
        reasons.push(
          `Src/Dst volume drift spike vs baseline: ${formatPercent(candidateDrift)} vs ${formatPercent(baselineDrift)}`,
        )
      }
    }
  }

  const driftSeries = [
    ...history.map((h) => getSrcDstDrift(h.srcVolumeUsd, h.dstVolumeUsd)),
    candidateDrift,
  ]
  const driftWindow = lastNValues(driftSeries, SIGNAL_WINDOW)
  if (
    candidateDrift >= DRIFT_ALERT_THRESHOLD &&
    ratioSpike(driftWindow, DRIFT_SPIKE_FACTOR)
  ) {
    reasons.push('Src/Dst volume drift ratio spike in recent window')
  }
}

function getSrcDstDrift(srcVolumeUsd: number, dstVolumeUsd: number): number {
  const maxVolume = Math.max(srcVolumeUsd, dstVolumeUsd)
  if (maxVolume === 0) {
    return 0
  }
  return Math.abs(srcVolumeUsd - dstVolumeUsd) / maxVolume
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}
