import { assertUnreachable } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { useTableFilterContext } from '~/components/table/filters/TableFilterContext'
import { useActivityTimeRangeContext } from '~/pages/scaling/activity/components/ActivityTimeRangeContext'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/getScalingActivityEntries'
import type { ActivityProjectFilter } from '~/server/features/scaling/activity/utils/projectFilterUtils'
import { api } from '~/trpc/React'
import {
  ActivityRatioChart,
  type ActivityRatioChartType,
} from './ActivityRatioChart'

interface Props {
  entries: ScalingActivityEntry[]
  type: ActivityRatioChartType
}

export function ScalingActivityRatioChart({ entries, type }: Props) {
  const { timeRange } = useActivityTimeRangeContext()
  const { state: filters } = useTableFilterContext()

  const chartFilter: ActivityProjectFilter =
    Object.keys(filters).length === 0
      ? {
          type: typeToChartFilterType(type),
        }
      : {
          type: 'projects',
          projectIds: entries.map((project) => project.id),
        }

  const { data, isLoading } = api.activity.ratioChart.useQuery({
    range: { type: timeRange },
    filter: chartFilter,
  })

  const chartData = useMemo(
    () =>
      data?.map(([timestamp, ratio]) => {
        return {
          timestamp,
          ratio,
        }
      }),
    [data],
  )

  return (
    <ActivityRatioChart
      className="mt-4 mb-2"
      data={chartData}
      isLoading={isLoading}
      type={type}
    />
  )
}

function typeToChartFilterType(
  type: ActivityRatioChartType,
): Exclude<ActivityProjectFilter['type'], 'all' | 'projects'> {
  switch (type) {
    case 'Rollups':
      return 'rollups'
    case 'ValidiumsAndOptimiums':
      return 'validiumsAndOptimiums'
    case 'Others':
      return 'others'
    default:
      assertUnreachable(type)
  }
}
