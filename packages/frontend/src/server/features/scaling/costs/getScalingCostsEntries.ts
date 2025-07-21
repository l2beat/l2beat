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
import { getApprovedOngoingAnomalies } from '../liveness/getApprovedOngoingAnomalies'
import type { CostsTableData } from './getCostsTableData'
import { compareStageAndCost } from './utils/compareStageAndCost'

export async function getScalingCostsEntries(helpers: SsrHelpers) {
  const [projectsChangeReport, projects, costs, projectsOngoingAnomalies] =
    await Promise.all([
      getProjectsChangeReport(),
      ps.getProjects({
        select: ['statuses', 'scalingInfo', 'costsInfo', 'display'],
        where: ['isScaling'],
        whereNot: ['isUpcoming', 'archivedAt'],
      }),
      helpers.costs.table.fetch({ range: '30d' }),
      getApprovedOngoingAnomalies(),
    ])

  const entries = projects
    .map((project) =>
      getScalingCostEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        costs[project.id],
        !!projectsOngoingAnomalies[project.id.toString()],
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
  ongoingAnomaly: boolean,
): ScalingCostsEntry {
  const costPerUop =
    costs?.uopsCount && costs.usd.total
      ? costs.usd.total / costs.uopsCount
      : Number.POSITIVE_INFINITY

  return {
    ...getCommonScalingEntry({ project, changes, ongoingAnomaly }),
    costsWarning: project.costsInfo.warning,
    costOrder: costPerUop,
  }
}
