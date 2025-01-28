import type { BackendProject } from '@l2beat/backend-shared'
import type {
  AggregatedLivenessRange,
  AggregatedLivenessRecord,
  Database,
} from '@l2beat/database'
import {
  type ProjectId,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../../../tools/uif/ManagedChildIndexer'
import {
  type LivenessRecordWithConfig,
  LivenessWithConfigService,
} from '../services/LivenessWithConfigService'
import { calculateIntervals } from '../utils/calculateIntervals'
import { calculateStats } from '../utils/calculateStats'
import { filterIntervalsByRange } from '../utils/filterIntervalsByRange'
import { getActiveConfigurations } from '../utils/getActiveConfigurations'
import { groupByType } from '../utils/groupByType'

export interface LivenessAggregatingIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  projects: BackendProject[]
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

    await this.$.db.aggregatedLiveness.upsertMany(updatedLivenessRecords)

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

    const configurations = await this.$.indexerService.getSavedConfigurations(
      'tracked_txs_indexer',
    )

    for (const project of this.$.projects) {
      const activeConfigs = getActiveConfigurations(project, configurations)

      if (!activeConfigs) {
        continue
      }

      const livenessWithConfig = new LivenessWithConfigService(
        activeConfigs,
        this.$.db,
      )

      const livenessRecords = await livenessWithConfig.getUpTo(syncTo)

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
    livenessRecords: LivenessRecordWithConfig[],
    syncTo: UnixTime,
    ranges: AggregatedLivenessRange[],
  ): AggregatedLivenessRecord[] {
    const intervals = calculateIntervals(livenessRecords)

    const aggregatedRecords: AggregatedLivenessRecord[] = []

    ranges.forEach((range) => {
      const filteredIntervals = filterIntervalsByRange(intervals, syncTo, range)

      if (filteredIntervals.length === 0) {
        return
      }

      const stats = calculateStats(filteredIntervals)

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
}
