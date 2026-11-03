import { UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
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
  const { data, isLoading, isPlaceholderData } = useChartQuery(
    trpc.costs.detailedChartWithProjectsRanges,
    getCostsCompareChartParams(queryProjects, chartRange),
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
    <CompareMetricLineChart
      isPlaceholderData={isPlaceholderData}
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
  )
}
