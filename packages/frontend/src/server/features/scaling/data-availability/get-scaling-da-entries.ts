import type {
  Project,
  ProjectDataAvailability,
  ScalingProjectCategory,
  ScalingProjectStack,
} from '@l2beat/config'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '~/app/(side-nav)/data-availability/_utils/map-risks-to-rosette-values'
import type { RosetteValue } from '~/components/rosette/types'
import { ps } from '~/server/projects'
import { groupByTabs } from '~/utils/group-by-tabs'
import type { ProjectChanges } from '../../projects-change-report/get-projects-change-report'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import type { CommonScalingEntry } from '../get-common-scaling-entry'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvsUsd } from '../tvs/utils/get-latest-tvs-usd'
import { compareStageAndTvs } from '../utils/compare-stage-and-tvs'

export async function getScalingDaEntries() {
  const [tvs, projectsChangeReport, projects, daLayers, daBridges] =
    await Promise.all([
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
    ])
  const entries = projects
    .map((project) => {
      const risks = getRisks(project, daLayers, daBridges)
      return getScalingDaEntry(
        project,
        risks,
        projectsChangeReport.getChanges(project.id),
        tvs[project.id],
      )
    })
    .filter((entry) => entry !== undefined)
    .sort(compareStageAndTvs)

  return groupByTabs(entries)
}

export interface ScalingDaEntry extends CommonScalingEntry {
  category: ScalingProjectCategory
  dataAvailability: ProjectDataAvailability
  stack: ScalingProjectStack | undefined
  tvsOrder: number
  risks: EntryRisks | undefined
}

function getScalingDaEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'scalingDa' | 'display',
    'customDa'
  >,
  risks: EntryRisks | undefined,
  changes: ProjectChanges,
  tvs: number | undefined,
): ScalingDaEntry {
  return {
    ...getCommonScalingEntry({ project, changes }),
    category: project.scalingInfo.type,
    dataAvailability: project.scalingDa,
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
): EntryRisks | undefined {
  if (project.customDa) {
    return {
      daLayer: mapLayerRisksToRosetteValues(project.customDa.risks),
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

  return {
    daLayer: mapLayerRisksToRosetteValues(daLayerProject.daLayer.risks),
    daBridge: daBridgeProject
      ? mapBridgeRisksToRosetteValues(daBridgeProject.daBridge.risks)
      : mapBridgeRisksToRosetteValues({ isNoBridge: true }),
  }
}
