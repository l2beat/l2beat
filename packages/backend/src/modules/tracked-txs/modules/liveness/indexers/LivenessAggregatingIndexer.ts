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
import { Project } from '../../../../../model/Project'
import { getLivenessTrackedTxsConfig } from '../../utils/getLivenessTrackedTxsConfig'

export interface LivenessAggregatingIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  livenessRepository: LivenessRepository
  aggregatedLivenessRepository: AggregatedLivenessRepository
  projects: Project[]
}

type Interval = {
  record: LivenessRecordWithSubtype
  duration: number
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
    const startOfCurrentDay = now.toStartOf('day')
    const endOfPreviuosDay = now
      .toEndOf('day')
      .add(-1, 'days')
      .add(-1, 'seconds')
    const endOfSyncedDay = new UnixTime(safeHeight)
      .toEndOf('day')
      .add(-1, 'seconds')

    const syncTo =
      endOfSyncedDay < endOfPreviuosDay ? endOfPreviuosDay : endOfSyncedDay
    const syncFrom = syncTo.toStartOf('day').add(-90, 'days')

    if (parentSafeHeight < startOfCurrentDay.toNumber()) {
      this.logger.info('Not enough data to calculate', { parentSafeHeight })
      return parentSafeHeight
    }

    if (syncTo.toNumber() > parentSafeHeight) {
      this.logger.info('Up to date - skipping', {
        nextSync: syncTo,
        parentSafeHeight,
      })
      return parentSafeHeight
    }

    this.logger.info('Recalculating liveness data', { syncFrom, syncTo })

    // const updatedLivenessRecords = await this.generateLiveness(syncFrom, syncTo)

    // await this.$.aggregatedLivenessRepository.addOrUpdateMany(
    //   updatedLivenessRecords,
    // )

    return await Promise.resolve(parentSafeHeight)
  }

  override async invalidate(targetHeight: number): Promise<number> {
    // no need to remove data
    // safeHeight will be updated to this vale
    return await Promise.resolve(targetHeight)
  }

  async generateLiveness(
    syncFrom: UnixTime,
    syncTo: UnixTime,
  ): Promise<AggregatedLivenessRecord[]> {
    const aggregatedRecords: AggregatedLivenessRecord[] = []
    const projectsToSync = this.getProjectsToSync()

    for (const project of projectsToSync) {
      const livenessRecords =
        await this.$.livenessRepository.getWithSubtypeByProjectIdsWithinTimeRange(
          project.projectId,
          syncFrom,
          syncTo,
        )

      if (livenessRecords.length === 0) {
        this.logger.warn('No records found for project', {
          projectId: project.projectId,
        })
        continue
      }

      const [batchSubmissions, stateUpdates, proofSubmissions] =
        this.groupByType(livenessRecords)

      aggregatedRecords.push(
        ...this.getAggregatedRecords(
          project.projectId,
          'batchSubmissions',
          batchSubmissions,
          syncTo,
          ['30D', '90D', 'MAX'],
        ),
      )
      aggregatedRecords.push(
        ...this.getAggregatedRecords(
          project.projectId,
          'batchSubmissions',
          stateUpdates,
          syncTo,
          ['30D', '90D', 'MAX'],
        ),
      )
      aggregatedRecords.push(
        ...this.getAggregatedRecords(
          project.projectId,
          'batchSubmissions',
          proofSubmissions,
          syncTo,
          ['30D', '90D', 'MAX'],
        ),
      )
    }

    return aggregatedRecords
  }

  getAggregatedRecords(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
    livenessRecords: LivenessRecordWithSubtype[],
    syncTo: UnixTime,
    ranges: AggregatedLivenessRange[],
  ): AggregatedLivenessRecord[] {
    const intervals = this.calculateIntervals(livenessRecords)

    const aggregatedRecords: AggregatedLivenessRecord[] = []

    ranges.forEach((range) => {
      const filteredItervals = this.filterByRange(intervals, syncTo, range)

      if (filteredItervals.length > 0) {
        const stats = this.calculateStats(filteredItervals)

        const record: AggregatedLivenessRecord = {
          projectId: projectId,
          subtype,
          range,
          min: stats.minimumInSeconds,
          avg: stats.averageInSeconds,
          max: stats.maximumInSeconds,
          timestamp: syncTo,
        }

        aggregatedRecords.push(record)
      } else {
        this.logger.warn('No records found', {
          type: 'batchSubmissions',
          range: '30D',
        })
      }
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

  calculateIntervals(records: LivenessRecordWithSubtype[]): Interval[] {
    const intervals: Interval[] = []
    for (let i = 0; i < records.length - 1; i++) {
      intervals.push({
        record: records[i],
        duration:
          records[i].timestamp.toNumber() - records[i + 1].timestamp.toNumber(),
      })
    }
    return intervals
  }

  groupByType(
    records: LivenessRecordWithSubtype[],
  ): [
    LivenessRecordWithSubtype[],
    LivenessRecordWithSubtype[],
    LivenessRecordWithSubtype[],
  ] {
    const batchSubmissions: LivenessRecordWithSubtype[] = []
    const stateUpdates: LivenessRecordWithSubtype[] = []
    const proofSubmissions: LivenessRecordWithSubtype[] = []

    for (const record of records) {
      switch (record.subtype) {
        case 'batchSubmissions':
          batchSubmissions.push(record)
          break
        case 'stateUpdates':
          stateUpdates.push(record)
          break
        case 'proofSubmissions':
          proofSubmissions.push(record)
          break
        default:
          assertUnreachable(record.subtype)
      }
    }

    return [batchSubmissions, stateUpdates, proofSubmissions]
  }

  getProjectsToSync(): Project[] {
    return this.$.projects.filter((p) => {
      if (p.isArchived || !p.trackedTxsConfig) {
        return false
      }

      const livenessConfig = getLivenessTrackedTxsConfig(p.trackedTxsConfig)

      if (livenessConfig.entries?.length === 0) {
        return false
      }

      return true
    })
  }
}
