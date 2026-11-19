import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { clampTo, formatBucket, ticksOf } from './liveView'

const T = UnixTime(1_800_000_000)

describe(clampTo.name, () => {
  const buffer = { from: T - 4 * UnixTime.HOUR, to: T }

  it('keeps an end within the buffer', () => {
    expect(clampTo(T - UnixTime.HOUR, buffer, 900)).toEqual(T - UnixTime.HOUR)
  })

  it('ends a window no earlier than its length into the buffer', () => {
    expect(clampTo(T - 5 * UnixTime.HOUR, buffer, 900)).toEqual(
      buffer.from + 900,
    )
  })

  it('follows the newest block within a twentieth of the window of it', () => {
    expect(clampTo(T - 46, buffer, 900)).toEqual(T - 46)
    expect(clampTo(T - 45, buffer, 900)).toEqual(undefined)
    expect(clampTo(T + 600, buffer, 900)).toEqual(undefined)
  })

  it('follows the newest block when the buffer is shorter than the window', () => {
    expect(clampTo(T - 300, { from: T - 600, to: T }, 3600)).toEqual(undefined)
  })

  it('follows the newest block without an end or a buffer', () => {
    expect(clampTo(undefined, buffer, 900)).toEqual(undefined)
    expect(clampTo(T - 300, undefined, 900)).toEqual(undefined)
  })
})

describe(ticksOf.name, () => {
  it('has every multiple of the step in the range, its ends included', () => {
    expect(ticksOf(T - 70, T + 120, 60)).toEqual([T - 60, T, T + 60, T + 120])
  })

  it('has none in a range between two', () => {
    expect(ticksOf(T + 1, T + 59, 60)).toEqual([])
  })
})

describe(formatBucket.name, () => {
  it('spans the bucket a time is in', () => {
    const start = UnixTime.fromDate(new Date('2026-06-30T23:59:48Z'))

    expect(formatBucket(start + 5, 6)).toEqual(
      '30 Jun 2026, 23:59:48 — 23:59:54 UTC',
    )
  })
})
