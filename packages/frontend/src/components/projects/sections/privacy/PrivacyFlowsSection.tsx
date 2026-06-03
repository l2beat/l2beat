import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { ChartScale } from '~/components/chart/types'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { PrivacyFlowChart } from '~/pages/privacy/project/components/PrivacyFlowChart'
import { PrivacyFlowsChartRangeControls } from '~/pages/privacy/project/components/PrivacyFlowsChartRangeControls'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface PrivacyFlowsSectionProps extends ProjectSectionProps {
  defaultRange: ChartRange
  project: ChartProject
}

type FlowsMetric = 'count' | 'value'

export function PrivacyFlowsSection({
  defaultRange,
  project,
  ...projectSectionProps
}: PrivacyFlowsSectionProps) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [metric, setMetric] = useState<FlowsMetric>('count')
  const [scale, setScale] = useState<ChartScale>('linear')
  const { data, isLoading } = useQuery(
    trpc.privacy.flowsChart.queryOptions({
      projectIds: [project.id],
      range,
    }),
  )

  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        data?.chart.map(([timestamp]) => ({ timestamp })),
      ),
    [data],
  )

  return (
    <ProjectSection {...projectSectionProps}>
      <ChartControlsWrapper className="mb-4">
        <ProjectChartTimeRange timeRange={timeRange} />
        <PrivacyFlowsChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
      <PrivacyFlowChart
        data={data?.chart}
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
        metric={metric}
        scale={scale}
        project={project}
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
