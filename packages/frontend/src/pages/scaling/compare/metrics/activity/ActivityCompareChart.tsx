import { UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { countPerSecond } from '~/server/features/scaling/activity/utils/countPerSecond'
import { useTRPC } from '~/trpc/React'
import { formatRange } from '~/utils/dates'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { CompareMetricLineChart } from '../../components/CompareMetricLineChart'
import type { CompareChartPoint } from '../../utils/toIndexedChartData'
import type { CompareMetricChartProps } from '../types'
import { getActivityCompareChartParams } from './getActivityCompareChartParams'

export function ActivityCompareChart({
  projects,
  state,
}: CompareMetricChartProps) {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.activity.detailedChartWithProjectsRanges.queryOptions(
      getActivityCompareChartParams(projects, state.chartRange),
    ),
  )
  const unit = state.activityUnit

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, valuesByProject]) => {
        const point: CompareChartPoint = { timestamp }
        for (const project of projects) {
          const values = valuesByProject[project.id]
          point[project.id] = values
            ? countPerSecond(unit === 'tps' ? values[0] : values[1])
            : null
        }
        return point
      }),
    [data, projects, unit],
  )

  return (
    <CompareMetricLineChart
      projects={projects}
      data={chartData}
      isLoading={isLoading}
      syncedUntil={data?.syncedUntil}
      scale={state.scale}
      mode={state.mode}
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
