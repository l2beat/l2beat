import { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  WatchMonitorRecord,
  WatchObservation,
  WatchPendingNotification,
} from '@l2beat/database'
import type {
  WatchConfig,
  WatchContext,
  Watched,
  WatchReader,
} from '@l2beat/discovery'
import type { HttpClient } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
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
  const watchMonitor = mockObject<Database['watchMonitor']>({
    findLatest: async (name: string) => stored.get(name),
    getAll: async () => [...stored.values()],
    upsertObservation: async (obs: WatchObservation) => {
      const prev = stored.get(obs.name)
      if (
        prev !== undefined &&
        ((prev.timestamp !== null && prev.timestamp > obs.timestamp) ||
          (prev.lastAttemptAt !== null && prev.lastAttemptAt > obs.attemptAt))
      ) {
        return false
      }
      stored.set(obs.name, {
        name: obs.name,
        timestamp: obs.timestamp,
        values: obs.values,
        isPublic: obs.isPublic,
        configHash: obs.configHash,
        pendingNotifications: obs.pendingNotifications,
        lastAttemptAt: obs.attemptAt,
        lastError: null,
      })
      return true
    },
    updatePendingNotifications: async (
      name: string,
      attemptAt: UnixTime,
      pendingNotifications: WatchPendingNotification[],
    ) => {
      const prev = stored.get(name)
      if (prev !== undefined && prev.lastAttemptAt === attemptAt) {
        stored.set(name, { ...prev, pendingNotifications })
      }
    },
    recordFailure: async (
      name: string,
      attemptAt: UnixTime,
      errorMessage: string,
    ) => {
      const prev = stored.get(name)
      if (
        prev !== undefined &&
        prev.lastAttemptAt !== null &&
        prev.lastAttemptAt > attemptAt
      ) {
        return
      }
      stored.set(name, {
        name,
        timestamp: prev?.timestamp ?? null,
        values: prev?.values ?? null,
        isPublic: prev?.isPublic ?? false,
        configHash: prev?.configHash ?? null,
        pendingNotifications: prev?.pendingNotifications ?? [],
        lastAttemptAt: attemptAt,
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

    // Hour 1: new file compared to committed baseline -> persists + notifies + clears queue.
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

    // Hour 2: unchanged -> no transition alert, still reported in daily reminder.
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

  it('persists pool-level worker timeouts so the API sees the failure', async () => {
    const { stored, db } = createMemoryDb()
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
    const reader = mockObject<WatchReader>({
      readAllWatches: () => [
        { name: 'slow', kind: 'project', path: '/p/slow' },
      ],
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => undefined,
    })
    const notifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn().resolvesTo('sent'),
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
      timeoutPool,
      [],
    )

    await monitor.update(TIMESTAMP)
    expect(stored.get('slow')?.lastError).toEqual('Task timeout')
    expect(stored.get('slow')?.timestamp).toEqual(null)
    expect(notifier.sendDailyReminder).toHaveBeenOnlyCalledWith(
      [],
      TIMESTAMP,
      [],
      ['slow'],
    )
  })

  it('retains a failed Discord transition even when the source reverts before recovery', async () => {
    const { stored, db } = createMemoryDb()
    const reader = mockObject<WatchReader>({
      readAllWatches: () => [
        { name: 'optimism', kind: 'project', path: '/p/optimism' },
      ],
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => ({ timestamp: 1, values: { v: 'A' } }),
    })
    const notifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn()
        .resolvesToOnce('failed')
        .resolvesToOnce('sent')
        .resolvesToOnce('sent'),
      sendDailyReminder: mockFn().resolvesTo('sent'),
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

    // Hour 1: A -> B, Discord fails -> B persisted, A->B retained in queue, failure recorded.
    await monitor.update(TIMESTAMP)
    expect(stored.get('optimism')?.values).toEqual({ v: 'B' })
    expect(stored.get('optimism')?.pendingNotifications.length).toEqual(1)
    expect(stored.get('optimism')?.lastError).toEqual(
      'Watch notification failed',
    )

    // Hour 2: B -> A (source reverted), Discord recovers -> BOTH A->B and B->A are delivered!
    await monitor.update(TIMESTAMP + 3600)
    expect(notifier.handleUpdate).toHaveBeenCalledTimes(3)
    expect(notifier.handleUpdate).toHaveBeenNthCalledWith(
      2,
      'optimism',
      [{ key: 'v', changes: [{ path: [], before: 'A', after: 'B' }] }],
      TIMESTAMP,
    )
    expect(notifier.handleUpdate).toHaveBeenNthCalledWith(
      3,
      'optimism',
      [{ key: 'v', changes: [{ path: [], before: 'B', after: 'A' }] }],
      TIMESTAMP + 3600,
    )
    expect(stored.get('optimism')?.pendingNotifications).toEqual([])
    expect(stored.get('optimism')?.lastError).toEqual(null)
  })

  it('does not let a timed-out Discord request mark a newer successful run stale', async () => {
    const abortController = new AbortController()
    const { stored, db } = createMemoryDb()
    const reader = mockObject<WatchReader>({
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => ({ timestamp: 1, values: { v: 1 } }),
    })

    // Simulate run 1's Discord request hanging until after abort, then returning 'failed'.
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
        TIMESTAMP,
      ),
    ).toBeRejectedWith('Task timeout')
    // Must not overwrite lastError after abort.
    expect(stored.get('optimism')?.lastError).toEqual(null)
  })

  it('forwards abort signal and stops before persisting or notifying on fetch timeout', async () => {
    const abortController = new AbortController()
    const { stored, db } = createMemoryDb()
    const reader = mockObject<WatchReader>({
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => ({ timestamp: 1, values: { v: 1 } }),
    })
    const notifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn().resolvesTo('sent'),
    })

    let receivedSignal: AbortSignal | undefined
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
      async (_config, ctx) => {
        receivedSignal = ctx.signal
        abortController.abort(new Error('Task timeout'))
        return { timestamp: TIMESTAMP, values: { v: 2 } }
      },
    )

    await expect(
      monitor.updateWatch(
        'optimism',
        TIMESTAMP,
        abortController.signal,
        TIMESTAMP,
      ),
    ).toBeRejectedWith('Task timeout')
    expect(receivedSignal).toEqual(abortController.signal)
    expect(notifier.handleUpdate).toHaveBeenCalledTimes(0)
    expect(stored.get('optimism')).toEqual(undefined)
  })
})
