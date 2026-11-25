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

  it('enforces optimistic CAS, atomic queue append without resurrection, and single-owner leases', async () => {
    const t1 = new Date(1_700_000_000 * 1000)
    const t2 = new Date(1_700_003_600 * 1000)
    const t3 = new Date(1_700_007_200 * 1000)
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
        newNotification: notif1,
        maxPendingNotifications: 20,
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
        newNotification: null,
        maxPendingNotifications: 20,
      }),
    ).toEqual(false)

    // Acknowledge notif-1 without changing lastAttemptId, then write a new
    // observation with expectedLastAttemptId = 'attempt-1': notif-1 must stay
    // removed and only notif-2 is appended atomically.
    await repository.acknowledgePendingNotification('optimism', 'notif-1')
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
        newNotification: notif2,
        maxPendingNotifications: 20,
      }),
    ).toEqual(true)
    expect(
      (await repository.findLatest('optimism'))?.pendingNotifications,
    ).toEqual([notif2])

    // Single-owner claim: second owner cannot claim while lease is active.
    const claimed = await repository.claimNextPendingNotification(
      'optimism',
      'owner-1',
      1_000,
      60_000,
    )
    expect(claimed?.id).toEqual('notif-2')
    expect(
      await repository.claimNextPendingNotification(
        'optimism',
        'owner-2',
        2_000,
        60_000,
      ),
    ).toEqual(undefined)

    // Unchanged observation write preserves active claim on notif-2.
    expect(
      await repository.upsertObservation({
        name: 'optimism',
        timestamp: 1_700_007_200,
        attemptAt: t3,
        attemptId: 'attempt-3',
        expectedLastAttemptId: 'attempt-2',
        values: { v: 'A' },
        isPublic: true,
        configHash: HASH,
        newNotification: null,
        maxPendingNotifications: 20,
      }),
    ).toEqual(true)
    expect(
      (await repository.findLatest('optimism'))?.pendingNotifications[0]
        ?.claimedBy,
    ).toEqual('owner-1')

    // Wrong owner cannot release owner-1's claim; owner-1 can release it.
    await repository.releasePendingNotificationClaim(
      'optimism',
      'notif-2',
      'owner-2',
    )
    expect(
      await repository.claimNextPendingNotification(
        'optimism',
        'owner-2',
        3_000,
        60_000,
      ),
    ).toEqual(undefined)
    await repository.releasePendingNotificationClaim(
      'optimism',
      'notif-2',
      'owner-1',
    )
    expect(
      (
        await repository.claimNextPendingNotification(
          'optimism',
          'owner-2',
          4_000,
          60_000,
        )
      )?.claimedBy,
    ).toEqual('owner-2')

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
