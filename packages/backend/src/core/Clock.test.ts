import { UnixTime } from '@l2beat/shared-pure'
import { install, InstalledClock } from '@sinonjs/fake-timers'
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

  describe(Clock.prototype.onEveryHour.name, () => {
    it('calls the callback for every hour up to now', () => {
      setTime('13:05:48')
      const start = toTimestamp('10:00:00')

      const clock = new Clock(start, 0)

      const calls: UnixTime[] = []
      const stop = clock.onEveryHour((timestamp) => calls.push(timestamp))
      stop()

      expect(calls).toEqual([
        toTimestamp('10:00:00'),
        toTimestamp('11:00:00'),
        toTimestamp('12:00:00'),
        toTimestamp('13:00:00'),
      ])
    })

    it('also calls the callback for future hours', async () => {
      const start = toTimestamp('12:00:00')
      setTime('13:05:48')

      const clock = new Clock(start, 0, 60 * 1000)

      const calls: UnixTime[] = []
      const stop = clock.onEveryHour((timestamp) => calls.push(timestamp))

      expect(calls).toEqual([toTimestamp('12:00:00'), toTimestamp('13:00:00')])

      // add two hours
      time.tick(2 * 60 * 60 * 1000)

      expect(calls).toEqual([
        toTimestamp('12:00:00'),
        toTimestamp('13:00:00'),
        toTimestamp('14:00:00'),
        toTimestamp('15:00:00'),
      ])
      stop()
    })

    it('ticks only daily for timestamps older than 7D', () => {
      setTime('00:00:00')
      const now = UnixTime.now()
      const start = now.add(-14, 'days')

      const clock = new Clock(start, 0)

      const calls: UnixTime[] = []
      const stop = clock.onEveryHour((timestamp) => calls.push(timestamp))
      stop()

      // timestamps older than 7D should be ticked daily
      const dailyCalls = calls.slice(0, 7)
      expect(dailyCalls.every((x) => x.isFull('day'))).toEqual(true)

      // timestamps newer than 7D should be ticked hourly
      const hourlyCalls = calls.slice(7)
      for (let i = 0; i < hourlyCalls.length - 1; i++) {
        const call = hourlyCalls[i]
        const nextCall = hourlyCalls[i + 1]
        expect(nextCall).toEqual(call.add(1, 'hours'))
      }

      // straightforward test case to better visualize the functionality
      expect(calls.slice(0, 10)).toEqual([
        toTimestamp('00:00:00').add(-14, 'days'),
        toTimestamp('00:00:00').add(-13, 'days'),
        toTimestamp('00:00:00').add(-12, 'days'),
        toTimestamp('00:00:00').add(-11, 'days'),
        toTimestamp('00:00:00').add(-10, 'days'),
        toTimestamp('00:00:00').add(-9, 'days'),
        toTimestamp('00:00:00').add(-8, 'days'),
        toTimestamp('00:00:00').add(-7, 'days'),
        toTimestamp('00:00:00').add(-7, 'days').add(1, 'hours'),
        toTimestamp('00:00:00').add(-7, 'days').add(2, 'hours'),
        // hourly granularity...
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
