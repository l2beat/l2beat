import { BackendProject } from '@l2beat/config'
import { TrackedTxConfigEntry } from '@l2beat/shared'
import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
  assertUnreachable,
} from '@l2beat/shared-pure'
import {
  ManagedChildIndexer,
  ManagedChildIndexerOptions,
} from '../../../../../tools/uif/ManagedChildIndexer'
import {
  AggregatedLivenessRange,
  AggregatedLivenessRecord,
  AggregatedLivenessRepository,
} from '../repositories/AggregatedLivenessRepository'
import {
  LivenessRecordWithSubtype,
  LivenessRepository,
} from '../repositories/LivenessRepository'
import { Interval, calculateIntervals } from '../utils/calculateIntervals'
import { getProjectsToSync } from '../utils/getProjectsToSync'
import { groupByType } from '../utils/groupByType'

export interface LivenessAggregatingIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  livenessRepository: LivenessRepository
  aggregatedLivenessRepository: AggregatedLivenessRepository
  projects: BackendProject[]
}

type Stats = {
  averageInSeconds: number
  minimumInSeconds: number
  maximumInSeconds: number
}

export class LivenessAggregatingIndexer extends ManagedChildIndexer {
  constructor(private readonly $: LivenessAggregatingIndexerDeps) {
    super({ ...$, name: 'liveness_aggregating' })
  }

  override async update(
    safeHeight: number,
    parentSafeHeight: number,
  ): Promise<number> {
    const now = UnixTime.now()
    const endOfPreviousDay = now.toStartOf('day').add(-1, 'seconds')
    let targetHeight = new UnixTime(safeHeight)
      .toEndOf('day')
      .add(-1, 'seconds')

    if (parentSafeHeight <= endOfPreviousDay.toNumber()) {
      this.logger.info('Not enough data to calculate - skipping', {
        parentSafeHeight,
      })
      return parentSafeHeight
    }

    if (targetHeight < endOfPreviousDay) {
      targetHeight = endOfPreviousDay
      this.logger.info('Adjusting target height', { targetHeight })
    }

    if (targetHeight.toNumber() > parentSafeHeight) {
      this.logger.info('Up to date - skipping', {
        targetHeight,
        parentSafeHeight,
      })
      return parentSafeHeight
    }

    this.logger.info('Recalculating liveness data', { targetHeight })

    const updatedLivenessRecords = await this.generateLiveness(targetHeight)

    await this.$.aggregatedLivenessRepository.addOrUpdateMany(
      updatedLivenessRecords,
    )

    return parentSafeHeight
  }

  override async invalidate(targetHeight: number): Promise<number> {
    // no need to remove data
    // safeHeight will be updated to this value
    return await Promise.resolve(targetHeight)
  }

  async generateLiveness(
    syncTo: UnixTime,
  ): Promise<AggregatedLivenessRecord[]> {
    const aggregatedRecords: AggregatedLivenessRecord[] = []

    const configurations =
      await this.$.indexerService.getSavedConfigurations<TrackedTxConfigEntry>(
        'tracked_txs_indexer',
      )

    const projectsToSync = getProjectsToSync(this.$.projects, configurations)

    for (const project of projectsToSync) {
      const livenessRecords =
        await this.$.livenessRepository.getWithSubtypeByProjectIdsUpTo(
          project.projectId,
          syncTo,
        )

      if (livenessRecords.length === 0) {
        this.logger.debug('No records found for project', {
          projectId: project.projectId,
        })
        continue
      }

      this.logger.debug('Liveness records loaded', {
        projectId: project.projectId,
        count: livenessRecords.length,
      })

      const [batchSubmissions, stateUpdates, proofSubmissions] =
        groupByType(livenessRecords)

      aggregatedRecords.push(
        ...this.aggregatedRecords(
          project.projectId,
          'batchSubmissions',
          batchSubmissions,
          syncTo,
          ['30D', '90D', 'MAX'],
        ),
      )
      aggregatedRecords.push(
        ...this.aggregatedRecords(
          project.projectId,
          'stateUpdates',
          stateUpdates,
          syncTo,
          ['30D', '90D', 'MAX'],
        ),
      )
      aggregatedRecords.push(
        ...this.aggregatedRecords(
          project.projectId,
          'proofSubmissions',
          proofSubmissions,
          syncTo,
          ['30D', '90D', 'MAX'],
        ),
      )
    }

    return aggregatedRecords
  }

  aggregatedRecords(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
    livenessRecords: LivenessRecordWithSubtype[],
    syncTo: UnixTime,
    ranges: AggregatedLivenessRange[],
  ): AggregatedLivenessRecord[] {
    const intervals = calculateIntervals(livenessRecords)

    const aggregatedRecords: AggregatedLivenessRecord[] = []

    ranges.forEach((range) => {
      const filteredIntervals = this.filterByRange(intervals, syncTo, range)

      if (filteredIntervals.length === 0) {
        return
      }

      const stats = this.calculateStats(filteredIntervals)

      const record: AggregatedLivenessRecord = {
        projectId: projectId,
        subtype,
        range,
        min: stats.minimumInSeconds,
        avg: stats.averageInSeconds,
        max: stats.maximumInSeconds,
        updatedAt: syncTo,
      }

      aggregatedRecords.push(record)
    })

    return aggregatedRecords
  }

  filterByRange(
    intervals: Interval[],
    syncTo: UnixTime,
    range: AggregatedLivenessRange,
  ): Interval[] {
    switch (range) {
      case '30D':
        return intervals.filter((i) =>
          i.record.timestamp.gt(syncTo.add(-30, 'days')),
        )
      case '90D':
        return intervals.filter((i) =>
          i.record.timestamp.gt(syncTo.add(-90, 'days')),
        )
      case 'MAX':
        return intervals
      default:
        assertUnreachable(range)
    }
  }

  calculateStats(intervals: Interval[]): Stats {
    const result: Stats = {
      averageInSeconds: 0,
      minimumInSeconds: Infinity,
      maximumInSeconds: 0,
    }

    for (const interval of intervals) {
      result.averageInSeconds += interval.duration
      result.minimumInSeconds = Math.min(
        result.minimumInSeconds,
        interval.duration,
      )
      result.maximumInSeconds = Math.max(
        result.maximumInSeconds,
        interval.duration,
      )
    }

    result.averageInSeconds = Math.ceil(
      result.averageInSeconds / intervals.length,
    )

    return result
  }
}
