import type {
  Project,
  ProjectScalingDa,
  ProjectScalingProofSystem,
  ProjectScalingStack,
} from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import type { RosetteValue } from '~/components/rosette/types'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '~/pages/data-availability/utils/MapRisksToRosetteValues'
import { groupByScalingTabs } from '~/pages/scaling/utils/groupByScalingTabs'
import { ps } from '~/server/projects'
import { getProofSystemWithName } from '~/utils/project/getProofSystemWithName'
import { getDaLayerRisks } from '../../data-availability/utils/getDaLayerRisks'
import type { ProjectsEconomicSecurity } from '../../data-availability/utils/getDaProjectsEconomicSecurity'
import { getDaProjectsEconomicSecurity } from '../../data-availability/utils/getDaProjectsEconomicSecurity'
import {
  getDaProjectsTvs,
  pickTvsForProjects,
} from '../../data-availability/utils/getDaProjectsTvs'
import { getDaUsers } from '../../data-availability/utils/getDaUsers'
import type { ProjectChanges } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { CommonScalingEntry } from '../getCommonScalingEntry'
import { getCommonScalingEntry } from '../getCommonScalingEntry'
import { get7dTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import { compareTvs } from '../tvs/utils/compareTvs'

export async function getScalingDaEntries() {
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
      optional: ['customDa'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'archivedAt'],
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
  const tvsPerProject = await getDaProjectsTvs(uniqueProjectsInUse)
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
      return getScalingDaEntry(
        project,
        risks,
        daLayers,
        projectsChangeReport.getChanges(project.id),
        tvs.projects[project.id]?.breakdown.total,
        zkCatalogProjects,
      )
    })
    .filter((entry) => entry !== undefined)
    .sort(compareTvs)

  return groupByScalingTabs(entries)
}

export interface ScalingDaEntry extends CommonScalingEntry {
  proofSystem: ProjectScalingProofSystem | undefined
  dataAvailability: (ProjectScalingDa & {
    daHref?: ScalingDaEntryHref
  })[]
  stacks: ProjectScalingStack[] | undefined
  tvsOrder: number
  risks:
    | (EntryRisks & {
        daHref?: ScalingDaEntryHref
      })[]
    | undefined
}

function getScalingDaEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'scalingDa' | 'display',
    'customDa'
  >,
  risks: ScalingDaEntry['risks'] | undefined,
  daLayers: Project<'daLayer'>[],
  changes: ProjectChanges,
  tvs: number | undefined,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
): ScalingDaEntry {
  return {
    ...getCommonScalingEntry({ project, changes }),
    dataAvailability: project.scalingDa.map((da) => ({
      ...da,
      daHref: getDaHref(project, da, daLayers),
    })),
    proofSystem: getProofSystemWithName(
      project.scalingInfo.proofSystem,
      zkCatalogProjects,
    ),
    stacks: project.scalingInfo.stacks,
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
): ScalingDaEntry['risks'] | undefined {
  const risks: ScalingDaEntry['risks'] = []
  if (project.customDa) {
    risks.push({
      daLayer: mapLayerRisksToRosetteValues(getDaLayerRisks(project.customDa)),
      daBridge: mapBridgeRisksToRosetteValues(project.customDa.risks),
      daHref: getDaHref(
        project,
        {
          layer: {
            value: 'DAC',
          },
        } as ProjectScalingDa,
        daLayers,
      ),
    })
  }

  risks.push(
    ...project.scalingDa
      .map((da) => {
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
          daHref: getDaHref(project, da, daLayers),
        }
      })
      .filter((da) => da !== undefined),
  )
  return risks
}

interface ScalingDaEntryHref {
  summary: string
  risk: string | undefined
}
function getDaHref(
  project: Project,
  scalingDa: ProjectScalingDa,
  daLayers: Project<'daLayer'>[],
): ScalingDaEntryHref | undefined {
  if (scalingDa.layer.value === 'DAC') {
    return {
      summary: `/data-availability/summary?tab=custom&highlight=${project.slug}`,
      risk: `/data-availability/risk?tab=custom&highlight=${project.slug}`,
    }
  }

  const daLayer = daLayers.find((l) => l.id === scalingDa.layer.projectId)
  if (!daLayer) {
    return undefined
  }

  return {
    summary: `/data-availability/summary?tab=${daLayer.daLayer.systemCategory}&highlight=${daLayer.slug}`,
    risk:
      daLayer.id === ProjectId.ETHEREUM
        ? undefined
        : `/data-availability/risk?tab=${daLayer.daLayer.systemCategory}&highlight=${daLayer.slug}`,
  }
}
