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
      lastError: null,
    })
    expect(JSON.stringify(record.values)).toEqual('{"list":[{"a":2,"z":1}]}')
    expect(record.isPublic).toEqual(true)
    expect(record.configHash).toEqual(HASH)
    expect(record.lastAttemptId).toEqual('attempt-1')
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

  it('orders observations, failures, and notification acks by attemptAt and attemptId', async () => {
    const sameInstant = new Date(1_700_003_600 * 1000)
    const newer = {
      name: 'optimism',
      timestamp: 1_700_003_600,
      attemptAt: sameInstant,
      attemptId: 'attempt-b',
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

    expect(await repository.upsertObservation(newer)).toEqual(true)
    // A concurrent attempt in the same millisecond with a different attemptId
    // cannot overwrite the observation, record a failure over it, or ack its queue.
    expect(
      await repository.upsertObservation({
        ...newer,
        attemptId: 'attempt-a',
        values: { audits: {} },
      }),
    ).toEqual(false)
    await repository.recordFailure(
      'optimism',
      sameInstant,
      'attempt-a',
      'Stale failure',
    )
    expect(
      await repository.updatePendingNotifications('optimism', 'attempt-a', []),
    ).toEqual(false)

    expect(await repository.findLatest('optimism')).toEqual({
      name: 'optimism',
      timestamp: newer.timestamp,
      values: newer.values,
      isPublic: true,
      configHash: HASH,
      pendingNotifications: newer.pendingNotifications,
      lastAttemptAt: 1_700_003_600,
      lastAttemptId: 'attempt-b',
      lastError: null,
    })

    expect(
      await repository.updatePendingNotifications('optimism', 'attempt-b', []),
    ).toEqual(true)
    expect(
      (await repository.findLatest('optimism'))?.pendingNotifications,
    ).toEqual([])
  })

  it('records failures without erasing the previous successful snapshot', async () => {
    await repository.recordFailure(
      'broken',
      new Date(1_700_000_000 * 1000),
      'attempt-1',
      'HTTP timeout',
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
      lastError: 'HTTP timeout',
    })

    await repository.upsertObservation({
      name: 'broken',
      timestamp: 1_700_003_600,
      attemptAt: new Date(1_700_003_600 * 1000),
      attemptId: 'attempt-2',
      values: { v: 1 },
      isPublic: true,
      configHash: HASH,
      pendingNotifications: [],
    })
    await repository.recordFailure(
      'broken',
      new Date(1_700_007_200 * 1000),
      'attempt-3',
      'Rate limited',
    )
    expect(await repository.findLatest('broken')).toEqual({
      name: 'broken',
      timestamp: 1_700_003_600,
      values: { v: 1 },
      isPublic: true,
      configHash: HASH,
      pendingNotifications: [],
      lastAttemptAt: 1_700_007_200,
      lastAttemptId: 'attempt-3',
      lastError: 'Rate limited',
    })
  })
})
