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
import { useQueryParam } from '~/hooks/useQueryParam'
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
}

export function ActivitySection({
  project,
  milestones,
  category,
  defaultRange,
  dataSource,
  hasLive,
  ...sectionProps
}: ActivitySectionProps) {
  // in the URL, so a link can open the section on Live
  const [viewParam, setViewParam] = useQueryParam('activity', 'history', {
    replaceState: true,
  })
  const view = hasLive && viewParam === 'live' ? 'live' : 'history'
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
            <RadioGroupItem value="live">Live</RadioGroupItem>
          </RadioGroup>
          {view === 'history' ? (
            <LiveNow
              project={project}
              metric={historyMetric}
              onOpen={() => openView('live')}
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
