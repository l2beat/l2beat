import type {
  AggregatedLivenessRecord,
  AnomalyRecord,
  IndexerConfigurationRecord,
} from '@l2beat/database'
import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { groupBy, range } from 'lodash'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getConfigurationsSyncedUntil } from '../../utils/get-configurations-synced-until'
import type { TrackedTxsProject } from '../../utils/get-tracked-txs-projects'
import { getTrackedTxsProjects } from '../../utils/get-tracked-txs-projects'
import type {
  LivenessAnomaly,
  LivenessDataPoint,
  LivenessDetails,
  LivenessProject,
  LivenessResponse,
} from './types'

export async function getLiveness() {
  if (env.MOCK) {
    return getMockLivenessData()
  }

  return getLivenessData()
}

async function getLivenessData() {
  const db = getDb()
  const projects: LivenessResponse = {}

  const configurations = await db.indexerConfiguration.getByIndexerId(
    'tracked_txs_indexer',
  )

  const livenessProjects = await ps.getProjects({
    select: ['trackedTxsConfig'],
    optional: ['livenessConfig'],
    whereNot: ['isUpcoming', 'archivedAt'],
  })

  const trackedTxsProjects = getTrackedTxsProjects(
    livenessProjects,
    configurations,
    'liveness',
  )

  const projectIds = trackedTxsProjects.map((p) => p.id)

  const records = await db.aggregatedLiveness.getByProjectIds(projectIds)
  const recordsByProjectId = groupBy(records, (r) => r.projectId)

  const last30Days = UnixTime.toStartOf(
    UnixTime.now() - 30 * UnixTime.DAY,
    'day',
  )
  const anomalyRecords = await db.anomalies.getByProjectIdsFrom(
    projectIds,
    last30Days,
  )
  const anomaliesByProjectId = groupBy(anomalyRecords, (r) => r.projectId)

  for (const project of trackedTxsProjects) {
    const livenessConfig = livenessProjects.find(
      (p) => p.id === project.id,
    )?.livenessConfig

    const projectRecords = recordsByProjectId[project.id]
    if (!projectRecords) {
      continue
    }
    const anomalies = anomaliesByProjectId[project.id] ?? []

    const livenessData: LivenessProject = {
      stateUpdates: mapAggregatedLivenessRecords(
        projectRecords,
        'stateUpdates',
        project,
        configurations,
        anomalies,
      ),
      batchSubmissions: mapAggregatedLivenessRecords(
        projectRecords,
        'batchSubmissions',
        project,
        configurations,
        anomalies,
      ),
      proofSubmissions: mapAggregatedLivenessRecords(
        projectRecords,
        'proofSubmissions',
        project,
        configurations,
        anomalies,
      ),
      anomalies: mapAnomalyRecords(anomalies),
    }
    // duplicate data from one subtype to another if configured
    if (livenessConfig) {
      const { from, to } = livenessConfig.duplicateData
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
  project: TrackedTxsProject,
  configurations: IndexerConfigurationRecord[],
  anomalies: AnomalyRecord[],
): LivenessDetails | undefined {
  const filteredConfigurations = configurations.filter((c) => {
    const config = project.trackedTxsConfigs?.find((pc) => pc.id === c.id)
    return config?.subtype === subtype
  })
  const syncedUntil = getConfigurationsSyncedUntil(filteredConfigurations)
  if (!syncedUntil) {
    return undefined
  }

  const todaysAnomalies = anomalies.filter(
    (a) =>
      a.subtype === subtype &&
      a.timestamp + a.duration >= UnixTime.toStartOf(UnixTime.now(), 'day'),
  )
  const maxAnomalyDuration = Math.max(...todaysAnomalies.map((a) => a.duration))

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
          maximumInSeconds: Math.max(last30Days.max, maxAnomalyDuration),
        }
      : undefined,
    '90d': last90Days
      ? {
          averageInSeconds: last90Days.avg,
          minimumInSeconds: last90Days.min,
          maximumInSeconds: Math.max(last90Days.max, maxAnomalyDuration),
        }
      : undefined,
    max: max
      ? {
          averageInSeconds: max.avg,
          minimumInSeconds: max.min,
          maximumInSeconds: Math.max(max.max, maxAnomalyDuration),
        }
      : undefined,
    syncedUntil: syncedUntil,
  }
}

function mapAnomalyRecords(records: AnomalyRecord[]): LivenessAnomaly[] {
  return records.map((a) => ({
    // TODO: validate if it makes sense to pass the end of anomaly rather than the start
    timestamp: a.timestamp,
    durationInSeconds: a.duration,
    type: a.subtype,
  }))
}

function getMockLivenessData(): LivenessResponse {
  const projects = [
    'arbitrum',
    'optimism',
    'apex',
    'aevo',
    'base',
    'dydx',
    'brine',
    'linea',
    'myria',
    'scroll',
    'polygonzkevm',
  ].reduce<Record<string, LivenessProject>>((acc, cur) => {
    acc[cur] = generateMockData()
    return acc
  }, {})

  return {
    ...projects,
    linea: {
      ...projects.linea!,
      batchSubmissions: {
        '30d': generateDataPoint(),
        '90d': generateDataPoint(),
        max: generateDataPoint(),
        syncedUntil: UnixTime.toStartOf(
          UnixTime.now() - 2 * UnixTime.HOUR,
          'hour',
        ),
      },
      proofSubmissions: {
        '30d': generateDataPoint(),
        '90d': generateDataPoint(),
        max: generateDataPoint(),
        syncedUntil: UnixTime.toStartOf(UnixTime.now(), 'hour'),
      },
    },
    dydx: {
      ...projects.dydx!,
      stateUpdates: {
        '30d': generateDataPoint(),
        '90d': generateDataPoint(),
        max: generateDataPoint(),
        syncedUntil: UnixTime.toStartOf(
          UnixTime.now() - 2 * UnixTime.HOUR,
          'hour',
        ),
      },
      proofSubmissions: {
        '30d': generateDataPoint(),
        '90d': generateDataPoint(),
        max: generateDataPoint(),
        syncedUntil: UnixTime.toStartOf(
          UnixTime.now() - 4 * UnixTime.HOUR,
          'hour',
        ),
      },
    },
  }
}

function generateMockData(): LivenessProject {
  return {
    batchSubmissions: {
      '30d': generateDataPoint(),
      '90d': generateDataPoint(),
      max: generateDataPoint(),
      syncedUntil: UnixTime.toStartOf(UnixTime.now(), 'hour'),
    },
    stateUpdates: {
      '30d': generateDataPoint(),
      '90d': generateDataPoint(),
      max: generateDataPoint(),
      syncedUntil: UnixTime.toStartOf(UnixTime.now(), 'hour'),
    },
    anomalies: generateAnomalies(),
  }
}

function generateDataPoint(): LivenessDataPoint | undefined {
  const i = Math.round(Math.random() * 100)
  if (i < 10) {
    return undefined
  }
  return {
    averageInSeconds: generateRandomTime(),
    minimumInSeconds: generateRandomTime(),
    maximumInSeconds: generateRandomTime(),
  }
}

function generateAnomalies(): LivenessAnomaly[] {
  const anomaliesCount = Math.round(Math.random() * 15)
  return anomaliesCount !== 0
    ? range(anomaliesCount).map(
        () =>
          ({
            type: Math.random() > 0.5 ? 'batchSubmissions' : 'stateUpdates',

            timestamp:
              UnixTime.now() +
              // TODO: (liveness) should we include current day
              UnixTime(Math.round(Math.random() * -29) - 1) * UnixTime.DAY +
              UnixTime(Math.round(Math.random() * 172800)),

            durationInSeconds: generateRandomTime(),
          }) as const,
      )
    : []
}

function generateRandomTime() {
  const i = Math.round(Math.random() * 100)
  if (i < 50) {
    return Math.round(Math.random() * 3600)
  }
  if (i < 90) {
    return 3600 + Math.round(Math.random() * 82800)
  }
  return 86400 + Math.round(Math.random() * 86400 * 5)
}
