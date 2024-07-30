import {
  assert,
  type LivenessApiProject,
  UnixTime,
  type LivenessApiResponse,
  type TrackedTxsConfigSubtype,
  type SavedConfiguration,
  type LivenessDetails,
  type LivenessAnomaly,
} from '@l2beat/shared-pure'
import { getSavedConfigurations } from './get-saved-configurations'
import {
  getActiveConfigurations,
  getSyncedUntil,
  type TrackedTxConfigEntry,
} from '@l2beat/shared'
import { db } from '~/server/database'
import { bridges, layer2s, layer3s } from '@l2beat/config/build/src/projects'
import {
  type BackendProject,
  bridgeToBackendProject,
  layer2ToBackendProject,
  layer3ToBackendProject,
} from '@l2beat/config'
import {
  type AnomalyRecord,
  type AggregatedLivenessRecord,
} from '@l2beat/database'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'

export async function getLiveness() {
  noStore()
  return getCachedLiveness()
}

const getCachedLiveness = cache(
  async () => {
    const backendProjects = [
      ...layer2s.map(layer2ToBackendProject),
      ...layer3s.map(layer3ToBackendProject),
      ...bridges.map(bridgeToBackendProject),
    ]

    const projects: LivenessApiResponse['projects'] = {}

    const configurations = await getSavedConfigurations<TrackedTxConfigEntry>({
      indexerId: 'tracked_txs_indexer',
    })

    for (const project of backendProjects) {
      const activeConfigs = getActiveConfigurations(project, configurations)

      if (!activeConfigs) {
        continue
      }

      const aggregatedLivenessRecords =
        await db.aggregatedLiveness.getByProjectId(project.projectId)

      const last30Days = UnixTime.now().add(-30, 'days').toStartOf('day')
      const anomalyRecords = await db.anomalies.getByProjectIdFrom(
        project.projectId,
        last30Days,
      )

      const livenessData: LivenessApiProject = {
        stateUpdates: mapAggregatedLivenessRecords(
          aggregatedLivenessRecords,
          'stateUpdates',
          project,
          configurations,
        ),
        batchSubmissions: mapAggregatedLivenessRecords(
          aggregatedLivenessRecords,
          'batchSubmissions',
          project,
          configurations,
        ),
        proofSubmissions: mapAggregatedLivenessRecords(
          aggregatedLivenessRecords,
          'proofSubmissions',
          project,
          configurations,
        ),
        anomalies: mapAnomalyRecords(anomalyRecords),
      }

      // duplicate data from one subtype to another if configured
      if (project.livenessConfig) {
        const { from, to } = project.livenessConfig.duplicateData
        const data = livenessData[from]
        assert(data, 'From data must exist')
        livenessData[to] = { ...data }
      }

      projects[project.projectId.toString()] = livenessData
    }

    return projects
  },
  ['getLiveness'],
  {
    revalidate: 60 * 60,
  },
)

function mapAggregatedLivenessRecords(
  records: AggregatedLivenessRecord[],
  subtype: TrackedTxsConfigSubtype,
  project: BackendProject,
  configurations: Omit<
    SavedConfiguration<TrackedTxConfigEntry>,
    'properties'
  >[],
): LivenessDetails {
  const syncedUntil = getSyncedUntil(
    configurations.filter((c) => {
      const config = project.trackedTxsConfig?.find((pc) => pc.id === c.id)
      return config?.subtype === subtype
    }),
  )

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
    last30Days: last30Days
      ? {
          averageInSeconds: last30Days.avg,
          minimumInSeconds: last30Days.min,
          maximumInSeconds: last30Days.max,
        }
      : undefined,
    last90Days: last90Days
      ? {
          averageInSeconds: last90Days.avg,
          minimumInSeconds: last90Days.min,
          maximumInSeconds: last90Days.max,
        }
      : undefined,
    allTime: max
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
