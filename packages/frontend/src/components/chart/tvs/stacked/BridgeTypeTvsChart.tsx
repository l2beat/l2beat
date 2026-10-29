import type { Milestone } from '@l2beat/config'
import { formatCurrency } from '@l2beat/shared-pure'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type {
  ChartMeta,
  ChartProject,
} from '~/components/core/chart/ChartContext'
import {
  type ChartSeries,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import type { ChartUnit } from '../../types'
import { StackedTvsChartTooltip } from './StackedTvsChartTooltip'

interface BridgeTypeChartDataPoint {
  timestamp: number
  native: number | null
  canonical: number | null
  external: number | null
}

interface Props {
  data: BridgeTypeChartDataPoint[] | undefined
  syncedUntil: number | undefined
  milestones: Milestone[]
  unit: ChartUnit
  isLoading: boolean
  dataKeys: (keyof typeof bridgeTypeTvsChartMeta)[]
  toggleDataKey: (dataKey: string) => void
  tickCount?: number
  project?: ChartProject
}

export const bridgeTypeTvsChartMeta = {
  canonical: {
    label: 'Canonically bridged',
    color: 'var(--chart-stacked-purple)',
    indicatorType: { shape: 'square' },
  },
  native: {
    label: 'Natively minted',
    color: 'var(--chart-stacked-pink)',
    indicatorType: { shape: 'square' },
  },
  external: {
    label: 'Externally bridged',
    color: 'var(--chart-stacked-yellow)',
    indicatorType: { shape: 'square' },
  },
} satisfies ChartMeta

type SeriesKey = keyof typeof bridgeTypeTvsChartMeta

export function BridgeTypeTvsChart({
  data,
  syncedUntil,
  milestones,
  unit,
  isLoading,
  tickCount,
  dataKeys,
  toggleDataKey,
  project,
}: Props) {
  // Bottom of the stack first.
  const series: ChartSeries<SeriesKey, BridgeTypeChartDataPoint>[] = (
    ['external', 'native', 'canonical'] as const
  ).map((key) => ({
    key,
    fill: bridgeTypeTvsChartMeta[key].color,
    stack: true,
  }))

  // If only one data key is selected we want to change the domain
  // Having it from 0 to MAX does make sense for stacked chart (better comparison)
  // But for single data source it should not start from 0
  return (
    <ChartContainer
      data={data}
      meta={bridgeTypeTvsChartMeta}
      isLoading={isLoading}
      milestones={milestones}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
      project={project}
      legend
    >
      <TimeSeriesChart
        data={data}
        series={series}
        ariaLabel="Value secured by bridge type"
        syncedUntil={syncedUntil}
        yAxis={{
          domain: 'autoIfSingle',
          format: (value) => formatCurrency(value, unit),
          tickCount,
        }}
        renderTooltip={(row, keys) => (
          <StackedTvsChartTooltip row={row} keys={keys} unit={unit} />
        )}
      />
    </ChartContainer>
  )
}
