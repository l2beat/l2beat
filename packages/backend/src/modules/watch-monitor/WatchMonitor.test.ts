import { Logger } from '@l2beat/backend-tools'
import type { Database, WatchMonitorRecord } from '@l2beat/database'
import type {
  WatchConfig,
  WatchContext,
  Watched,
  WatchReader,
} from '@l2beat/discovery'
import type { HttpClient } from '@l2beat/shared'
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

describe(WatchMonitor.name, () => {
  it('notifies once on transition, skips unchanged runs, and sends daily reminder from stored runs', async () => {
    const stored = new Map<string, WatchMonitorRecord>()
    const db = mockObject<Database>({
      watchMonitor: mockObject<Database['watchMonitor']>({
        findLatest: async (name: string) => stored.get(name),
        getAll: async () => [...stored.values()],
        upsert: async (record: WatchMonitorRecord) => {
          stored.set(record.name, record)
        },
      }),
    })

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
      sendDailyReminder: mockFn().resolvesTo(undefined),
    })

    const latestRun: Watched = {
      timestamp: TIMESTAMP,
      values: {
        audits: {
          'org/r:a.pdf': { sha: '1', size: 10 },
          'org/r:b.pdf': { sha: '2', size: 20 },
        },
      },
    }
    const runWatchFn = mockFn().resolvesTo(latestRun)

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

    // Hour 1: new file compared to committed baseline -> notifies + stores.
    await monitor.update(TIMESTAMP)
    expect(notifier.handleUpdate).toHaveBeenCalledTimes(1)
    expect(stored.get('optimism')).toEqual({
      name: 'optimism',
      timestamp: TIMESTAMP,
      values: latestRun.values,
    })
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

  it('does not upsert when a watch run fails, and reports failed watches in reminder', async () => {
    const upsert = mockFn().resolvesTo(undefined)
    const db = mockObject<Database>({
      watchMonitor: mockObject<Database['watchMonitor']>({
        findLatest: async () => undefined,
        getAll: async () => [],
        upsert,
      }),
    })
    const reader = mockObject<WatchReader>({
      readAllWatches: () => [
        { name: 'broken', kind: 'project', path: '/p/broken' },
      ],
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => undefined,
    })
    const notifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn().resolvesTo('sent'),
      sendDailyReminder: mockFn().resolvesTo(undefined),
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
    expect(upsert).toHaveBeenCalledTimes(0)
    expect(notifier.handleUpdate).toHaveBeenCalledTimes(0)
    expect(notifier.sendDailyReminder).toHaveBeenOnlyCalledWith(
      [],
      TIMESTAMP,
      [],
      ['broken'],
    )
  })

  it('skips upsert when Discord delivery fails so the next hour retries', async () => {
    const upsert = mockFn().resolvesTo(undefined)
    const db = mockObject<Database>({
      watchMonitor: mockObject<Database['watchMonitor']>({
        findLatest: async () => undefined,
        getAll: async () => [],
        upsert,
      }),
    })
    const reader = mockObject<WatchReader>({
      readAllWatches: () => [
        { name: 'optimism', kind: 'project', path: '/p/optimism' },
      ],
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => ({ timestamp: 1, values: { v: 1 } }),
    })
    const notifier = mockObject<WatchNotifier>({
      handleUpdate: mockFn().resolvesTo('failed'),
      sendDailyReminder: mockFn().resolvesTo(undefined),
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
      mockFn().resolvesTo({ timestamp: TIMESTAMP, values: { v: 2 } }),
    )

    await monitor.update(TIMESTAMP)
    expect(notifier.handleUpdate).toHaveBeenCalledTimes(1)
    expect(upsert).toHaveBeenCalledTimes(0)
  })

  it('aborts before notifying or writing when the task times out mid-run', async () => {
    const abortController = new AbortController()
    const upsert = mockFn().resolvesTo(undefined)
    const db = mockObject<Database>({
      watchMonitor: mockObject<Database['watchMonitor']>({
        findLatest: async () => undefined,
        upsert,
      }),
    })
    const reader = mockObject<WatchReader>({
      readWatchConfig: (name: string): WatchConfig => ({ name, watches: [] }),
      readWatched: () => ({ timestamp: 1, values: { v: 1 } }),
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
      async () => {
        abortController.abort(new Error('Task timeout'))
        return { timestamp: TIMESTAMP, values: { v: 2 } }
      },
    )

    await expect(
      monitor.updateWatch('optimism', TIMESTAMP, abortController.signal),
    ).toBeRejectedWith('Task timeout')
    expect(notifier.handleUpdate).toHaveBeenCalledTimes(0)
    expect(upsert).toHaveBeenCalledTimes(0)
  })
})
