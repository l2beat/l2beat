import { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  WatchMonitorRecord,
  WatchObservation,
} from '@l2beat/database'
import type {
  WatchConfig,
  WatchContext,
  Watched,
  WatchReader,
} from '@l2beat/discovery'
import type { HttpClient } from '@l2beat/shared'
import { type Hash256, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { Clock } from '../../tools/Clock'
import {
  createWorkerPool,
  type WorkerPool,
} from '../update-monitor/createWorkers'
import { summarizeWatchError, WatchMonitor } from './WatchMonitor'
import type { WatchNotifier } from './WatchNotifier'

const instantWorkerPool = mockObject<WorkerPool>({
  runInPool: mockFn(async (tasks) => {
    const results = []
    const errors = []
    for (const task of tasks) {
      try {
        const result = await task.job(new AbortController().signal)
        results.push({ identity: task.identity, result })
      } catch (error) {
        errors.push({
          identity: task.identity,
          error: error instanceof Error ? error : new Error(String(error)),
        })
      }
    }
    return { results, errors, timedOut: false }
  }),
})

const CONTEXT: WatchContext = {
  http: mockObject<HttpClient>(),
}

const TIMESTAMP = 1_700_000_000

function createMemoryDb() {
  const stored = new Map<string, WatchMonitorRecord>()
  const storedAttemptDates = new Map<string, Date>()
  const canWrite = (name: string, attemptAt: Date, attemptId: string) => {
    const prev = stored.get(name)
    const prevDate = storedAttemptDates.get(name)
    if (prev === undefined || prevDate === undefined) {
      return true
    }
    if (prevDate.getTime() < attemptAt.getTime()) {
      return true
    }
    return (
      prevDate.getTime() === attemptAt.getTime() &&
      prev.lastAttemptId === attemptId
    )
  }

  const watchMonitor = mockObject<Database['watchMonitor']>({
    findLatest: async (name: string) => stored.get(name),
    getAll: async () => [...stored.values()],
    upsertObservation: async (obs: WatchObservation) => {
      const prev = stored.get(obs.name)
      const currentLastAttemptId = prev?.lastAttemptId ?? null
      if (currentLastAttemptId !== obs.expectedLastAttemptId) {
        return false
      }
      if (
        (prev !== undefined &&
          prev.timestamp !== null &&
          prev.timestamp > obs.timestamp) ||
        !canWrite(obs.name, obs.attemptAt, obs.attemptId)
      ) {
        return false
      }
      const liveQueue = prev?.pendingNotifications ?? []
      let nextQueue = liveQueue
      if (obs.newNotification !== null) {
        const combined = [...liveQueue, obs.newNotification]
        if (combined.length > obs.maxPendingNotifications) {
          const head = combined[0]
          if (head?.claimedBy !== undefined) {
            const tailBudget = Math.max(obs.maxPendingNotifications - 1, 0)
            const tail =
              tailBudget === 0 ? [] : combined.slice(1).slice(-tailBudget)
            nextQueue = [head, ...tail]
          } else {
            nextQueue = combined.slice(-obs.maxPendingNotifications)
          }
        } else {
          nextQueue = combined
        }
      }
      storedAttemptDates.set(obs.name, obs.attemptAt)
      stored.set(obs.name, {
        name: obs.name,
        timestamp: obs.timestamp,
        values: obs.values,
        isPublic: obs.isPublic,
        configHash: obs.configHash,
        pendingNotifications: nextQueue,
        lastAttemptAt: UnixTime.fromDate(obs.attemptAt),
        lastAttemptId: obs.attemptId,
        lastAttemptConfigHash: obs.configHash,
        lastError: null,
      })
      return true
    },
    claimNextPendingNotification: async (
      name: string,
      ownerId: string,
      leaseMs: number,
    ) => {
      const prev = stored.get(name)
      const head = prev?.pendingNotifications[0]
      if (prev === undefined || head === undefined) {
        return undefined
      }
      const nowMs = Date.now()
      if (
        head.claimedBy !== undefined &&
        head.claimedAt !== undefined &&
        nowMs - head.claimedAt < leaseMs
      ) {
        return undefined
      }
      const claimed = {
        id: head.id,
        timestamp: head.timestamp,
        diff: head.diff,
        claimedBy: ownerId,
        claimedAt: nowMs,
      }
      stored.set(name, {
        ...prev,
        pendingNotifications: [claimed, ...prev.pendingNotifications.slice(1)],
      })
      return claimed
    },
    releasePendingNotificationClaim: async (
      name: string,
      notificationId: string,
      ownerId: string,
    ) => {
      const prev = stored.get(name)
      if (prev === undefined) {
        return
      }
      stored.set(name, {
        ...prev,
        pendingNotifications: prev.pendingNotifications.map((item) =>
          item.id === notificationId && item.claimedBy === ownerId
            ? { id: item.id, timestamp: item.timestamp, diff: item.diff }
            : item,
        ),
      })
    },
    acknowledgePendingNotification: async (
      name: string,
      notificationId: string,
      ownerId: string,
    ) => {
      const prev = stored.get(name)
      if (prev === undefined) {
        return false
      }
      const matched = prev.pendingNotifications.some(
        (item) => item.id === notificationId && item.claimedBy === ownerId,
      )
      if (!matched) {
        return false
      }
      stored.set(name, {
        ...prev,
        pendingNotifications: prev.pendingNotifications.filter(
          (item) => !(item.id === notificationId && item.claimedBy === ownerId),
        ),
      })
      return true
    },
    recordFailure: async (
      name: string,
      attemptAt: Date,
      attemptId: string,
      errorMessage: string,
      configHash: Hash256 | null = null,
    ) => {
      if (!canWrite(name, attemptAt, attemptId)) {
        return
      }
      const prev = stored.get(name)
      storedAttemptDates.set(name, attemptAt)
      stored.set(name, {
        name,
        timestamp: prev?.timestamp ?? null,
        values: prev?.values ?? null,
        isPublic: prev?.isPublic ?? false,
        configHash: prev?.configHash ?? null,
        pendingNotifications: prev?.pendingNotifications ?? [],
        lastAttemptAt: UnixTime.fromDate(attemptAt),
        lastAttemptId: attemptId,
        lastAttemptConfigHash: configHash,
        lastError: errorMessage,
      })
    },
  })
  return { stored, db: mockObject<Database>({ watchMonitor }) }
}

describe(WatchMonitor.name, () => {
  it('notifies once on transition, skips unchanged runs, and sends daily reminder from stored runs', async () => {
    const { stored, db } = createMemoryDb()

    const committed: Watched = {
      timestamp: 1,
      values: { audits: { 'org/r:a.pdf': { sha: '1', size: 10 } } },
    }
    const reader = mockObject<WatchReader>({
      readAllWatches: () => [
        { name: 'optimism', kind: 'project', path: '/p/optimism' },
      ],
      readWatchConfig: (name: string): WatchConfig => ({
        name,
        isPublic: true,
        watches: [],
      }),
      readWatched: () => committed,
    })

    const notifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn().resolvesTo('sent'),
      sendDailyReminder: mockFn().resolvesTo('sent'),
    })

    const values = {
      audits: {
        'org/r:a.pdf': { sha: '1', size: 10 },
        'org/r:b.pdf': { sha: '2', size: 20 },
      },
    }
    const runWatchFn = mockFn()
      .resolvesToOnce({ timestamp: TIMESTAMP, values })
      .resolvesToOnce({ timestamp: TIMESTAMP + 3600, values })

    const monitor = new WatchMonitor(
      reader,
      CONTEXT,
      notifier,
      db,
      mockObject<Clock>(),
      Logger.SILENT,
      false,
      instantWorkerPool,
      [],
      runWatchFn,
    )

    await monitor.update(TIMESTAMP)
    expect(notifier.handleUpdate).toHaveBeenCalledTimes(1)
    expect(stored.get('optimism')?.values).toEqual(values)
    expect(stored.get('optimism')?.pendingNotifications).toEqual([])
    expect(stored.get('optimism')?.isPublic).toEqual(true)
    expect(notifier.sendDailyReminder).toHaveBeenNthCalledWith(
      1,
      [{ name: 'optimism', pendingItems: 0, changedPaths: 1 }],
      TIMESTAMP,
      [],
      [],
    )

    await monitor.update(TIMESTAMP + 3600)
    expect(notifier.handleUpdate).toHaveBeenCalledTimes(1)
    expect(notifier.sendDailyReminder).toHaveBeenNthCalledWith(
      2,
      [{ name: 'optimism', pendingItems: 0, changedPaths: 1 }],
      TIMESTAMP + 3600,
      [],
      [],
    )
  })

  it('persists pool-level worker timeouts and still drains already-queued alerts', async () => {
    const { stored, db } = createMemoryDb()
    const reader = mockObject<WatchReader>({
      readAllWatches: () => [
        { name: 'slow', kind: 'project', path: '/p/slow' },
      ],
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => ({ timestamp: 1, values: { v: 'A' } }),
    })
    const notifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn().resolvesToOnce('failed').resolvesToOnce('sent'),
      sendDailyReminder: mockFn().resolvesTo('sent'),
    })

    // Seed an undelivered alert from an earlier run where Discord failed.
    const initialMonitor = new WatchMonitor(
      reader,
      CONTEXT,
      notifier,
      db,
      mockObject<Clock>(),
      Logger.SILENT,
      false,
      instantWorkerPool,
      [],
      mockFn().resolvesTo({ timestamp: TIMESTAMP, values: { v: 'B' } }),
    )
    await expect(
      initialMonitor.updateWatch(
        'slow',
        TIMESTAMP,
        undefined,
        new Date(TIMESTAMP * 1000),
        'attempt-1',
      ),
    ).toBeRejectedWith('Watch notification failed')
    expect(stored.get('slow')?.pendingNotifications.length).toEqual(1)

    // Next run times out in the worker pool; Discord is back up -> timeout is
    // recorded AND the queued alert is drained outside the aborted signal.
    const timeoutPool = mockObject<WorkerPool>({
      runInPool: async (tasks) => ({
        results: [],
        errors: tasks.map((t) => ({
          identity: t.identity,
          error: new Error('Task timeout'),
        })),
        timedOut: true,
      }),
    })
    const monitor = new WatchMonitor(
      reader,
      CONTEXT,
      notifier,
      db,
      mockObject<Clock>(),
      Logger.SILENT,
      false,
      timeoutPool,
      [],
    )

    await monitor.update(TIMESTAMP + 3600)
    expect(stored.get('slow')?.lastError).toEqual('Task timeout')
    expect(stored.get('slow')?.pendingNotifications).toEqual([])
    expect(notifier.handleUpdate).toHaveBeenCalledTimes(2)
  })

  it('still drains and reports when one watch cannot be written or claimed', async () => {
    const { stored, db } = createMemoryDb()
    const reader = mockObject<WatchReader>({
      readAllWatches: () => [
        { name: 'broken', kind: 'project', path: '/p/broken' },
        { name: 'queued', kind: 'project', path: '/p/queued' },
      ],
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => ({ timestamp: 1, values: { v: 'A' } }),
    })
    const notifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn().resolvesToOnce('failed').resolvesTo('sent'),
      sendDailyReminder: mockFn().resolvesTo('sent'),
    })
    const seeding = new WatchMonitor(
      reader,
      CONTEXT,
      notifier,
      db,
      mockObject<Clock>(),
      Logger.SILENT,
      false,
      instantWorkerPool,
      [],
      mockFn().resolvesTo({ timestamp: TIMESTAMP, values: { v: 'B' } }),
    )
    await expect(seeding.updateWatch('queued', TIMESTAMP)).toBeRejectedWith(
      'Watch notification failed',
    )
    expect(stored.get('queued')?.pendingNotifications.length).toEqual(1)

    // Methodology: every database call for `broken` rejects, as on a lost
    // connection for one row, while `queued` has an alert waiting.
    const working = db.watchMonitor
    const failingDb = mockObject<Database>({
      watchMonitor: mockObject<Database['watchMonitor']>({
        findLatest: (name) => working.findLatest(name),
        getAll: () => working.getAll(),
        recordFailure: async (name, ...rest) => {
          if (name === 'broken') {
            throw new Error('Database error')
          }
          return await working.recordFailure(name, ...rest)
        },
        claimNextPendingNotification: async (name, ...rest) => {
          if (name === 'broken') {
            throw new Error('Database error')
          }
          return await working.claimNextPendingNotification(name, ...rest)
        },
        acknowledgePendingNotification: (...args) =>
          working.acknowledgePendingNotification(...args),
      }),
    })
    const failingPool = mockObject<WorkerPool>({
      runInPool: async (tasks) => ({
        results: [],
        errors: tasks.map((task) => ({
          identity: task.identity,
          error: new Error('Watch run failed'),
        })),
        timedOut: false,
      }),
    })
    const monitor = new WatchMonitor(
      reader,
      CONTEXT,
      notifier,
      failingDb,
      mockObject<Clock>(),
      Logger.SILENT,
      false,
      failingPool,
      [],
    )

    await monitor.update(TIMESTAMP + 3600)
    expect(stored.get('queued')?.pendingNotifications).toEqual([])
    expect(notifier.sendDailyReminder).toHaveBeenCalledTimes(1)
    expect(notifier.sendDailyReminder.calls[0]?.args[3]).toEqual([
      'broken',
      'queued',
    ])
  })

  it('keeps the watch key and the source error of a failed run', () => {
    const error = new Error('Watch run failed', {
      cause: { name: 'alpha', key: 'docs', error: new Error('HTTP error') },
    })
    expect(summarizeWatchError(error)).toEqual(
      'Watch run failed: key docs: HTTP error',
    )
    expect(summarizeWatchError(new Error('Task timeout'))).toEqual(
      'Task timeout',
    )
  })

  it('retries CAS when a concurrent attempt persists an undelivered alert between read and write', async () => {
    const { stored, db } = createMemoryDb()
    const reader = mockObject<WatchReader>({
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => ({ timestamp: 1, values: { v: 'A' } }),
    })
    const notifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn()
        .resolvesToOnce('failed')
        .resolvesToOnce('sent')
        .resolvesToOnce('sent'),
    })

    // Older attempt (T) persists A->B and Discord fails (queue has [A->B]).
    const olderMonitor = new WatchMonitor(
      reader,
      CONTEXT,
      notifier,
      db,
      mockObject<Clock>(),
      Logger.SILENT,
      false,
      instantWorkerPool,
      [],
      async () => ({ timestamp: TIMESTAMP, values: { v: 'B' } }),
    )

    // Newer attempt (T+10) reads baseline BEFORE olderMonitor writes, then
    // olderMonitor writes before newerMonitor's upsert executes.
    let intercepted = false
    const originalFindLatest = db.watchMonitor.findLatest
    db.watchMonitor.findLatest = mockFn(async (name: string) => {
      const result = await originalFindLatest(name)
      if (!intercepted) {
        intercepted = true
        await olderMonitor
          .updateWatch(
            name,
            TIMESTAMP,
            undefined,
            new Date(TIMESTAMP * 1000),
            'attempt-old',
          )
          .catch(() => {})
      }
      return result
    })

    const newerMonitor = new WatchMonitor(
      reader,
      CONTEXT,
      notifier,
      db,
      mockObject<Clock>(),
      Logger.SILENT,
      false,
      instantWorkerPool,
      [],
      async () => ({ timestamp: TIMESTAMP + 10, values: { v: 'A' } }),
    )

    await newerMonitor.updateWatch(
      'optimism',
      TIMESTAMP + 10,
      undefined,
      new Date((TIMESTAMP + 10) * 1000),
      'attempt-new',
    )

    // CAS mismatch forced newerMonitor to re-read B + [A->B], append B->A, and deliver BOTH!
    expect(notifier.handleUpdate).toHaveBeenCalledTimes(3)
    expect(stored.get('optimism')?.values).toEqual({ v: 'A' })
    expect(stored.get('optimism')?.pendingNotifications).toEqual([])
  })

  it('retains a failed Discord transition even when the source reverts before recovery', async () => {
    const { stored, db } = createMemoryDb()
    const reader = mockObject<WatchReader>({
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => ({ timestamp: 1, values: { v: 'A' } }),
    })
    const notifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn()
        .resolvesToOnce('failed')
        .resolvesToOnce('sent')
        .resolvesToOnce('sent'),
    })
    const runWatchFn = mockFn()
      .resolvesToOnce({ timestamp: TIMESTAMP, values: { v: 'B' } })
      .resolvesToOnce({ timestamp: TIMESTAMP + 3600, values: { v: 'A' } })

    const monitor = new WatchMonitor(
      reader,
      CONTEXT,
      notifier,
      db,
      mockObject<Clock>(),
      Logger.SILENT,
      false,
      instantWorkerPool,
      [],
      runWatchFn,
    )

    await monitor
      .updateWatch(
        'optimism',
        TIMESTAMP,
        undefined,
        new Date(TIMESTAMP * 1000),
        'attempt-1',
      )
      .catch(() => {})
    expect(stored.get('optimism')?.values).toEqual({ v: 'B' })
    expect(stored.get('optimism')?.pendingNotifications.length).toEqual(1)

    await monitor.updateWatch(
      'optimism',
      TIMESTAMP + 3600,
      undefined,
      new Date((TIMESTAMP + 3600) * 1000),
      'attempt-2',
    )
    expect(notifier.handleUpdate).toHaveBeenCalledTimes(3)
    expect(stored.get('optimism')?.pendingNotifications).toEqual([])
    expect(stored.get('optimism')?.lastError).toEqual(null)
  })

  it('drains already-queued alerts monotonically without resurrecting delivered alerts across concurrent drains', async () => {
    const { stored, db } = createMemoryDb()
    const reader = mockObject<WatchReader>({
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => ({ timestamp: 1, values: { v: 'A' } }),
    })
    const notifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn().resolvesToOnce('failed').resolvesTo('sent'),
    })
    const runWatchFn = mockFn()
      .resolvesToOnce({ timestamp: TIMESTAMP, values: { v: 'B' } })
      .rejectsWith(new Error('Watch run failed'))

    const monitor = new WatchMonitor(
      reader,
      CONTEXT,
      notifier,
      db,
      mockObject<Clock>(),
      Logger.SILENT,
      false,
      instantWorkerPool,
      [],
      runWatchFn,
    )

    await expect(
      monitor.updateWatch(
        'optimism',
        TIMESTAMP,
        undefined,
        new Date(TIMESTAMP * 1000),
        'attempt-1',
      ),
    ).toBeRejectedWith('Watch notification failed')
    const queuedId = stored.get('optimism')?.pendingNotifications[0]?.id
    expect(queuedId).not.toEqual(undefined)

    // Two concurrent failure handlers run while Discord is back up:
    // both acknowledge monotonically by ID, never resurrecting delivered items.
    await Promise.allSettled([
      monitor.updateWatch(
        'optimism',
        TIMESTAMP + 3600,
        undefined,
        new Date((TIMESTAMP + 3600) * 1000),
        'attempt-2',
      ),
      monitor.updateWatch(
        'optimism',
        TIMESTAMP + 3601,
        undefined,
        new Date((TIMESTAMP + 3601) * 1000),
        'attempt-3',
      ),
    ])
    expect(stored.get('optimism')?.pendingNotifications).toEqual([])
    expect(stored.get('optimism')?.lastError).toEqual('Watch run failed')
  })

  it('isolates overlapping attempts started at the exact same instant using attemptId', async () => {
    const { stored, db } = createMemoryDb()
    const sameInstant = new Date(TIMESTAMP * 1000)
    const reader = mockObject<WatchReader>({
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => ({ timestamp: 1, values: { v: 'A' } }),
    })
    const notifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn().resolvesTo('sent'),
    })

    const monitor = new WatchMonitor(
      reader,
      CONTEXT,
      notifier,
      db,
      mockObject<Clock>(),
      Logger.SILENT,
      false,
      instantWorkerPool,
      [],
      mockFn()
        .resolvesToOnce({ timestamp: TIMESTAMP, values: { v: 'B' } })
        .rejectsWithOnce(new Error('Watch run failed')),
    )

    await monitor.updateWatch(
      'optimism',
      TIMESTAMP,
      undefined,
      sameInstant,
      'attempt-b',
    )
    await expect(
      monitor.updateWatch(
        'optimism',
        TIMESTAMP,
        undefined,
        sameInstant,
        'attempt-a',
      ),
    ).toBeRejectedWith('Watch run failed')
    expect(stored.get('optimism')?.lastAttemptId).toEqual('attempt-b')
    expect(stored.get('optimism')?.lastError).toEqual(null)
  })

  it('does not let a timed-out Discord request mark a newer successful run stale', async () => {
    const abortController = new AbortController()
    const { stored, db } = createMemoryDb()
    const reader = mockObject<WatchReader>({
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => ({ timestamp: 1, values: { v: 1 } }),
    })

    const notifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn(async () => {
        abortController.abort(new Error('Task timeout'))
        return 'failed' as const
      }),
    })

    const monitor = new WatchMonitor(
      reader,
      CONTEXT,
      notifier,
      db,
      mockObject<Clock>(),
      Logger.SILENT,
      false,
      instantWorkerPool,
      [],
      async () => ({ timestamp: TIMESTAMP, values: { v: 2 } }),
    )

    await expect(
      monitor.updateWatch(
        'optimism',
        TIMESTAMP,
        abortController.signal,
        new Date(TIMESTAMP * 1000),
        'attempt-1',
      ),
    ).toBeRejectedWith('Task timeout')
    expect(stored.get('optimism')?.lastError).toEqual(null)
  })

  it('does not restore a delivered alert when an observation writes after concurrent acknowledgment', async () => {
    const { stored, db } = createMemoryDb()
    const reader = mockObject<WatchReader>({
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => ({ timestamp: 1, values: { v: 'A' } }),
    })
    const notifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn().resolvesToOnce('failed').resolvesTo('sent'),
    })

    const seedMonitor = new WatchMonitor(
      reader,
      CONTEXT,
      notifier,
      db,
      mockObject<Clock>(),
      Logger.SILENT,
      false,
      instantWorkerPool,
      [],
      async () => ({ timestamp: TIMESTAMP, values: { v: 'B' } }),
    )
    await expect(
      seedMonitor.updateWatch(
        'optimism',
        TIMESTAMP,
        undefined,
        new Date(TIMESTAMP * 1000),
        'attempt-1',
      ),
    ).toBeRejectedWith('Watch notification failed')
    const queuedId = stored.get('optimism')?.pendingNotifications[0]?.id
    expect(queuedId).not.toEqual(undefined)

    // Worker 2 reads the row while queuedId is still present; another worker
    // acknowledges queuedId (leaving lastAttemptId unchanged) before Worker 2
    // writes its observation.
    const originalFindLatest = db.watchMonitor.findLatest
    let ackedDuringRead = false
    db.watchMonitor.findLatest = mockFn(async (name: string) => {
      const row = await originalFindLatest(name)
      if (!ackedDuringRead && queuedId !== undefined) {
        ackedDuringRead = true
        await db.watchMonitor.claimNextPendingNotification(
          name,
          'other-owner',
          60_000,
        )
        await db.watchMonitor.acknowledgePendingNotification(
          name,
          queuedId,
          'other-owner',
        )
      }
      return row
    })

    const secondMonitor = new WatchMonitor(
      reader,
      CONTEXT,
      notifier,
      db,
      mockObject<Clock>(),
      Logger.SILENT,
      false,
      instantWorkerPool,
      [],
      async () => ({ timestamp: TIMESTAMP + 3600, values: { v: 'B' } }),
    )
    await secondMonitor.updateWatch(
      'optimism',
      TIMESTAMP + 3600,
      undefined,
      new Date((TIMESTAMP + 3600) * 1000),
      'attempt-2',
    )

    // Delivered alert was NOT resurrected and NOT resent.
    expect(notifier.handleUpdate).toHaveBeenCalledTimes(1)
    expect(stored.get('optimism')?.pendingNotifications).toEqual([])
  })

  it('delivers each queued alert at most once across slow Discord sends and worker timeouts', async () => {
    const { stored, db } = createMemoryDb()
    const reader = mockObject<WatchReader>({
      readAllWatches: () => [
        { name: 'optimism', kind: 'project', path: '/p/optimism' },
      ],
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => ({ timestamp: 1, values: { v: 'A' } }),
    })

    // 1) Real worker pool with short task timeout (30ms) and slower Discord
    // send (60ms): Discord runs outside the pool so it delivers exactly once.
    const pool = createWorkerPool({
      workerCount: 1,
      timeoutPerTaskMs: 30,
      timeoutPerRunMs: 1_000,
      logger: Logger.SILENT,
    })
    const slowNotifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 60))
        return 'sent' as const
      }),
      sendDailyReminder: mockFn().resolvesTo('sent'),
    })
    const poolMonitor = new WatchMonitor(
      reader,
      CONTEXT,
      slowNotifier,
      db,
      mockObject<Clock>(),
      Logger.SILENT,
      false,
      pool,
      [],
      async () => ({ timestamp: TIMESTAMP, values: { v: 'B' } }),
    )

    await poolMonitor.update(TIMESTAMP)
    expect(slowNotifier.handleUpdate).toHaveBeenCalledTimes(1)
    expect(stored.get('optimism')?.pendingNotifications).toEqual([])
    expect(stored.get('optimism')?.lastError).toEqual(null)

    // 2) Direct updateWatch whose signal aborts mid-Discord-send while another
    // worker tries to drain concurrently: claim blocks the second sender and
    // the original worker still acknowledges once Discord accepts the message.
    let resolveInFlight: (() => void) | undefined
    const inFlightStarted = new Promise<void>((resolve) => {
      resolveInFlight = resolve
    })
    let releaseSend: (() => void) | undefined
    const sendGate = new Promise<void>((resolve) => {
      releaseSend = resolve
    })
    const gatedNotifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn(async () => {
        resolveInFlight?.()
        await sendGate
        return 'sent' as const
      }),
      sendDailyReminder: mockFn().resolvesTo('sent'),
    })
    const directDb = createMemoryDb()
    const directMonitor = new WatchMonitor(
      reader,
      CONTEXT,
      gatedNotifier,
      directDb.db,
      mockObject<Clock>(),
      Logger.SILENT,
      false,
      instantWorkerPool,
      [],
      async () => ({ timestamp: TIMESTAMP + 3600, values: { v: 'C' } }),
    )
    const abortController = new AbortController()
    const firstAttempt = directMonitor.updateWatch(
      'optimism',
      TIMESTAMP + 3600,
      abortController.signal,
      new Date((TIMESTAMP + 3600) * 1000),
      'attempt-direct-1',
    )
    await inFlightStarted
    abortController.abort(new Error('Task timeout'))

    // Concurrent drain while first send is still in flight must NOT resend.
    const secondMonitor = new WatchMonitor(
      reader,
      CONTEXT,
      gatedNotifier,
      directDb.db,
      mockObject<Clock>(),
      Logger.SILENT,
      false,
      instantWorkerPool,
      [],
      async () => {
        throw new Error('Source offline')
      },
    )
    await expect(
      secondMonitor.updateWatch(
        'optimism',
        TIMESTAMP + 3601,
        undefined,
        new Date((TIMESTAMP + 3601) * 1000),
        'attempt-direct-2',
      ),
    ).toBeRejectedWith('Source offline')
    expect(gatedNotifier.handleUpdate).toHaveBeenCalledTimes(1)

    releaseSend?.()
    await expect(firstAttempt).toBeRejectedWith('Task timeout')
    expect(gatedNotifier.handleUpdate).toHaveBeenCalledTimes(1)
    expect(directDb.stored.get('optimism')?.pendingNotifications).toEqual([])
  })

  it('aborts slow deliveries inside the claim lease without stalling other watches', async () => {
    const { stored, db } = createMemoryDb()
    const reader = mockObject<WatchReader>({
      readAllWatches: () => [
        { name: 'slow', kind: 'project', path: '/p/slow' },
        { name: 'fast', kind: 'project', path: '/p/fast' },
      ],
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => ({ timestamp: 1, values: { v: 'A' } }),
    })

    let slowAborted = false
    const notifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn(async (name, _diff, _ts, signal?: AbortSignal) => {
        if (name === 'slow') {
          await new Promise<void>((resolve) => {
            signal?.addEventListener(
              'abort',
              () => {
                slowAborted = true
                resolve()
              },
              { once: true },
            )
          })
          return 'failed' as const
        }
        return 'sent' as const
      }),
      sendDailyReminder: mockFn().resolvesTo('sent'),
    })

    const monitor = new WatchMonitor(
      reader,
      CONTEXT,
      notifier,
      db,
      mockObject<Clock>(),
      Logger.SILENT,
      false,
      instantWorkerPool,
      [],
      async () => ({ timestamp: TIMESTAMP, values: { v: 'B' } }),
      40, // 40ms delivery timeout strictly shorter than lease
      5_000,
    )

    await monitor.update(TIMESTAMP)
    expect(slowAborted).toEqual(true)
    expect(stored.get('fast')?.pendingNotifications).toEqual([])
    expect(stored.get('fast')?.lastError).toEqual(null)
    expect(stored.get('slow')?.lastError).toEqual('Watch notification failed')
    // Claim was released cleanly once the aborted send settled.
    expect(stored.get('slow')?.pendingNotifications[0]?.claimedBy).toEqual(
      undefined,
    )
  })
})
