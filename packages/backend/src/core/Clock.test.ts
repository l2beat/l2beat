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
    time.setSystemTime(new Date(`2022-06-29T${hhmmss}.000Z`))
  }

  it('cannot be constructed with minTimestamp in the future', () => {
    setTime('13:05:48')
    const minTimestamp = toTimestamp('15:12:34')
    expect(() => new Clock(minTimestamp, 0)).toThrow(
      'minTimestamp must be in the past',
    )
  })

  describe(Clock.prototype.getFirstHour.name, () => {
    it('returns minTimestamp aligned to an hour', () => {
      time.setSystemTime(10_000_000_000_000)
      const start = new UnixTime(123456789)
      const clock = new Clock(start, 0)

      const firstHour = clock.getFirstHour()
      expect(firstHour).toEqual(start.toNext('hour'))
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
