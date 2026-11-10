import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { TvsValueChart } from '~/components/chart/tvs/TvsValueChart'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { PrivacyFlowsChartRangeControls } from '~/pages/privacy/project/components/PrivacyFlowsChartRangeControls'
import { useTRPC } from '~/trpc/React'
import { type ChartRange, rangeToResolution } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { SectionChain } from '../SectionChainBadge'
import type { ProjectSectionProps } from '../types'

const ALL_CHAINS = 'all'

export interface PrivacyValueLockedSectionProps extends ProjectSectionProps {
  defaultRange: ChartRange
  project: ChartProject
  milestones: Milestone[]
  /** The project's tracked chains, any of which the chart can show. */
  chains: SectionChain[]
  /** The chain of the page, shown first. */
  defaultChain: string
}

/**
 * Value locked in a project that has a page per tracked chain. The chart has
 * its own chain field, so a reader can compare chains without leaving the page.
 */
export function PrivacyValueLockedSection({
  defaultRange,
  project,
  milestones,
  chains,
  defaultChain,
  ...projectSectionProps
}: PrivacyValueLockedSectionProps) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [chain, setChain] = useState(defaultChain)
  const { data, isLoading, isPlaceholderData, shownInput } = useChartQuery(
    trpc.privacy.valueLockedChart,
    {
      projectId: project.id,
      range,
      chain: chain === ALL_CHAINS ? undefined : chain,
    },
  )

  const chartData = useMemo(
    () => data?.chart.map(([timestamp, value]) => ({ timestamp, value })),
    [data],
  )
  const timeRange = useMemo(
    () => getChartTimeRangeFromData(chartData),
    [chartData],
  )

  return (
    <ProjectSection
      {...projectSectionProps}
      headerAccessory={
        <Select value={chain} onValueChange={setChain}>
          <SelectTrigger aria-label="Chain">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CHAINS}>All chains</SelectItem>
            {chains.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                <span className="flex items-center gap-2">
                  <img
                    src={option.iconUrl}
                    alt=""
                    width={16}
                    height={16}
                    className="size-4 rounded-full bg-pure-white"
                  />
                  {option.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      <ChartControlsWrapper className="mb-4">
        <ProjectChartTimeRange
          isPlaceholderData={isPlaceholderData}
          timeRange={timeRange}
        />
        <PrivacyFlowsChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
      <TvsValueChart
        isPlaceholderData={isPlaceholderData}
        resolution={rangeToResolution(shownInput.range)}
        data={chartData}
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
        project={project}
        milestones={milestones}
      />
    </ProjectSection>
  )
}
