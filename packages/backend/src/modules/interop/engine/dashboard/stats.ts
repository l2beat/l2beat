import type { AggregatedInteropTransferSeriesRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import {
  flatLine,
  lastNValues,
  log1Plus,
  MAD,
  median,
  ratioDrop,
  ratioSpike,
  zClassic,
  zRobust,
} from './statsComputation'
export const Z_CLASSIC_THRESHOLD = 7
export const Z_ROBUST_THRESHOLD = {
  warn: 4,
  drop: -6,
  spike: 6,
}

const FLAT_LINE_WINDOW_DAYS = 3
const RATIO_WINDOW_DAYS = 14

export type DataRow = AggregatedInteropTransferSeriesRecord
export type DataRowResult = {
  id: string
  timestamp: string
  lastCount: number
  prevDayCount: number | null
  prev7dCount: number | null
  z: {
    robust: number | null
    classic: number | null
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

    const zWindow = pick.lastNValues(
      log1PlusDataPoints.map((dp) => dp.transferCount),
      14,
    )

    const zR = zRobust(zWindow)
    const zC = zClassic(zWindow)

    const ratioWindow = pick.lastNValues(counts, RATIO_WINDOW_DAYS)
    const flatLineWindow = pick.lastNValues(counts, FLAT_LINE_WINDOW_DAYS)

    const isFlatLine =
      flatLineWindow.length >= FLAT_LINE_WINDOW_DAYS &&
      detect.flatLine(flatLineWindow)
    const isRatioDrop = detect.ratioDrop(ratioWindow)
    const isRatioSpike = detect.ratioSpike(ratioWindow)

    results.push({
      id,
      timestamp: UnixTime.toYYYYMMDD(lastDp.day),
      lastCount: lastDp.transferCount,
      prevDayCount,
      prev7dCount,
      z: {
        robust: zR,
        classic: zC,
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

export function interpret(result: DataRowResult) {
  const outputs: string[] = []

  if (result.isFlatLine) {
    outputs.push('Flat line')
  }

  if (result.isRatioDrop) {
    outputs.push('Ratio drop')
  }

  if (result.isRatioSpike) {
    outputs.push('Ratio spike')
  }

  if (
    result.z.classic !== null &&
    Math.abs(result.z.classic) > Z_CLASSIC_THRESHOLD
  ) {
    outputs.push('Z-classic: spike/drop')
  }

  if (result.z.robust !== null) {
    const zRobustInterpreted = interpretZRobust(result.z.robust)
    if (zRobustInterpreted) {
      outputs.push(zRobustInterpreted)
    }
  }

  return outputs.join(', ')
}

export function interpretZRobust(value: number) {
  const abs = Math.abs(value)

  if (value > Z_ROBUST_THRESHOLD.spike) {
    return 'Z-robust - big spike'
  }

  if (value < Z_ROBUST_THRESHOLD.drop) {
    return 'Z-robust - big drop'
  }

  if (abs > Z_ROBUST_THRESHOLD.warn) {
    return 'Z-robust - moderate spike/drop'
  }
}

function byDay(a: DataRow, b: DataRow) {
  return a.day - b.day
}

export const pick = {
  lastNValues,
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
