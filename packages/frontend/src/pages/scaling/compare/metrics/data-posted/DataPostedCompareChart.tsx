import { formatBytes, UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTRPC } from '~/trpc/React'
import { formatRange } from '~/utils/dates'
import { CompareMetricLineChart } from '../../components/CompareMetricLineChart'
import type { CompareChartPoint } from '../../utils/toIndexedChartData'
import type { CompareMetricChartProps } from '../types'
import { getDataPostedCompareChartParams } from './getDataPostedCompareChartParams'

export function DataPostedCompareChart({
  projects,
  state,
}: CompareMetricChartProps) {
  const trpc = useTRPC()
  // Projects without DA tracking never get a series (or a legend entry) -
  // an all-zero line would read as "posts nothing" instead of "not tracked".
  const trackedProjects = useMemo(
    () => projects.filter((project) => project.hasDaTracking),
    [projects],
  )
  const { data, isLoading } = useQuery(
    trpc.da.detailedChartWithProjectsRanges.queryOptions(
      getDataPostedCompareChartParams(trackedProjects, state.chartRange),
    ),
  )

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, valuesByProject]) => {
        const point: CompareChartPoint = { timestamp }
        for (const project of trackedProjects) {
          point[project.id] = valuesByProject[project.id] ?? null
        }
        return point
      }),
    [data, trackedProjects],
  )

  return (
    <CompareMetricLineChart
      projects={trackedProjects}
      data={chartData}
      isLoading={isLoading}
      syncedUntil={data?.syncedUntil}
      scale={state.scale}
      mode={state.mode}
      formatYAxisLabel={(value) => formatBytes(value)}
      formatTooltipValue={(value) => formatBytes(value)}
      renderTooltipTimestamp={(label) =>
        formatRange(label, label + UnixTime.DAY)
      }
    />
  )
}
