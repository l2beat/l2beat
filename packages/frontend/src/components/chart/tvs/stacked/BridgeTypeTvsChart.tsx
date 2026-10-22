import type { Milestone } from '@l2beat/config'
import { formatCurrency } from '@l2beat/shared-pure'
import { Area, AreaChart } from 'recharts'
import type { ChartMeta, ChartProject } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
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
    >
      {/* Without right:1 the chart last point is not hoverable for some reason */}
      <AreaChart responsive data={data} margin={{ top: 20, right: 1 }}>
        <ChartLegend content={<ChartLegendContent />} />
        <ChartCommonComponents
          data={data}
          isLoading={isLoading}
          yAxis={{
            domain: dataKeys.length === 1 ? ['auto', 'auto'] : undefined,
            tickFormatter: (value: number) => formatCurrency(value, unit),
            tickCount,
          }}
          syncedUntil={syncedUntil}
        />
        <Area
          dataKey="external"
          hide={!dataKeys.includes('external')}
          fill={bridgeTypeTvsChartMeta.external.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId={dataKeys.length === 1 ? undefined : 'a'}
          isAnimationActive={false}
          activeDot={
            !dataKeys.includes('canonical') && !dataKeys.includes('native')
          }
        />
        <Area
          dataKey="native"
          hide={!dataKeys.includes('native')}
          fill={bridgeTypeTvsChartMeta.native.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId={dataKeys.length === 1 ? undefined : 'a'}
          isAnimationActive={false}
          activeDot={!dataKeys.includes('canonical')}
        />
        <Area
          dataKey="canonical"
          hide={!dataKeys.includes('canonical')}
          fill={bridgeTypeTvsChartMeta.canonical.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId={dataKeys.length === 1 ? undefined : 'a'}
          isAnimationActive={false}
        />

        <ChartTooltip
          content={
            <StackedTvsChartTooltip unit={unit} meta={bridgeTypeTvsChartMeta} />
          }
          filterNull={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
