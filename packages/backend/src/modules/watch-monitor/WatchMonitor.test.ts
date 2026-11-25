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
import type { json, UnixTime } from '@l2beat/shared-pure'
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
        prev.timestamp !== null &&
        prev.timestamp > obs.timestamp
      ) {
        return false
      }
      stored.set(obs.name, {
        name: obs.name,
        timestamp: obs.timestamp,
        values: obs.values,
        notifiedValues: prev?.notifiedValues ?? null,
        lastAttemptAt: obs.timestamp,
        lastError: null,
      })
      return true
    },
    markNotified: async (
      name: string,
      timestamp: UnixTime,
      values: Record<string, json>,
    ) => {
      const prev = stored.get(name)
      if (prev !== undefined && prev.timestamp === timestamp) {
        stored.set(name, { ...prev, notifiedValues: values })
      }
    },
    recordFailure: async (
      name: string,
      attemptedAt: UnixTime,
      errorMessage: string,
    ) => {
      const prev = stored.get(name)
      stored.set(name, {
        name,
        timestamp: prev?.timestamp ?? null,
        values: prev?.values ?? null,
        notifiedValues: prev?.notifiedValues ?? null,
        lastAttemptAt: attemptedAt,
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
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
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

    // Hour 1: new file compared to committed baseline -> persists + notifies + marks notified.
    await monitor.update(TIMESTAMP)
    expect(notifier.handleUpdate).toHaveBeenCalledTimes(1)
    expect(stored.get('optimism')?.values).toEqual(values)
    expect(stored.get('optimism')?.notifiedValues).toEqual(values)
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

  it('records failures without erasing prior snapshots and reports failed watches in reminder', async () => {
    const { stored, db } = createMemoryDb()
    const reader = mockObject<WatchReader>({
      readAllWatches: () => [
        { name: 'broken', kind: 'project', path: '/p/broken' },
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
      instantWorkerPool,
      [],
      mockFn().rejectsWith(new Error('Watch run failed')),
    )

    await monitor.update(TIMESTAMP)
    expect(stored.get('broken')?.timestamp).toEqual(null)
    expect(stored.get('broken')?.lastError).toEqual('Watch run failed')
    expect(notifier.handleUpdate).toHaveBeenCalledTimes(0)
    expect(notifier.sendDailyReminder).toHaveBeenOnlyCalledWith(
      [],
      TIMESTAMP,
      [],
      ['broken'],
    )
  })

  it('persists the new snapshot when Discord fails, reports failure, and retries next hour', async () => {
    const { stored, db } = createMemoryDb()
    const reader = mockObject<WatchReader>({
      readAllWatches: () => [
        { name: 'optimism', kind: 'project', path: '/p/optimism' },
      ],
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => ({ timestamp: 1, values: { v: 1 } }),
    })
    const notifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn().resolvesToOnce('failed').resolvesToOnce('sent'),
      sendDailyReminder: mockFn().resolvesTo('sent'),
    })
    const runWatchFn = mockFn()
      .resolvesToOnce({ timestamp: TIMESTAMP, values: { v: 2 } })
      .resolvesToOnce({ timestamp: TIMESTAMP + 3600, values: { v: 2 } })

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

    // Hour 1: Discord fails -> snapshot IS persisted, notifiedValues stays null,
    // watch is reported in failedWatches AND daily reminder sees the new pending change.
    await monitor.update(TIMESTAMP)
    expect(stored.get('optimism')?.values).toEqual({ v: 2 })
    expect(stored.get('optimism')?.notifiedValues).toEqual(null)
    expect(stored.get('optimism')?.lastError).toEqual(
      'Watch notification failed',
    )
    expect(notifier.sendDailyReminder).toHaveBeenNthCalledWith(
      1,
      [{ name: 'optimism', pendingItems: 0, changedPaths: 1 }],
      TIMESTAMP,
      [],
      ['optimism'],
    )

    // Hour 2: Discord recovers -> retries diff against committed, marks notified, clears error.
    await monitor.update(TIMESTAMP + 3600)
    expect(notifier.handleUpdate).toHaveBeenCalledTimes(2)
    expect(stored.get('optimism')?.notifiedValues).toEqual({ v: 2 })
    expect(stored.get('optimism')?.lastError).toEqual(null)
    expect(notifier.sendDailyReminder).toHaveBeenNthCalledWith(
      2,
      [{ name: 'optimism', pendingItems: 0, changedPaths: 1 }],
      TIMESTAMP + 3600,
      [],
      [],
    )
  })

  it('forwards abort signal and stops before persisting or notifying on timeout', async () => {
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
      monitor.updateWatch('optimism', TIMESTAMP, abortController.signal),
    ).toBeRejectedWith('Task timeout')
    expect(receivedSignal).toEqual(abortController.signal)
    expect(notifier.handleUpdate).toHaveBeenCalledTimes(0)
    expect(stored.get('optimism')).toEqual(undefined)
  })
})
