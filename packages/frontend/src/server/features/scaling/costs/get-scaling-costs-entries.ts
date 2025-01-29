import {
  type Project,
  ProjectService,
  type WarningWithSentiment,
} from '@l2beat/config'
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
    ProjectService.STATIC.getProjects({
      select: ['statuses', 'scalingInfo', 'costsInfo'],
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
  project: Project<'statuses' | 'scalingInfo' | 'costsInfo'>,
  changes: ProjectChanges,
  costs: CostsTableData[string] | undefined,
): ScalingCostsEntry {
  let costPerUop = Infinity
  if (costs?.uopsCount && costs.usd.total) {
    costPerUop = costs.usd.total / costs.uopsCount
  }
  return {
    ...getCommonScalingEntry({ project, changes }),
    href: `/scaling/projects/${project.slug}#onchain-costs`,
    costsWarning: project.costsInfo.warning,
    costOrder: costPerUop,
  }
}
