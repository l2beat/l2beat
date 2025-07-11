import type {
  AnomalyRecord,
  AnomalyStatsRecord,
  Database,
} from '@l2beat/database'
import {
  assert,
  clampRangeToDay,
  notUndefined,
  type ProjectId,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import type { TrackedTxProject } from '../../../../../config/Config'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../../../tools/uif/ManagedChildIndexer'
import { calculateIntervals, type Interval } from '../utils/calculateIntervals'
import { getActiveConfigurations } from '../utils/getActiveConfigurations'
import { groupByType } from '../utils/groupByType'
import {
  type LivenessRecordWithConfig,
  mapToRecordWithConfig,
} from '../utils/mapToRecordWithConfig'
import { RunningStatistics } from '../utils/RollingVariance'

export interface AnomaliesIndexerIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  projects: TrackedTxProject[]
}

export class AnomaliesIndexer extends ManagedChildIndexer {
  private readonly SYNC_RANGE = 30
  constructor(private readonly $: AnomaliesIndexerIndexerDeps) {
    super({ ...$, name: 'anomalies' })
  }

  override async update(from: number, to: number): Promise<number> {
    // we only need to go one day back
    const maxDepth = UnixTime.toStartOf(
      UnixTime.now() - 1 * UnixTime.DAY,
      'day',
    )
    if (to <= maxDepth) {
      this.logger.info('Skipping update', { from, to })
      return to
    }

    // only on first run when from equals minTimestamp
    if (from < maxDepth) {
      from = maxDepth
      this.logger.info('Adjusting update range', { from, to })
    }

    // limit time range to one day if greater
    const { to: unixTo } = clampRangeToDay(from, to)

    this.logger.info('Calculating anomalies', { unixTo })

    const records = await this.getAnomalies(unixTo)

    await this.$.db.transaction(async () => {
      // anomalies are recalculated on each run so we can safely delete all records
      // to make sure we don't have any outdated records
      const deleted = await this.$.db.anomalies.deleteAll()
      await this.$.db.anomalies.upsertMany(records.anomalyRecords)
      await this.$.db.anomalyStats.upsertMany(records.anomalyStatsRecords)

      this.logger.info('Anomaly records saved to db', {
        deleted,
        upserted: records.anomalyRecords.length,
        stats: records.anomalyStatsRecords.length,
      })
    })

    return unixTo
  }

  override async invalidate(targetHeight: number): Promise<number> {
    // no need to remove data
    // safeHeight will be updated to this value
    return await Promise.resolve(targetHeight)
  }

  async getAnomalies(to: UnixTime): Promise<{
    anomalyRecords: AnomalyRecord[]
    anomalyStatsRecords: AnomalyStatsRecord[]
  }> {
    const configurations = await this.$.indexerService.getSavedConfigurations(
      'tracked_txs_indexer',
    )

    // we need data from 2 * SYNC_RANGE past days to calculate standard deviation
    const deviationRange = to - 1 * this.SYNC_RANGE * 2 * UnixTime.DAY

    const anomalyRecords: AnomalyRecord[] = []
    const anomalyStatsRecords: AnomalyStatsRecord[] = []

    for (const project of this.$.projects) {
      const activeConfigs = getActiveConfigurations(project, configurations)

      if (!activeConfigs) {
        continue
      }

      const records =
        await this.$.db.liveness.getByConfigurationIdWithinTimeRange(
          activeConfigs.map((c) => c.id),
          deviationRange,
          to,
        )

      const livenessRecords = records.map((r) =>
        mapToRecordWithConfig(r, activeConfigs),
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

      const {
        anomalies: batchSubmissionsAnomalies,
        stats: batchSubmissionsStats,
      } = this.detectAnomalies(
        project.id,
        'batchSubmissions',
        batchSubmissions,
        to,
      )

      anomalyRecords.push(...batchSubmissionsAnomalies)
      if (batchSubmissionsStats) anomalyStatsRecords.push(batchSubmissionsStats)

      const { anomalies: stateUpdatesAnomalies, stats: stateUpdatesStats } =
        this.detectAnomalies(project.id, 'stateUpdates', stateUpdates, to)

      anomalyRecords.push(...stateUpdatesAnomalies)
      if (stateUpdatesStats) anomalyStatsRecords.push(stateUpdatesStats)

      const {
        anomalies: proofSubmissionsAnomalies,
        stats: proofSubmissionsUpdatesStats,
      } = this.detectAnomalies(
        project.id,
        'proofSubmissions',
        proofSubmissions,
        to,
      )

      anomalyRecords.push(...proofSubmissionsAnomalies)
      if (proofSubmissionsUpdatesStats)
        anomalyStatsRecords.push(proofSubmissionsUpdatesStats)
    }

    return { anomalyRecords, anomalyStatsRecords }
  }

  detectAnomalies(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
    livenessRecords: LivenessRecordWithConfig[],
    to: UnixTime,
  ): { anomalies: AnomalyRecord[]; stats: AnomalyStatsRecord | undefined } {
    if (livenessRecords.length === 0) {
      return { anomalies: [], stats: undefined }
    }

    // if the oldest record is newer than 2 * SYNC_RANGE -1 we can't calculate anomalies
    const lastRecord = livenessRecords.at(-1)
    if (
      lastRecord?.timestamp &&
      lastRecord.timestamp > to - 1 * (2 * this.SYNC_RANGE - 1) * UnixTime.DAY
    )
      return { anomalies: [], stats: undefined }

    const anomalies: AnomalyRecord[] = []

    // add virtual point to calculate ongoing anomalies
    livenessRecords.unshift({
      id: '',
      timestamp: to,
      blockNumber: 0,
      configurationId: '',
      txHash: '',
      subtype,
    })

    const intervals = calculateIntervals(livenessRecords)

    const lastIndex = intervals.findIndex(
      (interval) =>
        interval.record.timestamp <= to - 1 * this.SYNC_RANGE * UnixTime.DAY,
    )

    const { means, stdDeviations } = this.calculate30DayRollingStats(
      intervals,
      0,
      lastIndex,
      to,
    )

    if (lastIndex === 0) {
      return { anomalies: [], stats: undefined }
    }

    const currentRange = intervals.slice(0, lastIndex)
    currentRange.forEach((interval) => {
      const point = UnixTime.toStartOf(interval.record.timestamp, 'minute')
      const mean = means.get(point)
      const stdDev = stdDeviations.get(
        UnixTime.toStartOf(interval.record.timestamp, 'minute'),
      )

      assert(mean !== undefined, 'Mean should not be undefined')
      assert(stdDev !== undefined, 'StdDev should not be undefined')

      const z = (interval.duration - mean) / stdDev
      if (z >= 15 && interval.duration > mean) {
        anomalies.push({
          projectId,
          timestamp: interval.record.timestamp,
          subtype: interval.record.subtype,
          duration: interval.duration,
        })
      }
    })

    const latestPoint = UnixTime.toStartOf(
      currentRange[0].record.timestamp,
      'minute',
    )
    const latestMean = means.get(latestPoint)
    const latestStDev = stdDeviations.get(latestPoint)

    assert(latestMean !== undefined, 'Latest mean should not be undefined')
    assert(latestStDev !== undefined, 'Latest stdDev should not be undefined')

    const stats = {
      timestamp: to,
      projectId,
      subtype,
      mean: latestMean,
      stdDev: latestStDev,
    } as AnomalyStatsRecord

    return { anomalies, stats }
  }

  calculate30DayRollingStats(
    entireScope: Interval[],
    windowStartIndex: number,
    windowEndIndex: number,
    upTo: UnixTime,
  ): {
    means: Map<number, number>
    stdDeviations: Map<number, number>
  } {
    const result = {
      means: new Map<number, number>(),
      stdDeviations: new Map<number, number>(),
    }

    let timeStart = upTo

    const initialWindow = entireScope.slice(windowStartIndex, windowEndIndex)
    let sum = initialWindow.reduce(
      (prev, curr) => prev + (curr.duration ?? 0),
      0,
    )

    // special handling for the first loop iteration
    const mean = sum / (windowEndIndex - windowStartIndex)
    const rollingStdDev = new RunningStatistics(
      initialWindow.map((r) => r.duration).filter(notUndefined),
    )

    result.means.set(timeStart, mean)
    result.stdDeviations.set(timeStart, rollingStdDev.getStandardDeviation())
    while (timeStart >= upTo - 1 * this.SYNC_RANGE * UnixTime.DAY) {
      timeStart = timeStart - 1 * UnixTime.MINUTE
      const leftFence = timeStart
      const rightFence = timeStart - 1 * this.SYNC_RANGE * UnixTime.DAY

      while (entireScope[windowStartIndex].record.timestamp >= leftFence) {
        sum -= entireScope[windowStartIndex].duration ?? 0
        rollingStdDev.removeValue(entireScope[windowStartIndex].duration ?? 0)
        windowStartIndex++
      }
      while (
        windowEndIndex < entireScope.length &&
        entireScope[windowEndIndex].record.timestamp >= rightFence
      ) {
        sum += entireScope[windowEndIndex].duration ?? 0
        rollingStdDev.addValue(entireScope[windowEndIndex].duration ?? 0)
        windowEndIndex++
      }

      const mean = sum / (windowEndIndex - windowStartIndex)
      result.means.set(timeStart, mean)
      result.stdDeviations.set(timeStart, rollingStdDev.getStandardDeviation())
    }

    return result
  }
}
