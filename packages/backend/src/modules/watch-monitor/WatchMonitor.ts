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
import type { WatchNotifier, WatchNotifyResult } from './WatchNotifier'

const MAX_PENDING_NOTIFICATIONS = 20
const MAX_OBSERVATION_CAS_ATTEMPTS = 3
const NOTIFICATION_CLAIM_LEASE_MS = 5 * 60 * 1000

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
        // Keep Discord delivery out of the abortable worker pool so task/run
        // timeouts only cancel external fetches and never race an in-flight
        // Discord send against post-pool recovery.
        job: (signal: AbortSignal) =>
          this.fetchAndPersistWatch(
            name,
            timestamp,
            signal,
            attemptAt,
            attemptId,
          ),
      }
    })

    const results = await this.workerPool.runInPool(tasks)

    const failedSet = new Set<string>()
    for (const taskError of results.errors) {
      const name = taskError.identity.id
      failedSet.add(name)
      const attemptId = attemptIds.get(name) ?? randomUUID()
      const configHash = attemptConfigHashes.get(name) ?? null
      await this.db.watchMonitor.recordFailure(
        name,
        attemptAt,
        attemptId,
        taskError.error.message,
        configHash,
      )
    }

    // Drain persisted transition alerts once per watch outside the abortable
    // worker signal so both succeeded watches and timed-out/failed sources
    // deliver queued alerts cleanly under single-owner claims.
    for (const name of enabledWatches) {
      const deliveredAll = await this.drainQueuedNotifications(name)
      if (!deliveredAll) {
        if (!failedSet.has(name)) {
          const attemptId = attemptIds.get(name) ?? randomUUID()
          const configHash = attemptConfigHashes.get(name) ?? null
          await this.db.watchMonitor.recordFailure(
            name,
            attemptAt,
            attemptId,
            'Watch notification failed',
            configHash,
          )
        }
        failedSet.add(name)
      }
    }

    const failedWatches = [...failedSet].sort()

    this.logger.info('Watch update finished', {
      duration: UnixTime.now() - updateStart,
      updateTarget: timestamp,
      timedOut: results.timedOut,
      successCount: tasks.length - failedWatches.length,
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
    let persisted: boolean
    let configHash: Hash256 | null = null
    try {
      const outcome = await this.fetchAndPersistWatch(
        name,
        timestamp,
        signal,
        attemptAt,
        attemptId,
      )
      persisted = outcome.persisted
      configHash = outcome.configHash
    } catch (error) {
      if (!signal?.aborted) {
        const message = error instanceof Error ? error.message : String(error)
        await this.db.watchMonitor.recordFailure(
          name,
          attemptAt,
          attemptId,
          message,
          this.tryReadConfigHash(name),
        )
        await this.drainQueuedNotifications(name, signal)
      }
      throw error
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

  private async fetchAndPersistWatch(
    name: string,
    timestamp: UnixTime,
    signal: AbortSignal | undefined,
    attemptAt: Date,
    attemptId: string,
  ): Promise<{ persisted: boolean; configHash: Hash256 }> {
    const config = this.watchReader.readWatchConfig(name)
    const configHash = hashWatchConfig(config)
    const result = await this.runWatchFn(config, {
      ...this.watchContext,
      signal,
    })

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
    return { persisted, configHash }
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
      const newNotification: WatchPendingNotification | null =
        transitionDiff.length > 0
          ? { id: randomUUID(), timestamp, diff: transitionDiff }
          : null

      const persisted = await this.db.watchMonitor.upsertObservation({
        name,
        timestamp: result.timestamp,
        attemptAt,
        attemptId,
        expectedLastAttemptId: existing?.lastAttemptId ?? null,
        values: result.values,
        isPublic: config.isPublic === true,
        configHash,
        newNotification,
        maxPendingNotifications: MAX_PENDING_NOTIFICATIONS,
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
    const ownerId = randomUUID()
    for (let i = 0; i < MAX_PENDING_NOTIFICATIONS; i++) {
      if (signal?.aborted) {
        throw signal.reason
      }
      const item = await this.db.watchMonitor.claimNextPendingNotification(
        name,
        ownerId,
        Date.now(),
        NOTIFICATION_CLAIM_LEASE_MS,
      )
      if (item === undefined) {
        return true
      }

      let notifyResult: WatchNotifyResult
      try {
        notifyResult = await this.watchNotifier.handleUpdate(
          name,
          item.diff,
          item.timestamp,
        )
      } catch (error) {
        await this.db.watchMonitor.releasePendingNotificationClaim(
          name,
          item.id,
          ownerId,
        )
        throw error
      }

      if (notifyResult === 'failed') {
        await this.db.watchMonitor.releasePendingNotificationClaim(
          name,
          item.id,
          ownerId,
        )
        if (signal?.aborted) {
          throw signal.reason
        }
        return false
      }

      // Acknowledge unconditionally once Discord accepted the message (or no
      // client is configured), even if signal aborted while the request was
      // already in flight, so the delivered alert cannot be sent again.
      await this.db.watchMonitor.acknowledgePendingNotification(name, item.id)
      if (signal?.aborted) {
        throw signal.reason
      }
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
