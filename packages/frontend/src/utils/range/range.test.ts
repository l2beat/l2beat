import { UnixTime } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect } from 'earl'
import { rangeToResolution } from './range'

describe(rangeToResolution.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install()
    time.setSystemTime(new Date('2026-04-15T12:00:00.000Z'))
  })

  afterEach(() => {
    time.uninstall()
  })

  it('returns hourly for the exact 7d boundary', () => {
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')

    const resolution = rangeToResolution([today - 7 * UnixTime.DAY, today])

    expect(resolution).toEqual('hourly')
  })

  it('returns sixHourly for ranges older than 7d', () => {
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')

    const resolution = rangeToResolution([
      today - 7 * UnixTime.DAY - UnixTime.HOUR,
      today,
    ])

    expect(resolution).toEqual('sixHourly')
  })

  it('returns sixHourly for the exact 90d boundary', () => {
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')

    const resolution = rangeToResolution([today - 90 * UnixTime.DAY, today])

    expect(resolution).toEqual('sixHourly')
  })

  it('returns daily for ranges older than 90d', () => {
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')

    const resolution = rangeToResolution([
      today - 90 * UnixTime.DAY - UnixTime.HOUR,
      today,
    ])

    expect(resolution).toEqual('daily')
  })
})
