import { manifest } from '~/utils/Manifest'
import type { DefiSummaryEntry } from '../getDefiSummaryEntries'
import snapshot from './lstChartsSnapshot.json'

export const LIQUID_STAKING_CHART_SERIES = [
  'apr30',
  'premium',
  'exitDays',
] as const

export type LiquidStakingChartSeries =
  (typeof LIQUID_STAKING_CHART_SERIES)[number]

export interface DefiLiquidStakingChartProject {
  id: string
  name: string
  icon: string
  /** A reference series rather than a tracked protocol: drawn dashed. */
  benchmark?: boolean
}

export interface DefiLiquidStakingCharts {
  /** Last sampled day of the snapshot (UTC date). */
  asOf: string
  projects: DefiLiquidStakingChartProject[]
  /** One entry per sampled day, shared by every series. */
  timestamps: number[]
  /** series -> project id -> one value per timestamp (null = no data). */
  series: Record<LiquidStakingChartSeries, Record<string, (number | null)[]>>
}

// Order of the rows in the charts' legends.
const SNAPSHOT_PROJECT_IDS = ['lido', 'rocketpool', 'etherfi', 'wbeth']

/**
 * The network-average return of all Ethereum validators before any protocol
 * fee, present in the snapshot's `apr30` series only: daily consensus issuance
 * (CoinMetrics) plus MEV-boost payments (relay data APIs, with the unrecorded
 * blocks sampled from an archive node), over the active stake (validator set
 * before Pectra, inverted from the issuance after), 30-day trailing.
 */
export const NETWORK_AVERAGE_BENCHMARK_ID = 'ethereum'

/**
 * A static snapshot of the liquid staking chart series: daily archive-node
 * reads of the protocol contracts and DEX pools plus DeFiLlama prices for
 * wBETH, from 2024-01-01 to the snapshot date. It is not a live feed. In
 * `exitDays` Rocket Pool is 0 on a day its burn buffer holds at least 1 ETH
 * and null on a day it does not. Names and icons come
 * from the summary entries so the charts follow the config, and a project
 * missing from the config is dropped from every series. The network average
 * benchmark is appended last and only to the series that carry it.
 */
export function getDefiLiquidStakingCharts(
  entries: DefiSummaryEntry[],
): DefiLiquidStakingCharts | undefined {
  const entriesById = new Map(entries.map((entry) => [entry.id, entry]))
  const projects = SNAPSHOT_PROJECT_IDS.flatMap(
    (id): DefiLiquidStakingChartProject[] => {
      const entry = entriesById.get(id)
      return entry
        ? [{ id, name: entry.shortName ?? entry.name, icon: entry.icon }]
        : []
    },
  )
  if (projects.length === 0) {
    return undefined
  }

  const rawSeries: Record<
    string,
    Record<string, (number | null)[]>
  > = snapshot.series
  if (rawSeries.apr30?.[NETWORK_AVERAGE_BENCHMARK_ID]) {
    projects.push({
      id: NETWORK_AVERAGE_BENCHMARK_ID,
      name: 'Network average',
      icon: manifest.getUrl('/icons/ethereum.png'),
      benchmark: true,
    })
  }

  const series = Object.fromEntries(
    LIQUID_STAKING_CHART_SERIES.map((key) => [
      key,
      Object.fromEntries(
        projects.flatMap((project) => {
          const values = rawSeries[key]?.[project.id]
          return values ? [[project.id, values]] : []
        }),
      ),
    ]),
  ) as DefiLiquidStakingCharts['series']

  return {
    asOf: snapshot.asOf,
    projects,
    timestamps: snapshot.timestamps,
    series,
  }
}
