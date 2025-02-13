import type { Project, ScalingProjectRiskView } from '@l2beat/config'
import { ps } from '~/server/projects'
import { groupByTabs } from '~/utils/group-by-tabs'
import type { ProjectChanges } from '../../projects-change-report/get-projects-change-report'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import type { CommonScalingEntry } from '../get-common-scaling-entry'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvsUsd } from '../tvs/utils/get-latest-tvs-usd'
import { compareStageAndTvs } from '../utils/compare-stage-and-tvs'

export async function getScalingRiskEntries() {
  const [tvs, projectsChangeReport, projects] = await Promise.all([
    getProjectsLatestTvsUsd(),
    getProjectsChangeReport(),
    ps.getProjects({
      select: ['statuses', 'scalingInfo', 'scalingRisks', 'display'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'isArchived'],
    }),
  ])

  const entries = projects
    .map((project) =>
      getScalingRiskEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvs[project.id],
      ),
    )
    .sort(compareStageAndTvs)

  return groupByTabs(entries)
}

export interface ScalingRiskEntry extends CommonScalingEntry {
  risks: ScalingProjectRiskView
  tvsOrder: number
}

function getScalingRiskEntry(
  project: Project<'scalingInfo' | 'statuses' | 'scalingRisks' | 'display'>,
  changes: ProjectChanges,
  tvs: number | undefined,
): ScalingRiskEntry {
  return {
    ...getCommonScalingEntry({ project, changes }),
    risks: project.scalingRisks.stacked ?? project.scalingRisks.self,
    tvsOrder: tvs ?? -1,
  }
}
