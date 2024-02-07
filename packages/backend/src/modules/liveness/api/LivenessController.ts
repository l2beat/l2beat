import {
  LivenessApiResponse,
  LivenessType,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { Project } from '../../../model'
import { IndexerStateRepository } from '../../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../../tools/Clock'
import { LivenessRepository } from '../repositories/LivenessRepository'
import { calculateAnomaliesPerProject } from './calculateAnomalies'
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

export class LivenessController {
  constructor(
    private readonly livenessRepository: LivenessRepository,
    private readonly indexerStateRepository: IndexerStateRepository,
    private readonly projects: Project[],
    private readonly clock: Clock,
  ) {}

  async getLiveness(): Promise<LivenessResult> {
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

    const projects: LivenessApiResponse['projects'] = {}

    await Promise.all(
      this.projects
        .filter((p) => !p.isArchived)
        .map(async (project) => {
          if (project.livenessConfig === undefined) {
            return
          }
          const records =
            await this.livenessRepository.getWithTypeDistinctTimestamp(
              project.projectId,
            )

          const groupedByType = groupByType(records)

          const intervals = calcIntervalWithAvgsPerProject(groupedByType)

          const withAnomalies = calculateAnomaliesPerProject(intervals)

          if (withAnomalies && project.livenessConfig.duplicateData) {
            for (const duplicateData of project.livenessConfig.duplicateData) {
              withAnomalies[duplicateData.to] = {
                ...withAnomalies[duplicateData.from],
              }
            }
          }

          projects[project.projectId.toString()] = withAnomalies
        }),
    )

    return { type: 'success', data: { projects } }
  }

  async getLivenessPerProjectAndType(
    projectId: ProjectId,
    livenessType: LivenessType,
  ): Promise<{
    projectId: ProjectId
    type: LivenessType
    data: UnixTime[]
  }> {
    const lastHour = UnixTime.now().toStartOf('hour')
    const records: LivenessRecordWithInterval[] =
      await this.livenessRepository.getByProjectIdAndType(
        projectId,
        livenessType,
        lastHour.add(-60, 'days'),
      )

    return {
      projectId,
      type: livenessType,
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
            await this.livenessRepository.getTransactionWithTypeDistinctTimestamp(
              project.projectId,
              last30Days,
            )

          const groupedByType = groupByType<{
            txHash: string
            timestamp: UnixTime
            type: string
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
