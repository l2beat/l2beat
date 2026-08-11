import { UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { formatCostValue } from '~/pages/scaling/costs/utils/formatCostValue'
import { useTRPC } from '~/trpc/React'
import { formatRange } from '~/utils/dates'
import { rangeToResolution } from '~/utils/range/range'
import {
  type CompareChartPoint,
  CompareMetricLineChart,
} from '../../components/CompareMetricLineChart'
import type { CompareMetricChartProps } from '../types'
import { getCostsCompareChartParams } from './getCostsCompareChartParams'

const UNIT_INDEX = { gas: 0, eth: 1, usd: 2 } as const

export function CostsCompareChart({
  projects,
  state,
}: CompareMetricChartProps) {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.costs.detailedChartWithProjectsRanges.queryOptions(
      getCostsCompareChartParams(projects, state.chartRange),
    ),
  )
  const unit = state.costsUnit

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, valuesByProject]) => {
        const point: CompareChartPoint = { timestamp }
        for (const project of projects) {
          const values = valuesByProject[project.id]
          point[project.id] = values ? values[UNIT_INDEX[unit]] : null
        }
        return point
      }),
    [data, projects, unit],
  )

  const resolution = rangeToResolution(state.chartRange)

  return (
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
  )
}
