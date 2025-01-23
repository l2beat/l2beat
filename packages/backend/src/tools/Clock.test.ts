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
      const start = new UnixTime(123456789)
      const clock = new Clock(start, 0)

      const firstHour = clock.getFirstHour()
      expect(firstHour).toEqual(start.toNext('hour'))
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
      const start = new UnixTime(123456789)
      const clock = new Clock(start, 0)

      const firstHour = clock.getFirstDay()
      expect(firstHour).toEqual(start.toNext('day'))
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
      const clock = new Clock(new UnixTime(0), 0)

      const lastHour = clock.getLastHour()
      expect(lastHour).toEqual(toTimestamp('13:00:00'))
    })

    it('uses the specified delay', () => {
      setTime('13:05:48')
      const clock = new Clock(new UnixTime(0), 10 * 60)

      const lastHour = clock.getLastHour()
      expect(lastHour).toEqual(toTimestamp('12:00:00'))
    })
  })

  describe(Clock.prototype.getSixHourlyCutoff.name, () => {
    it('returns correct cutoff', () => {
      const targetTimestamp = UnixTime.fromDate(
        new Date(`2022-06-29T13:00:00.000Z`),
      )
      setTime('13:00:00') // 2022-06-29T13:00:00.000Z

      const sixHourlyCutoffDays = 3
      const clock = new Clock(UnixTime.ZERO, 0, 1, sixHourlyCutoffDays)

      const result = clock.getSixHourlyCutoff(targetTimestamp)

      // 3D before - first possible sixHours entry
      const expected = UnixTime.fromDate(new Date(`2022-06-26T18:00:00.000Z`))
      expect(result).toEqual(expected)
    })
  })

  describe(Clock.prototype.getHourlyCutoff.name, () => {
    it('returns correct cutoff', () => {
      const targetTimestamp = UnixTime.fromDate(
        new Date(`2022-06-29T13:00:00.000Z`),
      )
      setTime('13:00:00') // 2022-06-29T13:00:00.000Z

      const hourlyCutoffDays = 1
      const clock = new Clock(UnixTime.ZERO, 0, hourlyCutoffDays, 3)

      const result = clock.getHourlyCutoff(targetTimestamp)

      // 3D before - first possible sixHours entry
      const expected = UnixTime.fromDate(new Date(`2022-06-28T13:00:00.000Z`))
      expect(result).toEqual(expected)
    })
  })

  describe(Clock.prototype.getAllTimestampsForApi.name, () => {
    it('can return all timestamps for API', () => {
      const minTimestamp = UnixTime.fromDate(
        new Date(`2022-06-22T00:00:00.000Z`),
      )
      const targetTimestamp = UnixTime.fromDate(
        new Date(`2022-06-29T13:00:00.000Z`),
      )
      setTime('13:00:00') // 2022-06-29T13:00:00.000Z

      const clock = new Clock(minTimestamp, 0, 1, 3)

      const timestamps = clock.getAllTimestampsForApi(targetTimestamp)

      expect(timestamps).toEqual([
        minTimestamp, // 22.06
        minTimestamp.add(1, 'days'),
        minTimestamp.add(2, 'days'),
        minTimestamp.add(3, 'days'),
        minTimestamp.add(4, 'days'),
        minTimestamp.add(4, 'days').add(18, 'hours'),
        minTimestamp.add(5, 'days'),
        minTimestamp.add(5, 'days').add(6, 'hours'),
        minTimestamp.add(5, 'days').add(12, 'hours'),
        minTimestamp.add(5, 'days').add(18, 'hours'),
        minTimestamp.add(6, 'days'),
        minTimestamp.add(6, 'days').add(6, 'hours'),
        minTimestamp.add(6, 'days').add(12, 'hours'),
        minTimestamp.add(6, 'days').add(13, 'hours'),
        minTimestamp.add(6, 'days').add(14, 'hours'),
        minTimestamp.add(6, 'days').add(15, 'hours'),
        minTimestamp.add(6, 'days').add(16, 'hours'),
        minTimestamp.add(6, 'days').add(17, 'hours'),
        minTimestamp.add(6, 'days').add(18, 'hours'),
        minTimestamp.add(6, 'days').add(19, 'hours'),
        minTimestamp.add(6, 'days').add(20, 'hours'),
        minTimestamp.add(6, 'days').add(21, 'hours'),
        minTimestamp.add(6, 'days').add(22, 'hours'),
        minTimestamp.add(6, 'days').add(23, 'hours'),
        minTimestamp.add(7, 'days'),
        minTimestamp.add(7, 'days').add(1, 'hours'),
        minTimestamp.add(7, 'days').add(2, 'hours'),
        minTimestamp.add(7, 'days').add(3, 'hours'),
        minTimestamp.add(7, 'days').add(4, 'hours'),
        minTimestamp.add(7, 'days').add(5, 'hours'),
        minTimestamp.add(7, 'days').add(6, 'hours'),
        minTimestamp.add(7, 'days').add(7, 'hours'),
        minTimestamp.add(7, 'days').add(8, 'hours'),
        minTimestamp.add(7, 'days').add(9, 'hours'),
        minTimestamp.add(7, 'days').add(10, 'hours'),
        minTimestamp.add(7, 'days').add(11, 'hours'),
        minTimestamp.add(7, 'days').add(12, 'hours'),
        minTimestamp.add(7, 'days').add(13, 'hours'),
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
