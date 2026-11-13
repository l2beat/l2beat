import type { Milestone, ProjectScalingCategory } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { useState } from 'react'
import { EthereumActivityChart } from '~/components/chart/activity/EthereumActivityChart'
import { LiveNow } from '~/components/chart/activity/live/LiveNow'
import { LiveState } from '~/components/chart/activity/live/LiveState'
import type { LiveMetric } from '~/components/chart/activity/live/liveSteps'
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
  /** Counted block by block, so the backend can store its blocks as they come */
  hasLive: boolean
  /** Whether its blocks are stored as they come, so Live has something to show */
  liveAvailable: boolean
}

export function ActivitySection({
  project,
  milestones,
  category,
  defaultRange,
  dataSource,
  hasLive,
  liveAvailable: liveAvailableOnLoad,
  ...sectionProps
}: ActivitySectionProps) {
  // in the URL, so a link can open the section on Live
  const [viewParam, setViewParam] = useQueryParam('activity', 'history', {
    replaceState: true,
  })
  // kept up to date by the live reads, so Live goes and comes back with the blocks
  const [liveAvailable, setLiveAvailable] = useState(liveAvailableOnLoad)
  const view =
    hasLive && liveAvailable && viewParam === 'live' ? 'live' : 'history'
  const [metric, setMetric] = useState<LiveMetric>('uops')
  // gas has no history
  const historyMetric: ActivityMetric = metric === 'gas' ? 'uops' : metric
  /** Where the live window ends, undefined while following the newest block */
  const [liveTo, setLiveTo] = useState<number>()
  const openView = (next: 'history' | 'live') => {
    setViewParam(next)
    setLiveTo(undefined)
  }
  return (
    <ProjectSection {...sectionProps}>
      {dataSource && <ChartDataSourceInfo dataSource={dataSource} />}
      {hasLive && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <RadioGroup
            name="activityView"
            value={view}
            onValueChange={(value) => openView(value as 'history' | 'live')}
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
            <LiveNow
              project={project}
              metric={historyMetric}
              onOpen={() => openView('live')}
              onAvailable={setLiveAvailable}
            />
          ) : (
            <LiveState
              following={liveTo === undefined}
              onFollow={() => setLiveTo(undefined)}
            />
          )}
        </div>
      )}
      {view === 'live' ? (
        <ProjectLiveActivity
          project={project}
          category={category}
          metric={metric}
          setMetric={setMetric}
          to={liveTo}
          setTo={setLiveTo}
          onAvailable={setLiveAvailable}
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
