import { Logger } from '@l2beat/backend-tools'
import {
  cacheAsyncFunction,
  LivenessApiResponse,
  notUndefined,
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'

import { Project } from '../../../../../model/Project'
import { IndexerStateRepository } from '../../../../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../../../../tools/Clock'
import { TaskQueue } from '../../../../../tools/queue/TaskQueue'
import { TrackedTxsConfigsRepository } from '../../../repositories/TrackedTxsConfigsRepository'
import { TrackedTxsConfig } from '../../../types/TrackedTxsConfig'
import { getSyncedUntil } from '../../utils/getSyncedUntil'
import { LivenessRepository } from '../repositories/LivenessRepository'
import { calculateAnomalies } from './calculateAnomalies'
import {
  calcIntervalWithAvgsPerProject,
  LivenessRecordWithInterval,
} from './calculateIntervalWithAverages'
import { groupByType } from './groupByType'

type LivenessResult =
  | {
      type: 'success'
      data: LivenessApiResponse
    }
  | {
      type: 'error'
      error: 'DATA_NOT_SYNCED'
    }

interface LivenessTransactionsDetail {
  txHash: string
  timestamp: UnixTime
}

type LivenessTransactionsResult =
  | {
      type: 'success'
      data: {
        projects: Record<
          string,
          {
            batchSubmissions: LivenessTransactionsDetail[]
            stateUpdates: LivenessTransactionsDetail[]
            proofSubmissions: LivenessTransactionsDetail[]
          }
        >
      }
    }
  | {
      type: 'error'
      error: 'DATA_NOT_SYNCED'
    }

type LivenessTrackedTxsConfig = {
  entries: LivenessTrackedTxsConfigEntry[]
}

type LivenessTrackedTxsConfigEntry = {
  subtype: TrackedTxsConfigSubtype
  untilTimestamp: UnixTime | undefined
}

export class LivenessController {
  private readonly taskQueue: TaskQueue<void>
  getCachedLivenessApiResponse: () => Promise<LivenessResult>

  constructor(
    private readonly livenessRepository: LivenessRepository,
    private readonly trackedTxsConfigsRepository: TrackedTxsConfigsRepository,
    private readonly indexerStateRepository: IndexerStateRepository,
    private readonly projects: Project[],
    private readonly clock: Clock,
    private readonly logger = Logger.SILENT,
  ) {
    this.logger = this.logger.for(this)

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

    const activeProjects = this.projects.filter((p) => !p.isArchived)
    for (const project of activeProjects) {
      if (!project.trackedTxsConfig) {
        continue
      }

      const livenessConfig = this.getLivenessTrackedTxsConfig(
        project.trackedTxsConfig,
      )

      if (livenessConfig.entries?.length === 0) {
        continue
      }

      const configurations =
        await this.trackedTxsConfigsRepository.getByProjectIdAndType(
          project.projectId,
          'liveness',
        )

      const syncedUntil = getSyncedUntil(configurations)
      if (!syncedUntil) {
        continue
      }

      const records =
        await this.livenessRepository.getWithSubtypeDistinctTimestamp(
          project.projectId,
        )

      const groupedByType = groupByType(records)

      const intervals = calcIntervalWithAvgsPerProject(groupedByType)

      const withAnomalies = calculateAnomalies(intervals)

      if (project.livenessConfig) {
        const { from, to } = project.livenessConfig.duplicateData
        withAnomalies[to] = {
          ...withAnomalies[from],
        }
      }

      projects[project.projectId.toString()] = {
        ...withAnomalies,
        syncedUntil,
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
      await this.livenessRepository.getByProjectIdAndType(
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
    const requiredTimestamp = this.clock.getLastHour().add(-1, 'hours')
    const indexerState = await this.indexerStateRepository.findIndexerState(
      'liveness_indexer',
    )
    if (
      indexerState === undefined ||
      new UnixTime(indexerState.safeHeight).lt(requiredTimestamp)
    ) {
      return { type: 'error', error: 'DATA_NOT_SYNCED' }
    }

    const projects: Record<
      string,
      {
        batchSubmissions: LivenessTransactionsDetail[]
        stateUpdates: LivenessTransactionsDetail[]
        proofSubmissions: LivenessTransactionsDetail[]
      }
    > = {}
    const last30Days = UnixTime.now().add(-30, 'days')

    await Promise.all(
      this.projects
        .filter((p) => !p.isArchived)
        .map(async (project) => {
          if (project.livenessConfig === undefined) {
            return
          }
          const records =
            await this.livenessRepository.getTransactionWithSubtypeDistinctTimestamp(
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

  getLivenessTrackedTxsConfig(
    trackedTxsConfig: TrackedTxsConfig,
  ): LivenessTrackedTxsConfig {
    return {
      entries: trackedTxsConfig.entries
        .flatMap((entry) => {
          return entry.uses.flatMap((use) => {
            if (use.type !== 'liveness') {
              return
            }

            return {
              subtype: use.subtype,
              untilTimestamp: entry.untilTimestampExclusive,
            }
          })
        })
        .filter(notUndefined),
    }
  }
}
