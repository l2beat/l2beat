import type { Project, ProjectScalingRiskView } from '@l2beat/config'
import { groupByScalingTabs } from '~/pages/scaling/utils/groupByScalingTabs'
import { ps } from '~/server/projects'
import { getDataAvailabilitySection } from '~/utils/project/technology/getDataAvailabilitySection'
import { getOperatorSection } from '~/utils/project/technology/getOperatorSection'
import { getWithdrawalsSection } from '~/utils/project/technology/getWithdrawalsSection'
import type { ProjectChanges } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { CommonScalingEntry } from '../getCommonScalingEntry'
import { getCommonScalingEntry } from '../getCommonScalingEntry'
import { getProjectsLatestTvsUsd } from '../tvs/getLatestTvsUsd'
import { compareStageAndTvs } from '../utils/compareStageAndTvs'

export async function getScalingRiskEntries() {
  const [tvs, projectsChangeReport, projects] = await Promise.all([
    getProjectsLatestTvsUsd(),
    getProjectsChangeReport(),
    ps.getProjects({
      select: [
        'statuses',
        'scalingInfo',
        'scalingRisks',
        'display',
        'scalingTechnology',
      ],
      optional: ['customDa', 'scalingDa'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'archivedAt'],
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

  return groupByScalingTabs(entries)
}

export interface ScalingRiskEntry extends CommonScalingEntry {
  risks: ProjectScalingRiskView
  tvsOrder: number
  hasStateValidationSection: boolean
  hasDataAvailabilitySection: boolean
  hasWithdrawalsSection: boolean
  hasOperatorsSection: boolean
}

function getScalingRiskEntry(
  project: Project<
    | 'scalingInfo'
    | 'statuses'
    | 'scalingRisks'
    | 'display'
    | 'scalingTechnology',
    // optional
    'customDa' | 'scalingDa'
  >,
  changes: ProjectChanges,
  tvs: number | undefined,
): ScalingRiskEntry {
  return {
    ...getCommonScalingEntry({ project, changes }),
    risks: project.scalingRisks.stacked ?? project.scalingRisks.self,
    tvsOrder: tvs ?? -1,
    hasStateValidationSection: !!project.scalingTechnology?.stateValidation,
    hasDataAvailabilitySection: !!getDataAvailabilitySection(project),
    hasWithdrawalsSection: !!getWithdrawalsSection(project),
    hasOperatorsSection: !!getOperatorSection(project),
  }
}
