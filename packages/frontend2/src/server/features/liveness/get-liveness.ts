import {
  assert,
  type LivenessApiProject,
  UnixTime,
  type TrackedTxsConfigSubtype,
  type LivenessAnomaly,
} from '@l2beat/shared-pure'
import { db } from '~/server/database'
import { layer2s } from '@l2beat/config/build/src/projects'
import {
  type AnomalyRecord,
  type AggregatedLivenessRecord,
} from '@l2beat/database'
import { unstable_noStore as noStore } from 'next/cache'
import { groupBy } from 'lodash'
import { filteredWithSyncedUntil } from '../utils/filtered-with-synced-until'
import { type LivenessResponse, type LivenessDetails } from './types'

export async function getLiveness() {
  noStore()
  return getCachedLiveness()
}

const getCachedLiveness = async (): Promise<LivenessResponse> => {
  const backendProjects = layer2s

  const projects: LivenessResponse = {}

  const configurations = await db.indexerConfiguration.getByIndexerId(
    'tracked_txs_indexer',
  )

  const filteredProjects = filteredWithSyncedUntil(
    backendProjects,
    configurations,
  )

  const projectIds = filteredProjects.map((p) => p.id)

  const records = await db.aggregatedLiveness.getByProjectIds(projectIds)
  const recordsByProjectId = groupBy(records, (r) => r.projectId)

  const last30Days = UnixTime.now().add(-30, 'days').toStartOf('day')
  const anomalyRecords = await db.anomalies.getByProjectIdsFrom(
    projectIds,
    last30Days,
  )
  const anomaliesByProjectId = groupBy(anomalyRecords, (r) => r.projectId)

  for (const project of filteredProjects) {
    const projectRecords = recordsByProjectId[project.id]
    if (!projectRecords) {
      continue
    }
    const anomalies = anomaliesByProjectId[project.id] ?? []

    const livenessData: LivenessApiProject = {
      stateUpdates: mapAggregatedLivenessRecords(
        projectRecords,
        'stateUpdates',
      ),
      batchSubmissions: mapAggregatedLivenessRecords(
        projectRecords,
        'batchSubmissions',
      ),
      proofSubmissions: mapAggregatedLivenessRecords(
        projectRecords,
        'proofSubmissions',
      ),
      anomalies: mapAnomalyRecords(anomalies),
    }
    // duplicate data from one subtype to another if configured
    if (project.config.liveness) {
      const { from, to } = project.config.liveness.duplicateData
      const data = livenessData[from]
      assert(data, 'From data must exist')
      livenessData[to] = { ...data }
    }

    projects[project.id.toString()] = livenessData
  }

  return projects
}

function mapAggregatedLivenessRecords(
  records: AggregatedLivenessRecord[],
  subtype: TrackedTxsConfigSubtype,
): LivenessDetails {
  const last30Days = records.find(
    (r) => r.subtype === subtype && r.range === '30D',
  )
  const last90Days = records.find(
    (r) => r.subtype === subtype && r.range === '90D',
  )
  const max = records.find((r) => r.subtype === subtype && r.range === 'MAX')
  return {
    '30d': last30Days
      ? {
          averageInSeconds: last30Days.avg,
          minimumInSeconds: last30Days.min,
          maximumInSeconds: last30Days.max,
        }
      : undefined,
    '90d': last90Days
      ? {
          averageInSeconds: last90Days.avg,
          minimumInSeconds: last90Days.min,
          maximumInSeconds: last90Days.max,
        }
      : undefined,
    max: max
      ? {
          averageInSeconds: max.avg,
          minimumInSeconds: max.min,
          maximumInSeconds: max.max,
        }
      : undefined,
    syncedUntil: UnixTime.now(),
  }
}

function mapAnomalyRecords(records: AnomalyRecord[]): LivenessAnomaly[] {
  return records.map((a) => ({
    // TODO: validate if it makes sense to pass the end of anomaly rather than the start
    timestamp: new UnixTime(a.timestamp.toNumber() + a.duration),
    durationInSeconds: a.duration,
    type: a.subtype,
  }))
}
