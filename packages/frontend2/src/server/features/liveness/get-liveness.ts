import {
  type AggregatedLivenessRecord,
  type AnomalyRecord,
  type IndexerConfigurationRecord,
} from '@l2beat/database'
import {
  assert,
  type LivenessAnomaly,
  type LivenessApiProject,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { unstable_noStore as noStore, unstable_cache } from 'next/cache'
import { db } from '~/server/database'
import { getConfigurationsSyncedUntil } from '../utils/get-configurations-synced-until'
import {
  type TrackedTxsProject,
  getTrackedTxsProjects,
} from '../utils/get-tracked-txs-projects'
import { getLivenessProjects } from './get-liveness-projects'
import { type LivenessDetails, type LivenessResponse } from './types'

export async function getLiveness() {
  noStore()
  return getCachedLiveness()
}

const getCachedLiveness = unstable_cache(
  async () => {
    const projects: LivenessResponse = {}

    const configurations = await db.indexerConfiguration.getByIndexerId(
      'tracked_txs_indexer',
    )

    const trackedTxsProjects = getTrackedTxsProjects(
      getLivenessProjects(),
      configurations,
      'liveness',
    )

    const projectIds = trackedTxsProjects.map((p) => p.id)

    const records = await db.aggregatedLiveness.getByProjectIds(projectIds)
    const recordsByProjectId = groupBy(records, (r) => r.projectId)

    const last30Days = UnixTime.now().add(-30, 'days').toStartOf('day')
    const anomalyRecords = await db.anomalies.getByProjectIdsFrom(
      projectIds,
      last30Days,
    )
    const anomaliesByProjectId = groupBy(anomalyRecords, (r) => r.projectId)

    for (const project of trackedTxsProjects) {
      const projectRecords = recordsByProjectId[project.id]
      if (!projectRecords) {
        continue
      }
      const anomalies = anomaliesByProjectId[project.id] ?? []

      const livenessData: LivenessApiProject = {
        stateUpdates: mapAggregatedLivenessRecords(
          projectRecords,
          'stateUpdates',
          project,
          configurations,
        ),
        batchSubmissions: mapAggregatedLivenessRecords(
          projectRecords,
          'batchSubmissions',
          project,
          configurations,
        ),
        proofSubmissions: mapAggregatedLivenessRecords(
          projectRecords,
          'proofSubmissions',
          project,
          configurations,
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
  },
  ['liveness'],
  {
    revalidate: 10 * UnixTime.MINUTE,
  },
)

function mapAggregatedLivenessRecords(
  records: AggregatedLivenessRecord[],
  subtype: TrackedTxsConfigSubtype,
  project: TrackedTxsProject,
  configurations: IndexerConfigurationRecord[],
): LivenessDetails {
  const filteredConfigurations = configurations.filter((c) => {
    const config = project.trackedTxsConfigs?.find((pc) => pc.id === c.id)
    return config?.subtype === subtype
  })
  const syncedUntil = getConfigurationsSyncedUntil(filteredConfigurations)
  if (!syncedUntil) {
    return undefined
  }

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
    syncedUntil,
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
