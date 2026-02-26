import type { AggregatedInteropTransferSeriesRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import sum from 'lodash/sum'
export const Z_CLASSIC_THRESHOLD = 7
export const Z_ROBUST_THRESHOLD = {
  warn: 4,
  drop: -6,
  spike: 6,
}
export const VALUE_DIFF_ALERT_THRESHOLD_PERCENT = 5

const FLAT_LINE_WINDOW_DAYS = 3
const RATIO_WINDOW_DAYS = 14
const MIN_NON_ZERO_HISTORY_POINTS = 3
const Z_WINDOW_DAYS = 14

export type DataRow = AggregatedInteropTransferSeriesRecord

type PeriodPoints = {
  last: DataRow
  prevDay: DataRow | undefined
  prev7d: DataRow | undefined
}

type ZScore = {
  robust: number | null
  classic: number | null
}

type CountStats = {
  last: number
  prevDay: number | null
  prev7d: number | null
  z: ZScore
  isFlatLine: boolean
  isRatioDrop: boolean
  isRatioSpike: boolean
}

type VolumeStats = {
  valueUsd: {
    last: number
    prevDay: number | null
    prev7d: number | null
  }
  avgValuePerTransfer: {
    last: number | null
    prevDay: number | null
    prev7d: number | null
  }
  z: ZScore
  isRatioDrop: boolean
  isRatioSpike: boolean
}

type SrcDstDiffStats = {
  lastPercent: number | null
  prevDayPercent: number | null
  prev7dPercent: number | null
  isHigh: boolean
}

export type DataRowResult = {
  id: string
  timestamp: string
  counts: CountStats
  srcVolume: VolumeStats
  dstVolume: VolumeStats
  srcDstDiff: SrcDstDiffStats
  rawDataPoints: {
    day: string
    transferCount: number
    totalSrcValueUsd: number
    totalDstValueUsd: number
  }[]
  dataPoints: {
    day: string
    transferCount: number
    totalSrcValueUsd: number
    totalDstValueUsd: number
  }[]
}

export function prepare(rows: DataRow[]) {
  if (rows.length === 0) {
    return []
  }

  const uniqueIds = [...new Set(rows.map((row) => row.id))]
  assert(uniqueIds.length === 1, 'All rows must have the same id')
  const [{ id }] = rows

  const dayNumbers = rows.map((row) => row.day)
  const upperBound = Math.max(...dayNumbers)
  const lowerBound = Math.min(...dayNumbers)

  const dataPoints: DataRow[] = []

  // Fill gaps with zeros
  for (let day = lowerBound; day <= upperBound; day += UnixTime.DAY) {
    const dayRow = rows.find((row) => row.day === day)
    if (dayRow) {
      dataPoints.push(dayRow)
    } else {
      dataPoints.push({
        day,
        id,
        transferCount: 0,
        totalSrcValueUsd: 0,
        totalDstValueUsd: 0,
      })
    }
  }

  return dataPoints.sort(byDay)
}

export function explore(rows: DataRow[]) {
  const byId = groupBy(rows, (row) => row.id)
  const results: DataRowResult[] = []

  for (const id in byId) {
    const series = byId[id]
    const rawDataPoints = [...series].sort(byDay)
    const dataPoints = prepare(series)
    const periodPoints = getPeriodPoints(dataPoints)
    const { last: lastDp } = periodPoints
    const counts = dataPoints.map((dp) => dp.transferCount)
    const srcValues = dataPoints.map((dp) => dp.totalSrcValueUsd)
    const dstValues = dataPoints.map((dp) => dp.totalDstValueUsd)

    const countsStats = buildCountStats(periodPoints, counts)
    const srcVolumeStats = buildVolumeStats(
      periodPoints,
      srcValues,
      (dp) => dp.totalSrcValueUsd,
    )
    const dstVolumeStats = buildVolumeStats(
      periodPoints,
      dstValues,
      (dp) => dp.totalDstValueUsd,
    )
    const srcDstDiffStats = buildSrcDstDiffStats(periodPoints)

    results.push({
      id,
      timestamp: UnixTime.toYYYYMMDD(lastDp.day),
      counts: countsStats,
      srcVolume: srcVolumeStats,
      dstVolume: dstVolumeStats,
      srcDstDiff: srcDstDiffStats,
      rawDataPoints: rawDataPoints.map((dp) => ({
        day: UnixTime.toYYYYMMDD(dp.day),
        transferCount: dp.transferCount,
        totalSrcValueUsd: dp.totalSrcValueUsd,
        totalDstValueUsd: dp.totalDstValueUsd,
      })),
      dataPoints: dataPoints.map((dp) => ({
        day: UnixTime.toYYYYMMDD(dp.day),
        transferCount: dp.transferCount,
        totalSrcValueUsd: dp.totalSrcValueUsd,
        totalDstValueUsd: dp.totalDstValueUsd,
      })),
    })
  }

  return results
}

export function interpret(result: DataRowResult) {
  const outputs: string[] = []

  if (result.counts.isFlatLine) {
    outputs.push('Flat line')
  }

  appendRatioLabels(outputs, result.counts, {
    drop: 'Ratio drop',
    spike: 'Ratio spike',
  })
  appendRatioLabels(outputs, result.srcVolume, {
    drop: 'Src volume ratio drop',
    spike: 'Src volume ratio spike',
  })
  appendRatioLabels(outputs, result.dstVolume, {
    drop: 'Dst volume ratio drop',
    spike: 'Dst volume ratio spike',
  })

  if (result.srcDstDiff.isHigh) {
    outputs.push(
      `Src/Dst value mismatch > ${VALUE_DIFF_ALERT_THRESHOLD_PERCENT}%`,
    )
  }

  appendZLabels(outputs, result.counts.z, {
    classic: 'Z-classic: spike/drop',
  })
  appendZLabels(outputs, result.srcVolume.z, {
    classic: 'Src volume Z-classic: spike/drop',
    robustPrefix: 'Src volume ',
  })
  appendZLabels(outputs, result.dstVolume.z, {
    classic: 'Dst volume Z-classic: spike/drop',
    robustPrefix: 'Dst volume ',
  })

  return outputs.join(', ')
}

export function interpretZRobust(value: number) {
  if (value > Z_ROBUST_THRESHOLD.spike) {
    return 'Z-robust - big spike'
  }

  if (value > Z_ROBUST_THRESHOLD.warn) {
    return 'Z-robust - moderate spike'
  }

  if (value < Z_ROBUST_THRESHOLD.drop) {
    return 'Z-robust - big drop'
  }

  if (value < -Z_ROBUST_THRESHOLD.warn) {
    return 'Z-robust - moderate drop'
  }
}

function log1Plus(x: number) {
  return Math.log(1 + x)
}

function avgVolumePerTransfer(volume: number, transferCount: number) {
  if (transferCount <= 0) {
    return null
  }

  return volume / transferCount
}

function relativePercentDifference(left: number, right: number) {
  const base = Math.max(Math.abs(left), Math.abs(right))
  if (base === 0) {
    return null
  }

  return (Math.abs(left - right) / base) * 100
}

function buildCountStats(points: PeriodPoints, counts: number[]): CountStats {
  const period = mapPeriodPoints(points, (dp) => dp.transferCount)
  const ratioWindow = pick.lastNDays(counts, RATIO_WINDOW_DAYS)
  const zWindow = pick.lastNDays(counts.map(log1Plus), Z_WINDOW_DAYS)
  const flatLineWindow = pick.lastNDays(counts, FLAT_LINE_WINDOW_DAYS)
  const hasSignal = hasEnoughNonZeroHistory(
    ratioWindow,
    MIN_NON_ZERO_HISTORY_POINTS,
  )

  return {
    ...period,
    z: getZScore(zWindow, hasSignal),
    isFlatLine:
      flatLineWindow.length >= FLAT_LINE_WINDOW_DAYS &&
      detect.flatLine(flatLineWindow),
    isRatioDrop: hasSignal && detect.ratioDrop(ratioWindow),
    isRatioSpike: hasSignal && detect.ratioSpike(ratioWindow),
  }
}

function buildVolumeStats(
  points: PeriodPoints,
  values: number[],
  getValueUsd: (dp: DataRow) => number,
): VolumeStats {
  const valueUsd = mapPeriodPoints(points, getValueUsd)
  const avgValuePerTransfer = mapPeriodPoints(points, (dp) =>
    avgVolumePerTransfer(getValueUsd(dp), dp.transferCount),
  )
  const ratioWindow = pick.lastNDays(values, RATIO_WINDOW_DAYS)
  const zWindow = pick.lastNDays(values.map(log1Plus), Z_WINDOW_DAYS)
  const hasSignal = hasEnoughNonZeroHistory(
    ratioWindow,
    MIN_NON_ZERO_HISTORY_POINTS,
  )

  return {
    valueUsd,
    avgValuePerTransfer,
    z: getZScore(zWindow, hasSignal),
    isRatioDrop: hasSignal && detect.ratioDrop(ratioWindow),
    isRatioSpike:
      hasSignal && detect.ratioSpike(ratioWindow, 10 /* 10x sudden spike */),
  }
}

function buildSrcDstDiffStats(points: PeriodPoints): SrcDstDiffStats {
  const period = mapPeriodPoints(points, (dp) =>
    relativePercentDifference(dp.totalSrcValueUsd, dp.totalDstValueUsd),
  )

  return {
    lastPercent: period.last,
    prevDayPercent: period.prevDay,
    prev7dPercent: period.prev7d,
    isHigh:
      period.last !== null && period.last > VALUE_DIFF_ALERT_THRESHOLD_PERCENT,
  }
}

function getZScore(values: number[], hasSignal: boolean): ZScore {
  if (!hasSignal) {
    return { robust: null, classic: null }
  }

  return {
    robust: zRobust(values),
    classic: zClassic(values),
  }
}

function appendRatioLabels(
  outputs: string[],
  ratioStats: { isRatioDrop: boolean; isRatioSpike: boolean },
  labels: { drop: string; spike: string },
) {
  if (ratioStats.isRatioDrop) {
    outputs.push(labels.drop)
  }

  if (ratioStats.isRatioSpike) {
    outputs.push(labels.spike)
  }
}

function appendZLabels(
  outputs: string[],
  z: ZScore,
  labels: { classic: string; robustPrefix?: string },
) {
  if (z.classic !== null && Math.abs(z.classic) > Z_CLASSIC_THRESHOLD) {
    outputs.push(labels.classic)
  }

  if (z.robust !== null) {
    const zRobustInterpreted = interpretZRobust(z.robust)
    if (zRobustInterpreted) {
      outputs.push(`${labels.robustPrefix ?? ''}${zRobustInterpreted}`)
    }
  }
}

function getPeriodPoints(dataPoints: DataRow[]): PeriodPoints {
  const last = dataPoints.at(-1)
  assert(last, 'Last data point must be defined')

  return {
    last,
    prevDay: dataPoints.at(-2),
    prev7d: dataPoints.at(-8),
  }
}

function mapPeriodPoints<T>(
  points: PeriodPoints,
  transform: (dataPoint: DataRow) => T,
) {
  return {
    last: transform(points.last),
    prevDay: points.prevDay === undefined ? null : transform(points.prevDay),
    prev7d: points.prev7d === undefined ? null : transform(points.prev7d),
  }
}

function byDay(a: DataRow, b: DataRow) {
  return a.day - b.day
}

export function median(values: number[]) {
  assert(values.length > 0, 'Values must be non-empty')
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }
  return sorted[middle]
}

export function MAD(values: number[]) {
  const med = median(values)
  const deviations = values.map((value) => Math.abs(value - med))
  return median(deviations)
}

/**
 * For a standard normal distribution:
 * - Median = 0
 * - Median of |X| ≈ 0.67449
 *
 * σ ≈ MAD / 0.67449 ≈ MAD × 1.4826
 */
export function zRobust(values: number[]) {
  if (values.length < 2) {
    return null
  }

  const prev = values.slice(0, -1)
  const current = values.at(-1)
  assert(current !== undefined, 'Current value must be defined')
  const med = median(prev)
  const mad = MAD(prev)
  if (mad === 0) return current === med ? 0 : null
  return (current - med) / (1.4826 * mad)
}

export function zClassic(values: number[]) {
  if (values.length < 2) {
    return null
  }

  const prev = values.slice(0, -1)
  const current = values.at(-1)
  assert(current !== undefined, 'Current value must be defined')
  const mean = sum(prev) / prev.length
  const varPop = prev.reduce((acc, v) => acc + (v - mean) ** 2, 0) / prev.length
  const std = Math.sqrt(varPop)
  if (std === 0) return current === mean ? 0 : null
  return (current - mean) / std
}

function flatLine(values: number[]) {
  const unique = [...new Set(values)]

  return unique.length === 1
}

function ratioDrop(values: number[], threshold = 0.1 /* 90% sudden drop */) {
  if (values.length <= 2) {
    return false
  }

  const prev = values.slice(0, -1)
  const current = values.at(-1)

  assert(prev.length > 0, 'Previous values must be defined')
  assert(current !== undefined, 'Current value must be defined')

  return current / median(prev) < threshold
}

function ratioSpike(values: number[], threshold = 1.9 /* +90% */) {
  if (values.length <= 2) {
    return false
  }
  const prev = values.slice(0, -1)
  const current = values.at(-1)
  assert(current !== undefined, 'Current value must be defined')
  const base = median(prev)
  if (base === 0) {
    return false
  }
  return current / base > threshold
}

function hasEnoughNonZeroHistory(values: number[], minNonZeroPoints: number) {
  if (values.length <= 2) {
    return false
  }

  const prev = values.slice(0, -1)
  const nonZeroPoints = prev.filter((value) => value > 0).length
  return nonZeroPoints >= minNonZeroPoints
}

function lastNDays(values: number[], n: number) {
  return values.slice(-n)
}

export const pick = {
  lastNDays,
}

export const detect = {
  flatLine,
  ratioDrop,
  ratioSpike,
}

export const funcs = {
  log1Plus,
  avgVolumePerTransfer,
  relativePercentDifference,
  hasEnoughNonZeroHistory,
  median,
  MAD,
  zRobust,
  zClassic,
}
