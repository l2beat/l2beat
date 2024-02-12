import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

interface TestedRepository<T> {
  deleteHourlyUntil: (
    to: UnixTime,
    from: UnixTime | undefined,
  ) => Promise<number>
  deleteSixHourlyUntil: (
    to: UnixTime,
    from: UnixTime | undefined,
  ) => Promise<number>
  addMany: (records: T[]) => Promise<number>
  getAll: () => Promise<T[]>
}

export function testDeletingArchivedRecords<T>(
  repository: TestedRepository<T>,
  fakeRecord: (timestamp: UnixTime) => T,
) {
  it('deletes hourly records to given date', async () => {
    const start = UnixTime.now().toStartOf('day')
    const until = start.add(25, 'hours')

    const entries = []
    for (let i = start.toNumber(); i <= until.toNumber(); i += UnixTime.HOUR) {
      entries.push(fakeRecord(new UnixTime(i)))
    }

    await repository.addMany(entries)
    await repository.deleteHourlyUntil(until, undefined)
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

  it('deletes hourly records from to', async () => {
    const start = UnixTime.now().toStartOf('day')
    const to = start.add(25, 'hours')
    const from = start.add(6, 'hours')

    const entries = []
    for (let i = start.toNumber(); i <= to.toNumber(); i += UnixTime.HOUR) {
      entries.push(fakeRecord(new UnixTime(i)))
    }

    await repository.addMany(entries)
    await repository.deleteHourlyUntil(to, from)
    const results = await repository.getAll()

    expect(results).toEqualUnsorted([
      fakeRecord(start),
      fakeRecord(start.add(1, 'hours')),
      fakeRecord(start.add(2, 'hours')),
      fakeRecord(start.add(3, 'hours')),
      fakeRecord(start.add(4, 'hours')),
      fakeRecord(start.add(5, 'hours')),
      fakeRecord(start.add(6, 'hours')),
      fakeRecord(start.add(12, 'hours')),
      fakeRecord(start.add(18, 'hours')),
      fakeRecord(start.add(24, 'hours')),
      fakeRecord(start.add(25, 'hours')),
    ])
  })

  it('deletes six hourly records to given date', async () => {
    const start = UnixTime.now().toStartOf('day')
    const until = start.add(7, 'hours')

    const entries = []
    for (let i = start.toNumber(); i <= until.toNumber(); i += UnixTime.HOUR) {
      entries.push(fakeRecord(new UnixTime(i)))
    }

    await repository.addMany(entries)
    await repository.deleteSixHourlyUntil(until, undefined)
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

  it('deletes six hourly records from to', async () => {
    const start = UnixTime.now().toStartOf('day')
    const to = start.add(13, 'hours')
    const from = start.add(7, 'hours')

    const entries = []
    for (let i = start.toNumber(); i <= to.toNumber(); i += UnixTime.HOUR) {
      entries.push(fakeRecord(new UnixTime(i)))
    }

    await repository.addMany(entries)
    await repository.deleteSixHourlyUntil(to, from)
    const results = await repository.getAll()

    expect(results).toEqualUnsorted([
      fakeRecord(start),
      fakeRecord(start.add(1, 'hours')),
      fakeRecord(start.add(2, 'hours')),
      fakeRecord(start.add(3, 'hours')),
      fakeRecord(start.add(4, 'hours')),
      fakeRecord(start.add(5, 'hours')),
      fakeRecord(start.add(6, 'hours')),
      fakeRecord(start.add(7, 'hours')),
      fakeRecord(start.add(8, 'hours')),
      fakeRecord(start.add(9, 'hours')),
      fakeRecord(start.add(10, 'hours')),
      fakeRecord(start.add(11, 'hours')),
      fakeRecord(start.add(13, 'hours')),
    ])
  })
}
