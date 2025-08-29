import type {
  Project,
  ProjectScalingProofSystem,
  ProjectScalingStack,
} from '@l2beat/config'
import type { RosetteValue } from '~/components/rosette/types'
import { getL2Risks } from '~/pages/scaling/utils/getL2Risks'
import { groupByScalingTabs } from '~/pages/scaling/utils/groupByScalingTabs'
import { ps } from '~/server/projects'
import { getProofSystemWithName } from '~/utils/project/getProofSystemWithName'
import type { ProjectChanges } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { CommonScalingEntry } from '../getCommonScalingEntry'
import { getCommonScalingEntry } from '../getCommonScalingEntry'
import type { ProjectSevenDayTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import { get7dTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import { compareTvs } from '../tvs/utils/compareTvs'

export async function getScalingArchivedEntries() {
  const [projectsChangeReport, tvs, projects, zkCatalogProjects] =
    await Promise.all([
      getProjectsChangeReport(),
      get7dTvsBreakdown({ type: 'layer2' }),
      ps.getProjects({
        select: ['statuses', 'scalingInfo', 'scalingRisks', 'display'],
        where: ['isScaling', 'archivedAt'],
      }),
      ps.getProjects({
        select: ['zkCatalogInfo'],
      }),
    ])

  const entries = projects.map((project) =>
    getScalingArchivedEntry(
      project,
      projectsChangeReport.getChanges(project.id),
      tvs.projects[project.id.toString()],
      zkCatalogProjects,
    ),
  )

  return groupByScalingTabs(entries.sort(compareTvs))
}

export interface ScalingArchivedEntry extends CommonScalingEntry {
  proofSystem: ProjectScalingProofSystem | undefined
  purposes: string[]
  stacks: ProjectScalingStack[] | undefined
  risks: RosetteValue[] | undefined
  totalTvs: number | undefined
  tvsOrder: number
}

function getScalingArchivedEntry(
  project: Project<'scalingInfo' | 'statuses' | 'scalingRisks' | 'display'>,
  changes: ProjectChanges,
  latestTvs: ProjectSevenDayTvsBreakdown | undefined,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
): ScalingArchivedEntry {
  return {
    ...getCommonScalingEntry({ project, changes }),
    proofSystem: getProofSystemWithName(
      project.scalingInfo.proofSystem,
      zkCatalogProjects,
    ),
    purposes: project.scalingInfo.purposes,
    stacks: project.scalingInfo.stacks,
    risks: getL2Risks(
      project.scalingRisks.stacked ?? project.scalingRisks.self,
    ),
    totalTvs: latestTvs?.breakdown.total,
    tvsOrder: latestTvs?.breakdown.total ?? -1,
  }
}
