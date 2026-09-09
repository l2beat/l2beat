import type { Project, WarningWithSentiment } from '@l2beat/config'
import { groupByL2Tabs } from '~/pages/layer2s/utils/groupByL2Tabs'
import { ps } from '~/server/projects'
import type { SsrHelpers } from '~/trpc/server'
import { optionToRange } from '~/utils/range/range'
import {
  getProjectsChangeReport,
  type ProjectChanges,
} from '../../projects-change-report/getProjectsChangeReport'
import { type CommonL2Entry, getCommonL2Entry } from '../getCommonL2Entry'
import type { CostsTableData } from './getCostsTableData'
import { compareCosts } from './utils/compareCosts'
import { getCostsSyncWarning } from './utils/isCostsSynced'

export async function getL2CostsEntries(helpers: SsrHelpers) {
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
      getL2CostEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        costs[project.id],
      ),
    )
    .sort(compareCosts)
  return groupByL2Tabs(entries)
}

export interface L2CostsEntry extends CommonL2Entry {
  costsWarning: WarningWithSentiment | undefined
  costOrder: number
}

function getL2CostEntry(
  project: Project<
    'statuses' | 'scalingInfo' | 'costsInfo' | 'display',
    'contracts'
  >,
  changes: ProjectChanges,
  costs: CostsTableData[string] | undefined,
): L2CostsEntry {
  const costPerUop =
    costs?.uopsCount && costs.usd.total
      ? costs.usd.total / costs.uopsCount
      : Number.POSITIVE_INFINITY

  return {
    ...getCommonL2Entry({
      project,
      syncWarning: getCostsSyncWarning(costs?.syncedUntil),
      changes,
    }),
    costsWarning: project.costsInfo.warning,
    costOrder: costPerUop,
  }
}
