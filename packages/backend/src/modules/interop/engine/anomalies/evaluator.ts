import type { UnixTime } from '@l2beat/shared-pure'
import { getWindowedLogZScore, hasEnoughNonZeroHistory } from '../zScore'
import {
  FLAT_LINE_WINDOW_DAYS,
  MIN_BASELINE_COUNT_PER_DAY,
  MIN_BASELINE_VOLUME_USD_PER_DAY,
  MIN_VOLUME_IDENTIFICATION_RATE,
  RATIO_COUNT_SPIKE_THRESHOLD,
  RATIO_DROP_THRESHOLD,
  RATIO_VOLUME_SPIKE_THRESHOLD,
  SIDE_MISMATCH_DIFF_PERCENT,
  SIDE_MISMATCH_MIN_VOLUME_USD,
  Z_CLASSIC_THRESHOLD,
  Z_ROBUST_THRESHOLD,
  Z_WINDOW_DAYS,
} from './thresholds'

export interface SeriesPoint {
  day: UnixTime
  transferCount: number
  identifiedCount: number
  srcVolumeUsd: number
  dstVolumeUsd: number
}

export type AnomalyMetric = 'count' | 'srcVolume' | 'dstVolume'
export type AnomalyKind =
  | 'flatLine'
  | 'ratioDrop'
  | 'ratioSpike'
  | 'zScoreDrop'
  | 'zScoreSpike'
export type AnomalySeverity = 'moderate' | 'severe'

export interface MetricSignal {
  metric: AnomalyMetric
  kind: AnomalyKind
  severity: AnomalySeverity
  baseline: number
  current: number
  changePercent: number | null
}

export interface SideMismatchSignal {
  diffPercent: number
  srcValueUsd: number
  dstValueUsd: number
  largerSideUsd: number
}

export interface AnomalyEvaluation {
  signals: MetricSignal[]
  sideMismatch: SideMismatchSignal | null
}

export function evaluateAnomalies(series: SeriesPoint[]): AnomalyEvaluation {
  if (series.length === 0) {
    return { signals: [], sideMismatch: null }
  }

  const sorted = [...series].sort((a, b) => Number(a.day - b.day))
  const window = sorted.slice(-Z_WINDOW_DAYS)
  const candidate = window[window.length - 1]
  if (!candidate) {
    return { signals: [], sideMismatch: null }
  }

  const signals: MetricSignal[] = []
  const countSignal = evaluateMetric('count', window, (p) => p.transferCount)
  if (countSignal) signals.push(countSignal)

  if (isVolumeReliable(candidate)) {
    const srcSignal = evaluateMetric('srcVolume', window, (p) =>
      isVolumeReliable(p) ? p.srcVolumeUsd : 0,
    )
    const dstSignal = evaluateMetric('dstVolume', window, (p) =>
      isVolumeReliable(p) ? p.dstVolumeUsd : 0,
    )
    if (srcSignal) signals.push(srcSignal)
    if (dstSignal) signals.push(dstSignal)
  }

  return {
    signals,
    sideMismatch: evaluateSideMismatch(candidate),
  }
}

function evaluateMetric(
  metric: AnomalyMetric,
  window: SeriesPoint[],
  pick: (p: SeriesPoint) => number,
): MetricSignal | null {
  if (window.length < 2) return null

  const values = window.map(pick)
  const baseline = values.slice(0, -1)
  const current = values[values.length - 1] ?? 0
  const baselineMean = baseline.reduce((sum, v) => sum + v, 0) / baseline.length

  const floor =
    metric === 'count'
      ? MIN_BASELINE_COUNT_PER_DAY
      : MIN_BASELINE_VOLUME_USD_PER_DAY
  if (baselineMean < floor) return null

  if (!hasEnoughNonZeroHistory(values)) return null

  if (metric === 'count' && detectFlatLine(values)) {
    return buildSignal('flatLine', metric, 'severe', baselineMean, current)
  }

  const spikeRatioThreshold =
    metric === 'count'
      ? RATIO_COUNT_SPIKE_THRESHOLD
      : RATIO_VOLUME_SPIKE_THRESHOLD
  const isRatioSpike = detectRatioSpike(values, spikeRatioThreshold)
  const isRatioDrop = detectRatioDrop(values)
  const z = getWindowedLogZScore(values)

  const classicSpike = z.classic !== null && z.classic > Z_CLASSIC_THRESHOLD
  const robustSpike = z.robust !== null && z.robust > Z_ROBUST_THRESHOLD.spike

  if (isRatioSpike || classicSpike || robustSpike) {
    return buildSignal(
      isRatioSpike ? 'ratioSpike' : 'zScoreSpike',
      metric,
      'severe',
      baselineMean,
      current,
    )
  }

  const classicDrop = z.classic !== null && z.classic < -Z_CLASSIC_THRESHOLD
  const robustDrop = z.robust !== null && z.robust < Z_ROBUST_THRESHOLD.drop

  if (isRatioDrop || classicDrop || robustDrop) {
    return buildSignal(
      isRatioDrop ? 'ratioDrop' : 'zScoreDrop',
      metric,
      'severe',
      baselineMean,
      current,
    )
  }

  if (z.robust !== null && z.robust > Z_ROBUST_THRESHOLD.warn) {
    return buildSignal('zScoreSpike', metric, 'moderate', baselineMean, current)
  }
  if (z.robust !== null && z.robust < -Z_ROBUST_THRESHOLD.warn) {
    return buildSignal('zScoreDrop', metric, 'moderate', baselineMean, current)
  }

  return null
}

function evaluateSideMismatch(
  candidate: SeriesPoint,
): SideMismatchSignal | null {
  const { srcVolumeUsd, dstVolumeUsd } = candidate
  if (srcVolumeUsd <= 0 || dstVolumeUsd <= 0) return null

  const largerSideUsd = Math.max(srcVolumeUsd, dstVolumeUsd)
  if (largerSideUsd < SIDE_MISMATCH_MIN_VOLUME_USD) return null

  const diffPercent =
    (Math.abs(srcVolumeUsd - dstVolumeUsd) / largerSideUsd) * 100
  if (diffPercent < SIDE_MISMATCH_DIFF_PERCENT) return null

  return {
    diffPercent,
    srcValueUsd: srcVolumeUsd,
    dstValueUsd: dstVolumeUsd,
    largerSideUsd,
  }
}

function buildSignal(
  kind: AnomalyKind,
  metric: AnomalyMetric,
  severity: AnomalySeverity,
  baseline: number,
  current: number,
): MetricSignal {
  return {
    metric,
    kind,
    severity,
    baseline,
    current,
    changePercent: getChangePercent(baseline, current),
  }
}

function getChangePercent(baseline: number, current: number): number | null {
  if (baseline === 0) {
    return current === 0 ? 0 : null
  }
  return ((current - baseline) / baseline) * 100
}

function isVolumeReliable(point: SeriesPoint): boolean {
  if (point.transferCount <= 0) return false
  return (
    point.identifiedCount / point.transferCount >=
    MIN_VOLUME_IDENTIFICATION_RATE
  )
}

function detectFlatLine(values: number[]): boolean {
  if (values.length < FLAT_LINE_WINDOW_DAYS) return false
  const window = values.slice(-FLAT_LINE_WINDOW_DAYS)
  return new Set(window).size === 1
}

function detectRatioDrop(values: number[]): boolean {
  if (values.length <= 2) return false
  const baseline = values.slice(0, -1)
  const current = values[values.length - 1] ?? 0
  const med = median(baseline)
  if (med === 0) return false
  return current / med < RATIO_DROP_THRESHOLD
}

function detectRatioSpike(values: number[], threshold: number): boolean {
  if (values.length <= 2) return false
  const baseline = values.slice(0, -1)
  const current = values[values.length - 1] ?? 0
  const med = median(baseline)
  if (med === 0) return false
  return current / med > threshold
}

function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2
  }
  return sorted[mid] ?? 0
}
