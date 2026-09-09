import type {
  Project,
  ProjectScalingCategory,
  ProjectScalingProofSystem,
  ProjectScalingStack,
  TableReadyValue,
} from '@l2beat/config'
import { TrackedTxsConfigSubtypeValues, UnixTime } from '@l2beat/shared-pure'
import { groupByL2Tabs } from '~/pages/layer2s/utils/groupByL2Tabs'
import { ps } from '~/server/projects'
import { getProofSystemWithName } from '~/utils/project/getProofSystemWithName'
import type { ProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { CommonL2Entry } from '../getCommonL2Entry'
import { getCommonL2Entry } from '../getCommonL2Entry'
import { get7dTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import { compareTvs } from '../tvs/utils/compareTvs'
import { getApprovedOngoingAnomalies } from './getApprovedOngoingAnomalies'
import { getLiveness } from './getLiveness'
import type { LivenessAnomaly, LivenessProject } from './types'
import { getHasTrackedContractChanged } from './utils/getHasTrackedContractChanged'
import { getLivenessSyncWarning } from './utils/isLivenessSynced'
import {
  type LivenessData,
  transformLivenessData,
} from './utils/transformLivenessData'

export async function getL2LivenessEntries() {
  const [
    tvs,
    projectsChangeReport,
    liveness,
    projects,
    zkCatalogProjects,
    projectsOngoingAnomalies,
  ] = await Promise.all([
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
      optional: ['scalingDa', 'contracts'],
      where: ['scalingInfo'],
      whereNot: ['archivedAt'],
    }),
    ps.getProjects({
      select: ['zkCatalogInfo'],
    }),
    getApprovedOngoingAnomalies(),
  ])

  const entries = projects
    .map((project) =>
      getL2LivenessEntry(
        project,
        projectsChangeReport,
        liveness[project.id.toString()],
        tvs.projects[project.id]?.breakdown.total,
        zkCatalogProjects,
        !!projectsOngoingAnomalies[project.id.toString()],
      ),
    )
    .filter((x) => x !== undefined)
    .sort(compareTvs)

  return groupByL2Tabs(entries)
}

export interface L2LivenessEntry extends CommonL2Entry {
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

function getL2LivenessEntry(
  project: Project<
    | 'scalingInfo'
    | 'statuses'
    | 'livenessInfo'
    | 'display'
    | 'trackedTxsConfig',
    'scalingDa' | 'contracts'
  >,
  projectsChangeReport: ProjectsChangeReport,
  liveness: LivenessProject | undefined,
  tvs: number | undefined,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
  ongoingAnomaly: boolean,
): L2LivenessEntry | undefined {
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
    ...getCommonL2Entry({
      project,
      changes,
      syncWarning,
      ongoingAnomaly,
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
