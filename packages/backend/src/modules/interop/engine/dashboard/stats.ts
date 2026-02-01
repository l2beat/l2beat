import type { AggregatedInteropTransferSeriesRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import sum from 'lodash/sum'
export const Z_SCORE_THRESHOLD = 3

export type DataRow = AggregatedInteropTransferSeriesRecord
export type DataRowResult = {
  id: string
  timestamp: string
  lastCount: number
  prevDayCount: number | null
  prev7dCount: number | null
  z: {
    robust: {
      value: number
      isAnomaly: boolean
    }
    classic: {
      value: number
      isAnomaly: boolean
    }
  }
  isFlatLine: boolean
  isRatioDrop: boolean
  isRatioSpike: boolean
  dataPoints: { day: string; transferCount: number }[]
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
      dataPoints.push({ day, id, transferCount: 0 })
    }
  }

  return dataPoints.sort(byDay)
}

export function explore(rows: DataRow[]) {
  const byId = groupBy(rows, (row) => row.id)
  const results: DataRowResult[] = []

  for (const id in byId) {
    const series = byId[id]
    const dataPoints = prepare(series)
    const log1PlusDataPoints = dataPoints.map((dp) => ({
      ...dp,
      transferCount: log1Plus(dp.transferCount),
    }))
    const counts = dataPoints.map((dp) => dp.transferCount)
    const lastDp = dataPoints.at(-1)
    assert(lastDp, 'Last data point must be defined')
    const prevDayCount = dataPoints.at(-2)?.transferCount ?? null
    const prev7dCount = dataPoints.at(-8)?.transferCount ?? null

    const zWindow = pick.lastNDays(
      log1PlusDataPoints.map((dp) => dp.transferCount),
      14,
    )

    const zR = zRobust(zWindow)
    const zC = zClassic(zWindow)

    const ratioWindow = pick.lastNDays(counts, 14)
    const flatLineWindow = pick.lastNDays(counts, 3)

    const isFlatLine = detect.flatLine(flatLineWindow)
    const isRatioDrop = detect.ratioDrop(ratioWindow)
    const isRatioSpike = detect.ratioSpike(ratioWindow)

    results.push({
      id,
      timestamp: UnixTime.toYYYYMMDD(lastDp.day),
      lastCount: lastDp.transferCount,
      prevDayCount,
      prev7dCount,
      z: {
        robust: {
          value: zR,
          isAnomaly: Math.abs(zR) > Z_SCORE_THRESHOLD,
        },
        classic: {
          value: zC,
          isAnomaly: Math.abs(zC) > Z_SCORE_THRESHOLD,
        },
      },
      isFlatLine,
      isRatioDrop,
      isRatioSpike,
      dataPoints: dataPoints.map((dp) => ({
        day: UnixTime.toYYYYMMDD(dp.day),
        transferCount: dp.transferCount,
      })),
    })
  }

  return results
}

function log1Plus(x: number) {
  return Math.log(1 + x)
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
  assert(values.length >= 2, 'Need at least 2 points')
  const prev = values.slice(0, -1)
  const current = values.at(-1)
  assert(current !== undefined, 'Current value must be defined')
  const med = median(prev)
  const mad = MAD(prev)
  if (mad === 0) return current === med ? 0 : Number.POSITIVE_INFINITY
  return (current - med) / (1.4826 * mad)
}

export function zClassic(values: number[]) {
  assert(values.length >= 2, 'Need at least 2 points')
  const prev = values.slice(0, -1)
  const current = values.at(-1)
  assert(current !== undefined, 'Current value must be defined')
  const mean = sum(prev) / prev.length
  const varPop = prev.reduce((acc, v) => acc + (v - mean) ** 2, 0) / prev.length
  const std = Math.sqrt(varPop)
  if (std === 0) return current === mean ? 0 : Number.POSITIVE_INFINITY
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
  if (values.length <= 2) return false
  const prev = values.slice(0, -1)
  const current = values.at(-1)
  assert(current !== undefined, 'Current value must be defined')
  const base = median(prev)
  if (base === 0) return current > 0 // or handle separately
  return current / base > threshold
}

function lastNDays(values: number[], n: number) {
  if (values.length < n) {
    return values
  }
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
  median,
  MAD,
  zRobust,
  zClassic,
}
