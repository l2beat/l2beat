import { Hash256, type json } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { toRecord, WatchMonitorRepository } from './WatchMonitorRepository'

const HASH = Hash256.random()

describe(toRecord.name, () => {
  it('canonicalizes object key order inside JSONB arrays on read', () => {
    const record = toRecord({
      name: 'optimism',
      timestamp: new Date(1_700_000_000 * 1000),
      valuesJsonBlob: { list: [{ z: 1, a: 2 }] },
      isPublic: true,
      configHash: HASH.toString(),
      pendingNotificationsJsonBlob: [],
      lastAttemptAt: new Date(1_700_000_000 * 1000),
      lastAttemptId: 'attempt-1',
      lastAttemptConfigHash: HASH.toString(),
      lastError: null,
    })
    expect(JSON.stringify(record.values)).toEqual('{"list":[{"a":2,"z":1}]}')
    expect(record.isPublic).toEqual(true)
    expect(record.configHash).toEqual(HASH)
    expect(record.lastAttemptId).toEqual('attempt-1')
    expect(record.lastAttemptConfigHash).toEqual(HASH)
  })

  it('handles a depth-8 template value without exceeding the watched depth limit', () => {
    let deep: json = 1
    for (let i = 0; i < 8; i++) {
      deep = { a: deep }
    }
    const record = toRecord({
      name: 'deep',
      timestamp: new Date(1_700_000_000 * 1000),
      valuesJsonBlob: { key: deep },
      isPublic: false,
      configHash: HASH.toString(),
      pendingNotificationsJsonBlob: null,
      lastAttemptAt: new Date(1_700_000_000 * 1000),
      lastAttemptId: 'attempt-1',
      lastAttemptConfigHash: HASH.toString(),
      lastError: null,
    })
    expect(record.values).toEqual({ key: deep })
  })
})

describeDatabase(WatchMonitorRepository.name, (db) => {
  const repository = db.watchMonitor

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it('enforces optimistic CAS on observations and monotonic notification acknowledgement', async () => {
    const t1 = new Date(1_700_000_000 * 1000)
    const t2 = new Date(1_700_003_600 * 1000)
    const notif1 = {
      id: 'notif-1',
      timestamp: 1_700_000_000,
      diff: [{ key: 'v', changes: [{ path: [], before: 'A', after: 'B' }] }],
    }
    const notif2 = {
      id: 'notif-2',
      timestamp: 1_700_003_600,
      diff: [{ key: 'v', changes: [{ path: [], before: 'B', after: 'A' }] }],
    }

    expect(
      await repository.upsertObservation({
        name: 'optimism',
        timestamp: 1_700_000_000,
        attemptAt: t1,
        attemptId: 'attempt-1',
        expectedLastAttemptId: null,
        values: { v: 'B' },
        isPublic: true,
        configHash: HASH,
        pendingNotifications: [notif1],
      }),
    ).toEqual(true)

    // Stale expectedLastAttemptId (null instead of 'attempt-1') is rejected even for newer attemptAt.
    expect(
      await repository.upsertObservation({
        name: 'optimism',
        timestamp: 1_700_003_600,
        attemptAt: t2,
        attemptId: 'attempt-2',
        expectedLastAttemptId: null,
        values: { v: 'A' },
        isPublic: true,
        configHash: HASH,
        pendingNotifications: [],
      }),
    ).toEqual(false)

    // Matching expectedLastAttemptId succeeds and retains notif1 alongside notif2.
    expect(
      await repository.upsertObservation({
        name: 'optimism',
        timestamp: 1_700_003_600,
        attemptAt: t2,
        attemptId: 'attempt-2',
        expectedLastAttemptId: 'attempt-1',
        values: { v: 'A' },
        isPublic: true,
        configHash: HASH,
        pendingNotifications: [notif1, notif2],
      }),
    ).toEqual(true)

    await repository.acknowledgePendingNotification('optimism', 'notif-1')
    expect(
      (await repository.findLatest('optimism'))?.pendingNotifications,
    ).toEqual([notif2])

    // Re-acknowledging notif-1 is a monotonic no-op and cannot resurrect notif-1.
    await repository.acknowledgePendingNotification('optimism', 'notif-1')
    expect(
      (await repository.findLatest('optimism'))?.pendingNotifications,
    ).toEqual([notif2])

    await repository.acknowledgePendingNotification('optimism', 'notif-2')
    expect(
      (await repository.findLatest('optimism'))?.pendingNotifications,
    ).toEqual([])
  })

  it('records failures with attemptConfigHash without erasing previous snapshot', async () => {
    await repository.recordFailure(
      'broken',
      new Date(1_700_000_000 * 1000),
      'attempt-1',
      'HTTP timeout',
      HASH,
    )
    expect(await repository.findLatest('broken')).toEqual({
      name: 'broken',
      timestamp: null,
      values: null,
      isPublic: false,
      configHash: null,
      pendingNotifications: [],
      lastAttemptAt: 1_700_000_000,
      lastAttemptId: 'attempt-1',
      lastAttemptConfigHash: HASH,
      lastError: 'HTTP timeout',
    })
  })
})
