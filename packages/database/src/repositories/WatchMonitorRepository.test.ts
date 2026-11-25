import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { toRecord, WatchMonitorRepository } from './WatchMonitorRepository'

describe(toRecord.name, () => {
  it('canonicalizes object key order inside JSONB arrays on read', () => {
    const record = toRecord({
      name: 'optimism',
      timestamp: new Date(1_700_000_000 * 1000),
      valuesJsonBlob: { list: [{ z: 1, a: 2 }] },
      notifiedValuesJsonBlob: { list: [{ z: 1, a: 2 }] },
      lastAttemptAt: new Date(1_700_000_000 * 1000),
      lastError: null,
    })
    expect(JSON.stringify(record.values)).toEqual('{"list":[{"a":2,"z":1}]}')
    expect(JSON.stringify(record.notifiedValues)).toEqual(
      '{"list":[{"a":2,"z":1}]}',
    )
  })
})

describeDatabase(WatchMonitorRepository.name, (db) => {
  const repository = db.watchMonitor

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it('persists observations without letting older timestamps overwrite newer ones', async () => {
    const newer = {
      name: 'optimism',
      timestamp: 1_700_003_600,
      values: { audits: { 'org/r:b.pdf': { sha: 'bbb', size: 20 } } },
    }
    const older = {
      name: 'optimism',
      timestamp: 1_700_000_000,
      values: { audits: { 'org/r:a.pdf': { sha: 'aaa', size: 10 } } },
    }

    expect(await repository.upsertObservation(newer)).toEqual(true)
    expect(await repository.upsertObservation(older)).toEqual(false)
    expect(await repository.findLatest('optimism')).toEqual({
      name: 'optimism',
      timestamp: newer.timestamp,
      values: newer.values,
      notifiedValues: null,
      lastAttemptAt: newer.timestamp,
      lastError: null,
    })

    await repository.markNotified('optimism', older.timestamp, older.values)
    expect((await repository.findLatest('optimism'))?.notifiedValues).toEqual(
      null,
    )

    await repository.markNotified('optimism', newer.timestamp, newer.values)
    expect((await repository.findLatest('optimism'))?.notifiedValues).toEqual(
      newer.values,
    )
  })

  it('records failures without erasing the previous successful snapshot', async () => {
    await repository.recordFailure('broken', 1_700_000_000, 'HTTP timeout')
    expect(await repository.findLatest('broken')).toEqual({
      name: 'broken',
      timestamp: null,
      values: null,
      notifiedValues: null,
      lastAttemptAt: 1_700_000_000,
      lastError: 'HTTP timeout',
    })

    await repository.upsertObservation({
      name: 'broken',
      timestamp: 1_700_003_600,
      values: { v: 1 },
    })
    await repository.recordFailure('broken', 1_700_007_200, 'Rate limited')
    expect(await repository.findLatest('broken')).toEqual({
      name: 'broken',
      timestamp: 1_700_003_600,
      values: { v: 1 },
      notifiedValues: null,
      lastAttemptAt: 1_700_007_200,
      lastError: 'Rate limited',
    })
  })
})
