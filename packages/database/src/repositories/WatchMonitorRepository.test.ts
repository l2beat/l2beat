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
      lastError: null,
    })
    expect(JSON.stringify(record.values)).toEqual('{"list":[{"a":2,"z":1}]}')
    expect(record.isPublic).toEqual(true)
    expect(record.configHash).toEqual(HASH)
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

  it('persists observations without letting older attempts overwrite newer ones', async () => {
    const newer = {
      name: 'optimism',
      timestamp: 1_700_003_600,
      attemptAt: 1_700_003_600,
      values: { audits: { 'org/r:b.pdf': { sha: 'bbb', size: 20 } } },
      isPublic: true,
      configHash: HASH,
      pendingNotifications: [
        {
          timestamp: 1_700_003_600,
          diff: [
            {
              key: 'audits',
              changes: [
                { path: ['org/r:b.pdf'], after: { sha: 'bbb', size: 20 } },
              ],
            },
          ],
        },
      ],
    }
    const older = {
      name: 'optimism',
      timestamp: 1_700_000_000,
      attemptAt: 1_700_000_000,
      values: { audits: { 'org/r:a.pdf': { sha: 'aaa', size: 10 } } },
      isPublic: false,
      configHash: HASH,
      pendingNotifications: [],
    }

    expect(await repository.upsertObservation(newer)).toEqual(true)
    expect(await repository.upsertObservation(older)).toEqual(false)
    await repository.recordFailure('optimism', older.attemptAt, 'Stale timeout')
    expect(await repository.findLatest('optimism')).toEqual({
      name: 'optimism',
      timestamp: newer.timestamp,
      values: newer.values,
      isPublic: true,
      configHash: HASH,
      pendingNotifications: newer.pendingNotifications,
      lastAttemptAt: newer.attemptAt,
      lastError: null,
    })

    await repository.updatePendingNotifications('optimism', older.attemptAt, [])
    expect(
      (await repository.findLatest('optimism'))?.pendingNotifications.length,
    ).toEqual(1)

    await repository.updatePendingNotifications('optimism', newer.attemptAt, [])
    expect(
      (await repository.findLatest('optimism'))?.pendingNotifications,
    ).toEqual([])
  })

  it('records failures without erasing the previous successful snapshot', async () => {
    await repository.recordFailure('broken', 1_700_000_000, 'HTTP timeout')
    expect(await repository.findLatest('broken')).toEqual({
      name: 'broken',
      timestamp: null,
      values: null,
      isPublic: false,
      configHash: null,
      pendingNotifications: [],
      lastAttemptAt: 1_700_000_000,
      lastError: 'HTTP timeout',
    })

    await repository.upsertObservation({
      name: 'broken',
      timestamp: 1_700_003_600,
      attemptAt: 1_700_003_600,
      values: { v: 1 },
      isPublic: true,
      configHash: HASH,
      pendingNotifications: [],
    })
    await repository.recordFailure('broken', 1_700_007_200, 'Rate limited')
    expect(await repository.findLatest('broken')).toEqual({
      name: 'broken',
      timestamp: 1_700_003_600,
      values: { v: 1 },
      isPublic: true,
      configHash: HASH,
      pendingNotifications: [],
      lastAttemptAt: 1_700_007_200,
      lastError: 'Rate limited',
    })
  })
})
