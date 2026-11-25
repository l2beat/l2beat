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

    // Claim and acknowledge notif-1 without changing lastAttemptId, then write
    // a new observation with expectedLastAttemptId = 'attempt-1': notif-1 must
    // stay removed and only notif-2 is appended atomically.
    const claimed1 = await repository.claimNextPendingNotification(
      'optimism',
      'owner-0',
      1_000,
      60_000,
    )
    expect(claimed1?.id).toEqual('notif-1')
    // Wrong owner cannot acknowledge owner-0's claim.
    expect(
      await repository.acknowledgePendingNotification(
        'optimism',
        'notif-1',
        'wrong-owner',
      ),
    ).toEqual(false)
    expect(
      await repository.acknowledgePendingNotification(
        'optimism',
        'notif-1',
        'owner-0',
      ),
    ).toEqual(true)
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

    // Appending at capacity (maxPendingNotifications: 2) preserves the claimed
    // head outside backlog eviction so owner-1's alert is never dropped and
    // owner-2 still cannot claim the next alert concurrently.
    const notif3 = {
      id: 'notif-3',
      timestamp: 1_700_007_200,
      diff: [{ key: 'v', changes: [{ path: [], before: 'A', after: 'C' }] }],
    }
    const notif4 = {
      id: 'notif-4',
      timestamp: 1_700_010_800,
      diff: [{ key: 'v', changes: [{ path: [], before: 'C', after: 'D' }] }],
    }
    expect(
      await repository.upsertObservation({
        name: 'optimism',
        timestamp: 1_700_007_200,
        attemptAt: t3,
        attemptId: 'attempt-3',
        expectedLastAttemptId: 'attempt-2',
        values: { v: 'C' },
        isPublic: true,
        configHash: HASH,
        newNotification: notif3,
        maxPendingNotifications: 2,
      }),
    ).toEqual(true)
    expect(
      await repository.upsertObservation({
        name: 'optimism',
        timestamp: 1_700_010_800,
        attemptAt: new Date(1_700_010_800 * 1000),
        attemptId: 'attempt-4',
        expectedLastAttemptId: 'attempt-3',
        values: { v: 'D' },
        isPublic: true,
        configHash: HASH,
        newNotification: notif4,
        maxPendingNotifications: 2,
      }),
    ).toEqual(true)
    const afterCap = (await repository.findLatest('optimism'))
      ?.pendingNotifications
    expect(afterCap?.map((item) => item.id)).toEqual(['notif-2', 'notif-4'])
    expect(afterCap?.[0]?.claimedBy).toEqual('owner-1')
    expect(
      await repository.claimNextPendingNotification(
        'optimism',
        'owner-2',
        2_500,
        60_000,
      ),
    ).toEqual(undefined)

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

    expect(
      await repository.acknowledgePendingNotification(
        'optimism',
        'notif-2',
        'owner-1',
      ),
    ).toEqual(false)
    expect(
      await repository.acknowledgePendingNotification(
        'optimism',
        'notif-2',
        'owner-2',
      ),
    ).toEqual(true)
    const claimed4 = await repository.claimNextPendingNotification(
      'optimism',
      'owner-2',
      4_500,
      60_000,
    )
    expect(claimed4?.id).toEqual('notif-4')
    expect(
      await repository.acknowledgePendingNotification(
        'optimism',
        'notif-4',
        'owner-2',
      ),
    ).toEqual(true)
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
