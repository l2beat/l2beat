import { formatCurrency } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTRPC } from '~/trpc/React'
import { formatTimestamp } from '~/utils/dates'
import { CompareMetricLineChart } from '../../components/CompareMetricLineChart'
import type { CompareTvsFilter } from '../../utils/compareChartState'
import type { CompareChartPoint } from '../../utils/toIndexedChartData'
import type { CompareMetricChartProps } from '../types'
import { getTvsCompareChartParams } from './getTvsCompareChartParams'

/** Indices into `ProjectTvsChartDataPoint` for each TVS filter. */
const TVS_FILTER_VALUE_INDEX: Record<CompareTvsFilter, number> = {
  all: 0,
  canonical: 1,
  external: 2,
  native: 3,
}

export function TvsCompareChart({ projects, state }: CompareMetricChartProps) {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.tvs.detailedChartWithProjectsRanges.queryOptions(
      getTvsCompareChartParams(projects, state),
    ),
  )
  const unit = state.tvsUnit
  const valueIndex = TVS_FILTER_VALUE_INDEX[state.tvsFilter]

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, ethPrice, valuesByProject]) => {
        const point: CompareChartPoint = { timestamp }
        const divider = unit === 'usd' ? 1 : ethPrice
        for (const project of projects) {
          const value = valuesByProject[project.id]?.[valueIndex]
          point[project.id] =
            value !== undefined && divider !== null && divider !== 0
              ? value / divider
              : null
        }
        return point
      }),
    [data, projects, unit, valueIndex],
  )

  return (
    <CompareMetricLineChart
      projects={projects}
      data={chartData}
      isLoading={isLoading}
      syncedUntil={data?.syncedUntil}
      scale={state.scale}
      mode={state.mode}
      formatYAxisLabel={(value) => formatCurrency(value, unit)}
      formatTooltipValue={(value) => formatCurrency(value, unit)}
      renderTooltipTimestamp={(label) =>
        formatTimestamp(label, {
          longMonthName: true,
          mode: 'datetime',
        })
      }
    />
  )
}
