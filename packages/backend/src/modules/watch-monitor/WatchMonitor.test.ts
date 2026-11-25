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
import type { WorkerPool } from '../update-monitor/createWorkers'
import { WatchMonitor } from './WatchMonitor'
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
      storedAttemptDates.set(obs.name, obs.attemptAt)
      stored.set(obs.name, {
        name: obs.name,
        timestamp: obs.timestamp,
        values: obs.values,
        isPublic: obs.isPublic,
        configHash: obs.configHash,
        pendingNotifications: obs.pendingNotifications,
        lastAttemptAt: UnixTime.fromDate(obs.attemptAt),
        lastAttemptId: obs.attemptId,
        lastAttemptConfigHash: obs.configHash,
        lastError: null,
      })
      return true
    },
    acknowledgePendingNotification: async (
      name: string,
      notificationId: string,
    ) => {
      const prev = stored.get(name)
      if (prev === undefined) {
        return
      }
      stored.set(name, {
        ...prev,
        pendingNotifications: prev.pendingNotifications.filter(
          (item) => item.id !== notificationId,
        ),
      })
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
})
