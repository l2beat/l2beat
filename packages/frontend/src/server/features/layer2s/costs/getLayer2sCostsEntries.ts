import type { Project, WarningWithSentiment } from '@l2beat/config'
import { groupByLayer2sTabs } from '~/pages/layer2s/utils/groupByLayer2sTabs'
import { ps } from '~/server/projects'
import type { SsrHelpers } from '~/trpc/server'
import { optionToRange } from '~/utils/range/range'
import {
  getProjectsChangeReport,
  type ProjectChanges,
} from '../../projects-change-report/getProjectsChangeReport'
import {
  type CommonLayer2sEntry,
  getCommonLayer2sEntry,
} from '../getCommonLayer2sEntry'
import type { CostsTableData } from './getCostsTableData'
import { compareCosts } from './utils/compareCosts'
import { getCostsSyncWarning } from './utils/isCostsSynced'

export async function getLayer2sCostsEntries(helpers: SsrHelpers) {
  const [projectsChangeReport, projects, costs] = await Promise.all([
    getProjectsChangeReport(),
    ps.getProjects({
      select: ['statuses', 'scalingInfo', 'costsInfo', 'display'],
      optional: ['contracts'],
      where: ['scalingInfo'],
      whereNot: ['archivedAt'],
    }),
    helpers.queryClient.fetchQuery(
      helpers.trpc.costs.table.queryOptions({ range: optionToRange('30d') }),
    ),
  ])

  const entries = projects
    .map((project) =>
      getLayer2sCostEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        costs[project.id],
      ),
    )
    .sort(compareCosts)
  return groupByLayer2sTabs(entries)
}

export interface Layer2sCostsEntry extends CommonLayer2sEntry {
  costsWarning: WarningWithSentiment | undefined
  costOrder: number
}

function getLayer2sCostEntry(
  project: Project<
    'statuses' | 'scalingInfo' | 'costsInfo' | 'display',
    'contracts'
  >,
  changes: ProjectChanges,
  costs: CostsTableData[string] | undefined,
): Layer2sCostsEntry {
  const costPerUop =
    costs?.uopsCount && costs.usd.total
      ? costs.usd.total / costs.uopsCount
      : Number.POSITIVE_INFINITY

  return {
    ...getCommonLayer2sEntry({
      project,
      syncWarning: getCostsSyncWarning(costs?.syncedUntil),
      changes,
    }),
    costsWarning: project.costsInfo.warning,
    costOrder: costPerUop,
  }
}
