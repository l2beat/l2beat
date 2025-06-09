import type { Project, WarningWithSentiment } from '@l2beat/config'
import { groupByScalingTabs } from '~/pages/scaling/utils/groupByScalingTabs'
import { ps } from '~/server/projects'
import type { ExpressHelpers } from '~/trpc/server'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../../projects-change-report/getProjectsChangeReport'
import {
  type CommonScalingEntry,
  getCommonScalingEntry,
} from '../getCommonScalingEntry'
import type { CostsTableData } from './getCostsTableData'
import { compareStageAndCost } from './utils/compareStageAndCost'

export async function getScalingCostsEntries(helpers: ExpressHelpers) {
  const [projectsChangeReport, projects, costs] = await Promise.all([
    getProjectsChangeReport(),
    ps.getProjects({
      select: ['statuses', 'scalingInfo', 'costsInfo', 'display'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'archivedAt'],
    }),
    helpers.costs.table.fetch({ range: '30d' }),
  ])

  const entries = projects
    .map((project) =>
      getScalingCostEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        costs[project.id],
      ),
    )
    .sort(compareStageAndCost)
  return groupByScalingTabs(entries)
}

export interface ScalingCostsEntry extends CommonScalingEntry {
  costsWarning: WarningWithSentiment | undefined
  costOrder: number
}

function getScalingCostEntry(
  project: Project<'statuses' | 'scalingInfo' | 'costsInfo' | 'display'>,
  changes: ProjectChanges,
  costs: CostsTableData[string] | undefined,
): ScalingCostsEntry {
  const costPerUop =
    costs?.uopsCount && costs.usd.total
      ? costs.usd.total / costs.uopsCount
      : Infinity

  return {
    ...getCommonScalingEntry({ project, changes }),
    costsWarning: project.costsInfo.warning,
    costOrder: costPerUop,
  }
}
