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
import { assert, type Hash256, UnixTime } from '@l2beat/shared-pure'
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
const NOTIFICATION_DELIVERY_TIMEOUT_MS = 30 * 1000
const DRAIN_CONCURRENCY = 4

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
    private readonly notificationDeliveryTimeoutMs: number = NOTIFICATION_DELIVERY_TIMEOUT_MS,
    private readonly notificationClaimLeaseMs: number = NOTIFICATION_CLAIM_LEASE_MS,
  ) {
    assert(
      this.notificationDeliveryTimeoutMs > 0 &&
        this.notificationDeliveryTimeoutMs < this.notificationClaimLeaseMs,
      'Notification delivery timeout must be shorter than claim lease',
    )
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
    const recordFailure = (name: string, message: string) =>
      this.recordFailureAndLog(
        name,
        attemptAt,
        attemptIds.get(name) ?? randomUUID(),
        message,
        attemptConfigHashes.get(name) ?? null,
      )
    for (const taskError of results.errors) {
      const name = taskError.identity.id
      failedSet.add(name)
      await recordFailure(name, summarizeWatchError(taskError.error))
    }

    // Drain persisted transition alerts with bounded concurrency outside the
    // abortable worker pool so both succeeded watches and timed-out/failed
    // sources deliver queued alerts cleanly without one slow send stalling
    // the rest of the hourly run.
    let nextDrainIndex = 0
    const drainWorker = async () => {
      while (nextDrainIndex < enabledWatches.length) {
        const name = enabledWatches[nextDrainIndex++]
        if (name === undefined) {
          return
        }
        const deliveredAll = await this.drainAndLog(name)
        if (deliveredAll) {
          continue
        }
        if (!failedSet.has(name)) {
          await recordFailure(name, 'Watch notification failed')
        }
        failedSet.add(name)
      }
    }
    const drainWorkers = Array.from(
      { length: Math.min(DRAIN_CONCURRENCY, enabledWatches.length) },
      () => drainWorker(),
    )
    await Promise.all(drainWorkers)

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
        this.notificationClaimLeaseMs,
      )
      if (item === undefined) {
        return true
      }

      const deliveryController = new AbortController()
      const onCallerAbort = () => deliveryController.abort(signal?.reason)
      signal?.addEventListener('abort', onCallerAbort, { once: true })

      let timeoutHandle: ReturnType<typeof setTimeout> | undefined
      const timeoutPromise = new Promise<'timed-out'>((resolve) => {
        timeoutHandle = setTimeout(() => {
          deliveryController.abort(new Error('Watch notification timed out'))
          resolve('timed-out')
        }, this.notificationDeliveryTimeoutMs)
      })

      const sendPromise = this.watchNotifier.handleUpdate(
        name,
        item.diff,
        item.timestamp,
        deliveryController.signal,
      )

      let outcome: WatchNotifyResult | 'timed-out'
      try {
        outcome = await Promise.race([sendPromise, timeoutPromise])
      } catch (error) {
        await this.db.watchMonitor.releasePendingNotificationClaim(
          name,
          item.id,
          ownerId,
        )
        throw error
      } finally {
        if (timeoutHandle !== undefined) {
          clearTimeout(timeoutHandle)
        }
        signal?.removeEventListener('abort', onCallerAbort)
      }

      if (outcome === 'timed-out') {
        // Leave the claim intact while the underlying promise finishes settling
        // so another worker cannot double-send before lease expiry; complete or
        // release with ownerId check once the promise settles.
        void sendPromise
          .then(
            async (lateResult) => {
              if (lateResult === 'failed') {
                await this.db.watchMonitor.releasePendingNotificationClaim(
                  name,
                  item.id,
                  ownerId,
                )
              } else {
                await this.db.watchMonitor.acknowledgePendingNotification(
                  name,
                  item.id,
                  ownerId,
                )
              }
            },
            async () => {
              await this.db.watchMonitor.releasePendingNotificationClaim(
                name,
                item.id,
                ownerId,
              )
            },
          )
          .catch(() => {})
        if (signal?.aborted) {
          throw signal.reason
        }
        return false
      }

      if (outcome === 'failed') {
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

      // Acknowledge with owner check once Discord accepted the message (or no
      // client is configured), even if caller signal aborted while in flight.
      await this.db.watchMonitor.acknowledgePendingNotification(
        name,
        item.id,
        ownerId,
      )
      if (signal?.aborted) {
        throw signal.reason
      }
    }
    return true
  }

  // One watch whose row cannot be written must not stop the others from
  // draining: their alerts are already persisted and only wait to be sent.
  private async recordFailureAndLog(
    name: string,
    attemptAt: Date,
    attemptId: string,
    message: string,
    configHash: Hash256 | null,
  ): Promise<void> {
    try {
      await this.db.watchMonitor.recordFailure(
        name,
        attemptAt,
        attemptId,
        message,
        configHash,
      )
    } catch (error) {
      this.logger.error('Watch failure not recorded', { watch: name, error })
    }
  }

  private async drainAndLog(name: string): Promise<boolean> {
    try {
      return await this.drainQueuedNotifications(name)
    } catch (error) {
      this.logger.error('Watch notifications not drained', {
        watch: name,
        error,
      })
      return false
    }
  }

  private tryReadConfigHash(name: string): Hash256 | null {
    try {
      return hashWatchConfig(this.watchReader.readWatchConfig(name))
    } catch {
      return null
    }
  }
}

const WATCH_ERROR_SUMMARY_LENGTH_MAX = 500

// runWatch wraps the source error as 'Watch run failed' and keeps the key and
// the original error in the cause. Without them a stored failure cannot tell
// bad credentials from a source outage.
export function summarizeWatchError(error: Error): string {
  const parts = [error.message]
  const cause: unknown = error.cause
  if (typeof cause === 'object' && cause !== null) {
    if ('key' in cause && typeof cause.key === 'string') {
      parts.push(`key ${cause.key}`)
    }
    if ('error' in cause && cause.error instanceof Error) {
      parts.push(cause.error.message)
    }
  }
  return parts.join(': ').slice(0, WATCH_ERROR_SUMMARY_LENGTH_MAX)
}
