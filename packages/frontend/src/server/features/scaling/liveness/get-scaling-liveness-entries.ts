import type {
  Project,
  ProjectScalingCategory,
  ProjectScalingStack,
  TableReadyValue,
} from '@l2beat/config'
import { TrackedTxsConfigSubtypeValues, UnixTime } from '@l2beat/shared-pure'
import { groupByScalingTabs } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { ps } from '~/server/projects'
import type {
  ProjectsChangeReport
} from '../../projects-change-report/get-projects-change-report'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import type { CommonScalingEntry } from '../get-common-scaling-entry'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvsUsd } from '../tvs/utils/get-latest-tvs-usd'
import { compareStageAndTvs } from '../utils/compare-stage-and-tvs'
import { getLiveness } from './get-liveness'
import type { LivenessAnomaly, LivenessProject } from './types'
import { getHasTrackedContractChanged } from './utils/get-has-tracked-contract-changed'
import { getLivenessSyncWarning } from './utils/is-liveness-synced'
import {
  type LivenessData,
  transformLivenessData,
} from './utils/transform-liveness-data'

export async function getScalingLivenessEntries() {
  const [tvs, projectsChangeReport, liveness, projects] = await Promise.all([
    getProjectsLatestTvsUsd(),
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
      whereNot: ['isUpcoming', 'isArchived'],
    }),
  ])

  const entries = projects
    .map((project) =>
      getScalingLivenessEntry(
        project,
        projectsChangeReport,
        liveness[project.id.toString()],
        tvs[project.id],
      ),
    )
    .filter((x) => x !== undefined)
    .sort(compareStageAndTvs)

  return groupByScalingTabs(entries)
}

export interface ScalingLivenessEntry extends CommonScalingEntry {
  category: ProjectScalingCategory
  stack: ProjectScalingStack | undefined
  data: LivenessData
  explanation: string | undefined
  anomalies: LivenessAnomaly[]
  dataAvailabilityMode: TableReadyValue | undefined
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
    ...getCommonScalingEntry({ project, changes, syncWarning }),
    category: project.scalingInfo.type,
    stack: project.scalingInfo.stack,
    data,
    explanation: project.livenessInfo?.explanation,
    anomalies: liveness.anomalies,
    dataAvailabilityMode: project.scalingDa?.mode,
    tvsOrder: tvs ?? -1,
    hasTrackedContractsChanged,
  }
}

function getLowestSyncedUntil(liveness: LivenessProject): UnixTime {
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
