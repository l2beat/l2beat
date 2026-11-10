import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import type { ChartScale } from '~/components/chart/types'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { PrivacyFlowChart } from '~/pages/privacy/project/components/PrivacyFlowChart'
import { PrivacyFlowsChartRangeControls } from '~/pages/privacy/project/components/PrivacyFlowsChartRangeControls'
import { useTRPC } from '~/trpc/React'
import { type ChartRange, rangeToResolution } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface PrivacyFlowsSectionProps extends ProjectSectionProps {
  defaultRange: ChartRange
  project: ChartProject
  milestones: Milestone[]
}

type FlowsMetric = 'count' | 'value'

export function PrivacyFlowsSection({
  defaultRange,
  project,
  milestones,
  ...projectSectionProps
}: PrivacyFlowsSectionProps) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [metric, setMetric] = useState<FlowsMetric>('count')
  const [scale, setScale] = useState<ChartScale>('linear')
  const { data, isLoading, isPlaceholderData, shownInput } = useChartQuery(
    trpc.privacy.flowsChart,
    {
      projectIds: [project.id],
      range,
      chain: projectSectionProps.chain?.id,
    },
  )
  const resolution = rangeToResolution(shownInput.range)

  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        data?.chart.map(([timestamp]) => ({ timestamp })),
        { bucket: resolution },
      ),
    [data, resolution],
  )

  return (
    <ProjectSection {...projectSectionProps}>
      <ChartControlsWrapper className="mb-4">
        <ProjectChartTimeRange
          isPlaceholderData={isPlaceholderData}
          timeRange={timeRange}
        />
        <PrivacyFlowsChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
      <PrivacyFlowChart
        isPlaceholderData={isPlaceholderData}
        data={data?.chart}
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
        metric={metric}
        resolution={resolution}
        scale={scale}
        project={project}
        milestones={milestones}
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-[120px]" />
            <Skeleton className="h-8 w-[91px] md:w-[95px]" />
          </>
        ) : (
          <>
            <RadioGroup
              name="privacyFlowsMetric"
              value={metric}
              onValueChange={(value) => setMetric(value as FlowsMetric)}
            >
              <RadioGroupItem value="count">COUNT</RadioGroupItem>
              <RadioGroupItem value="value">USD</RadioGroupItem>
            </RadioGroup>
            <RadioGroup
              name="privacyFlowsScale"
              value={scale}
              onValueChange={(value) => setScale(value as ChartScale)}
            >
              <RadioGroupItem value="symlog">LOG</RadioGroupItem>
              <RadioGroupItem value="linear">LIN</RadioGroupItem>
            </RadioGroup>
          </>
        )}
      </div>
    </ProjectSection>
  )
}
