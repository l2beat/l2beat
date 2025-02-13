import type { Project, WarningWithSentiment } from '@l2beat/config'
import { ps } from '~/server/projects'
import { api } from '~/trpc/server'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import {
  type CommonScalingEntry,
  getCommonScalingEntry,
} from '../get-common-scaling-entry'
import type { CostsTableData } from './get-costs-table-data'
import { compareStageAndCost } from './utils/compare-stage-and-cost'

export async function getScalingCostsEntries() {
  const [projectsChangeReport, projects, costs] = await Promise.all([
    getProjectsChangeReport(),
    ps.getProjects({
      select: ['statuses', 'scalingInfo', 'costsInfo', 'display'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'isArchived'],
    }),
    api.costs.table({ range: '30d' }),
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
  return groupByTabs(entries)
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
    href: `/scaling/projects/${project.slug}#onchain-costs`,
    costsWarning: project.costsInfo.warning,
    costOrder: costPerUop,
  }
}
