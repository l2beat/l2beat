import type {
  Project,
  ProjectScalingCategory,
  ProjectScalingDa,
  ProjectScalingStack,
} from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '~/app/(side-nav)/data-availability/_utils/map-risks-to-rosette-values'
import { groupByScalingTabs } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import type { RosetteValue } from '~/components/rosette/types'
import { ps } from '~/server/projects'
import { getDaLayerRisks } from '../../data-availability/utils/get-da-layer-risks'
import type { ProjectsEconomicSecurity } from '../../data-availability/utils/get-da-projects-economic-security'
import { getDaProjectsEconomicSecurity } from '../../data-availability/utils/get-da-projects-economic-security'
import {
  getDaProjectsTvs,
  pickTvsForProjects,
} from '../../data-availability/utils/get-da-projects-tvs'
import { getDaUsers } from '../../data-availability/utils/get-da-users'
import type { ProjectChanges } from '../../projects-change-report/get-projects-change-report'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import type { CommonScalingEntry } from '../get-common-scaling-entry'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvsUsd } from '../tvs/utils/get-latest-tvs-usd'
import { compareStageAndTvs } from '../utils/compare-stage-and-tvs'

export async function getScalingDaEntries() {
  const [
    tvs,
    projectsChangeReport,
    projects,
    daLayers,
    daBridges,
    projectsEconomicSecurity,
  ] = await Promise.all([
    getProjectsLatestTvsUsd(),
    getProjectsChangeReport(),
    ps.getProjects({
      select: ['statuses', 'scalingInfo', 'scalingDa', 'display'],
      optional: ['customDa'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'isArchived'],
    }),
    ps.getProjects({
      select: ['daLayer'],
    }),
    ps.getProjects({
      select: ['daBridge'],
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
        tvs[project.id],
      )
    })
    .filter((entry) => entry !== undefined)
    .sort(compareStageAndTvs)

  return groupByScalingTabs(entries)
}

export interface ScalingDaEntry extends CommonScalingEntry {
  category: ProjectScalingCategory
  dataAvailability: ProjectScalingDa
  stack: ProjectScalingStack | undefined
  tvsOrder: number
  risks: EntryRisks | undefined
  daHref:
    | {
        summary: string
        risk: string | undefined
      }
    | undefined
}

function getScalingDaEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'scalingDa' | 'display',
    'customDa'
  >,
  risks: EntryRisks | undefined,
  daLayers: Project<'daLayer'>[],
  changes: ProjectChanges,
  tvs: number | undefined,
): ScalingDaEntry {
  return {
    ...getCommonScalingEntry({ project, changes }),
    category: project.scalingInfo.type,
    dataAvailability: project.scalingDa,
    daHref: getDaHref(project, daLayers),
    stack: project.scalingInfo.stack,
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
): EntryRisks | undefined {
  if (project.customDa) {
    return {
      daLayer: mapLayerRisksToRosetteValues(getDaLayerRisks(project.customDa)),
      daBridge: mapBridgeRisksToRosetteValues(project.customDa.risks),
    }
  }

  const daLayerProject = daLayers.find(
    (daLayer) => daLayer.id === project.scalingDa.layer.projectId,
  )
  const daBridgeProject = daBridges.find(
    (daBridge) => daBridge.id === project.scalingDa.bridge.projectId,
  )
  if (!daLayerProject) {
    return undefined
  }
  const usedProjectIds = daBridgeProject
    ? daBridgeProject.daBridge.usedIn.map((project) => project.id)
    : daLayerProject.daLayer.usedWithoutBridgeIn.map((project) => project.id)
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
}

function getDaHref(
  project: Project<
    'scalingInfo' | 'statuses' | 'scalingDa' | 'display',
    'customDa'
  >,
  daLayers: Project<'daLayer'>[],
) {
  if (project.customDa) {
    return {
      summary: `/data-availability/summary?tab=custom&highlight=${project.slug}`,
      risk: `/data-availability/risk?tab=custom&highlight=${project.slug}`,
    }
  }

  const daLayer = daLayers.find(
    (l) => l.id === project.scalingDa.layer.projectId,
  )

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
