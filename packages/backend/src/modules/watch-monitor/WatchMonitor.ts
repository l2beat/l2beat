import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import {
  diffWatched,
  runWatch,
  type WatchConfig,
  type WatchContext,
  type Watched,
  type WatchReader,
} from '@l2beat/discovery'
import { UnixTime } from '@l2beat/shared-pure'
import shuffle from 'lodash/shuffle'
import type { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'
import type { WorkerPool } from '../update-monitor/createWorkers'
import { getPendingWatchDiffs } from './pendingWatchDiffs'
import type { WatchNotifier } from './WatchNotifier'

export type RunWatchFn = (
  config: WatchConfig,
  context: WatchContext,
) => Promise<Watched>

export class WatchMonitor {
  private readonly taskQueue: TaskQueue<UnixTime>

  constructor(
    private readonly watchReader: WatchReader,
    private readonly watchContext: WatchContext,
    private readonly watchNotifier: WatchNotifier,
    private readonly db: Database,
    private readonly clock: Clock,
    private readonly logger: Logger,
    private readonly runOnStart: boolean,
    private readonly workerPool: WorkerPool,
    private readonly disabledWatches: string[] = [],
    private readonly runWatchFn: RunWatchFn = runWatch,
  ) {
    this.logger = this.logger.for(this)
    this.taskQueue = new TaskQueue(
      (timestamp) => this.update(timestamp),
      this.logger.for('taskQueue'),
      {
        metricsId: WatchMonitor.name,
      },
    )
  }

  start() {
    this.logger.info('Started')
    if (this.runOnStart) {
      this.taskQueue.addToFront(UnixTime.now())
    }
    return this.clock.onNewHour((timestamp) => {
      this.taskQueue.addToFront(timestamp)
    })
  }

  async update(timestamp: UnixTime): Promise<void> {
    const updateStart = UnixTime.now()
    const allWatches = this.watchReader
      .readAllWatches()
      .map((location) => location.name)
    const enabledWatches = shuffle(allWatches).filter(
      (name) => !this.disabledWatches.includes(name),
    )

    this.logger.info('Watch update started', {
      updateTarget: timestamp,
      total: allWatches.length,
      enabled: enabledWatches.length,
      disabled: this.disabledWatches.length,
    })

    const tasks = enabledWatches.map((name) => ({
      identity: {
        id: name,
        name: `Watch ${name}`,
      },
      job: (signal: AbortSignal) => this.updateWatch(name, timestamp, signal),
    }))

    const results = await this.workerPool.runInPool(tasks)
    const failedWatches = results.errors
      .map((error) => error.identity.id)
      .sort()

    this.logger.info('Watch update finished', {
      duration: UnixTime.now() - updateStart,
      updateTarget: timestamp,
      timedOut: results.timedOut,
      successCount: results.results.length,
      failedCount: failedWatches.length,
      totalCount: tasks.length,
    })

    const pendingDiffs = await getPendingWatchDiffs(this.watchReader, this.db)
    const reminderEntries = pendingDiffs.map(
      ({ name, pendingItems, changedPaths }) => ({
        name,
        pendingItems,
        changedPaths,
      }),
    )

    await this.watchNotifier.sendDailyReminder(
      reminderEntries,
      timestamp,
      this.disabledWatches,
      failedWatches,
    )
  }

  async updateWatch(
    name: string,
    timestamp: UnixTime,
    signal?: AbortSignal,
  ): Promise<void> {
    let result: Watched
    try {
      const config = this.watchReader.readWatchConfig(name)
      result = await this.runWatchFn(config, {
        ...this.watchContext,
        signal,
      })
    } catch (error) {
      if (!signal?.aborted) {
        const message = error instanceof Error ? error.message : String(error)
        await this.db.watchMonitor.recordFailure(name, UnixTime.now(), message)
      }
      throw error
    }

    if (signal?.aborted) {
      throw signal.reason
    }

    const existing = await this.db.watchMonitor.findLatest(name)
    const committed = this.watchReader.readWatched(name)
    if (signal?.aborted) {
      throw signal.reason
    }

    // Persist the observation independently of Discord delivery so the API
    // and daily reminder reflect fresh state even when Discord is degraded.
    const persisted = await this.db.watchMonitor.upsertObservation({
      name,
      timestamp: result.timestamp,
      values: result.values,
    })
    if (!persisted || signal?.aborted) {
      if (signal?.aborted) {
        throw signal.reason
      }
      return
    }

    const previousNotified = existing?.notifiedValues ?? committed?.values ?? {}
    const diff = diffWatched(previousNotified, result.values)

    if (diff.length === 0) {
      if (existing?.notifiedValues === null || existing === undefined) {
        await this.db.watchMonitor.markNotified(
          name,
          result.timestamp,
          result.values,
        )
      }
      return
    }

    const notifyResult = await this.watchNotifier.handleUpdate(
      name,
      diff,
      timestamp,
    )
    if (notifyResult === 'failed') {
      await this.db.watchMonitor.recordFailure(
        name,
        UnixTime.now(),
        'Watch notification failed',
      )
      throw new Error('Watch notification failed', { cause: { name } })
    }

    await this.db.watchMonitor.markNotified(
      name,
      result.timestamp,
      result.values,
    )
  }
}
