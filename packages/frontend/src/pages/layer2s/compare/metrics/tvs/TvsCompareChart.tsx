import { formatCurrency } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { ChartShowsPreviousData } from '~/components/core/chart/ChartPreviousData'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { PROJECT_TVS_CHART_VALUE_KEYS } from '~/server/features/layer2s/tvs/projectTvsChartValues'
import { useTRPC } from '~/trpc/React'
import { formatTimestamp } from '~/utils/dates'
import {
  CompareMetricLineChart,
  toCompareChartPoints,
} from '../../components/CompareMetricLineChart'
import type { CompareMetricChartProps } from '../types'
import { getTvsCompareChartParams } from './tvsCompareMetric'

export function TvsCompareChart({
  projects,
  queryProjects,
  config,
  chartRange,
}: CompareMetricChartProps) {
  const trpc = useTRPC()
  const { data, isLoading, isPlaceholderData } = useChartQuery(
    trpc.tvs.detailedChartWithProjectsRanges,
    getTvsCompareChartParams(queryProjects, config, chartRange),
  )
  const unit = config.tvs.unit
  // Index into `ProjectTvsChartDataPoint`, derived from the shared key order
  // so it can't drift from the server's serialization. Every filter except
  // "all" is itself a value key; "all" compares the total, stored as `value`.
  const valueIndex = PROJECT_TVS_CHART_VALUE_KEYS.indexOf(
    config.tvs.filter === 'all' ? 'value' : config.tvs.filter,
  )

  const chartData = useMemo(
    () =>
      data &&
      toCompareChartPoints(
        data.chart,
        projects,
        ([, ethPrice, valuesByProject], projectId) => {
          const value = valuesByProject[projectId]?.[valueIndex]
          const divider = unit === 'usd' ? 1 : ethPrice
          return value !== undefined && divider !== null && divider !== 0
            ? value / divider
            : null
        },
      ),
    [data, projects, unit, valueIndex],
  )

  return (
    <ChartShowsPreviousData value={isPlaceholderData}>
      <CompareMetricLineChart
        projects={projects}
        data={chartData}
        isLoading={isLoading}
        syncedUntil={data?.syncedUntil}
        formatYAxisLabel={(value) => formatCurrency(value, unit)}
        formatTooltipValue={(value) => formatCurrency(value, unit)}
        renderTooltipTimestamp={(label) =>
          formatTimestamp(label, {
            mode: 'datetime',
          })
        }
      />
    </ChartShowsPreviousData>
  )
}
