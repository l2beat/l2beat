import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTRPC } from '~/trpc/React'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { CompareMetricLineChart } from '../../components/CompareMetricLineChart'
import type { CompareChartPoint } from '../../utils/toIndexedChartData'
import type { CompareMetricChartProps } from '../types'
import { getTvsCompareChartParams } from './getTvsCompareChartParams'

export function TvsCompareChart({ projects, state }: CompareMetricChartProps) {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.tvs.detailedChartWithProjectsRanges.queryOptions(
      getTvsCompareChartParams(projects, state.chartRange),
    ),
  )

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, _ethPrice, valuesByProject]) => {
        const point: CompareChartPoint = { timestamp }
        for (const project of projects) {
          point[project.id] = valuesByProject[project.id]?.[0] ?? null
        }
        return point
      }),
    [data, projects],
  )

  return (
    <CompareMetricLineChart
      projects={projects}
      data={chartData}
      isLoading={isLoading}
      syncedUntil={data?.syncedUntil}
      scale={state.scale}
      mode={state.mode}
      formatYAxisLabel={(value) => formatCurrency(value, 'usd')}
      formatTooltipValue={(value) => formatCurrency(value, 'usd')}
      renderTooltipTimestamp={(label) =>
        formatTimestamp(label, {
          longMonthName: true,
          mode: 'datetime',
        })
      }
    />
  )
}
