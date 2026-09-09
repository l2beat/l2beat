import type { Project, ProjectRiskView } from '@l2beat/config'
import { groupByL2Tabs } from '~/pages/layer2s/utils/groupByL2Tabs'
import { ps } from '~/server/projects'
import { getDataAvailabilitySection } from '~/utils/project/technology/getDataAvailabilitySection'
import { getOperatorSection } from '~/utils/project/technology/getOperatorSection'
import { getWithdrawalsSection } from '~/utils/project/technology/getWithdrawalsSection'
import type { ProjectChanges } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { CommonL2Entry } from '../getCommonL2Entry'
import { getCommonL2Entry } from '../getCommonL2Entry'
import { get7dTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import { compareTvs } from '../tvs/utils/compareTvs'

export async function getL2RiskEntries() {
  const [tvs, projectsChangeReport, projects] = await Promise.all([
    get7dTvsBreakdown({ type: 'layer2' }),
    getProjectsChangeReport(),
    ps.getProjects({
      select: [
        'statuses',
        'scalingInfo',
        'scalingRisks',
        'display',
        'scalingTechnology',
      ],
      optional: ['customDa', 'scalingDa', 'contracts'],
      where: ['scalingInfo'],
      whereNot: ['archivedAt'],
    }),
  ])

  const entries = projects
    .map((project) =>
      getL2RiskEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvs.projects[project.id]?.breakdown.total,
      ),
    )
    .sort(compareTvs)

  return groupByL2Tabs(entries)
}

export interface L2RiskEntry extends CommonL2Entry {
  risks: ProjectRiskView
  tvsOrder: number
  hasStateValidationSection: boolean
  hasDataAvailabilitySection: boolean
  hasWithdrawalsSection: boolean
  hasOperatorsSection: boolean
}

function getL2RiskEntry(
  project: Project<
    | 'scalingInfo'
    | 'statuses'
    | 'scalingRisks'
    | 'display'
    | 'scalingTechnology',
    // optional
    'customDa' | 'scalingDa' | 'contracts'
  >,
  changes: ProjectChanges,
  tvs: number | undefined,
): L2RiskEntry {
  return {
    ...getCommonL2Entry({ project, changes }),
    risks: project.scalingRisks.stacked ?? project.scalingRisks.self,
    tvsOrder: tvs ?? -1,
    hasStateValidationSection: !!project.scalingTechnology?.stateValidation,
    hasDataAvailabilitySection: !!getDataAvailabilitySection(project),
    hasWithdrawalsSection: !!getWithdrawalsSection(project),
    hasOperatorsSection: !!getOperatorSection(project),
  }
}
