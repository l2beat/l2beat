import type { Project, ProjectRiskView } from '@l2beat/config'
import { groupByLayer2sTabs } from '~/pages/layer2s/utils/groupByLayer2sTabs'
import { ps } from '~/server/projects'
import { getDataAvailabilitySection } from '~/utils/project/technology/getDataAvailabilitySection'
import { getOperatorSection } from '~/utils/project/technology/getOperatorSection'
import { getWithdrawalsSection } from '~/utils/project/technology/getWithdrawalsSection'
import type { ProjectChanges } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { CommonLayer2sEntry } from '../getCommonLayer2sEntry'
import { getCommonLayer2sEntry } from '../getCommonLayer2sEntry'
import { get7dTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import { compareTvs } from '../tvs/utils/compareTvs'

export async function getLayer2sRiskEntries() {
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
      getLayer2sRiskEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvs.projects[project.id]?.breakdown.total,
      ),
    )
    .sort(compareTvs)

  return groupByLayer2sTabs(entries)
}

export interface Layer2sRiskEntry extends CommonLayer2sEntry {
  risks: ProjectRiskView
  tvsOrder: number
  hasStateValidationSection: boolean
  hasDataAvailabilitySection: boolean
  hasWithdrawalsSection: boolean
  hasOperatorsSection: boolean
}

function getLayer2sRiskEntry(
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
): Layer2sRiskEntry {
  return {
    ...getCommonLayer2sEntry({ project, changes }),
    risks: project.scalingRisks.stacked ?? project.scalingRisks.self,
    tvsOrder: tvs ?? -1,
    hasStateValidationSection: !!project.scalingTechnology?.stateValidation,
    hasDataAvailabilitySection: !!getDataAvailabilitySection(project),
    hasWithdrawalsSection: !!getWithdrawalsSection(project),
    hasOperatorsSection: !!getOperatorSection(project),
  }
}
