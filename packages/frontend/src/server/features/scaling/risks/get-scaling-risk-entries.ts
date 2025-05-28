import type { Project, ProjectScalingRiskView } from '@l2beat/config'
import { groupByScalingTabs } from '~/pages/scaling/utils/group-by-scaling-tabs'
import { ps } from '~/server/projects'
import { getDataAvailabilitySection } from '~/utils/project/technology/get-data-availability-section'
import { getOperatorSection } from '~/utils/project/technology/get-operator-section'
import { getWithdrawalsSection } from '~/utils/project/technology/get-withdrawals-section'
import type { ProjectChanges } from '../../projects-change-report/get-projects-change-report'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import type { CommonScalingEntry } from '../get-common-scaling-entry'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvsUsd } from '../tvs/get-latest-tvs-usd'
import { compareStageAndTvs } from '../utils/compare-stage-and-tvs'

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
