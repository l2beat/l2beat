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
    const to = start + 25 * UnixTime.HOUR

    const entries = []
    for (let i = start; i <= to; i += UnixTime.HOUR) {
      entries.push(fakeRecord(UnixTime(i)))
    }

    await repository.insertMany(entries)
    await repository.deleteHourlyUntil({ from: undefined, to })
    const results = await repository.getAll()

    expect(results).toEqualUnsorted([
      fakeRecord(start),
      fakeRecord(start + 6 * UnixTime.HOUR),
      fakeRecord(start + 12 * UnixTime.HOUR),
      fakeRecord(start + 18 * UnixTime.HOUR),
      fakeRecord(start + 24 * UnixTime.HOUR),
      fakeRecord(start + 25 * UnixTime.HOUR),
    ])
  })

  it('deletes hourly records from to', async () => {
    const start = UnixTime.toStartOf(UnixTime.now(), 'day')
    const to = start + 25 * UnixTime.HOUR
    const from = start + 6 * UnixTime.HOUR

    const entries = []
    for (let i = start; i <= to; i += UnixTime.HOUR) {
      entries.push(fakeRecord(UnixTime(i)))
    }

    await repository.insertMany(entries)
    await repository.deleteHourlyUntil({ from, to })
    const results = await repository.getAll()

    expect(results).toEqualUnsorted([
      fakeRecord(start),
      fakeRecord(start + 1 * UnixTime.HOUR),
      fakeRecord(start + 2 * UnixTime.HOUR),
      fakeRecord(start + 3 * UnixTime.HOUR),
      fakeRecord(start + 4 * UnixTime.HOUR),
      fakeRecord(start + 5 * UnixTime.HOUR),
      fakeRecord(start + 6 * UnixTime.HOUR),
      fakeRecord(start + 12 * UnixTime.HOUR),
      fakeRecord(start + 18 * UnixTime.HOUR),
      fakeRecord(start + 24 * UnixTime.HOUR),
      fakeRecord(start + 25 * UnixTime.HOUR),
    ])
  })

  it('deletes six hourly records to given date', async () => {
    const start = UnixTime.toStartOf(UnixTime.now(), 'day')
    const to = start + 7 * UnixTime.HOUR

    const entries = []
    for (let i = start; i <= to; i += UnixTime.HOUR) {
      entries.push(fakeRecord(UnixTime(i)))
    }

    await repository.insertMany(entries)
    await repository.deleteSixHourlyUntil({ from: undefined, to })
    const results = await repository.getAll()

    expect(results).toEqualUnsorted([
      fakeRecord(start),
      fakeRecord(start + 1 * UnixTime.HOUR),
      fakeRecord(start + 2 * UnixTime.HOUR),
      fakeRecord(start + 3 * UnixTime.HOUR),
      fakeRecord(start + 4 * UnixTime.HOUR),
      fakeRecord(start + 5 * UnixTime.HOUR),
      fakeRecord(start + 7 * UnixTime.HOUR),
    ])
  })

  it('deletes six hourly records from to', async () => {
    const start = UnixTime.toStartOf(UnixTime.now(), 'day')
    const to = start + 13 * UnixTime.HOUR
    const from = start + 7 * UnixTime.HOUR

    const entries = []
    for (let i = start; i <= to; i += UnixTime.HOUR) {
      entries.push(fakeRecord(UnixTime(i)))
    }

    await repository.insertMany(entries)
    await repository.deleteSixHourlyUntil({ from, to })
    const results = await repository.getAll()

    expect(results).toEqualUnsorted([
      fakeRecord(start),
      fakeRecord(start + 1 * UnixTime.HOUR),
      fakeRecord(start + 2 * UnixTime.HOUR),
      fakeRecord(start + 3 * UnixTime.HOUR),
      fakeRecord(start + 4 * UnixTime.HOUR),
      fakeRecord(start + 5 * UnixTime.HOUR),
      fakeRecord(start + 6 * UnixTime.HOUR),
      fakeRecord(start + 7 * UnixTime.HOUR),
      fakeRecord(start + 8 * UnixTime.HOUR),
      fakeRecord(start + 9 * UnixTime.HOUR),
      fakeRecord(start + 10 * UnixTime.HOUR),
      fakeRecord(start + 11 * UnixTime.HOUR),
      fakeRecord(start + 13 * UnixTime.HOUR),
    ])
  })
}
