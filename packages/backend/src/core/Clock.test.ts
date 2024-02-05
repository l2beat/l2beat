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

  describe(Clock.prototype._TVL_ONLY_onEveryHour.name, () => {
    it('calls the callback for every hour up to now', () => {
      setTime('13:05:48')
      const start = toTimestamp('10:00:00')

      const clock = new Clock(start, 0)

      const calls: UnixTime[] = []
      const stop = clock._TVL_ONLY_onEveryHour((timestamp) =>
        calls.push(timestamp),
      )
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
      const stop = clock._TVL_ONLY_onEveryHour((timestamp) =>
        calls.push(timestamp),
      )

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

    it('ticks six hourly after 7D and daily after 90D', () => {
      setTime('00:00:00')
      const now = UnixTime.now()

      const TOTAL_DAYS = 183
      const DAILY_TICK_START_DAY = 93
      const SIX_HOURLY_TICK_START_DAY = 10

      const start = now.add(-TOTAL_DAYS, 'days')
      const clock = new Clock(start, 0)

      const calls: UnixTime[] = []
      const stop = clock._TVL_ONLY_onEveryHour((timestamp) =>
        calls.push(timestamp),
      )
      stop()

      const DAILY_TICKS = TOTAL_DAYS - DAILY_TICK_START_DAY
      const dailyCalls = calls.slice(0, DAILY_TICKS)
      expect(dailyCalls.length).toEqual(DAILY_TICKS)
      expect(dailyCalls.every((x) => x.isFull('day'))).toEqual(true)

      const SIX_HOURLY_TICKS =
        (DAILY_TICK_START_DAY - SIX_HOURLY_TICK_START_DAY) * 4
      const sixHourlyCalls = calls.slice(
        DAILY_TICKS,
        DAILY_TICKS + SIX_HOURLY_TICKS,
      )
      expect(sixHourlyCalls.length).toEqual(SIX_HOURLY_TICKS)
      expect(sixHourlyCalls.every((x) => x.isFull('six hours'))).toEqual(true)

      const HOURLY_TICKS = 10 * 24 + 1
      const hourlyCalls = calls.slice(DAILY_TICKS + SIX_HOURLY_TICKS)
      expect(hourlyCalls.length).toEqual(HOURLY_TICKS)
      for (let i = 0; i < hourlyCalls.length - 1; i++) {
        const call = hourlyCalls[i]
        const nextCall = hourlyCalls[i + 1]
        expect(nextCall).toEqual(call.add(1, 'hours'))
      }
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

  describe(Clock.prototype._TVL_ONLY_getHourlyDeletionBoundary.name, () => {
    it('returns timestamp 10 days before now', () => {
      setTime('00:00:00')
      const now = UnixTime.now()
      const clock = new Clock(new UnixTime(0), 0)
      const boundary = clock._TVL_ONLY_getHourlyDeletionBoundary()

      expect(boundary).toEqual(now.add(-10, 'days'))
    })
  })

  describe(Clock.prototype._TVL_ONLY_getSixHourlyDeletionBoundary.name, () => {
    it('returns timestamp 93 days before now', () => {
      setTime('00:00:00')
      const now = UnixTime.now()
      const clock = new Clock(new UnixTime(0), 0)
      const boundary = clock._TVL_ONLY_getSixHourlyDeletionBoundary()

      expect(boundary).toEqual(now.add(-93, 'days'))
    })
  })
})
