import type {
  Project,
  ProjectScalingCategory,
  ProjectScalingProofSystem,
  ProjectScalingStack,
} from '@l2beat/config'
import type { RosetteValue } from '~/components/rosette/types'
import { getL2Risks } from '~/pages/layer2s/utils/getL2Risks'
import { ps } from '~/server/projects'
import { getProofSystemWithName } from '~/utils/project/getProofSystemWithName'
import type { ProjectChanges } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { CommonL2Entry } from '../getCommonL2Entry'
import { getCommonL2Entry } from '../getCommonL2Entry'
import type { ProjectSevenDayTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import { get7dTvsBreakdown } from '../tvs/get7dTvsBreakdown'

export async function getL2ArchivedEntries() {
  const [projectsChangeReport, tvs, projects, zkCatalogProjects] =
    await Promise.all([
      getProjectsChangeReport(),
      get7dTvsBreakdown({ type: 'layer2' }),
      ps.getProjects({
        select: ['statuses', 'scalingInfo', 'scalingRisks', 'display'],
        optional: ['contracts'],
        where: ['scalingInfo', 'archivedAt'],
      }),
      ps.getProjects({
        select: ['zkCatalogInfo'],
      }),
    ])

  const entries = projects.map((project) =>
    getL2ArchivedEntry(
      project,
      projectsChangeReport.getChanges(project.id),
      tvs.projects[project.id.toString()],
      zkCatalogProjects,
    ),
  )

  return entries.sort((a, b) => {
    const tvsDifference = (b.totalTvs ?? -1) - (a.totalTvs ?? -1)
    return tvsDifference !== 0 ? tvsDifference : a.name.localeCompare(b.name)
  })
}

export interface L2ArchivedEntry extends Omit<CommonL2Entry, 'tab'> {
  type: ProjectScalingCategory | undefined
  proofSystem: ProjectScalingProofSystem | undefined
  purposes: string[]
  stacks: ProjectScalingStack[] | undefined
  risks: RosetteValue[] | undefined
  totalTvs: number | undefined
}

function getL2ArchivedEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'scalingRisks' | 'display',
    'contracts'
  >,
  changes: ProjectChanges,
  latestTvs: ProjectSevenDayTvsBreakdown | undefined,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
): L2ArchivedEntry {
  const { tab: _tab, ...commonEntry } = getCommonL2Entry({
    project,
    changes,
  })

  return {
    ...commonEntry,
    type: project.scalingInfo.type,
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
  }
}
