import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type WatchMonitorRecord,
  WatchMonitorRepository,
} from './WatchMonitorRepository'

describeDatabase(WatchMonitorRepository.name, (db) => {
  const repository = db.watchMonitor

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(WatchMonitorRepository.prototype.findLatest.name, async () => {
    const expected: WatchMonitorRecord = {
      name: 'optimism',
      timestamp: 1_700_000_000,
      values: { audits: { 'org/repo:a.pdf': { sha: 'aaa', size: 10 } } },
    }

    await repository.upsert(expected)
    expect(await repository.findLatest('optimism')).toEqual(expected)
    expect(await repository.findLatest('missing')).toEqual(undefined)
  })

  it(WatchMonitorRepository.prototype.upsert.name, async () => {
    const initial: WatchMonitorRecord = {
      name: 'optimism',
      timestamp: 1_700_000_000,
      values: { audits: { 'org/repo:a.pdf': { sha: 'aaa', size: 10 } } },
    }
    await repository.upsert(initial)

    const updated: WatchMonitorRecord = {
      name: 'optimism',
      timestamp: 1_700_003_600,
      values: {
        audits: {
          'org/repo:a.pdf': { sha: 'aaa', size: 10 },
          'org/repo:b.pdf': { sha: 'bbb', size: 20 },
        },
      },
    }
    await repository.upsert(updated)
    expect(await repository.findLatest('optimism')).toEqual(updated)
    expect(await repository.getAll()).toEqual([updated])
  })
})
