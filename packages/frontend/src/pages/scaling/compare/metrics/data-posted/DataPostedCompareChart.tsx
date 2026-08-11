import { formatBytes, UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTRPC } from '~/trpc/React'
import { formatRange } from '~/utils/dates'
import {
  type CompareChartPoint,
  CompareMetricLineChart,
} from '../../components/CompareMetricLineChart'
import type { CompareMetricChartProps } from '../types'
import { getDataPostedCompareChartParams } from './getDataPostedCompareChartParams'

export function DataPostedCompareChart({
  projects,
  state,
}: CompareMetricChartProps) {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.da.detailedChartWithProjectsRanges.queryOptions(
      getDataPostedCompareChartParams(projects, state.chartRange),
    ),
  )

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, valuesByProject]) => {
        const point: CompareChartPoint = { timestamp }
        for (const project of projects) {
          // Projects without DA tracking are absent from the response and
          // stay null, so they never render as an empty/zero series.
          point[project.id] = valuesByProject[project.id] ?? null
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
      formatYAxisLabel={(value) => formatBytes(value)}
      formatTooltipValue={(value) => formatBytes(value)}
      renderTooltipTimestamp={(label) =>
        formatRange(label, label + UnixTime.DAY)
      }
    />
  )
}
