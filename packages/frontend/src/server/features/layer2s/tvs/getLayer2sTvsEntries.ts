import type {
  Project,
  ProjectAssociatedToken,
  WarningWithSentiment,
} from '@l2beat/config'
import { groupByLayer2sTabs } from '~/pages/layer2s/utils/groupByLayer2sTabs'
import { ps } from '~/server/projects'
import type { ProjectChanges } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { CommonLayer2sEntry } from '../getCommonLayer2sEntry'
import { getCommonLayer2sEntry } from '../getCommonLayer2sEntry'
import type { ProjectSevenDayTvsBreakdown } from './get7dTvsBreakdown'
import { get7dTvsBreakdown } from './get7dTvsBreakdown'
import { compareTvs } from './utils/compareTvs'

export async function getLayer2sTvsEntries() {
  const [projectsChangeReport, tvs, projects] = await Promise.all([
    getProjectsChangeReport(),
    get7dTvsBreakdown({ type: 'layer2' }),
    ps.getProjects({
      select: ['statuses', 'scalingInfo', 'tvsInfo', 'display'],
      optional: ['contracts'],
      where: ['scalingInfo'],
      whereNot: ['archivedAt'],
    }),
  ])

  const entries = projects
    .map((project) =>
      getLayer2sTvsEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvs.projects[project.id.toString()],
      ),
    )
    .filter((entry) => entry !== undefined)
    .sort(compareTvs)

  return groupByLayer2sTabs(entries)
}

export interface Layer2sTvsEntry extends CommonLayer2sEntry {
  tvs: {
    associatedTokens: ProjectAssociatedToken[]
    warnings: WarningWithSentiment[]
  }
  tvsOrder: number
}

function getLayer2sTvsEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'tvsInfo' | 'display',
    'contracts'
  >,
  changes: ProjectChanges,
  data: ProjectSevenDayTvsBreakdown | undefined,
): Layer2sTvsEntry | undefined {
  return {
    ...getCommonLayer2sEntry({ project, changes }),
    tvs: {
      associatedTokens: project.tvsInfo.associatedTokens,
      warnings: project.tvsInfo.warnings,
    },
    tvsOrder: data?.breakdown.total ?? -1,
  }
}
