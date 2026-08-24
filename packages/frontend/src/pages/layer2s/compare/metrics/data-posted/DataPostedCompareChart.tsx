import { formatBytes, UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTRPC } from '~/trpc/React'
import { formatRange } from '~/utils/dates'
import {
  CompareMetricLineChart,
  toCompareChartPoints,
} from '../../components/CompareMetricLineChart'
import type { CompareMetricChartProps } from '../types'
import { getDataPostedCompareChartParams } from './dataPostedCompareMetric'

export function DataPostedCompareChart({
  projects,
  queryProjects,
  chartRange,
}: CompareMetricChartProps) {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.da.detailedChartWithProjectsRanges.queryOptions(
      getDataPostedCompareChartParams(queryProjects, chartRange),
    ),
  )

  const chartData = useMemo(
    () =>
      data &&
      // Projects without DA tracking are absent from the response and stay
      // null, so they never render as an empty/zero series.
      toCompareChartPoints(
        data.chart,
        projects,
        ([, valuesByProject], id) => valuesByProject[id] ?? null,
      ),
    [data, projects],
  )

  return (
    <CompareMetricLineChart
      projects={projects}
      data={chartData}
      isLoading={isLoading}
      syncedUntil={data?.syncedUntil}
      formatYAxisLabel={(value) => formatBytes(value)}
      formatTooltipValue={(value) => formatBytes(value)}
      renderTooltipTimestamp={(label) =>
        formatRange(label, label + UnixTime.DAY)
      }
    />
  )
}
