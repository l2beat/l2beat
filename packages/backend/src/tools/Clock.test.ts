import { UnixTime } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect } from 'earl'

import { Clock } from './Clock'

describe(Clock.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install()
  })

  afterEach(() => {
    time.uninstall()
  })

  const toTimestamp = (hhmmss: string) =>
    UnixTime.fromDate(new Date(`2022-06-29T${hhmmss}.000Z`))

  function setTime(hhmmss: string) {
    const newTime = new Date(`2022-06-29T${hhmmss}.000Z`)
    time.setSystemTime(newTime)
    return newTime
  }

  describe(Clock.prototype.getFirstHour.name, () => {
    it('returns minTimestamp aligned to an hour', () => {
      time.setSystemTime(10_000_000_000_000)
      const start = UnixTime(123456789)
      const clock = new Clock(start, 0)

      const firstHour = clock.getFirstHour()
      expect(firstHour).toEqual(UnixTime.toNext(start, 'hour'))
    })

    it('cannot get first hour with minTimestamp in the future', () => {
      setTime('13:05:48')
      const minTimestamp = toTimestamp('15:12:34')
      const clock = new Clock(minTimestamp, 0)
      expect(() => clock.getFirstHour()).toThrow(
        'minTimestamp must be in the past',
      )
    })
  })

  describe(Clock.prototype.getFirstDay.name, () => {
    it('returns minTimestamp aligned to an hour', () => {
      time.setSystemTime(10_000_000_000_000)
      const start = UnixTime(123456789)
      const clock = new Clock(start, 0)

      const firstHour = clock.getFirstDay()
      expect(firstHour).toEqual(UnixTime.toNext(start, 'day'))
    })

    it('cannot get first day with minTimestamp in the future', () => {
      setTime('13:05:48')
      const minTimestamp = toTimestamp('15:12:34')
      const clock = new Clock(minTimestamp, 0)
      expect(() => clock.getFirstDay()).toThrow(
        'minTimestamp must be in the past',
      )
    })
  })

  describe(Clock.prototype.getLastHour.name, () => {
    it('can return the last hour', () => {
      setTime('13:05:48')
      const clock = new Clock(0, 0)

      const lastHour = clock.getLastHour()
      expect(lastHour).toEqual(toTimestamp('13:00:00'))
    })

    it('uses the specified delay', () => {
      setTime('13:05:48')
      const clock = new Clock(0, 10 * 60)

      const lastHour = clock.getLastHour()
      expect(lastHour).toEqual(toTimestamp('12:00:00'))
    })
  })

  describe(Clock.prototype.getSixHourlyCutoff.name, () => {
    it('returns correct cutoff', () => {
      const targetTimestamp = UnixTime.fromDate(
        new Date('2022-06-29T13:00:00.000Z'),
      )
      setTime('13:00:00') // 2022-06-29T13:00:00.000Z

      const sixHourlyCutoffDays = 3
      const clock = new Clock(0, 0, 1, sixHourlyCutoffDays)

      const result = clock.getSixHourlyCutoff(targetTimestamp)

      // 3D before - first possible sixHours entry
      const expected = UnixTime.fromDate(new Date('2022-06-26T18:00:00.000Z'))
      expect(result).toEqual(expected)
    })
  })

  describe(Clock.prototype.getHourlyCutoff.name, () => {
    it('returns correct cutoff', () => {
      const targetTimestamp = UnixTime.fromDate(
        new Date('2022-06-29T13:00:00.000Z'),
      )
      setTime('13:00:00') // 2022-06-29T13:00:00.000Z

      const hourlyCutoffDays = 1
      const clock = new Clock(0, 0, hourlyCutoffDays, 3)

      const result = clock.getHourlyCutoff(targetTimestamp)

      // 3D before - first possible sixHours entry
      const expected = UnixTime.fromDate(new Date('2022-06-28T13:00:00.000Z'))
      expect(result).toEqual(expected)
    })
  })

  describe(Clock.prototype.getAllTimestampsForApi.name, () => {
    it('can return all timestamps for API', () => {
      const minTimestamp = UnixTime.fromDate(
        new Date('2022-06-22T00:00:00.000Z'),
      )
      const targetTimestamp = UnixTime.fromDate(
        new Date('2022-06-29T13:00:00.000Z'),
      )
      setTime('13:00:00') // 2022-06-29T13:00:00.000Z

      const clock = new Clock(minTimestamp, 0, 1, 3)

      const timestamps = clock.getAllTimestampsForApi(targetTimestamp)

      expect(timestamps).toEqual([
        minTimestamp, // 22.06
        minTimestamp + 1 * UnixTime.DAY,
        minTimestamp + 2 * UnixTime.DAY,
        minTimestamp + 3 * UnixTime.DAY,
        minTimestamp + 4 * UnixTime.DAY,
        minTimestamp + 4 * UnixTime.DAY + 18 * UnixTime.HOUR,
        minTimestamp + 5 * UnixTime.DAY,
        minTimestamp + 5 * UnixTime.DAY + 6 * UnixTime.HOUR,
        minTimestamp + 5 * UnixTime.DAY + 12 * UnixTime.HOUR,
        minTimestamp + 5 * UnixTime.DAY + 18 * UnixTime.HOUR,
        minTimestamp + 6 * UnixTime.DAY,
        minTimestamp + 6 * UnixTime.DAY + 6 * UnixTime.HOUR,
        minTimestamp + 6 * UnixTime.DAY + 12 * UnixTime.HOUR,
        minTimestamp + 6 * UnixTime.DAY + 13 * UnixTime.HOUR,
        minTimestamp + 6 * UnixTime.DAY + 14 * UnixTime.HOUR,
        minTimestamp + 6 * UnixTime.DAY + 15 * UnixTime.HOUR,
        minTimestamp + 6 * UnixTime.DAY + 16 * UnixTime.HOUR,
        minTimestamp + 6 * UnixTime.DAY + 17 * UnixTime.HOUR,
        minTimestamp + 6 * UnixTime.DAY + 18 * UnixTime.HOUR,
        minTimestamp + 6 * UnixTime.DAY + 19 * UnixTime.HOUR,
        minTimestamp + 6 * UnixTime.DAY + 20 * UnixTime.HOUR,
        minTimestamp + 6 * UnixTime.DAY + 21 * UnixTime.HOUR,
        minTimestamp + 6 * UnixTime.DAY + 22 * UnixTime.HOUR,
        minTimestamp + 6 * UnixTime.DAY + 23 * UnixTime.HOUR,
        minTimestamp + 7 * UnixTime.DAY,
        minTimestamp + 7 * UnixTime.DAY + 1 * UnixTime.HOUR,
        minTimestamp + 7 * UnixTime.DAY + 2 * UnixTime.HOUR,
        minTimestamp + 7 * UnixTime.DAY + 3 * UnixTime.HOUR,
        minTimestamp + 7 * UnixTime.DAY + 4 * UnixTime.HOUR,
        minTimestamp + 7 * UnixTime.DAY + 5 * UnixTime.HOUR,
        minTimestamp + 7 * UnixTime.DAY + 6 * UnixTime.HOUR,
        minTimestamp + 7 * UnixTime.DAY + 7 * UnixTime.HOUR,
        minTimestamp + 7 * UnixTime.DAY + 8 * UnixTime.HOUR,
        minTimestamp + 7 * UnixTime.DAY + 9 * UnixTime.HOUR,
        minTimestamp + 7 * UnixTime.DAY + 10 * UnixTime.HOUR,
        minTimestamp + 7 * UnixTime.DAY + 11 * UnixTime.HOUR,
        minTimestamp + 7 * UnixTime.DAY + 12 * UnixTime.HOUR,
        minTimestamp + 7 * UnixTime.DAY + 13 * UnixTime.HOUR,
      ])
    })
  })

  describe(Clock.prototype.onNewHour.name, () => {
    it('calls the callback for future hours', async () => {
      const start = toTimestamp('12:00:00')
      setTime('13:05:48')

      const clock = new Clock(start, 0, 60 * 1000)

      const calls: UnixTime[] = []
      const stop = clock.onNewHour((timestamp) => calls.push(timestamp))

      expect(calls).toEqual([])

      // add two hours
      time.tick(2 * 60 * 60 * 1000)

      expect(calls).toEqual([toTimestamp('14:00:00'), toTimestamp('15:00:00')])
      stop()
    })
  })
})
