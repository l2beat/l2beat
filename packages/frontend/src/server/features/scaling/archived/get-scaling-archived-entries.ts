import {
  type Project,
  ProjectService,
  type ScalingProjectCategory,
  type ScalingProjectStack,
} from '@l2beat/config'
import { getL2Risks } from '~/app/(side-nav)/scaling/_utils/get-l2-risks'
import { type RosetteValue } from '~/components/rosette/types'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import {
  type CommonScalingEntry,
  getCommonScalingEntry,
} from '../get-common-scaling-entry'
import { compareTvl } from '../tvl/utils/compare-tvl'
import {
  type LatestTvl,
  get7dTokenBreakdown,
} from '../tvl/utils/get-7d-token-breakdown'

export async function getScalingArchivedEntries() {
  const [projectsChangeReport, tvl, projects] = await Promise.all([
    getProjectsChangeReport(),
    get7dTokenBreakdown({ type: 'layer2' }),
    ProjectService.STATIC.getProjects({
      select: ['statuses', 'scalingInfo', 'scalingRisks'],
      where: ['isScaling', 'isArchived'],
    }),
  ])

  const entries = projects.map((project) =>
    getScalingArchivedEntry(
      project,
      projectsChangeReport.getChanges(project.id),
      tvl.projects[project.id.toString()],
    ),
  )

  return groupByTabs(entries.sort(compareTvl))
}

export interface ScalingArchivedEntry extends CommonScalingEntry {
  category: ScalingProjectCategory
  purposes: string[]
  stack: ScalingProjectStack | undefined
  risks: RosetteValue[] | undefined
  totalTvl: number | undefined
  tvlOrder: number
}

function getScalingArchivedEntry(
  project: Project<'scalingInfo' | 'statuses' | 'scalingRisks'>,
  changes: ProjectChanges,
  latestTvl: LatestTvl['projects'][string] | undefined,
): ScalingArchivedEntry {
  return {
    ...getCommonScalingEntry({ project, changes }),
    category: project.scalingInfo.type,
    purposes: project.scalingInfo.purposes,
    stack: project.scalingInfo.stack,
    risks: getL2Risks(
      project.scalingRisks.stacked ?? project.scalingRisks.self,
    ),
    totalTvl: latestTvl?.breakdown.total,
    tvlOrder: latestTvl?.breakdown.total ?? -1,
  }
}
