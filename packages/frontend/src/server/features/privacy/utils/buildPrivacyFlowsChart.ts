import { UnixTime } from '@l2beat/shared-pure'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import type { ChartRange } from '~/utils/range/range'

export type PrivacyFlowsChartPoint = [
  timestamp: number,
  depositsCount: number,
  withdrawalsCount: number,
  depositsValueUsd: number,
  withdrawalsValueUsd: number,
]

export function buildPrivacyFlowsChart(
  projects: string[],
  dailyRows: Array<{
    projectId: string
    timestamp: UnixTime
    depositCount: number
    withdrawalCount: number
    depositValueUsd: number
    withdrawalValueUsd: number
  }>,
  syncedUntil: UnixTime | undefined,
  range: ChartRange,
): { chart: PrivacyFlowsChartPoint[]; syncedUntil: number | undefined } {
  const projectIds = new Set(projects)
  const historyRows = dailyRows.filter(
    (row) => projectIds.has(row.projectId) && Number(row.timestamp) > 0,
  )

  if (historyRows.length === 0) {
    if (range[0] === null) {
      return {
        chart: [],
        syncedUntil: syncedUntil ? Number(syncedUntil) : undefined,
      }
    }

    return {
      chart: generateTimestamps(
        normalizePrivacyFlowsChartRange(range),
        'daily',
      ).map((timestamp) => [timestamp, 0, 0, 0, 0]),
      syncedUntil: syncedUntil ? Number(syncedUntil) : undefined,
    }
  }

  const minTimestamp = Math.min(
    ...historyRows.map((row) => Number(row.timestamp)),
  )
  const normalizedRange = normalizePrivacyFlowsChartRange(range, minTimestamp)
  const grouped = new Map<
    number,
    {
      depositsCount: number
      withdrawalsCount: number
      depositsValueUsd: number
      withdrawalsValueUsd: number
    }
  >()

  for (const row of historyRows) {
    if (
      Number(row.timestamp) < normalizedRange[0] ||
      Number(row.timestamp) > normalizedRange[1]
    ) {
      continue
    }

    const entry = grouped.get(Number(row.timestamp)) ?? {
      depositsCount: 0,
      withdrawalsCount: 0,
      depositsValueUsd: 0,
      withdrawalsValueUsd: 0,
    }

    entry.depositsCount += row.depositCount
    entry.withdrawalsCount += row.withdrawalCount
    entry.depositsValueUsd += row.depositValueUsd
    entry.withdrawalsValueUsd += row.withdrawalValueUsd

    grouped.set(Number(row.timestamp), entry)
  }

  return {
    chart: generateTimestamps(normalizedRange, 'daily').map((timestamp) => {
      const entry = grouped.get(timestamp)
      return [
        timestamp,
        entry?.depositsCount ?? 0,
        entry?.withdrawalsCount ?? 0,
        entry?.depositsValueUsd ?? 0,
        entry?.withdrawalsValueUsd ?? 0,
      ] as PrivacyFlowsChartPoint
    }),
    syncedUntil: syncedUntil ? Number(syncedUntil) : Number(normalizedRange[1]),
  }
}

function normalizePrivacyFlowsChartRange(
  range: ChartRange,
  minTimestamp?: number,
): [UnixTime, UnixTime] {
  const from =
    range[0] === null
      ? UnixTime.toStartOf(minTimestamp ?? range[1], 'day')
      : UnixTime.toStartOf(range[0], 'day')
  const to = UnixTime.toStartOf(range[1], 'day')

  return [UnixTime(from), UnixTime(to)]
}
