import type {
  Project,
  ProjectScalingCategory,
  ProjectScalingProofSystem,
  ProjectScalingStack,
  TableReadyValue,
} from '@l2beat/config'
import { TrackedTxsConfigSubtypeValues, UnixTime } from '@l2beat/shared-pure'
import { groupByScalingTabs } from '~/pages/scaling/utils/groupByScalingTabs'
import { ps } from '~/server/projects'
import { getProofSystemWithName } from '~/utils/project/getProofSystemWithName'
import type { ProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { CommonScalingEntry } from '../getCommonScalingEntry'
import { getCommonScalingEntry } from '../getCommonScalingEntry'
import { get7dTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import { compareTvs } from '../tvs/utils/compareTvs'
import { getLiveness } from './getLiveness'
import type { LivenessAnomaly, LivenessProject } from './types'
import { getHasTrackedContractChanged } from './utils/getHasTrackedContractChanged'
import { getLivenessSyncWarning } from './utils/isLivenessSynced'
import {
  type LivenessData,
  transformLivenessData,
} from './utils/transformLivenessData'

export async function getScalingLivenessEntries() {
  const [tvs, projectsChangeReport, liveness, projects, zkCatalogProjects] =
    await Promise.all([
      get7dTvsBreakdown({ type: 'layer2' }),
      getProjectsChangeReport(),
      getLiveness(),
      ps.getProjects({
        select: [
          'statuses',
          'scalingInfo',
          'livenessInfo',
          'display',
          'trackedTxsConfig',
        ],
        optional: ['scalingDa'],
        where: ['isScaling'],
        whereNot: ['isUpcoming', 'archivedAt'],
      }),
      ps.getProjects({
        select: ['zkCatalogInfo'],
      }),
    ])

  const entries = projects
    .map((project) =>
      getScalingLivenessEntry(
        project,
        projectsChangeReport,
        liveness[project.id.toString()],
        tvs.projects[project.id]?.breakdown.total,
        zkCatalogProjects,
      ),
    )
    .filter((x) => x !== undefined)
    .sort(compareTvs)

  return groupByScalingTabs(entries)
}

export interface ScalingLivenessEntry extends CommonScalingEntry {
  proofSystem: ProjectScalingProofSystem | undefined
  category: ProjectScalingCategory | undefined
  stacks: ProjectScalingStack[] | undefined
  data: LivenessData
  explanation: string | undefined
  anomalies: LivenessAnomaly[]
  dataAvailabilityMode: TableReadyValue[] | undefined
  hasTrackedContractsChanged: boolean
  tvsOrder: number
}

function getScalingLivenessEntry(
  project: Project<
    | 'scalingInfo'
    | 'statuses'
    | 'livenessInfo'
    | 'display'
    | 'trackedTxsConfig',
    'scalingDa'
  >,
  projectsChangeReport: ProjectsChangeReport,
  liveness: LivenessProject | undefined,
  tvs: number | undefined,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
): ScalingLivenessEntry | undefined {
  if (!liveness) {
    return undefined
  }

  const hasTrackedContractsChanged = getHasTrackedContractChanged(
    project,
    projectsChangeReport.projects[project.id],
  )

  const changes = projectsChangeReport.getChanges(project.id)
  const lowestSyncedUntil = getLowestSyncedUntil(liveness)
  const syncWarning = getLivenessSyncWarning(lowestSyncedUntil)
  const data = transformLivenessData(liveness, project, !syncWarning)
  return {
    ...getCommonScalingEntry({
      project,
      changes,
      syncWarning,
      ongoingAnomaly: liveness.anomalies.some((a) => a.end === undefined),
    }),
    stacks: project.scalingInfo.stacks,
    proofSystem: getProofSystemWithName(
      project.scalingInfo.proofSystem,
      zkCatalogProjects,
    ),
    category: project.scalingInfo.type,
    data,
    explanation: project.livenessInfo?.explanation,
    anomalies: liveness.anomalies,
    dataAvailabilityMode: project.scalingDa?.map((da) => da.mode),
    tvsOrder: tvs ?? -1,
    hasTrackedContractsChanged,
  }
}

export function getLowestSyncedUntil(liveness: LivenessProject): UnixTime {
  let lowestSyncedUntil = UnixTime.now()

  for (const subtype of TrackedTxsConfigSubtypeValues) {
    const data = liveness[subtype]
    if (!data) {
      continue
    }
    const syncedUntil = UnixTime(data.syncedUntil)
    if (syncedUntil < lowestSyncedUntil) {
      lowestSyncedUntil = syncedUntil
    }
  }
  return lowestSyncedUntil
}
