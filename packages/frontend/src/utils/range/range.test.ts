import { UnixTime } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect } from 'earl'
import { optionToRange, rangeToResolution } from './range'

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

describe(optionToRange.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install()
    time.setSystemTime(new Date('2026-04-15T12:00:00.000Z'))
  })

  afterEach(() => {
    time.uninstall()
  })

  it('ends at now when no anchor is given', () => {
    const [from, to] = optionToRange('30d')

    expect(to).toEqual(UnixTime.fromDate(new Date('2026-04-15T10:00:00.000Z')))
    expect(from).toEqual(
      UnixTime.fromDate(new Date('2026-03-16T00:00:00.000Z')),
    )
  })

  it('ends exactly at the anchor when one is given', () => {
    const anchor = UnixTime.fromDate(new Date('2026-01-10T00:00:00.000Z'))

    const [from, to] = optionToRange('30d', anchor)

    // No backend offset is subtracted, so a snapshot's last point stays inside.
    expect(to).toEqual(anchor)
    expect(from).toEqual(
      UnixTime.fromDate(new Date('2025-12-11T00:00:00.000Z')),
    )
  })

  it('leaves the start open for max, anchored or not', () => {
    const anchor = UnixTime.fromDate(new Date('2026-01-10T00:00:00.000Z'))

    expect(optionToRange('max', anchor)[0]).toEqual(null)
    expect(optionToRange('max')[0]).toEqual(null)
  })
})
