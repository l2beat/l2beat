import type { Database, WatchMonitorRecord } from '@l2beat/database'
import type { Watched, WatchReader } from '@l2beat/discovery'
import { expect, mockObject } from 'earl'
import { getPendingWatchDiffs } from './pendingWatchDiffs'

function record(
  partial: Partial<WatchMonitorRecord> & Pick<WatchMonitorRecord, 'name'>,
): WatchMonitorRecord {
  return {
    timestamp: null,
    values: null,
    isPublic: false,
    configHash: null,
    pendingNotifications: [],
    lastAttemptAt: null,
    lastAttemptId: null,
    lastError: null,
    ...partial,
  }
}

describe(getPendingWatchDiffs.name, () => {
  it('computes pending items and changed paths from stored runs without running templates', async () => {
    const reader = mockObject<WatchReader>({
      readAllWatches: () => [
        { name: 'alpha', kind: 'project', path: '/p/alpha' },
        { name: 'beta', kind: 'global', path: '/w/beta' },
        { name: 'clean', kind: 'project', path: '/p/clean' },
        { name: 'failed-only', kind: 'project', path: '/p/failed-only' },
        { name: 'never-ran', kind: 'project', path: '/p/never-ran' },
      ],
      readWatched: (name: string): Watched | undefined => {
        if (name === 'alpha') {
          return {
            timestamp: 1,
            values: { audits: { 'org/r:a.pdf': { sha: '1', size: 10 } } },
          }
        }
        if (name === 'beta') {
          return {
            timestamp: 1,
            values: {
              items: {
                known: { status: 'handled' },
              },
            },
          }
        }
        if (name === 'clean') {
          return { timestamp: 1, values: { version: '1' } }
        }
        return undefined
      },
    })

    const stored: WatchMonitorRecord[] = [
      record({
        name: 'alpha',
        timestamp: 200,
        values: {
          audits: {
            'org/r:a.pdf': { sha: '1', size: 10 },
            'org/r:b.pdf': { sha: '2', size: 20 },
          },
        },
      }),
      record({
        name: 'beta',
        timestamp: 300,
        values: {
          items: {
            known: { status: 'handled' },
            openA: { status: 'open', pending: true },
            openB: { status: 'open', pending: true },
          },
        },
      }),
      record({
        name: 'clean',
        timestamp: 400,
        values: { version: '1' },
      }),
      record({
        name: 'failed-only',
        lastAttemptAt: 400,
        lastError: 'HTTP timeout',
      }),
    ]

    const db = mockObject<Database>({
      watchMonitor: mockObject<Database['watchMonitor']>({
        getAll: async () => stored,
      }),
    })

    const pending = await getPendingWatchDiffs(reader, db)
    expect(pending).toEqual([
      {
        name: 'alpha',
        kind: 'project',
        runTimestamp: 200,
        pendingItems: 0,
        changedPaths: 1,
        diff: [
          {
            key: 'audits',
            changes: [{ path: ['org/r:b.pdf'], after: { sha: '2', size: 20 } }],
          },
        ],
      },
      {
        name: 'beta',
        kind: 'global',
        runTimestamp: 300,
        pendingItems: 2,
        changedPaths: 0,
        diff: [
          {
            key: 'items',
            changes: [
              { path: ['openA'], after: { status: 'open', pending: true } },
              { path: ['openB'], after: { status: 'open', pending: true } },
            ],
          },
        ],
      },
    ])
  })

  it('keeps changedPaths non-negative when no watched.json is committed yet', async () => {
    const reader = mockObject<WatchReader>({
      readAllWatches: () => [{ name: 'fresh', kind: 'global', path: '/w/f' }],
      readWatched: () => undefined,
    })
    const db = mockObject<Database>({
      watchMonitor: mockObject<Database['watchMonitor']>({
        getAll: async () => [
          record({
            name: 'fresh',
            timestamp: 100,
            values: {
              items: {
                openA: { pending: true },
                openB: { pending: true },
              },
            },
          }),
        ],
      }),
    })

    const pending = await getPendingWatchDiffs(reader, db)
    expect(pending.length).toEqual(1)
    expect(pending[0]?.pendingItems).toEqual(2)
    expect(pending[0]?.changedPaths).toEqual(1)
  })
})
