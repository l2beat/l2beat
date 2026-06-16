import type { AggregatedInteropTransferSeriesRecord } from '@l2beat/database'
import { assert, type InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import {
  type AnomalyEvaluation,
  type BridgeTotal,
  evaluateAnomalies,
  formatAnomalyReasons,
  type SeriesPoint,
} from '../anomalies'

export type DataRow = AggregatedInteropTransferSeriesRecord

export type DataRowResult = {
  id: string
  bridgeType: InteropBridgeType
  srcChain: string
  dstChain: string
  timestamp: string
  evaluation: AnomalyEvaluation
  interpretation: string
  counts: {
    last: number
    prevDay: number | null
    prev7d: number | null
  }
  srcVolume: PeriodVolume
  dstVolume: PeriodVolume
  srcDstDiff: {
    lastPercent: number | null
    prevDayPercent: number | null
    prev7dPercent: number | null
    isSideMismatch: boolean
  }
  dataPoints: DataPointDto[]
}

type PeriodVolume = {
  valueUsd: {
    last: number
    prevDay: number | null
    prev7d: number | null
  }
}

type DataPointDto = {
  day: string
  transferCount: number
  totalSrcValueUsd: number
  totalDstValueUsd: number
}

function groupKey(row: DataRow): string {
  return `${row.id}::${row.bridgeType}::${row.srcChain}::${row.dstChain}`
}

export function prepare(rows: DataRow[]): DataRow[] {
  const template = rows[0]
  if (!template) return []

  const key = groupKey(template)
  for (const row of rows) {
    assert(groupKey(row) === key, 'All rows must share the same route key')
  }

  const dayNumbers = rows.map((row) => row.day)
  const upperBound = Math.max(...dayNumbers)
  const lowerBound = Math.min(...dayNumbers)
  const filled: DataRow[] = []

  for (let day = lowerBound; day <= upperBound; day += UnixTime.DAY) {
    const existing = rows.find((row) => row.day === day)
    filled.push(
      existing ?? {
        day,
        id: template.id,
        bridgeType: template.bridgeType,
        srcChain: template.srcChain,
        dstChain: template.dstChain,
        transferCount: 0,
        identifiedCount: 0,
        totalSrcValueUsd: 0,
        totalDstValueUsd: 0,
      },
    )
  }

  return filled.sort(byDay)
}

export function explore(rows: DataRow[]): DataRowResult[] {
  const byRoute = groupBy(rows, groupKey)
  const bridgeTotals = computeBridgeTotals(rows)
  const results: DataRowResult[] = []

  for (const key in byRoute) {
    const route = byRoute[key]
    if (!route || route.length === 0) continue
    const dataPoints = prepare(route)
    const last = dataPoints.at(-1)
    if (!last) continue
    const prevDay = dataPoints.at(-2) ?? null
    const prev7d = dataPoints.at(-8) ?? null

    const evaluation = evaluateAnomalies(
      dataPoints.map(toSeriesPoint),
      bridgeTotals.get(bridgeTotalKey(last)),
    )
    const reasons = formatAnomalyReasons(evaluation)

    results.push({
      id: last.id,
      bridgeType: last.bridgeType,
      srcChain: last.srcChain,
      dstChain: last.dstChain,
      timestamp: UnixTime.toYYYYMMDD(last.day),
      evaluation,
      interpretation: reasons.join('\n'),
      counts: {
        last: last.transferCount,
        prevDay: prevDay?.transferCount ?? null,
        prev7d: prev7d?.transferCount ?? null,
      },
      srcVolume: buildVolume(last.totalSrcValueUsd, prevDay, prev7d, 'src'),
      dstVolume: buildVolume(last.totalDstValueUsd, prevDay, prev7d, 'dst'),
      srcDstDiff: buildSrcDstDiff(last, prevDay, prev7d, evaluation),
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

export function interpret(result: DataRowResult): string {
  return result.interpretation
}

function computeBridgeTotals(rows: DataRow[]): Map<string, BridgeTotal> {
  const totals = new Map<string, BridgeTotal>()

  for (const row of rows) {
    const key = bridgeTotalKey(row)
    const existing = totals.get(key) ?? {
      transferCount: 0,
      volumeUsd: 0,
    }
    existing.transferCount += row.transferCount
    existing.volumeUsd += row.totalSrcValueUsd + row.totalDstValueUsd
    totals.set(key, existing)
  }

  return totals
}

function buildVolume(
  last: number,
  prevDay: DataRow | null,
  prev7d: DataRow | null,
  side: 'src' | 'dst',
): PeriodVolume {
  const pick = (row: DataRow | null) =>
    row === null
      ? null
      : side === 'src'
        ? row.totalSrcValueUsd
        : row.totalDstValueUsd
  return {
    valueUsd: {
      last,
      prevDay: pick(prevDay),
      prev7d: pick(prev7d),
    },
  }
}

function buildSrcDstDiff(
  last: DataRow,
  prevDay: DataRow | null,
  prev7d: DataRow | null,
  evaluation: AnomalyEvaluation,
) {
  return {
    lastPercent: percentDiff(last.totalSrcValueUsd, last.totalDstValueUsd),
    prevDayPercent:
      prevDay === null
        ? null
        : percentDiff(prevDay.totalSrcValueUsd, prevDay.totalDstValueUsd),
    prev7dPercent:
      prev7d === null
        ? null
        : percentDiff(prev7d.totalSrcValueUsd, prev7d.totalDstValueUsd),
    isSideMismatch: evaluation.sideMismatch !== null,
  }
}

function percentDiff(left: number, right: number): number | null {
  const base = Math.max(Math.abs(left), Math.abs(right))
  if (base === 0) return null
  return (Math.abs(left - right) / base) * 100
}

function bridgeTotalKey(row: Pick<DataRow, 'id' | 'day'>): string {
  return `${row.id}::${row.day}`
}

function toSeriesPoint(row: DataRow): SeriesPoint {
  return {
    day: row.day,
    transferCount: row.transferCount,
    identifiedCount: row.identifiedCount,
    srcVolumeUsd: row.totalSrcValueUsd,
    dstVolumeUsd: row.totalDstValueUsd,
  }
}

function byDay(a: DataRow, b: DataRow) {
  return a.day - b.day
}
