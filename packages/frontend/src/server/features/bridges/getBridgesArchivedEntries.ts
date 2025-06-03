import type { BridgeCategory, TableReadyValue } from '@l2beat/config'
import type { TabbedBridgeEntries } from '~/pages/bridges/utils/groupByBridgeTabs'
import { groupByBridgeTabs } from '~/pages/bridges/utils/groupByBridgeTabs'
import { ps } from '~/server/projects'
import { getProjectsChangeReport } from '../projects-change-report/getProjectsChangeReport'
import { get7dTvsBreakdown } from '../scaling/tvs/get7dTvsBreakdown'
import { compareTvs } from '../scaling/tvs/utils/compareTvs'
import type { CommonBridgesEntry } from './getCommonBridgesEntry'
import { getCommonBridgesEntry } from './getCommonBridgesEntry'

export interface BridgesArchivedEntry extends CommonBridgesEntry {
  type: BridgeCategory
  validatedBy: TableReadyValue | undefined
  totalTvs: number | undefined
  tvsOrder: number
}

export async function getBridgesArchivedEntries(): Promise<
  TabbedBridgeEntries<BridgesArchivedEntry>
> {
  const [tvs7dBreakdown, projectsChangeReport, projects] = await Promise.all([
    get7dTvsBreakdown({ type: 'bridge' }),
    getProjectsChangeReport(),
    ps.getProjects({
      select: ['statuses', 'bridgeInfo', 'bridgeRisks'],
      where: ['isBridge', 'archivedAt'],
    }),
  ])

  const entries = projects
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

  return groupByBridgeTabs(entries)
}
