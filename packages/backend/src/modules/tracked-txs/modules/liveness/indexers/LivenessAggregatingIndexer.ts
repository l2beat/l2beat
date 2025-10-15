import type { AggregatedLivenessRecord, Database } from '@l2beat/database'
import {
  clampRangeToDay,
  ProjectId,
  slidingWindow,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import type { TrackedTxProject } from '../../../../../config/Config'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../../../tools/uif/ManagedChildIndexer'
import { calculateIntervals } from '../utils/calculateIntervals'
import { calculateStats } from '../utils/calculateStats'
import { getActiveConfigurations } from '../utils/getActiveConfigurations'
import { groupByType } from '../utils/groupByType'
import {
  type LivenessRecordWithConfig,
  mapToRecordWithConfig,
} from '../utils/mapToRecordWithConfig'

export interface LivenessAggregatingIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  projects: TrackedTxProject[]
}

export class LivenessAggregatingIndexer extends ManagedChildIndexer {
  constructor(private readonly $: LivenessAggregatingIndexerDeps) {
    super({ ...$, name: 'liveness_aggregating' })
  }

  override async update(
    safeHeight: number,
    parentSafeHeight: number,
  ): Promise<number> {
    const from =
      safeHeight <= this.$.minHeight
        ? this.$.minHeight
        : UnixTime.toStartOf(safeHeight, 'hour')
    const { from: clampedFrom, to } = clampRangeToDay(from, parentSafeHeight)

    const updatedLivenessRecords = await this.generateLiveness(clampedFrom, to)

    await this.$.db.aggregatedLiveness.upsertMany(updatedLivenessRecords)
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
  ): Promise<AggregatedLivenessRecord[]> {
    const aggregatedRecords: (AggregatedLivenessRecord | undefined)[] = []

    const configurations = await this.$.indexerService.getSavedConfigurations(
      'tracked_txs_indexer',
    )

    const allProjectConfigs = this.$.projects
      .flatMap((p) => getActiveConfigurations(p, configurations))
      .filter((c) => c !== undefined)

    const hourlyTimestamps: UnixTime[] = []
    let currentHour = UnixTime.toStartOf(from, 'hour')
    while (currentHour <= to) {
      hourlyTimestamps.push(currentHour)
      currentHour = currentHour + UnixTime.HOUR
    }

    const slidingWindows = slidingWindow(hourlyTimestamps, 2, 1)

    // for every considered time range we also take latest record before `from`
    // for each configuration to calculate interval for first record in time range
    const records = await this.$.db.liveness.getRecordsInRangeWithLatestBefore(
      allProjectConfigs.map((c) => c.id),
      from,
      to,
    )

    // NOTE(maciekzygmunt): normally this steps should be done in the database, but because liveness table is huge, sorting and distinction
    // takes a lot of memory, so for this case it is better to do it here
    records.sort((a, b) => b.timestamp - a.timestamp)
    const livenessRecords: LivenessRecordWithConfig[] = []
    const present = new Set<string>()

    for (const r of records) {
      const key = r.timestamp + '-' + r.configurationId

      if (!present.has(key)) {
        present.add(key)
        livenessRecords.push(mapToRecordWithConfig(r, allProjectConfigs))
      }
    }

    const groupedConfigs = groupBy(allProjectConfigs, (c) => c.projectId)

    for (const project of Object.keys(groupedConfigs)) {
      const projectConfigs = groupedConfigs[project]

      if (projectConfigs.length === 0) {
        continue
      }

      const activeConfigIds = projectConfigs.map((c) => c.id)
      const projectLivenessRecords = livenessRecords.filter((r) =>
        activeConfigIds.includes(r.id),
      )

      if (projectLivenessRecords.length === 0) {
        this.logger.debug('No records found for project', {
          projectId: project,
        })
        continue
      }

      this.logger.debug('Liveness records loaded', {
        projectId: project,
        count: livenessRecords.length,
      })

      const [batchSubmissions, stateUpdates, proofSubmissions] = groupByType(
        projectLivenessRecords,
      )

      for (const [start, end] of slidingWindows) {
        aggregatedRecords.push(
          this.aggregateRecords(
            ProjectId(project),
            'batchSubmissions',
            batchSubmissions.filter((r) => r.timestamp < end),
            start,
          ),
        )
        aggregatedRecords.push(
          this.aggregateRecords(
            ProjectId(project),
            'stateUpdates',
            stateUpdates.filter((r) => r.timestamp < end),
            start,
          ),
        )
        aggregatedRecords.push(
          this.aggregateRecords(
            ProjectId(project),
            'proofSubmissions',
            proofSubmissions.filter((r) => r.timestamp < end),
            start,
          ),
        )
      }
    }

    return aggregatedRecords.filter((r) => r !== undefined)
  }

  aggregateRecords(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
    livenessRecords: LivenessRecordWithConfig[],
    timestamp: UnixTime,
  ): AggregatedLivenessRecord | undefined {
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
      // We are saving the number of records to later correctly calculate the average for a given time range.
      // This ensures we calculate the correct average from all records, not just from daily aggregations.
      numberOfRecords: intervals.length,
    }
  }
}
