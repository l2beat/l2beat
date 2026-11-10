import type { Milestone } from '@l2beat/config'
import { useEffect, useMemo, useState } from 'react'
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
import { useRouter } from '~/hooks/useRouter'
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
  /** The project's tracked chains, each with its page. */
  chains: (SectionChain & { href: string })[]
  /** The chain of the page this section is on. */
  pageChain: string
}

/**
 * Value locked in a project that has a page per tracked chain. Its chain
 * field follows the page's chain tabs both ways: it shows the page's chain,
 * and picking another one opens that chain's page at this section. The page
 * has no tab for all chains, so that choice only changes the chart.
 */
export function PrivacyValueLockedSection({
  defaultRange,
  project,
  milestones,
  chains,
  pageChain,
  ...projectSectionProps
}: PrivacyValueLockedSectionProps) {
  const trpc = useTRPC()
  const router = useRouter()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [chain, setChain] = useState(pageChain)
  // Picking a chain opens its page at this section. The sections above are
  // still settling their height when the browser jumps there, so it can stop
  // short of the section or past it.
  useEffect(() => {
    if (window.location.hash === `#${projectSectionProps.id}`) {
      document
        .getElementById(projectSectionProps.id)
        ?.scrollIntoView({ behavior: 'instant' })
    }
  }, [projectSectionProps.id])
  const selectChain = (value: string) => {
    const page = chains.find((c) => c.id === value)
    if (page && page.id !== pageChain) {
      router.push(`${page.href}#${projectSectionProps.id}`)
      return
    }
    setChain(value)
  }
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
        <Select value={chain} onValueChange={selectChain}>
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
