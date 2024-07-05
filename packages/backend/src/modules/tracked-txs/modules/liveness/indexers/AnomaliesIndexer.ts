import { TrackedTxConfigEntry } from '@l2beat/shared'
import {
  assert,
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
  clampRangeToDay,
  notUndefined,
} from '@l2beat/shared-pure'
import { Project } from '../../../../../model/Project'
import {
  ManagedChildIndexer,
  ManagedChildIndexerOptions,
} from '../../../../../tools/uif/ManagedChildIndexer'
import { RunningStatistics } from '../api/RollingVariance'
import {
  AnomaliesRecord,
  AnomaliesRepository,
} from '../repositories/AnomaliesRepository'
import {
  LivenessRecordWithSubtype,
  LivenessRepository,
} from '../repositories/LivenessRepository'
import { Interval, calculateIntervals } from '../utils/calculateIntervals'
import { getProjectsToSync } from '../utils/getProjectsToSync'
import { groupByType } from '../utils/groupByType'

export interface AnomaliesIndexerIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  livenessRepository: LivenessRepository
  anomaliesRepository: AnomaliesRepository
  projects: Project[]
}

export class AnomaliesIndexer extends ManagedChildIndexer {
  private readonly SYNC_RANGE = 30
  constructor(private readonly $: AnomaliesIndexerIndexerDeps) {
    super({ ...$, name: 'anomalies' })
  }

  override async update(from: number, to: number): Promise<number> {
    // we only need to go one day back
    const maxDepth = UnixTime.now().add(-1, 'days').toStartOf('day').toNumber()
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

    const anomalies = await this.getAnomalies(unixTo)

    await this.$.anomaliesRepository.addOrUpdateMany(anomalies)

    return unixTo.toNumber()
  }

  override async invalidate(targetHeight: number): Promise<number> {
    // no need to remove data
    // safeHeight will be updated to this value
    return await Promise.resolve(targetHeight)
  }

  async getAnomalies(to: UnixTime) {
    const anomalies: AnomaliesRecord[] = []

    const configurations =
      await this.$.indexerService.getSavedConfigurations<TrackedTxConfigEntry>(
        'tracked_txs_indexer',
      )

    const projectsToSync = getProjectsToSync(this.$.projects, configurations)

    // we need data from 2 * SYNC_RANGE past days to calcualate standard deviation
    const deviationRange = to.add(-1 * this.SYNC_RANGE * 2, 'days')

    for (const project of projectsToSync) {
      const livenessRecords =
        await this.$.livenessRepository.getWithSubtypeByProjectIdsWithinTimeRange(
          project.projectId,
          deviationRange,
          to,
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

      const test = this.detectAnomalies(
        project.projectId,
        'batchSubmissions',
        batchSubmissions,
        to,
      )

      anomalies.push(...test)

      anomalies.push(
        ...this.detectAnomalies(
          project.projectId,
          'stateUpdates',
          stateUpdates,
          to,
        ),
      )

      anomalies.push(
        ...this.detectAnomalies(
          project.projectId,
          'proofSubmissions',
          proofSubmissions,
          to,
        ),
      )
    }

    return anomalies
  }

  detectAnomalies(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
    livenessRecords: LivenessRecordWithSubtype[],
    to: UnixTime,
  ): AnomaliesRecord[] {
    if (livenessRecords.length === 0) {
      return []
    }

    // if the oldest record is newer than 2 * SYNC_RANGE -1 we can't calculate anomalies
    const lastRecord = livenessRecords.at(-1)
    if (
      lastRecord?.timestamp.gt(to.add(-1 * (2 * this.SYNC_RANGE - 1), 'days'))
    )
      return []

    const anomalies: AnomaliesRecord[] = []

    // add virtual point to calculate ongoing anomalies
    livenessRecords.unshift({
      timestamp: to,
      subtype,
    })

    const intervals = calculateIntervals(livenessRecords)

    const lastIndex = intervals.findIndex((interval) =>
      interval.record.timestamp.lte(to.add(-1 * this.SYNC_RANGE, 'days')),
    )

    const { means, stdDevs } = this.calculate30DayRollingStats(
      intervals,
      0,
      lastIndex,
      to,
    )

    const currentRange = intervals.slice(0, lastIndex)
    currentRange.forEach((interval) => {
      const point = interval.record.timestamp.toStartOf('minute').toNumber()
      const mean = means.get(point)
      const stdDev = stdDevs.get(
        interval.record.timestamp.toStartOf('minute').toNumber(),
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

    return anomalies
  }

  calculate30DayRollingStats(
    entireScope: Interval[],
    windowStartIndex: number,
    windowEndIndex: number,
    upTo: UnixTime,
  ): {
    means: Map<number, number>
    stdDevs: Map<number, number>
  } {
    const result = {
      means: new Map<number, number>(),
      stdDevs: new Map<number, number>(),
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

    result.means.set(timeStart.toNumber(), mean)
    result.stdDevs.set(
      timeStart.toNumber(),
      rollingStdDev.getStandardDeviation(),
    )
    while (timeStart.gte(upTo.add(-1 * this.SYNC_RANGE, 'days'))) {
      timeStart = timeStart.add(-1, 'minutes')
      const leftFence = timeStart
      const rightFence = timeStart.add(-1 * this.SYNC_RANGE, 'days')

      while (entireScope[windowStartIndex].record.timestamp.gte(leftFence)) {
        sum -= entireScope[windowStartIndex].duration ?? 0
        rollingStdDev.removeValue(entireScope[windowStartIndex].duration ?? 0)
        windowStartIndex++
      }
      while (
        windowEndIndex < entireScope.length &&
        entireScope[windowEndIndex].record.timestamp.gte(rightFence)
      ) {
        sum += entireScope[windowEndIndex].duration ?? 0
        rollingStdDev.addValue(entireScope[windowEndIndex].duration ?? 0)
        windowEndIndex++
      }

      const mean = sum / (windowEndIndex - windowStartIndex)
      result.means.set(timeStart.toNumber(), mean)
      result.stdDevs.set(
        timeStart.toNumber(),
        rollingStdDev.getStandardDeviation(),
      )
    }

    return result
  }
}
