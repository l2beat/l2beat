import type { DefiSummaryEntry } from '../getDefiSummaryEntries'
import snapshot from './lstChartsSnapshot.json'

export const LIQUID_STAKING_CHART_SERIES = [
  'apr30',
  'premium',
  'liquidShare',
  'liquidEth',
  'netFlow',
  'exitDays',
] as const

export type LiquidStakingChartSeries =
  (typeof LIQUID_STAKING_CHART_SERIES)[number]

export interface DefiLiquidStakingChartProject {
  id: string
  name: string
  icon: string
}

export interface DefiLiquidStakingCharts {
  /** Last sampled day of the snapshot (UTC date). */
  asOf: string
  /** First sampled day of the snapshot (UTC date). */
  fromDate: string
  /** Block the last sample was read at. */
  headBlock: number
  projects: DefiLiquidStakingChartProject[]
  /** One entry per sampled day, shared by every series. */
  timestamps: number[]
  /** series -> project id -> one value per timestamp (null = no data). */
  series: Record<LiquidStakingChartSeries, Record<string, (number | null)[]>>
}

// Order of the rows in the charts' legends.
const SNAPSHOT_PROJECT_IDS = ['lido', 'rocketpool', 'etherfi', 'wbeth']

/**
 * A static snapshot of the liquid staking chart series: daily archive-node
 * reads of the protocol contracts and DEX pools plus event scans, from
 * 2024-01-01 to the snapshot date. It is not a live feed. Names and icons come
 * from the summary entries so the charts follow the config, and a project
 * missing from the config is dropped from every series.
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
    fromDate: snapshot.fromDate,
    headBlock: snapshot.headBlock,
    projects,
    timestamps: snapshot.timestamps,
    series,
  }
}
