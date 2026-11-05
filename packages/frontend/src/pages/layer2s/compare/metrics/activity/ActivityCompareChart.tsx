import { formatActivityCount, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { countPerSecond } from '~/server/features/layer2s/activity/utils/countPerSecond'
import { useTRPC } from '~/trpc/React'
import { formatRange } from '~/utils/dates'
import {
  CompareMetricLineChart,
  toCompareChartPoints,
} from '../../components/CompareMetricLineChart'
import type { CompareMetricChartProps } from '../types'
import { getActivityCompareChartParams } from './activityCompareMetric'

export function ActivityCompareChart({
  projects,
  queryProjects,
  config,
  chartRange,
}: CompareMetricChartProps) {
  const trpc = useTRPC()
  const { data, isLoading, isPlaceholderData } = useChartQuery(
    trpc.activity.detailedChartWithProjectsRanges,
    getActivityCompareChartParams(queryProjects, chartRange),
  )
  const unit = config.activity.unit

  const chartData = useMemo(
    () =>
      data &&
      toCompareChartPoints(data.chart, projects, ([, valuesByProject], id) => {
        const values = valuesByProject[id]
        return values
          ? countPerSecond(unit === 'tps' ? values[0] : values[1])
          : null
      }),
    [data, projects, unit],
  )

  return (
    <CompareMetricLineChart
      isPlaceholderData={isPlaceholderData}
      projects={projects}
      data={chartData}
      isLoading={isLoading}
      syncedUntil={data?.syncedUntil}
      formatYAxisLabel={(value) => formatActivityCount(value)}
      formatTooltipValue={(value) =>
        `${formatActivityCount(value)} ${unit.toUpperCase()}`
      }
      renderTooltipTimestamp={(label) =>
        formatRange(label, label + UnixTime.DAY)
      }
    />
  )
}
