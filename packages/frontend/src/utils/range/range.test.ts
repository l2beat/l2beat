import { UnixTime } from '@l2beat/shared-pure'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { rangeToResolution } from './range'

describe(rangeToResolution.name, () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-15T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns hour for the exact 7d boundary', () => {
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')

    const resolution = rangeToResolution([today - 7 * UnixTime.DAY, today])

    expect(resolution).toStrictEqual('hour')
  })

  it('returns six hours for ranges older than 7d', () => {
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')

    const resolution = rangeToResolution([
      today - 7 * UnixTime.DAY - UnixTime.HOUR,
      today,
    ])

    expect(resolution).toStrictEqual('six hours')
  })

  it('returns six hours for the exact 90d boundary', () => {
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')

    const resolution = rangeToResolution([today - 90 * UnixTime.DAY, today])

    expect(resolution).toStrictEqual('six hours')
  })

  it('returns day for ranges older than 90d', () => {
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')

    const resolution = rangeToResolution([
      today - 90 * UnixTime.DAY - UnixTime.HOUR,
      today,
    ])

    expect(resolution).toStrictEqual('day')
  })
})
