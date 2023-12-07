import {
  assert,
  LivenessApiResponse,
  LivenessType,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { Clock } from '../../../core/Clock'
import { Project } from '../../../model'
import { IndexerStateRepository } from '../../../peripherals/database/IndexerStateRepository'
import { LivenessRepository } from '../../../peripherals/database/LivenessRepository'
import {
  calculate30DayRollingStats,
  calculateAnomaliesPerProject,
} from './calculateAnomalies'
import {
  calcIntervalWithAvgsPerProject,
  calculateIntervals,
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
    data: { timestamp: UnixTime; avg: number }[]
  }> {
    const lastHour = UnixTime.now().toStartOf('hour')
    const records: LivenessRecordWithInterval[] =
      await this.livenessRepository.getByProjectIdAndType(
        projectId,
        livenessType,
        lastHour.add(-60, 'days'),
      )
    calculateIntervals(records)

    const lastRecord = records.at(-1)
    assert(lastRecord !== undefined)

    const timestamp60daysAgo = lastHour.add(-60, 'days')
    const last60Days = records.filter((record) =>
      record.timestamp.gte(timestamp60daysAgo),
    )
    assert(last60Days.length !== 0)

    const startIndex = last60Days.findIndex((record) =>
      record.timestamp.lte(lastHour),
    )
    const lastIndex = last60Days.findIndex((record) =>
      record.timestamp.lte(lastHour.add(-30, 'days')),
    )
    const { means } = calculate30DayRollingStats(
      last60Days,
      startIndex,
      lastIndex,
      lastHour,
    )

    const last30Days = last60Days.slice(startIndex, lastIndex)
    const result = last30Days.map((record) => {
      if (record.previousRecordInterval === undefined)
        return { timestamp: record.timestamp, avg: 0 }

      const mean = means.get(record.timestamp.toStartOf('minute').toNumber())
      assert(mean !== undefined, 'mean should not be undefined')
      return {
        timestamp: record.timestamp,
        avg: mean,
      }
    })

    return {
      projectId,
      type: livenessType,
      data: result,
    }
  }
}
