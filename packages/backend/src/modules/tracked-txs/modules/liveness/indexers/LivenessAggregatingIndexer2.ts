import type { Database } from '@l2beat/database'
import {
  type ProjectId,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import type { TrackedTxProject } from '../../../../../config/Config'
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
import { getActiveConfigurations } from '../utils/getActiveConfigurations'
import { groupByType } from '../utils/groupByType'
import type { AggregatedLiveness2Record } from '@l2beat/database/dist/other/aggregated-liveness2/entity'

export interface LivenessAggregatingIndexer2Deps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  projects: TrackedTxProject[]
}

export class LivenessAggregatingIndexer2 extends ManagedChildIndexer {
  constructor(private readonly $: LivenessAggregatingIndexer2Deps) {
    super({ ...$, name: 'liveness_aggregating2' })
  }

  override async update(
    safeHeight: number,
    parentSafeHeight: number,
  ): Promise<number> {
    const from =
      safeHeight === this.$.minHeight
        ? safeHeight
        : UnixTime.toStartOf(safeHeight, 'day')
    const endOfDay = UnixTime.toStartOf(safeHeight, 'day') + UnixTime.DAY - 1

    const to = parentSafeHeight > endOfDay ? endOfDay : parentSafeHeight

    const updatedLivenessRecords = await this.generateLiveness(from, to)

    await this.$.db.aggregatedLiveness2.upsertMany(updatedLivenessRecords)
    return to
  }

  override async invalidate(targetHeight: number): Promise<number> {
    // no need to remove data
    // safeHeight will be updated to this value
    return await Promise.resolve(targetHeight)
  }

  async generateLiveness(
    from: UnixTime,
    to: UnixTime,
  ): Promise<AggregatedLiveness2Record[]> {
    const aggregatedRecords: (AggregatedLiveness2Record | undefined)[] = []

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

      // for every considered time range we also take latest record before `from`
      // for each configuration to calculate interval for first record in time range
      const livenessRecords =
        await livenessWithConfig.getWithinTimeRangeWithLatestBeforeFrom(
          from,
          to,
        )

      if (livenessRecords.length === 0) {
        this.logger.debug('No records found for project', {
          projectId: project.id,
        })
        continue
      }

      this.logger.debug('Liveness records loaded', {
        projectId: project.id,
        count: livenessRecords.length,
      })

      const [batchSubmissions, stateUpdates, proofSubmissions] =
        groupByType(livenessRecords)

      aggregatedRecords.push(
        this.aggregateRecords(
          project.id,
          'batchSubmissions',
          batchSubmissions,
          from,
        ),
      )
      aggregatedRecords.push(
        this.aggregateRecords(project.id, 'stateUpdates', stateUpdates, from),
      )
      aggregatedRecords.push(
        this.aggregateRecords(
          project.id,
          'proofSubmissions',
          proofSubmissions,
          from,
        ),
      )
    }

    return aggregatedRecords.filter((r) => r !== undefined)
  }

  aggregateRecords(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
    livenessRecords: LivenessRecordWithConfig[],
    timestamp: UnixTime,
  ): AggregatedLiveness2Record | undefined {
    // here we have few records before timestamp as we take one for each configuration
    // so here we need to filter out all and leave only the latest before timestamp
    const timeRangeStartIndex = livenessRecords.findIndex(
      (r) => r.timestamp < timestamp,
    )
    const timeRangeRecords =
      timeRangeStartIndex === -1
        ? livenessRecords
        : livenessRecords.slice(0, timeRangeStartIndex + 1)

    // if <= 1 record, than we can't calculate intervals
    if (timeRangeRecords.length <= 1) return
    const intervals = calculateIntervals(timeRangeRecords)
    const stats = calculateStats(intervals)

    return {
      projectId: projectId,
      subtype,
      min: stats.minimumInSeconds,
      avg: stats.averageInSeconds,
      max: stats.maximumInSeconds,
      timestamp,
    }
  }
}
