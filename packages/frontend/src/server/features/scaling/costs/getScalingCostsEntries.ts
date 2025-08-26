import type { Project, WarningWithSentiment } from '@l2beat/config'
import { groupByScalingTabs } from '~/pages/scaling/utils/groupByScalingTabs'
import { ps } from '~/server/projects'
import type { SsrHelpers } from '~/trpc/server'
import {
  getProjectsChangeReport,
  type ProjectChanges,
} from '../../projects-change-report/getProjectsChangeReport'
import {
  type CommonScalingEntry,
  getCommonScalingEntry,
} from '../getCommonScalingEntry'
import type { CostsTableData } from './getCostsTableData'
import { compareCosts } from './utils/compareCosts'

export async function getScalingCostsEntries(helpers: SsrHelpers) {
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
    .sort(compareCosts)
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
      : Number.POSITIVE_INFINITY

  return {
    ...getCommonScalingEntry({ project, changes }),
    costsWarning: project.costsInfo.warning,
    costOrder: costPerUop,
  }
}
