import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { Knex } from 'knex'

/**
 * WARNING: this method requires table to have unix_timestamp column
 */
export function _TVL_ONLY_deleteHourlyUntil(
  knex: Knex,
  tableName: string,
  timestamp: UnixTime,
) {
  return (
    knex(tableName)
      .where('unix_timestamp', '<', timestamp.toDate())
      // do not delete daily
      .andWhereRaw(`extract(hour from "unix_timestamp") != 0`)
      // do not delete six hourly
      .andWhereRaw(`extract(hour from "unix_timestamp") % 6 != 0`)
      .delete()
  )
}

/**
 * WARNING: this method requires table to have unix_timestamp column
 */
export function _TVL_ONLY_deleteSixHourlyUntil(
  knex: Knex,
  tableName: string,
  timestamp: UnixTime,
) {
  return (
    knex(tableName)
      .where('unix_timestamp', '<', timestamp.toDate())
      // do not delete daily
      .andWhereRaw(`extract(hour from "unix_timestamp") != 0`)
      // delete only six hourly
      .andWhereRaw(`extract(hour from "unix_timestamp") % 6 = 0`)
      .delete()
  )
}

interface Repository {
  deleteHourlyUntil: (timestamp: UnixTime) => Promise<number>
  deleteSixHourlyUntil: (timestamp: UnixTime) => Promise<number>
  addMany: (records: any[]) => Promise<number>
  getAll: () => Promise<any[]>
}

export function _TVL_ONLY_deletion_test<T>(
  repository: Repository,
  fakeRecord: (timestamp: UnixTime) => T,
) {
  it('deletes hourly records', async () => {
    const start = UnixTime.now().toStartOf('day')
    const until = start.add(25, 'hours')

    const entries = []
    for (let i = start.toNumber(); i <= until.toNumber(); i += UnixTime.HOUR) {
      entries.push(fakeRecord(new UnixTime(i)))
    }

    await repository.addMany(entries)
    await repository.deleteHourlyUntil(until)
    const results = await repository.getAll()

    expect(results).toEqualUnsorted([
      fakeRecord(start),
      fakeRecord(start.add(6, 'hours')),
      fakeRecord(start.add(12, 'hours')),
      fakeRecord(start.add(18, 'hours')),
      fakeRecord(start.add(24, 'hours')),
      fakeRecord(start.add(25, 'hours')),
    ])
  })

  it('deletes six hourly records', async () => {
    const start = UnixTime.now().toStartOf('day')
    const until = start.add(7, 'hours')

    const entries = []
    for (let i = start.toNumber(); i <= until.toNumber(); i += UnixTime.HOUR) {
      entries.push(fakeRecord(new UnixTime(i)))
    }

    await repository.addMany(entries)
    await repository.deleteSixHourlyUntil(until)
    const results = await repository.getAll()

    expect(results).toEqualUnsorted([
      fakeRecord(start),
      fakeRecord(start.add(1, 'hours')),
      fakeRecord(start.add(2, 'hours')),
      fakeRecord(start.add(3, 'hours')),
      fakeRecord(start.add(4, 'hours')),
      fakeRecord(start.add(5, 'hours')),
      fakeRecord(start.add(7, 'hours')),
    ])
  })
}
