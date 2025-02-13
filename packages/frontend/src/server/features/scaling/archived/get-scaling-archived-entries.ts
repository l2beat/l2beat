import type {
  Project,
  ScalingProjectCategory,
  ScalingProjectStack,
} from '@l2beat/config'
import { getL2Risks } from '~/app/(side-nav)/scaling/_utils/get-l2-risks'
import type { RosetteValue } from '~/components/rosette/types'
import { ps } from '~/server/projects'
import { groupByTabs } from '~/utils/group-by-tabs'
import type { ProjectChanges } from '../../projects-change-report/get-projects-change-report'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import type { CommonScalingEntry } from '../get-common-scaling-entry'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { compareTvs } from '../tvs/utils/compare-tvs'
import type { LatestTvs } from '../tvs/utils/get-7d-token-breakdown'
import { get7dTokenBreakdown } from '../tvs/utils/get-7d-token-breakdown'

export async function getScalingArchivedEntries() {
  const [projectsChangeReport, tvs, projects] = await Promise.all([
    getProjectsChangeReport(),
    get7dTokenBreakdown({ type: 'layer2' }),
    ps.getProjects({
      select: ['statuses', 'scalingInfo', 'scalingRisks', 'display'],
      where: ['isScaling', 'isArchived'],
    }),
  ])

  const entries = projects.map((project) =>
    getScalingArchivedEntry(
      project,
      projectsChangeReport.getChanges(project.id),
      tvs.projects[project.id.toString()],
    ),
  )

  return groupByTabs(entries.sort(compareTvs))
}

export interface ScalingArchivedEntry extends CommonScalingEntry {
  category: ScalingProjectCategory
  purposes: string[]
  stack: ScalingProjectStack | undefined
  risks: RosetteValue[] | undefined
  totalTvs: number | undefined
  tvsOrder: number
}

function getScalingArchivedEntry(
  project: Project<'scalingInfo' | 'statuses' | 'scalingRisks' | 'display'>,
  changes: ProjectChanges,
  latestTvs: LatestTvs['projects'][string] | undefined,
): ScalingArchivedEntry {
  return {
    ...getCommonScalingEntry({ project, changes }),
    category: project.scalingInfo.type,
    purposes: project.scalingInfo.purposes,
    stack: project.scalingInfo.stack,
    risks: getL2Risks(
      project.scalingRisks.stacked ?? project.scalingRisks.self,
    ),
    totalTvs: latestTvs?.breakdown.total,
    tvsOrder: latestTvs?.breakdown.total ?? -1,
  }
}
