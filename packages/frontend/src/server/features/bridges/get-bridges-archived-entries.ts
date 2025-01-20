import {
  type BridgeDisplay,
  type BridgeRiskView,
  ProjectService,
} from '@l2beat/config'
import { getProjectsChangeReport } from '../projects-change-report/get-projects-change-report'
import { compareTvl } from '../scaling/tvl/utils/compare-tvl'
import { get7dTokenBreakdown } from '../scaling/tvl/utils/get-7d-token-breakdown'
import {
  type CommonBridgesEntry,
  getCommonBridgesEntry,
} from './get-common-bridges-entry'

export interface BridgesArchivedEntry extends CommonBridgesEntry {
  type: BridgeDisplay['category']
  validatedBy: BridgeRiskView['validatedBy']
  totalTvl: number | undefined
  tvlOrder: number
}

export async function getBridgesArchivedEntries(): Promise<
  BridgesArchivedEntry[]
> {
  const [tvl7dBreakdown, projectsChangeReport, projects] = await Promise.all([
    get7dTokenBreakdown({ type: 'bridge' }),
    getProjectsChangeReport(),
    ProjectService.STATIC.getProjects({
      select: ['statuses', 'bridgeInfo', 'bridgeRisks'],
      where: ['isBridge', 'isArchived'],
    }),
  ])

  return projects
    .map((project) => {
      const tvl = tvl7dBreakdown.projects[project.id.toString()]
      const changes = projectsChangeReport.getChanges(project.id)
      return {
        ...getCommonBridgesEntry({ project, changes }),
        type: project.bridgeInfo.category,
        validatedBy: project.bridgeRisks.validatedBy,
        totalTvl: tvl?.breakdown.total,
        tvlOrder: tvl?.breakdown.total ?? -1,
      }
    })
    .sort(compareTvl)
}
