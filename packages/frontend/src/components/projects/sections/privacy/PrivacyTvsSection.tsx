import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { PrivacyFlowsChartRangeControls } from '~/pages/privacy/project/components/PrivacyFlowsChartRangeControls'
import { PrivacyTvsChart } from '~/pages/privacy/summary/components/PrivacyTvsChart'
import { api } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface PrivacyTvsSectionProps extends ProjectSectionProps {
  defaultRange: ChartRange
  project: ChartProject
}

export function PrivacyTvsSection({
  defaultRange,
  project,
  ...projectSectionProps
}: PrivacyTvsSectionProps) {
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const { data, isLoading } = api.privacy.tvsChart.useQuery({
    projectIds: [project.id],
    range,
  })

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, value]) => ({
        timestamp,
        value,
      })),
    [data],
  )

  const timeRange = useMemo(
    () => getChartTimeRangeFromData(chartData),
    [chartData],
  )

  return (
    <ProjectSection {...projectSectionProps}>
      <ChartControlsWrapper>
        <ProjectChartTimeRange timeRange={timeRange} />
        <PrivacyFlowsChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
      <PrivacyTvsChart
        data={chartData}
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
      />
    </ProjectSection>
  )
}
