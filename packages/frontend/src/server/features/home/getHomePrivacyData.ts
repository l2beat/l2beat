import { UnixTime } from '@l2beat/shared-pure'
import type { ChartRange } from '~/utils/range/range'
import { getPrivacyFlowsChart } from '../privacy/getPrivacyFlowsChart'
import { getPrivacyProjects } from '../privacy/getPrivacyProjects'
import {
  getPrivacySummaryEntries,
  type PrivacySummaryEntry,
} from '../privacy/getPrivacySummaryEntries'
import { getTvsChartByProjects } from '../tvs/getTvsChartByProjects'
import {
  computeRangeTotal,
  computeSeriesChange,
  EMPTY_HOME_KPI,
  getLatestValue,
  type HomeKpi,
  type HomeSeriesPoint,
} from './homeSeries'

const TOP_PROTOCOLS_COUNT = 5

/** Carries what the privacy rosette needs, so the card can show it per row. */
interface HomePrivacyTopProtocol
  extends Pick<PrivacySummaryEntry, 'adversaries' | 'isUnderReview'> {
  id: string
  name: string
  href: string
  iconUrl: string
  /** Undefined when the protocol has no value locked to track. */
  tvl: number | undefined
  /** Against 7 days ago, as for the Layer 2s. */
  tvlChange: number | undefined
  /** Value deposited over the last 30 days. */
  deposited30d: number | undefined
}

export interface HomePrivacyData {
  tvl: HomeKpi
  /**
   * Value deposited; the figure is the total over the range, its change
   * against the same length of time before it.
   */
  deposits: HomeKpi
  topProtocols: HomePrivacyTopProtocol[]
}

export const EMPTY_HOME_PRIVACY_DATA: HomePrivacyData = {
  tvl: EMPTY_HOME_KPI,
  deposits: EMPTY_HOME_KPI,
  topProtocols: [],
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
    ([timestamp, valuesByProject]): HomeSeriesPoint => {
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
    ([timestamp, , , depositsValueUsd]): [number, number] => [
      timestamp,
      depositsValueUsd,
    ],
  )
  const deposits = flows.filter(
    ([timestamp]) => from === null || timestamp >= from,
  )
  const { total, change } = computeRangeTotal(flows, from, previousFrom)

  return {
    tvl: {
      chart: tvl,
      value: getLatestValue(tvl),
      change: computeSeriesChange(tvl),
    },
    deposits: {
      chart: deposits,
      value: deposits.length > 0 ? total : undefined,
      change,
    },
    // The /privacy order: privacy rating first, value locked after.
    topProtocols: entries.slice(0, TOP_PROTOCOLS_COUNT).map((entry) => ({
      id: entry.id,
      name: entry.name,
      href: entry.href,
      iconUrl: entry.icon,
      tvl: entry.hasTvl ? entry.totalValueLockedUsd : undefined,
      tvlChange: entry.hasTvl ? entry.totalValueLockedChange : undefined,
      deposited30d: entry.totalValueDeposited30dUsd,
      adversaries: entry.adversaries,
      isUnderReview: entry.isUnderReview,
    })),
  }
}
