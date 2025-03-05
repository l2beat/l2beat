import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

interface TestedRepository<T> {
  deleteHourlyUntil: (dateRange: {
    from: UnixTime | undefined
    to: UnixTime
  }) => Promise<unknown>
  deleteSixHourlyUntil: (dateRange: {
    from: UnixTime | undefined
    to: UnixTime
  }) => Promise<unknown>
  insertMany: (records: T[]) => Promise<unknown>
  getAll: () => Promise<T[]>
}

export function testDeletingArchivedRecords<T>(
  repository: TestedRepository<T>,
  fakeRecord: (timestamp: UnixTime) => T,
) {
  it('deletes hourly records to given date', async () => {
    const start = UnixTime.toStartOf(UnixTime.now(), 'day')
    const to = start + UnixTime(25, 'hours')

    const entries = []
    for (let i = start; i <= to; i += UnixTime.HOUR) {
      entries.push(fakeRecord(UnixTime(i)))
    }

    await repository.insertMany(entries)
    await repository.deleteHourlyUntil({ from: undefined, to })
    const results = await repository.getAll()

    expect(results).toEqualUnsorted([
      fakeRecord(start),
      fakeRecord(start + UnixTime(6, 'hours')),
      fakeRecord(start + UnixTime(12, 'hours')),
      fakeRecord(start + UnixTime(18, 'hours')),
      fakeRecord(start + UnixTime(24, 'hours')),
      fakeRecord(start + UnixTime(25, 'hours')),
    ])
  })

  it('deletes hourly records from to', async () => {
    const start = UnixTime.toStartOf(UnixTime.now(), 'day')
    const to = start + UnixTime(25, 'hours')
    const from = start + UnixTime(6, 'hours')

    const entries = []
    for (let i = start; i <= to; i += UnixTime.HOUR) {
      entries.push(fakeRecord(UnixTime(i)))
    }

    await repository.insertMany(entries)
    await repository.deleteHourlyUntil({ from, to })
    const results = await repository.getAll()

    expect(results).toEqualUnsorted([
      fakeRecord(start),
      fakeRecord(start + UnixTime(1, 'hours')),
      fakeRecord(start + UnixTime(2, 'hours')),
      fakeRecord(start + UnixTime(3, 'hours')),
      fakeRecord(start + UnixTime(4, 'hours')),
      fakeRecord(start + UnixTime(5, 'hours')),
      fakeRecord(start + UnixTime(6, 'hours')),
      fakeRecord(start + UnixTime(12, 'hours')),
      fakeRecord(start + UnixTime(18, 'hours')),
      fakeRecord(start + UnixTime(24, 'hours')),
      fakeRecord(start + UnixTime(25, 'hours')),
    ])
  })

  it('deletes six hourly records to given date', async () => {
    const start = UnixTime.toStartOf(UnixTime.now(), 'day')
    const to = start + UnixTime(7, 'hours')

    const entries = []
    for (let i = start; i <= to; i += UnixTime.HOUR) {
      entries.push(fakeRecord(UnixTime(i)))
    }

    await repository.insertMany(entries)
    await repository.deleteSixHourlyUntil({ from: undefined, to })
    const results = await repository.getAll()

    expect(results).toEqualUnsorted([
      fakeRecord(start),
      fakeRecord(start + UnixTime(1, 'hours')),
      fakeRecord(start + UnixTime(2, 'hours')),
      fakeRecord(start + UnixTime(3, 'hours')),
      fakeRecord(start + UnixTime(4, 'hours')),
      fakeRecord(start + UnixTime(5, 'hours')),
      fakeRecord(start + UnixTime(7, 'hours')),
    ])
  })

  it('deletes six hourly records from to', async () => {
    const start = UnixTime.toStartOf(UnixTime.now(), 'day')
    const to = start + UnixTime(13, 'hours')
    const from = start + UnixTime(7, 'hours')

    const entries = []
    for (let i = start; i <= to; i += UnixTime.HOUR) {
      entries.push(fakeRecord(UnixTime(i)))
    }

    await repository.insertMany(entries)
    await repository.deleteSixHourlyUntil({ from, to })
    const results = await repository.getAll()

    expect(results).toEqualUnsorted([
      fakeRecord(start),
      fakeRecord(start + UnixTime(1, 'hours')),
      fakeRecord(start + UnixTime(2, 'hours')),
      fakeRecord(start + UnixTime(3, 'hours')),
      fakeRecord(start + UnixTime(4, 'hours')),
      fakeRecord(start + UnixTime(5, 'hours')),
      fakeRecord(start + UnixTime(6, 'hours')),
      fakeRecord(start + UnixTime(7, 'hours')),
      fakeRecord(start + UnixTime(8, 'hours')),
      fakeRecord(start + UnixTime(9, 'hours')),
      fakeRecord(start + UnixTime(10, 'hours')),
      fakeRecord(start + UnixTime(11, 'hours')),
      fakeRecord(start + UnixTime(13, 'hours')),
    ])
  })
}
