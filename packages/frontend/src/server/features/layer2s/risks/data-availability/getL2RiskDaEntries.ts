import type {
  Project,
  ProjectScalingDa,
  ProjectScalingProofSystem,
  ProjectScalingStack,
} from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { RosetteValue } from '~/components/rosette/types'
import { groupByL2Tabs } from '~/pages/layer2s/utils/groupByL2Tabs'
import {
  getProjectsDataPosted,
  type ProjectDataPosted,
} from '~/server/features/data-availability/throughput/getProjectsDataPosted'
import { ps } from '~/server/projects'
import { getProofSystemWithName } from '~/utils/project/getProofSystemWithName'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '~/utils/project/mapDaRisksToRosetteValues'
import { getDaLayerRisks } from '../../../data-availability/utils/getDaLayerRisks'
import type { ProjectsEconomicSecurity } from '../../../data-availability/utils/getDaProjectsEconomicSecurity'
import { getDaProjectsEconomicSecurity } from '../../../data-availability/utils/getDaProjectsEconomicSecurity'
import {
  getDaProjectsTvs,
  pickTvsForProjects,
} from '../../../data-availability/utils/getDaProjectsTvs'
import { getDaUsers } from '../../../data-availability/utils/getDaUsers'
import type { ProjectChanges } from '../../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../../projects-change-report/getProjectsChangeReport'
import type { CommonL2Entry } from '../../getCommonL2Entry'
import { getCommonL2Entry } from '../../getCommonL2Entry'
import { get7dTvsBreakdown } from '../../tvs/get7dTvsBreakdown'
import { compareTvs } from '../../tvs/utils/compareTvs'

export async function getL2RiskDaEntries() {
  const [
    tvs,
    projectsChangeReport,
    projects,
    daLayers,
    daBridges,
    zkCatalogProjects,
    projectsEconomicSecurity,
  ] = await Promise.all([
    get7dTvsBreakdown({ type: 'layer2' }),
    getProjectsChangeReport(),
    ps.getProjects({
      select: ['statuses', 'scalingInfo', 'scalingDa', 'display'],
      optional: ['customDa', 'contracts', 'daTrackingConfig'],
      where: ['scalingInfo'],
      whereNot: ['archivedAt'],
    }),
    ps.getProjects({
      select: ['daLayer'],
    }),
    ps.getProjects({
      select: ['daBridge'],
    }),
    ps.getProjects({
      select: ['zkCatalogInfo'],
    }),
    getDaProjectsEconomicSecurity(),
  ])

  const dacs = projects.filter((p) => !!p.customDa) as Project<'customDa'>[]

  const uniqueProjectsInUse = getDaUsers(daLayers, daBridges, dacs)
  const [tvsPerProject, dataPostedByProject] = await Promise.all([
    getDaProjectsTvs(uniqueProjectsInUse),
    getProjectsDataPosted(
      projects
        .filter((project) => project.daTrackingConfig)
        .map((project) => project.id),
    ),
  ])
  const getTvs = pickTvsForProjects(tvsPerProject)

  const entries = projects
    .map((project) => {
      const risks = getRisks(
        project,
        daLayers,
        daBridges,
        getTvs,
        projectsEconomicSecurity,
      )
      return getL2RiskDaEntry(
        project,
        risks,
        projectsChangeReport.getChanges(project.id),
        tvs.projects[project.id]?.breakdown.total,
        zkCatalogProjects,
        dataPostedByProject[project.id],
      )
    })
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
  risks: EntryRisks[] | undefined
}

function getL2RiskDaEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'scalingDa' | 'display',
    'customDa' | 'contracts'
  >,
  risks: L2RiskDaEntry['risks'] | undefined,
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
    risks,
    tvsOrder: tvs ?? -1,
  }
}

interface EntryRisks {
  daLayer: RosetteValue[]
  daBridge: RosetteValue[]
}
function getRisks(
  project: Project<
    'scalingInfo' | 'statuses' | 'scalingDa' | 'display',
    'customDa'
  >,
  daLayers: Project<'daLayer'>[],
  daBridges: Project<'daBridge'>[],
  getTvs: (projectIds: ProjectId[]) => {
    latest: number
    sevenDaysAgo: number
  },
  projectsEconomicSecurity: ProjectsEconomicSecurity,
): L2RiskDaEntry['risks'] | undefined {
  return project.scalingDa
    .map((da) => {
      if (da.layer.value === 'DAC' && project.customDa) {
        return {
          daLayer: mapLayerRisksToRosetteValues(
            getDaLayerRisks(project.customDa),
          ),
          daBridge: mapBridgeRisksToRosetteValues(project.customDa.risks),
        }
      }
      const daLayerProject =
        da === undefined
          ? undefined
          : daLayers.find((daLayer) => daLayer.id === da.layer.projectId)

      const daBridgeProject =
        da === undefined
          ? undefined
          : daBridges.find((daBridge) => daBridge.id === da.bridge.projectId)

      if (!daLayerProject) {
        return undefined
      }
      const usedProjectIds = daBridgeProject
        ? daBridgeProject.daBridge.usedIn.map((project) => project.id)
        : daLayerProject.daLayer.usedWithoutBridgeIn.map(
            (project) => project.id,
          )

      const tvs = getTvs(usedProjectIds).latest
      const economicSecurity = projectsEconomicSecurity[daLayerProject.id]

      return {
        daLayer: mapLayerRisksToRosetteValues(
          getDaLayerRisks(daLayerProject.daLayer, tvs, economicSecurity),
        ),
        daBridge: daBridgeProject
          ? mapBridgeRisksToRosetteValues(daBridgeProject.daBridge.risks)
          : mapBridgeRisksToRosetteValues({ isNoBridge: true }),
      }
    })
    .filter((da) => da !== undefined)
}
