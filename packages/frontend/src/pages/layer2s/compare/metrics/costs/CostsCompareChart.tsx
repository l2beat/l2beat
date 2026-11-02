import { UnixTime } from '@l2beat/shared-pure'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { ChartShowsPreviousData } from '~/components/core/chart/ChartPreviousData'
import { formatCostValue } from '~/pages/layer2s/costs/utils/formatCostValue'
import { useTRPC } from '~/trpc/React'
import { formatRange } from '~/utils/dates'
import { rangeToResolution } from '~/utils/range/range'
import {
  CompareMetricLineChart,
  toCompareChartPoints,
} from '../../components/CompareMetricLineChart'
import type { CompareMetricChartProps } from '../types'
import { getCostsCompareChartParams } from './costsCompareMetric'

const UNIT_INDEX = { gas: 0, eth: 1, usd: 2 } as const

export function CostsCompareChart({
  projects,
  queryProjects,
  config,
  chartRange,
}: CompareMetricChartProps) {
  const trpc = useTRPC()
  const { data, isLoading, isPlaceholderData } = useQuery(
    trpc.costs.detailedChartWithProjectsRanges.queryOptions(
      getCostsCompareChartParams(queryProjects, chartRange),
      { placeholderData: keepPreviousData },
    ),
  )
  const unit = config.costs.unit

  const chartData = useMemo(
    () =>
      data &&
      toCompareChartPoints(
        data.chart,
        projects,
        ([, valuesByProject], id) =>
          valuesByProject[id]?.[UNIT_INDEX[unit]] ?? null,
      ),
    [data, projects, unit],
  )

  const resolution = rangeToResolution(chartRange)

  return (
    <ChartShowsPreviousData value={isPlaceholderData}>
      <CompareMetricLineChart
        projects={projects}
        data={chartData}
        isLoading={isLoading}
        syncedUntil={data?.syncedUntil}
        formatYAxisLabel={(value) => formatCostValue(value, unit)}
        formatTooltipValue={(value) => formatCostValue(value, unit)}
        renderTooltipTimestamp={(label) =>
          formatRange(label, label + UnixTime.periodToSeconds(resolution))
        }
      />
    </ChartShowsPreviousData>
  )
}
