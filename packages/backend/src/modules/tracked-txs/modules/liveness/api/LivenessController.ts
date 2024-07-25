import { Logger } from '@l2beat/backend-tools'
import {
  assert,
  LivenessAnomaly,
  LivenessApiProject,
  LivenessApiResponse,
  LivenessDetails,
  ProjectId,
  Result,
  TrackedTxsConfigSubtype,
  UnixTime,
  cacheAsyncFunction,
} from '@l2beat/shared-pure'

import { BackendProject } from '@l2beat/config'
import {
  AggregatedLivenessRecord,
  AnomalyRecord,
  Database,
} from '@l2beat/database'
import { TrackedTxConfigEntry } from '@l2beat/shared'
import { Clock } from '../../../../../tools/Clock'
import { TaskQueue } from '../../../../../tools/queue/TaskQueue'
import { IndexerService } from '../../../../../tools/uif/IndexerService'
import { SavedConfiguration } from '../../../../../tools/uif/multi/types'
import { getSyncedUntil } from '../../utils/getSyncedUntil'
import { LivenessWithConfigService } from '../services/LivenessWithConfigService'
import { getActiveConfigurations } from '../utils/getActiveConfigurations'
import { groupByType } from '../utils/groupByType'

export type LivenessResult = Result<LivenessApiResponse, 'DATA_NOT_SYNCED'>

interface LivenessTransactionsDetail {
  txHash: string
  timestamp: UnixTime
}

export type LivenessTransactionsResult = Result<
  {
    projects: Record<
      string,
      {
        batchSubmissions: LivenessTransactionsDetail[]
        stateUpdates: LivenessTransactionsDetail[]
        proofSubmissions: LivenessTransactionsDetail[]
      }
    >
  },
  'DATA_NOT_SYNCED'
>

export interface LivenessControllerDeps {
  indexerService: IndexerService
  db: Database
  projects: BackendProject[]
  clock: Clock
  logger?: Logger
}

export class LivenessController {
  private readonly taskQueue: TaskQueue<void>
  getCachedLivenessApiResponse: () => Promise<LivenessResult>
  private readonly logger: Logger

  constructor(private readonly $: LivenessControllerDeps) {
    this.logger = $.logger ? $.logger.for(this) : Logger.SILENT

    const cached = cacheAsyncFunction(() => this.getLiveness())
    this.getCachedLivenessApiResponse = cached.call
    this.taskQueue = new TaskQueue(
      cached.refetch,
      this.logger.for('taskQueue'),
      { metricsId: LivenessController.name },
    )
  }

  start() {
    this.taskQueue.addToFront()
    this.logger.info('Caching: initial caching scheduled')

    const tenMinutes = 10 * 60 * 1000
    setInterval(() => {
      this.taskQueue.addIfEmpty()
      this.logger.info('Caching: refetch scheduled')
    }, tenMinutes)
  }

  async getLiveness(): Promise<LivenessResult> {
    const projects: LivenessApiResponse['projects'] = {}

    const configurations = await this.$.indexerService.getSavedConfigurations(
      'tracked_txs_indexer',
    )

    for (const project of this.$.projects) {
      const activeConfigs = getActiveConfigurations(project, configurations)

      if (!activeConfigs) {
        continue
      }

      const aggregatedLivenessRecords =
        await this.$.db.aggregatedLiveness.getByProject(project.projectId)

      const last30Days = UnixTime.now().add(-30, 'days').toStartOf('day')
      const anomalyRecords = await this.$.db.anomalies.getByProjectFrom(
        project.projectId,
        last30Days,
      )

      const livenessData: LivenessApiProject = {
        stateUpdates: this.mapAggregatedLivenessRecords(
          aggregatedLivenessRecords,
          'stateUpdates',
          project,
          configurations,
        ),
        batchSubmissions: this.mapAggregatedLivenessRecords(
          aggregatedLivenessRecords,
          'batchSubmissions',
          project,
          configurations,
        ),
        proofSubmissions: this.mapAggregatedLivenessRecords(
          aggregatedLivenessRecords,
          'proofSubmissions',
          project,
          configurations,
        ),
        anomalies: this.mapAnomalyRecords(anomalyRecords),
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

    return { type: 'success', data: { projects } }
  }

  mapAggregatedLivenessRecords(
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

  mapAnomalyRecords(records: AnomalyRecord[]): LivenessAnomaly[] {
    return records.map((a) => ({
      // TODO: validate if it makes sense to pass the end of anomaly rather than the start
      timestamp: new UnixTime(a.timestamp.toNumber() + a.duration),
      durationInSeconds: a.duration,
      type: a.subtype,
    }))
  }

  async getLivenessPerProjectAndType(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
  ): Promise<{
    projectId: ProjectId
    type: TrackedTxsConfigSubtype
    data: UnixTime[]
  }> {
    const lastHour = UnixTime.now().toStartOf('hour')

    const project = this.$.projects.find((p) => p.projectId === projectId)

    if (project === undefined) {
      throw new Error(`Project with id ${projectId} not found`)
    }

    const configurations = await this.$.indexerService.getSavedConfigurations(
      'tracked_txs_indexer',
    )

    const activeConfigs = getActiveConfigurations(project, configurations)

    if (!activeConfigs) {
      throw new Error(
        `No active liveness configurations found for project ${projectId}`,
      )
    }

    const livenessWithConfig = new LivenessWithConfigService(
      activeConfigs,
      this.$.db,
    )

    const records = await livenessWithConfig.getByTypeSince(
      subtype,
      lastHour.add(-60, 'days'),
    )

    return {
      projectId,
      type: subtype,
      data: records.map((r) => r.timestamp),
    }
  }

  async getLivenessTransactions(): Promise<LivenessTransactionsResult> {
    const requiredTimestamp = this.$.clock.getLastHour().add(-1, 'hours')

    const indexerState =
      await this.$.indexerService.getIndexerState('liveness_indexer')

    if (
      indexerState === undefined ||
      new UnixTime(indexerState.safeHeight).lt(requiredTimestamp)
    ) {
      return { type: 'error', error: 'DATA_NOT_SYNCED' }
    }

    const configurations = await this.$.indexerService.getSavedConfigurations(
      'tracked_txs_indexer',
    )

    const projects: Record<
      string,
      Record<TrackedTxsConfigSubtype, LivenessTransactionsDetail[]>
    > = {}
    const last30Days = UnixTime.now().add(-30, 'days')

    await Promise.all(
      this.$.projects
        .filter((p) => !p.isArchived)
        .map(async (project) => {
          const activeConfigs = getActiveConfigurations(project, configurations)

          if (!activeConfigs) {
            return
          }

          const livenessWithConfig = new LivenessWithConfigService(
            activeConfigs,
            this.$.db,
          )

          const records = await livenessWithConfig.getSince(last30Days)

          const [batchSubmissions, stateUpdates, proofSubmissions] =
            groupByType(records)

          projects[project.projectId.toString()] = {
            batchSubmissions: batchSubmissions.map((r) => ({
              txHash: r.txHash,
              timestamp: r.timestamp,
            })),
            stateUpdates: stateUpdates.map((r) => ({
              txHash: r.txHash,
              timestamp: r.timestamp,
            })),
            proofSubmissions: proofSubmissions.map((r) => ({
              txHash: r.txHash,
              timestamp: r.timestamp,
            })),
          }
        }),
    )

    return { type: 'success', data: { projects } }
  }
}
