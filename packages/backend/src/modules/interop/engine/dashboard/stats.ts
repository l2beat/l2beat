import type { AggregatedInteropTransferSeriesRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import {
  getWindowedLogZScore,
  hasEnoughNonZeroHistory,
  log1Plus,
  MAD,
  median,
  Z_CLASSIC_THRESHOLD,
  Z_ROBUST_THRESHOLD,
  type ZScore,
  zClassic,
  zRobust,
} from '../zScore'

export { Z_CLASSIC_THRESHOLD } from '../zScore'
export const SIDE_MISMATCH_DIFF_PERCENT = 30
export const SIDE_MISMATCH_MIN_VOLUME_USD = 1_000_000

const FLAT_LINE_WINDOW_DAYS = 3
const RATIO_WINDOW_DAYS = 14

export type DataRow = AggregatedInteropTransferSeriesRecord

type PeriodPoints = {
  last: DataRow
  prevDay: DataRow | undefined
  prev7d: DataRow | undefined
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
  isSideMismatch: boolean
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

type MetricSummary =
  | { kind: 'flat' }
  | { kind: 'spike' | 'drop'; severity: 'severe' | 'moderate' }

export function interpret(result: DataRowResult) {
  const outputs: string[] = []

  appendMetricLabel(outputs, 'Transfer count', summarizeCount(result.counts))
  appendMetricLabel(outputs, 'Source volume', summarizeVolume(result.srcVolume))
  appendMetricLabel(
    outputs,
    'Destination volume',
    summarizeVolume(result.dstVolume),
  )

  if (
    result.srcDstDiff.isSideMismatch &&
    result.srcDstDiff.lastPercent !== null
  ) {
    outputs.push(
      `Source/destination volume mismatch (${result.srcDstDiff.lastPercent.toFixed(0)}%)`,
    )
  }

  return outputs.join(', ')
}

function appendMetricLabel(
  outputs: string[],
  label: string,
  summary: MetricSummary | null,
) {
  if (!summary) return

  if (summary.kind === 'flat') {
    outputs.push(`${label} was flat`)
    return
  }

  const intensity = summary.severity === 'moderate' ? ' moderately' : ''
  const action = summary.kind === 'spike' ? 'spiked' : 'dropped'
  outputs.push(`${label}${intensity} ${action}`)
}

function summarizeCount(stats: CountStats): MetricSummary | null {
  if (stats.isFlatLine) {
    return { kind: 'flat' }
  }
  return summarizeDirectional(stats)
}

function summarizeVolume(stats: VolumeStats): MetricSummary | null {
  return summarizeDirectional(stats)
}

function summarizeDirectional(stats: {
  isRatioSpike: boolean
  isRatioDrop: boolean
  z: ZScore
}): MetricSummary | null {
  const robust = stats.z.robust
  const classic = stats.z.classic
  const classicHit =
    classic !== null && Math.abs(classic) > Z_CLASSIC_THRESHOLD ? classic : null

  const severeSpike =
    stats.isRatioSpike ||
    (robust !== null && robust > Z_ROBUST_THRESHOLD.spike) ||
    (classicHit !== null && classicHit > 0)
  if (severeSpike) return { kind: 'spike', severity: 'severe' }

  const severeDrop =
    stats.isRatioDrop ||
    (robust !== null && robust < Z_ROBUST_THRESHOLD.drop) ||
    (classicHit !== null && classicHit < 0)
  if (severeDrop) return { kind: 'drop', severity: 'severe' }

  if (robust !== null && robust > Z_ROBUST_THRESHOLD.warn) {
    return { kind: 'spike', severity: 'moderate' }
  }
  if (robust !== null && robust < -Z_ROBUST_THRESHOLD.warn) {
    return { kind: 'drop', severity: 'moderate' }
  }

  return null
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
  const flatLineWindow = pick.lastNDays(counts, FLAT_LINE_WINDOW_DAYS)
  const hasSignal = hasEnoughNonZeroHistory(ratioWindow)

  return {
    ...period,
    z: hasSignal
      ? getWindowedLogZScore(counts)
      : { robust: null, classic: null },
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
  const hasSignal = hasEnoughNonZeroHistory(ratioWindow)

  return {
    valueUsd,
    avgValuePerTransfer,
    z: hasSignal
      ? getWindowedLogZScore(values)
      : { robust: null, classic: null },
    isRatioDrop: hasSignal && detect.ratioDrop(ratioWindow),
    isRatioSpike:
      hasSignal && detect.ratioSpike(ratioWindow, 10 /* 10x sudden spike */),
  }
}

function buildSrcDstDiffStats(points: PeriodPoints): SrcDstDiffStats {
  const period = mapPeriodPoints(points, (dp) =>
    relativePercentDifference(dp.totalSrcValueUsd, dp.totalDstValueUsd),
  )
  const latestVolume = Math.max(
    points.last.totalSrcValueUsd,
    points.last.totalDstValueUsd,
  )

  return {
    lastPercent: period.last,
    prevDayPercent: period.prevDay,
    prev7dPercent: period.prev7d,
    isSideMismatch:
      period.last !== null &&
      points.last.totalSrcValueUsd > 0 &&
      points.last.totalDstValueUsd > 0 &&
      latestVolume >= SIDE_MISMATCH_MIN_VOLUME_USD &&
      period.last >= SIDE_MISMATCH_DIFF_PERCENT,
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
