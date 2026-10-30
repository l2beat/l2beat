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

interface TokenCategoryTvsChartDataPoint {
  timestamp: number
  ether: number | null
  stablecoin: number | null
  btc: number | null
  other: number | null
}

interface Props {
  data: TokenCategoryTvsChartDataPoint[] | undefined
  syncedUntil: number | undefined
  dataKeys: (keyof typeof assetCategoryTvsChartMeta)[]
  toggleDataKey: (dataKey: string) => void
  milestones: Milestone[]
  unit: ChartUnit
  isLoading: boolean
  tickCount?: number
  project?: ChartProject
  excludeRwaRestrictedTokens: boolean
}

export const assetCategoryTvsChartMeta = {
  ether: {
    label: 'ETH & derivatives',
    color: 'var(--chart-ethereum)',
    indicatorType: { shape: 'square' },
  },
  stablecoin: {
    label: 'Stablecoins',
    color: 'var(--chart-teal)',
    indicatorType: { shape: 'square' },
  },
  btc: {
    label: 'BTC & derivatives',
    color: 'var(--chart-orange)',
    indicatorType: { shape: 'square' },
  },
  other: {
    label: 'Other',
    color: 'var(--chart-yellow-lime)',
    indicatorType: { shape: 'square' },
  },
  rwaPublic: {
    label: 'Public RWAs',
    color: 'var(--color-lime-650)',
    indicatorType: { shape: 'square' },
  },
  rwaRestricted: {
    label: 'Restricted RWAs',
    color: 'var(--color-pink-750)',
    indicatorType: { shape: 'square' },
  },
} satisfies ChartMeta

export function AssetCategoryTvsChart({
  data,
  syncedUntil,
  milestones,
  unit,
  isLoading,
  tickCount,
  dataKeys,
  toggleDataKey,
  project,
  excludeRwaRestrictedTokens,
}: Props) {
  // If only one data key is selected we want to change the domain
  // Having it from 0 to MAX does make sense for stacked chart (better comparison)
  // But for single one it should not start from 0
  return (
    <ChartContainer
      data={data}
      meta={assetCategoryTvsChartMeta}
      isLoading={isLoading}
      milestones={milestones}
      project={project}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
    >
      {/* Without right:1 the chart last point is not hoverable for some reason */}
      <AreaChart responsive data={data} margin={{ top: 20, right: 1 }}>
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="rwaPublic"
          hide={!dataKeys.includes('rwaPublic')}
          fill={assetCategoryTvsChartMeta.rwaPublic.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId={dataKeys.length === 1 ? undefined : 'a'}
          isAnimationActive={false}
        />
        {!excludeRwaRestrictedTokens && (
          <Area
            dataKey="rwaRestricted"
            hide={!dataKeys.includes('rwaRestricted')}
            fill={assetCategoryTvsChartMeta.rwaRestricted.color}
            fillOpacity={1}
            strokeWidth={0}
            stackId={dataKeys.length === 1 ? undefined : 'a'}
            isAnimationActive={false}
          />
        )}
        <Area
          dataKey="other"
          hide={!dataKeys.includes('other')}
          fill={assetCategoryTvsChartMeta.other.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId={dataKeys.length === 1 ? undefined : 'a'}
          isAnimationActive={false}
          activeDot={
            !dataKeys.includes('ether') &&
            !dataKeys.includes('stablecoin') &&
            !dataKeys.includes('btc')
          }
        />
        <Area
          dataKey="btc"
          hide={!dataKeys.includes('btc')}
          fill={assetCategoryTvsChartMeta.btc.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId={dataKeys.length === 1 ? undefined : 'a'}
          isAnimationActive={false}
          activeDot={
            !dataKeys.includes('ether') && !dataKeys.includes('stablecoin')
          }
        />
        <Area
          dataKey="stablecoin"
          hide={!dataKeys.includes('stablecoin')}
          fill={assetCategoryTvsChartMeta.stablecoin.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId={dataKeys.length === 1 ? undefined : 'a'}
          isAnimationActive={false}
          activeDot={!dataKeys.includes('ether')}
        />
        <Area
          dataKey="ether"
          hide={!dataKeys.includes('ether')}
          fill={assetCategoryTvsChartMeta.ether.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId={dataKeys.length === 1 ? undefined : 'a'}
          isAnimationActive={false}
        />
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
        <ChartTooltip
          content={
            <StackedTvsChartTooltip
              unit={unit}
              meta={assetCategoryTvsChartMeta}
            />
          }
          filterNull={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
