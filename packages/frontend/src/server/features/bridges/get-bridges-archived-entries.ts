import type { BridgeDisplay, BridgeRiskView } from '@l2beat/config'
import { ps } from '~/server/projects'
import { getProjectsChangeReport } from '../projects-change-report/get-projects-change-report'
import { compareTvs } from '../scaling/tvs/utils/compare-tvs'
import { get7dTokenBreakdown } from '../scaling/tvs/utils/get-7d-token-breakdown'
import type { CommonBridgesEntry } from './get-common-bridges-entry'
import { getCommonBridgesEntry } from './get-common-bridges-entry'

export interface BridgesArchivedEntry extends CommonBridgesEntry {
  type: BridgeDisplay['category']
  validatedBy: BridgeRiskView['validatedBy']
  totalTvs: number | undefined
  tvsOrder: number
}

export async function getBridgesArchivedEntries(): Promise<
  BridgesArchivedEntry[]
> {
  const [tvs7dBreakdown, projectsChangeReport, projects] = await Promise.all([
    get7dTokenBreakdown({ type: 'bridge' }),
    getProjectsChangeReport(),
    ps.getProjects({
      select: ['statuses', 'bridgeInfo', 'bridgeRisks'],
      where: ['isBridge', 'isArchived'],
    }),
  ])

  return projects
    .map((project) => {
      const tvs = tvs7dBreakdown.projects[project.id.toString()]
      const changes = projectsChangeReport.getChanges(project.id)
      return {
        ...getCommonBridgesEntry({ project, changes }),
        type: project.bridgeInfo.category,
        validatedBy: project.bridgeRisks.validatedBy,
        totalTvs: tvs?.breakdown.total,
        tvsOrder: tvs?.breakdown.total ?? -1,
      }
    })
    .sort(compareTvs)
}
