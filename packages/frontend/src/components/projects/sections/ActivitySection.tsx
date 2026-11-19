import type { Milestone, ProjectScalingCategory } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { EthereumActivityChart } from '~/components/chart/activity/EthereumActivityChart'
import { LiveNow } from '~/components/chart/activity/live/LiveNow'
import {
  hasHistory,
  type LiveMetric,
} from '~/components/chart/activity/live/liveMetrics'
import { ProjectLiveActivity } from '~/components/chart/activity/live/ProjectLiveActivity'
import { ChartDataSourceInfo } from '~/components/chart/ChartDataSourceInfo'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { useQueryParam } from '~/hooks/useQueryParam'
import { InfoIcon } from '~/icons/Info'
import type { ActivityMetric } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import { useTRPC } from '~/trpc/React'
import { DEFAULT_LIVE_RANGE } from '~/utils/range/liveRanges'
import type { ChartRange } from '~/utils/range/range'
import { ProjectActivityChart } from '../../chart/activity/ProjectActivityChart'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface ActivitySectionProps extends ProjectSectionProps {
  id: 'activity'
  project: ChartProject
  milestones: Milestone[]
  category?: ProjectScalingCategory
  defaultRange: ChartRange
  dataSource: string | undefined
  /**
   * Whether its blocks are stored as they come, so Live has something to
   * show. Undefined for a chain that has no live view
   */
  live: 'available' | 'unavailable' | undefined
}

export function ActivitySection({
  project,
  milestones,
  category,
  defaultRange,
  dataSource,
  live,
  ...sectionProps
}: ActivitySectionProps) {
  // in the URL, so a link can open the section on Live
  const [viewParam, setViewParam] = useQueryParam('activity', 'history', {
    replaceState: true,
  })
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  // read on, so Live goes and comes back with the blocks
  const { data: status } = useQuery({
    ...trpc.activity.liveStatus.queryOptions({ projectId: project.id }),
    enabled: live !== undefined,
    refetchInterval: 10_000,
  })
  const liveAvailable = status ? status.available : live === 'available'
  const view = liveAvailable && viewParam === 'live' ? 'live' : 'history'
  const [metric, setMetric] = useState<LiveMetric>('uops')
  const historyMetric: ActivityMetric = hasHistory(metric) ? metric : 'uops'
  // the live view shows there whether it follows the newest block: the
  // switch stays where it is, so keeps its focus between the views
  const [liveStateSlot, setLiveStateSlot] = useState<HTMLElement | null>(null)
  // so Live opens on what it shows first
  const prefetchLive = () => {
    if (view === 'live' || !liveAvailable) return
    void queryClient.prefetchQuery({
      ...trpc.activity.liveWindow.queryOptions({
        projectId: project.id,
        range: DEFAULT_LIVE_RANGE,
      }),
      staleTime: 5_000,
    })
  }
  return (
    <ProjectSection {...sectionProps}>
      {dataSource && <ChartDataSourceInfo dataSource={dataSource} />}
      {live !== undefined && (
        <div
          className="mb-4 flex flex-wrap items-center justify-between gap-2"
          onPointerEnter={prefetchLive}
          onFocus={prefetchLive}
        >
          <RadioGroup
            name="activityView"
            value={view}
            onValueChange={setViewParam}
          >
            <RadioGroupItem value="history">History</RadioGroupItem>
            {liveAvailable ? (
              <RadioGroupItem value="live">Live</RadioGroupItem>
            ) : (
              <Tooltip>
                {/* a disabled button gets no hover, so the tooltip is on its wrapper */}
                <TooltipTrigger asChild>
                  <span className="h-full" tabIndex={0}>
                    <RadioGroupItem
                      value="live"
                      disabled
                      className="pointer-events-none flex items-center gap-1"
                    >
                      Live
                      <InfoIcon className="size-3" />
                    </RadioGroupItem>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Live activity isn't available for this chain right now.
                </TooltipContent>
              </Tooltip>
            )}
          </RadioGroup>
          {view === 'history' ? (
            status?.now && (
              <LiveNow
                now={status.now}
                metric={historyMetric}
                onOpen={() => setViewParam('live')}
              />
            )
          ) : (
            <div ref={setLiveStateSlot} />
          )}
        </div>
      )}
      {view === 'live' ? (
        <ProjectLiveActivity
          project={project}
          category={category}
          metric={metric}
          setMetric={setMetric}
          stateSlot={liveStateSlot}
        />
      ) : project.id === ProjectId.ETHEREUM ? (
        <EthereumActivityChart
          milestones={milestones}
          project={project}
          category={category}
          defaultRange={defaultRange}
          metric={historyMetric}
          setMetric={setMetric}
        />
      ) : (
        <ProjectActivityChart
          milestones={milestones}
          project={project}
          category={category}
          defaultRange={defaultRange}
          metric={historyMetric}
          setMetric={setMetric}
        />
      )}
    </ProjectSection>
  )
}
