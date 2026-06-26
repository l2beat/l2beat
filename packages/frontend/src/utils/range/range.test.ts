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

  it('returns hour for the exact 7d boundary', () => {
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')

    const resolution = rangeToResolution([today - 7 * UnixTime.DAY, today])

    expect(resolution).toEqual('hour')
  })

  it('returns six hours for ranges older than 7d', () => {
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')

    const resolution = rangeToResolution([
      today - 7 * UnixTime.DAY - UnixTime.HOUR,
      today,
    ])

    expect(resolution).toEqual('six hours')
  })

  it('returns six hours for the exact 90d boundary', () => {
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')

    const resolution = rangeToResolution([today - 90 * UnixTime.DAY, today])

    expect(resolution).toEqual('six hours')
  })

  it('returns day for ranges older than 90d', () => {
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')

    const resolution = rangeToResolution([
      today - 90 * UnixTime.DAY - UnixTime.HOUR,
      today,
    ])

    expect(resolution).toEqual('day')
  })
})
