import type { Milestone } from '@l2beat/config'
import { type ReactNode, useMemo } from 'react'
import { TvsValueChart } from '~/components/chart/tvs/TvsValueChart'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { type ChartRange, rangeToResolution } from '~/utils/range/range'

interface Props {
  data: { timestamp: number; value: number | null }[] | undefined
  syncedUntil: number | undefined
  isLoading: boolean
  isPlaceholderData: boolean
  /** The range `data` was fetched with, see `useChartQuery`. */
  shownRange: ChartRange
  rangeControls: ReactNode
  project: ChartProject
  milestones: Milestone[]
}

/** The body of a section charting one project's value, whatever its source. */
export function TvsValueSectionChart({
  data,
  syncedUntil,
  isLoading,
  isPlaceholderData,
  shownRange,
  rangeControls,
  project,
  milestones,
}: Props) {
  const timeRange = useMemo(() => getChartTimeRangeFromData(data), [data])

  return (
    <>
      <ChartControlsWrapper className="mb-4">
        <ProjectChartTimeRange
          isPlaceholderData={isPlaceholderData}
          timeRange={timeRange}
        />
        {rangeControls}
      </ChartControlsWrapper>
      <TvsValueChart
        isPlaceholderData={isPlaceholderData}
        resolution={rangeToResolution(shownRange)}
        data={data}
        syncedUntil={syncedUntil}
        isLoading={isLoading}
        project={project}
        milestones={milestones}
      />
    </>
  )
}
