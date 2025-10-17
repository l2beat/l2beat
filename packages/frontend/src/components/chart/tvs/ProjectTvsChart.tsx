import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import { ProjectChartTimeRange } from '../../core/chart/ChartTimeRange'
import { getChartRange } from '../../core/chart/utils/getChartRangeFromColumns'
import type { ChartUnit } from '../types'
import type { TvsChartDataPoint } from './TvsChart'
import { TvsChart } from './TvsChart'
import { TvsChartTimeRangeControls } from './TvsChartTimeRangeControls'
import { TvsChartUnitControls } from './TvsChartUnitControls'

interface Props {
  project: ChartProject
  milestones: Milestone[]
  defaultRange: TvsChartRange
}

export function ProjectTvsChart({ project, milestones, defaultRange }: Props) {
  const [unit, setUnit] = useState<ChartUnit>('usd')
  const [timeRange, setTimeRange] = useState<TvsChartRange>(defaultRange)

  const { data, isLoading } = api.tvs.chart.useQuery({
    range: { type: timeRange },
    filter: { type: 'projects', projectIds: [project.id] },
    excludeAssociatedTokens: false,
    includeRwaRestrictedTokens: false,
  })

  const chartData: TvsChartDataPoint[] | undefined = data?.chart.map(
    ([timestamp, native, canonical, external, ethPrice]) => {
      const total =
        native !== null && canonical !== null && external !== null
          ? native + canonical + external
          : null
      const divider = unit === 'usd' ? 1 : ethPrice
      return {
        timestamp,
        value:
          total !== null && divider !== null && divider !== 0
            ? total / divider
            : null,
      }
    },
  )

  const chartRange = useMemo(() => getChartRange(chartData), [chartData])

  return (
    <div className="flex flex-col gap-4">
      <ChartControlsWrapper>
        <ProjectChartTimeRange range={chartRange} />
        <div className="flex items-center gap-1">
          <TvsChartUnitControls unit={unit} setUnit={setUnit} />

          <TvsChartTimeRangeControls
            projectSection
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </div>
      </ChartControlsWrapper>
      <TvsChart
        data={chartData}
        project={project}
        unit={unit}
        isLoading={isLoading}
        syncedUntil={data?.syncedUntil}
        milestones={milestones}
        tickCount={4}
      />
    </div>
  )
}
