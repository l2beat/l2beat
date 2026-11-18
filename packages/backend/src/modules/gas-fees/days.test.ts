import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { DuneDayWait, nextDays } from './days'

describe(nextDays.name, () => {
  const day = (date: string) => UnixTime.fromDate(new Date(`${date}T00:00:00Z`))
  const firstDay = day('2026-10-01')

  it('starts after the stored days and stops at the last finished one', () => {
    // Height: the end of 2026-10-01, `to`: midday of 2026-10-04
    expect(
      nextDays(
        firstDay,
        day('2026-10-02') + 1,
        day('2026-10-04') + 12 * 3600,
        10,
      ),
    ).toEqual([day('2026-10-02'), day('2026-10-03')])
  })

  it('starts at the first day from the initial height', () => {
    expect(nextDays(firstDay, day('2026-10-02'), day('2026-10-09'), 2)).toEqual(
      [day('2026-10-01'), day('2026-10-02')],
    )
  })

  it('waits for its first day when a parent starts earlier', () => {
    // The hourly tips start a day before, and lower their children to their height
    const lowered = day('2026-09-30')
    expect(nextDays(firstDay, lowered, day('2026-10-01') + 3600)).toEqual([])
    expect(nextDays(firstDay, lowered, day('2026-10-02'))).toEqual([firstDay])
  })

  it('returns no day before one has finished', () => {
    expect(
      nextDays(firstDay, day('2026-10-02') + 1, day('2026-10-02') + 3600),
    ).toEqual([])
  })
})

describe(DuneDayWait.name, () => {
  const day = UnixTime.fromDate(new Date('2026-10-01T00:00:00Z'))
  const HOUR_MS = 60 * 60_000

  it('waits again without reading, until 6 hours after the read', async () => {
    const waits = new DuneDayWait('Not on Dune yet')
    let reads = 0
    const read = (now: number) =>
      waits.run(day, UnixTime(now), async (wait) => {
        reads++
        return wait({ day })
      })

    for (const hours of [0, 1, 5, 6]) {
      await expect(read(day + hours * UnixTime.HOUR)).toBeRejectedWith(
        'Not on Dune yet',
      )
    }

    expect(reads).toEqual(2)
  })

  it('keeps a wait out of the failed attempts, retried hourly', async () => {
    const waits = new DuneDayWait('Not on Dune yet')
    const { retryStrategy } = waits
    // What the framework does when an update throws
    const fail = async (
      now: number,
      read: Parameters<typeof waits.run<number>>[2],
    ) => {
      await waits
        .run(day, UnixTime(now), read)
        .catch(() => retryStrategy.markAttempt())
      return [retryStrategy.attempts(), retryStrategy.timeoutMs()]
    }
    const duneError = () => Promise.reject(new Error('Dune error'))

    expect(await fail(day, duneError)).toEqual([1, 5 * 60_000])
    expect(await fail(day, async (wait) => wait({ day }))).toEqual([0, HOUR_MS])
    // A failure after the wait counts on from where the failures were
    expect(await fail(day + 6 * UnixTime.HOUR, duneError)).toEqual([
      2,
      10 * 60_000,
    ])
  })

  it('forgets the wait once the day is read', async () => {
    const waits = new DuneDayWait('Not on Dune yet')
    await waits.run(day, day, async (wait) => wait({ day })).catch(() => {})
    const later = UnixTime(day + 6 * UnixTime.HOUR)

    expect(await waits.run(day, later, async () => 1)).toEqual(1)
    expect(await waits.run(day, later, async () => 2)).toEqual(2)
  })
})
