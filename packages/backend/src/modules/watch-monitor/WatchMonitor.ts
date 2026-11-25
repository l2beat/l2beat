import type { Logger } from '@l2beat/backend-tools'
import type { Database, WatchPendingNotification } from '@l2beat/database'
import {
  diffWatched,
  hashWatchConfig,
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

const MAX_PENDING_NOTIFICATIONS = 20

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
    const attemptAt = UnixTime.now()
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
      job: (signal: AbortSignal) =>
        this.updateWatch(name, timestamp, signal, attemptAt),
    }))

    const results = await this.workerPool.runInPool(tasks)

    // Persist pool-level failures (including task/run timeouts and skipped
    // tasks) keyed by this run's originating attemptAt so the API reflects them.
    for (const taskError of results.errors) {
      await this.db.watchMonitor.recordFailure(
        taskError.identity.id,
        attemptAt,
        taskError.error.message,
      )
    }

    const failedWatches = results.errors
      .map((error) => error.identity.id)
      .sort()

    this.logger.info('Watch update finished', {
      duration: UnixTime.now() - attemptAt,
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
    attemptAt: UnixTime = UnixTime.now(),
  ): Promise<void> {
    let config: WatchConfig
    let result: Watched
    try {
      config = this.watchReader.readWatchConfig(name)
      result = await this.runWatchFn(config, {
        ...this.watchContext,
        signal,
      })
    } catch (error) {
      if (!signal?.aborted) {
        const message = error instanceof Error ? error.message : String(error)
        await this.db.watchMonitor.recordFailure(name, attemptAt, message)
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

    const previousValues = existing?.values ?? committed?.values ?? {}
    const transitionDiff = diffWatched(previousValues, result.values)
    const queued: WatchPendingNotification[] = [
      ...(existing?.pendingNotifications ?? []),
    ]
    if (transitionDiff.length > 0) {
      queued.push({ timestamp, diff: transitionDiff })
    }
    const boundedQueue =
      queued.length > MAX_PENDING_NOTIFICATIONS
        ? queued.slice(queued.length - MAX_PENDING_NOTIFICATIONS)
        : queued

    // Persist the observation and queued transitions independently of Discord
    // delivery so transient changes survive reverts and the API sees fresh state.
    const persisted = await this.db.watchMonitor.upsertObservation({
      name,
      timestamp: result.timestamp,
      attemptAt,
      values: result.values,
      isPublic: config.isPublic === true,
      configHash: hashWatchConfig(config),
      pendingNotifications: boundedQueue,
    })
    if (signal?.aborted) {
      throw signal.reason
    }
    if (!persisted) {
      return
    }

    await this.drainNotifications(name, attemptAt, boundedQueue, signal)
  }

  private async drainNotifications(
    name: string,
    attemptAt: UnixTime,
    queue: WatchPendingNotification[],
    signal?: AbortSignal,
  ): Promise<void> {
    let remaining = queue
    while (remaining.length > 0) {
      if (signal?.aborted) {
        throw signal.reason
      }
      const next = remaining[0]
      if (next === undefined) {
        break
      }
      const notifyResult = await this.watchNotifier.handleUpdate(
        name,
        next.diff,
        next.timestamp,
      )
      if (signal?.aborted) {
        throw signal.reason
      }
      if (notifyResult === 'failed') {
        await this.db.watchMonitor.recordFailure(
          name,
          attemptAt,
          'Watch notification failed',
        )
        throw new Error('Watch notification failed', { cause: { name } })
      }
      remaining = remaining.slice(1)
      await this.db.watchMonitor.updatePendingNotifications(
        name,
        attemptAt,
        remaining,
      )
    }
  }
}
