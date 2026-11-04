import type {
  Project,
  ProjectScalingDa,
  ProjectScalingProofSystem,
  ProjectScalingStack,
} from '@l2beat/config'
import { groupByL2Tabs } from '~/pages/layer2s/utils/groupByL2Tabs'
import {
  getProjectsDataPosted,
  type ProjectDataPosted,
} from '~/server/features/data-availability/throughput/getProjectsDataPosted'
import { ps } from '~/server/projects'
import { getProofSystemWithName } from '~/utils/project/getProofSystemWithName'
import type { ProjectChanges } from '../../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../../projects-change-report/getProjectsChangeReport'
import type { CommonL2Entry } from '../../getCommonL2Entry'
import { getCommonL2Entry } from '../../getCommonL2Entry'
import { get7dTvsBreakdown } from '../../tvs/get7dTvsBreakdown'
import { compareTvs } from '../../tvs/utils/compareTvs'

export async function getL2RiskDaEntries() {
  const [tvs, projectsChangeReport, projects, zkCatalogProjects] =
    await Promise.all([
      get7dTvsBreakdown({ type: 'layer2' }),
      getProjectsChangeReport(),
      ps.getProjects({
        select: ['statuses', 'scalingInfo', 'scalingDa', 'display'],
        optional: ['contracts', 'daTrackingConfig'],
        where: ['scalingInfo'],
        whereNot: ['archivedAt'],
      }),
      ps.getProjects({
        select: ['zkCatalogInfo'],
      }),
    ])

  const dataPostedByProject = await getProjectsDataPosted(
    projects
      .filter((project) => project.daTrackingConfig)
      .map((project) => project.id),
  )

  const entries = projects
    .map((project) =>
      getL2RiskDaEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvs.projects[project.id]?.breakdown.total,
        zkCatalogProjects,
        dataPostedByProject[project.id],
      ),
    )
    .filter((entry) => entry !== undefined)
    .sort(compareTvs)

  return groupByL2Tabs(entries)
}

export interface L2RiskDaEntry extends CommonL2Entry {
  proofSystem: ProjectScalingProofSystem | undefined
  dataAvailability: ProjectScalingDa[]
  stacks: ProjectScalingStack[] | undefined
  tvsOrder: number
  dataPosted: ProjectDataPosted | undefined
}

function getL2RiskDaEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'scalingDa' | 'display',
    'contracts'
  >,
  changes: ProjectChanges,
  tvs: number | undefined,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
  dataPosted: ProjectDataPosted | undefined,
): L2RiskDaEntry {
  return {
    ...getCommonL2Entry({ project, changes }),
    dataAvailability: project.scalingDa,
    proofSystem: getProofSystemWithName(
      project.scalingInfo.proofSystem,
      zkCatalogProjects,
    ),
    stacks: project.scalingInfo.stacks,
    dataPosted,
    tvsOrder: tvs ?? -1,
  }
}
