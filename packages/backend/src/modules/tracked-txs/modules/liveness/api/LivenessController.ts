import { Logger } from '@l2beat/backend-tools'
import {
  assert,
  LivenessApiProject,
  LivenessApiResponse,
  ProjectId,
  Result,
  TrackedTxsConfigSubtype,
  TrackedTxsConfigSubtypeValues,
  UnixTime,
  cacheAsyncFunction,
} from '@l2beat/shared-pure'

import { TrackedTxConfigEntry } from '@l2beat/shared'
import { Clock } from '../../../../../tools/Clock'
import { TaskQueue } from '../../../../../tools/queue/TaskQueue'
import { IndexerService } from '../../../../../tools/uif/IndexerService'
import { getSyncedUntil } from '../../utils/getSyncedUntil'
import { LivenessRepository } from '../repositories/LivenessRepository'
import { calculateAnomalies } from './calculateAnomalies'
import {
  LivenessRecordWithInterval,
  calcIntervalWithAvgsPerProject,
} from './calculateIntervalWithAverages'
import { groupByType } from './groupByType'

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
  livenessRepository: LivenessRepository
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

    const configurations =
      await this.$.indexerService.getSavedConfigurations<TrackedTxConfigEntry>(
        'tracked_txs_indexer',
      )

    const activeProjects = this.$.projects.filter((p) => !p.isArchived)
    for (const project of activeProjects) {
      if (!project.trackedTxsConfig) {
        continue
      }

      const projectRuntimeConfigIds = project.trackedTxsConfig
        .filter((c) => c.type === 'liveness')
        .map((c) => c.id)
      const projectConfigs = configurations.filter((c) =>
        projectRuntimeConfigIds.includes(c.id),
      )

      if (projectConfigs.length === 0) {
        continue
      }

      const syncedUntil = getSyncedUntil(projectConfigs)

      if (!syncedUntil) {
        continue
      }

      const records =
        await this.$.livenessRepository.getWithSubtypeDistinctTimestamp(
          project.projectId,
        )

      const groupedByType = groupByType(records)

      const intervals = calcIntervalWithAvgsPerProject(groupedByType)

      const withAnomalies = calculateAnomalies(intervals)

      const { anomalies, ...subtypeData } = withAnomalies

      const withSyncedUntil =
        TrackedTxsConfigSubtypeValues.reduce<LivenessApiProject>(
          (obj, subtype) => {
            const syncedUntil = getSyncedUntil(
              configurations.filter((c) => {
                const config = project.trackedTxsConfig?.find(
                  (pc) => pc.id === c.id,
                )
                return config?.subtype === subtype
              }),
            )
            if (!syncedUntil) return obj
            obj[subtype] = {
              ...subtypeData[subtype],
              syncedUntil,
            }
            return obj
          },
          {},
        )

      if (project.livenessConfig) {
        const { from, to } = project.livenessConfig.duplicateData
        const data = withSyncedUntil[from]
        assert(data, 'From data must exist')
        withSyncedUntil[to] = { ...data }
      }

      projects[project.projectId.toString()] = {
        ...withSyncedUntil,
        anomalies,
      }
    }

    return { type: 'success', data: { projects } }
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
    const records: LivenessRecordWithInterval[] =
      await this.$.livenessRepository.getByProjectIdAndType(
        projectId,
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

    const projects: Record<
      string,
      Record<TrackedTxsConfigSubtype, LivenessTransactionsDetail[]>
    > = {}
    const last30Days = UnixTime.now().add(-30, 'days')

    await Promise.all(
      this.$.projects
        .filter((p) => !p.isArchived)
        .map(async (project) => {
          if (project.livenessConfig === undefined) {
            return
          }
          const records =
            await this.$.livenessRepository.getTransactionWithSubtypeDistinctTimestamp(
              project.projectId,
              last30Days,
            )

          const groupedByType = groupByType<{
            txHash: string
            timestamp: UnixTime
            subtype: TrackedTxsConfigSubtype
          }>(records)

          projects[project.projectId.toString()] = {
            batchSubmissions: groupedByType.batchSubmissions.records.map(
              (r) => ({ txHash: r.txHash, timestamp: r.timestamp }),
            ),
            stateUpdates: groupedByType.stateUpdates.records.map((r) => ({
              txHash: r.txHash,
              timestamp: r.timestamp,
            })),
            proofSubmissions: groupedByType.proofSubmissions.records.map(
              (r) => ({ txHash: r.txHash, timestamp: r.timestamp }),
            ),
          }
        }),
    )

    return { type: 'success', data: { projects } }
  }
}
