import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import type { TvsProjectFilter } from '~/server/features/scaling/tvs/utils/projectFilterUtils'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import type { ChartUnit } from '../../types'
import { StackedTvsChart } from './StackedTvsChart'

interface Props {
  milestones: Milestone[]
  range: TvsChartRange
  unit: ChartUnit
  filter: TvsProjectFilter
  excludeAssociatedTokens: boolean
}

export function ScalingStackedTvsChart({
  milestones,
  unit,
  filter,
  range,
  excludeAssociatedTokens,
}: Props) {
  const { data, isLoading } = api.tvs.detailedChart.useQuery({
    range,
    excludeAssociatedTokens,
    filter,
  })

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, ethPrice, native, canonical, external]) => {
        const divider = unit === 'usd' ? 1 : ethPrice
        return {
          timestamp,
          native:
            native !== null && divider !== null && divider !== 0
              ? native / divider
              : null,
          canonical:
            canonical !== null && divider !== null && divider !== 0
              ? canonical / divider
              : null,
          external:
            external !== null && divider !== null && divider !== 0
              ? external / divider
              : null,
        }
      }),
    [data, unit],
  )

  return (
    <StackedTvsChart
      className="mt-4 mb-3"
      data={chartData}
      milestones={milestones}
      unit={unit}
      isLoading={isLoading}
      syncedUntil={data?.syncedUntil}
    />
  )
}
