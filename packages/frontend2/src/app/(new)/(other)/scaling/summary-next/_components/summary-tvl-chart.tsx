'use client'

import { type Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { useCookieState } from '~/hooks/use-cookie-state'
import { type ScalingSummaryEntry } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { type TvlLayer2ProjectFilter } from '~/server/features/scaling/tvl/utils/project-filter-utils'
import { api } from '~/trpc/react'
import {
  useScalingFilter,
  useScalingFilterValues,
} from '../../../_components/scaling-filter-context'
import { TvlChart } from '../../../_components/tvl-chart'

type Props = {
  milestones: Milestone[]
  entries: ScalingSummaryEntry[]
}

export function SummaryTvlChart({ entries, milestones }: Props) {
  const filters = useScalingFilterValues()
  const includeFilter = useScalingFilter()
  const [timeRange, setTimeRange] = useCookieState('scalingTvlChartRange')

  const chartDataType = useMemo<TvlLayer2ProjectFilter>(() => {
    if (filters.isEmpty) {
      return { type: 'layer2' }
    }

    return {
      type: 'projects',
      projectIds: entries.filter(includeFilter).map((project) => project.id),
    }
  }, [entries, filters, includeFilter])

  const scalingSummaryQuery = api.scaling.summary.chart.useQuery({
    range: timeRange,
    excludeAssociatedTokens: filters.excludeAssociatedTokens,
    ...chartDataType,
  })

  const { data } = scalingSummaryQuery

  return (
    <TvlChart
      data={data}
      tag="scaling-summary"
      timeRange={timeRange}
      milestones={milestones}
      setTimeRange={setTimeRange}
    />
  )
}
