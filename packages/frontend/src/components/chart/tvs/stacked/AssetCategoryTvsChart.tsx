import type { Milestone } from '@l2beat/config'
import { formatCurrency } from '@l2beat/shared-pure'
import omit from 'lodash/omit'
import { useMemo } from 'react'
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

type SeriesKey = keyof typeof assetCategoryTvsChartMeta

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
  const meta = useMemo(
    () =>
      excludeRwaRestrictedTokens
        ? omit(assetCategoryTvsChartMeta, 'rwaRestricted')
        : assetCategoryTvsChartMeta,
    [excludeRwaRestrictedTokens],
  )
  // Bottom of the stack first. The RWA series get an active dot even below
  // the top of the stack.
  const seriesKeys: { key: SeriesKey; activeDot?: boolean }[] = [
    { key: 'rwaPublic', activeDot: true },
    ...(excludeRwaRestrictedTokens
      ? []
      : [{ key: 'rwaRestricted' as const, activeDot: true }]),
    { key: 'other' },
    { key: 'btc' },
    { key: 'stablecoin' },
    { key: 'ether' },
  ]
  const series: ChartSeries<SeriesKey, TokenCategoryTvsChartDataPoint>[] =
    seriesKeys.map(({ key, activeDot }) => ({
      key,
      fill: assetCategoryTvsChartMeta[key].color,
      stack: true,
      activeDot,
    }))

  // If only one data key is selected we want to change the domain
  // Having it from 0 to MAX does make sense for stacked chart (better comparison)
  // But for single one it should not start from 0
  return (
    <ChartContainer
      data={data}
      meta={meta}
      isLoading={isLoading}
      milestones={milestones}
      project={project}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
      legend
    >
      <TimeSeriesChart
        data={data}
        series={series}
        ariaLabel="Value secured by asset category"
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
