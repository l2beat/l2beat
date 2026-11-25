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
import { type Hash256, UnixTime } from '@l2beat/shared-pure'
import { randomUUID } from 'crypto'
import shuffle from 'lodash/shuffle'
import type { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'
import type { WorkerPool } from '../update-monitor/createWorkers'
import { getPendingWatchDiffs } from './pendingWatchDiffs'
import type { WatchNotifier } from './WatchNotifier'

const MAX_PENDING_NOTIFICATIONS = 20
const MAX_OBSERVATION_CAS_ATTEMPTS = 3

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
    const attemptAt = new Date()
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

    const attemptIds = new Map<string, string>()
    const attemptConfigHashes = new Map<string, Hash256 | null>()
    const tasks = enabledWatches.map((name) => {
      const attemptId = randomUUID()
      attemptIds.set(name, attemptId)
      attemptConfigHashes.set(name, this.tryReadConfigHash(name))
      return {
        identity: {
          id: name,
          name: `Watch ${name}`,
        },
        job: (signal: AbortSignal) =>
          this.updateWatch(name, timestamp, signal, attemptAt, attemptId),
      }
    })

    const results = await this.workerPool.runInPool(tasks)

    // Persist pool-level failures (including task/run timeouts and skipped
    // tasks), and drain any already-queued alerts outside the timed-out worker
    // signal so a source timeout never strands earlier transitions.
    for (const taskError of results.errors) {
      const name = taskError.identity.id
      const attemptId = attemptIds.get(name) ?? randomUUID()
      const configHash = attemptConfigHashes.get(name) ?? null
      await this.db.watchMonitor.recordFailure(
        name,
        attemptAt,
        attemptId,
        taskError.error.message,
        configHash,
      )
      await this.drainQueuedNotifications(name)
    }

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
    attemptAt: Date = new Date(),
    attemptId: string = randomUUID(),
  ): Promise<void> {
    let config: WatchConfig | undefined
    let configHash: Hash256 | null = null
    let result: Watched
    try {
      config = this.watchReader.readWatchConfig(name)
      configHash = hashWatchConfig(config)
      result = await this.runWatchFn(config, {
        ...this.watchContext,
        signal,
      })
    } catch (error) {
      if (!signal?.aborted) {
        const message = error instanceof Error ? error.message : String(error)
        await this.db.watchMonitor.recordFailure(
          name,
          attemptAt,
          attemptId,
          message,
          configHash,
        )
        await this.drainQueuedNotifications(name, signal)
      }
      throw error
    }

    if (signal?.aborted) {
      throw signal.reason
    }

    const persisted = await this.persistObservationWithCas(
      name,
      config,
      configHash,
      result,
      timestamp,
      attemptAt,
      attemptId,
      signal,
    )
    if (signal?.aborted) {
      throw signal.reason
    }
    if (!persisted) {
      return
    }

    const deliveredAll = await this.drainQueuedNotifications(name, signal)
    if (!deliveredAll) {
      await this.db.watchMonitor.recordFailure(
        name,
        attemptAt,
        attemptId,
        'Watch notification failed',
        configHash,
      )
      throw new Error('Watch notification failed', { cause: { name } })
    }
  }

  private async persistObservationWithCas(
    name: string,
    config: WatchConfig,
    configHash: Hash256,
    result: Watched,
    timestamp: UnixTime,
    attemptAt: Date,
    attemptId: string,
    signal?: AbortSignal,
  ): Promise<boolean> {
    const committed = this.watchReader.readWatched(name)
    for (let attempt = 0; attempt < MAX_OBSERVATION_CAS_ATTEMPTS; attempt++) {
      if (signal?.aborted) {
        throw signal.reason
      }
      const existing = await this.db.watchMonitor.findLatest(name)
      if (signal?.aborted) {
        throw signal.reason
      }

      const previousValues = existing?.values ?? committed?.values ?? {}
      const transitionDiff = diffWatched(previousValues, result.values)
      const queued: WatchPendingNotification[] = [
        ...(existing?.pendingNotifications ?? []),
      ]
      if (transitionDiff.length > 0) {
        queued.push({ id: randomUUID(), timestamp, diff: transitionDiff })
      }
      const boundedQueue =
        queued.length > MAX_PENDING_NOTIFICATIONS
          ? queued.slice(queued.length - MAX_PENDING_NOTIFICATIONS)
          : queued

      const persisted = await this.db.watchMonitor.upsertObservation({
        name,
        timestamp: result.timestamp,
        attemptAt,
        attemptId,
        expectedLastAttemptId: existing?.lastAttemptId ?? null,
        values: result.values,
        isPublic: config.isPublic === true,
        configHash,
        pendingNotifications: boundedQueue,
      })
      if (persisted) {
        return true
      }
      // If another attempt raced ahead with a strictly newer timestamp, stop.
      const fresh = await this.db.watchMonitor.findLatest(name)
      if (
        fresh !== undefined &&
        fresh.lastAttemptAt !== null &&
        fresh.lastAttemptAt > UnixTime.fromDate(attemptAt)
      ) {
        return false
      }
    }
    return false
  }

  private async drainQueuedNotifications(
    name: string,
    signal?: AbortSignal,
  ): Promise<boolean> {
    const existing = await this.db.watchMonitor.findLatest(name)
    if (existing === undefined || existing.pendingNotifications.length === 0) {
      return true
    }
    for (const item of existing.pendingNotifications) {
      if (signal?.aborted) {
        throw signal.reason
      }
      const notifyResult = await this.watchNotifier.handleUpdate(
        name,
        item.diff,
        item.timestamp,
      )
      if (signal?.aborted) {
        throw signal.reason
      }
      if (notifyResult === 'failed') {
        return false
      }
      await this.db.watchMonitor.acknowledgePendingNotification(name, item.id)
    }
    return true
  }

  private tryReadConfigHash(name: string): Hash256 | null {
    try {
      return hashWatchConfig(this.watchReader.readWatchConfig(name))
    } catch {
      return null
    }
  }
}
