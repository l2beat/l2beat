import { UnixTime } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect } from 'earl'
import { endsToday, optionToRange, rangeToResolution } from './range'

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

describe(endsToday.name, () => {
  let time: InstalledClock
  const NOON = UnixTime(Date.parse('2026-04-15T12:00:00.000Z') / 1000)
  const DAY = UnixTime.toStartOf(NOON, 'day')

  afterEach(() => {
    time.uninstall()
  })

  it('holds for the presets and a calendar range ending today', () => {
    time = install({ now: NOON * 1000 })

    expect(endsToday(optionToRange('7d'))).toEqual(true)
    expect(endsToday([DAY - 7 * UnixTime.DAY, NOON])).toEqual(true)
  })

  it('does not for a calendar range ending an earlier day', () => {
    time = install({ now: NOON * 1000 })

    expect(endsToday([DAY - 7 * UnixTime.DAY, DAY - 1])).toEqual(false)
  })

  it('does not for the presets in the hour and a quarter after midnight', () => {
    time = install({ now: (DAY + UnixTime.HOUR) * 1000 })

    expect(endsToday(optionToRange('7d'))).toEqual(false)
  })
})
