import type {
  Project,
  ProjectAssociatedToken,
  WarningWithSentiment,
} from '@l2beat/config'
import { groupByL2Tabs } from '~/pages/layer2s/utils/groupByL2Tabs'
import { ps } from '~/server/projects'
import type { ProjectChanges } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { CommonL2Entry } from '../getCommonL2Entry'
import { getCommonL2Entry } from '../getCommonL2Entry'
import type { ProjectSevenDayTvsBreakdown } from './get7dTvsBreakdown'
import { get7dTvsBreakdown } from './get7dTvsBreakdown'
import { compareTvs } from './utils/compareTvs'

export async function getL2TvsEntries() {
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
      getL2TvsEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvs.projects[project.id.toString()],
      ),
    )
    .filter((entry) => entry !== undefined)
    .sort(compareTvs)

  return groupByL2Tabs(entries)
}

export interface L2TvsEntry extends CommonL2Entry {
  tvs: {
    associatedTokens: ProjectAssociatedToken[]
    warnings: WarningWithSentiment[]
  }
  tvsOrder: number
}

function getL2TvsEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'tvsInfo' | 'display',
    'contracts'
  >,
  changes: ProjectChanges,
  data: ProjectSevenDayTvsBreakdown | undefined,
): L2TvsEntry | undefined {
  return {
    ...getCommonL2Entry({ project, changes }),
    tvs: {
      associatedTokens: project.tvsInfo.associatedTokens,
      warnings: project.tvsInfo.warnings,
    },
    tvsOrder: data?.breakdown.total ?? -1,
  }
}
