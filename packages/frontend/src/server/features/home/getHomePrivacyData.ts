import { UnixTime } from '@l2beat/shared-pure'
import type { ChartRange } from '~/utils/range/range'
import { getPrivacyFlowsChart } from '../privacy/getPrivacyFlowsChart'
import { getPrivacyProjects } from '../privacy/getPrivacyProjects'
import {
  getPrivacySummaryEntries,
  type PrivacySummaryEntry,
} from '../privacy/getPrivacySummaryEntries'
import { getTvsChartByProjects } from '../tvs/getTvsChartByProjects'
import { computeSeriesChange } from './computeSeriesChange'

const TOP_PROTOCOLS_COUNT = 5

/** Carries what the privacy dot needs, so the card can show it per row. */
export interface HomePrivacyTopProtocol
  extends Pick<PrivacySummaryEntry, 'adversaries'> {
  id: string
  name: string
  href: string
  iconUrl: string
  /** Undefined when the protocol has no value locked to track. */
  tvl: number | undefined
  tvlChange: number | undefined
  /** Value deposited over the last 30 days. */
  deposited30d: number | undefined
}

export interface HomePrivacyData {
  protocolCount: number
  tvl: {
    chart: [timestamp: number, value: number | null][]
    syncedUntil: number | undefined
    change: number | undefined
  }
  deposits: {
    chart: [timestamp: number, count: number, valueUsd: number][]
    syncedUntil: number | undefined
    totalValueUsd: number
    /** Against the same length of time before the chart's. */
    change: number | undefined
  }
  topProtocols: HomePrivacyTopProtocol[]
}

export async function getHomePrivacyData(
  range: ChartRange,
): Promise<HomePrivacyData> {
  const projects = await getPrivacyProjects()

  // Same project sets as the privacy summary charts.
  const tvlProjectIds = projects
    .filter((project) => project.tvsConfig !== undefined)
    .map((project) => project.id)
  const flowProjectIds = projects
    .filter(
      (project) =>
        project.tvsConfig !== undefined ||
        project.privacyInfo.tokens.some((token) => token.buckets.length > 0),
    )
    .map((project) => project.id)

  // Deposits are a sum over the range, so their change compares the range
  // with the one before it: the flows chart is fetched for both.
  const [from, to] = range
  const previousFrom =
    from !== null ? from - (UnixTime.toStartOf(to, 'day') - from) : null

  const [entries, tvlChart, flowsChart] = await Promise.all([
    getPrivacySummaryEntries(projects),
    getTvsChartByProjects({ projectIds: tvlProjectIds, range }),
    getPrivacyFlowsChart({
      projectIds: flowProjectIds,
      range: [previousFrom, to],
    }),
  ])

  const tvl = tvlChart.chart.map(
    ([timestamp, valuesByProject]): [number, number | null] => {
      const values = Object.values(valuesByProject).filter(
        (value): value is number => value !== null,
      )
      return [
        timestamp,
        values.length > 0 ? values.reduce((a, b) => a + b, 0) : null,
      ]
    },
  )

  const flows = flowsChart.chart.map(
    ([timestamp, depositsCount, , depositsValueUsd]): [
      number,
      number,
      number,
    ] => [timestamp, depositsCount, depositsValueUsd],
  )
  const deposits = flows.filter(
    ([timestamp]) => from === null || timestamp >= from,
  )
  const depositsTotal = sumDeposits(deposits)
  // Only against a range the chart covers in full, so a short history does
  // not read as growth.
  const previousTotal =
    previousFrom !== null &&
    from !== null &&
    (flows[0]?.[0] ?? from) <= previousFrom
      ? sumDeposits(flows.filter(([timestamp]) => timestamp < from))
      : 0

  return {
    protocolCount: entries.length,
    tvl: {
      chart: tvl,
      syncedUntil: tvlChart.syncedUntil,
      change: computeSeriesChange(tvl.map(([, value]) => value)),
    },
    deposits: {
      chart: deposits,
      syncedUntil: flowsChart.syncedUntil,
      totalValueUsd: depositsTotal,
      change: previousTotal > 0 ? depositsTotal / previousTotal - 1 : undefined,
    },
    // The /privacy order: privacy rating first, value locked after.
    topProtocols: entries.slice(0, TOP_PROTOCOLS_COUNT).map((entry) => ({
      id: entry.id,
      name: entry.name,
      href: entry.href,
      iconUrl: entry.icon,
      tvl: entry.hasTvl ? entry.totalValueLockedUsd : undefined,
      tvlChange: entry.hasTvl ? entry.totalValueLockedChange7d : undefined,
      deposited30d: entry.totalValueDeposited30dUsd,
      adversaries: entry.adversaries,
    })),
  }
}

function sumDeposits(points: [number, number, number][]): number {
  return points.reduce((acc, [, , valueUsd]) => acc + valueUsd, 0)
}
