import type { WarningWithSentiment } from '@l2beat/config'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { PrivacyFlowsChartRangeControls } from '~/pages/privacy/project/components/PrivacyFlowsChartRangeControls'
import { PrivacyTvlChart } from '~/pages/privacy/summary/components/PrivacyTvlChart'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { sentimentToWarningBarColor, WarningBar } from '../../../WarningBar'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface PrivacyTvlSectionProps extends ProjectSectionProps {
  defaultRange: ChartRange
  project: ChartProject
  warnings?: WarningWithSentiment[]
}

export function PrivacyTvlSection({
  defaultRange,
  project,
  warnings,
  ...projectSectionProps
}: PrivacyTvlSectionProps) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const { data, isLoading } = useQuery(
    trpc.privacy.tvlChart.queryOptions({
      projectIds: [project.id],
      range,
    }),
  )

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, valuesByProject]) => ({
        timestamp,
        value: valuesByProject[project.id] ?? 0,
      })),
    [data, project.id],
  )

  const timeRange = useMemo(
    () => getChartTimeRangeFromData(chartData),
    [chartData],
  )

  return (
    <ProjectSection {...projectSectionProps}>
      {warnings?.map((warning, i) => (
        <WarningBar
          key={`tvs-warning-${i}`}
          icon={RoundedWarningIcon}
          text={warning.value}
          color={sentimentToWarningBarColor(warning.sentiment)}
          className="mb-4"
        />
      ))}
      <ChartControlsWrapper className="mb-4">
        <ProjectChartTimeRange timeRange={timeRange} />
        <PrivacyFlowsChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
      <PrivacyTvlChart
        data={chartData}
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
      />
    </ProjectSection>
  )
}
