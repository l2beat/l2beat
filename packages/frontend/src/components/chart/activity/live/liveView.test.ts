import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  clampTo,
  formatBucket,
  getKeyEnd,
  getMoveEnd,
  isMoveKey,
  ticksOf,
} from './liveView'

const T = UnixTime(1_800_000_000)

describe(getMoveEnd.name, () => {
  const buffer = { from: T - 4 * UnixTime.HOUR, to: T }

  it('follows the newest block when the overview shows it does', () => {
    // Methodology: 14 s behind on 5M is within its 15 s, but rounded to a
    // 12 s bucket first it would be 24 s behind
    expect(getMoveEnd(T - 14, buffer, 300, 12)).toEqual(undefined)
  })

  it('ends a window looked back on on a bucket', () => {
    expect(getMoveEnd(T - 100, buffer, 300, 12)).toEqual(
      T - 100 - ((T - 100) % 12),
    )
  })
})

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

describe(getKeyEnd.name, () => {
  const buffer = { from: T - 4 * UnixTime.HOUR, to: T }

  it('steps a tenth of the window back and forward', () => {
    expect(getKeyEnd('ArrowLeft', T - 1800, buffer, 900)).toEqual(T - 1890)
    expect(getKeyEnd('ArrowDown', T - 1800, buffer, 900)).toEqual(T - 1890)
    expect(getKeyEnd('ArrowRight', T - 1800, buffer, 900)).toEqual(T - 1710)
    expect(getKeyEnd('ArrowUp', T - 1800, buffer, 900)).toEqual(T - 1710)
  })

  it('goes to the first window and to the newest block', () => {
    expect(getKeyEnd('Home', T - 1800, buffer, 900)).toEqual(buffer.from + 900)
    expect(getKeyEnd('End', T - 1800, buffer, 900)).toEqual(T)
  })

  it('stops following the newest block with one step back', () => {
    for (const seconds of [300, 900, 3600]) {
      const end = getKeyEnd('ArrowLeft', T, buffer, seconds)

      expect(clampTo(end, buffer, seconds)).toEqual(end)
    }
  })

  it('moves nothing for other keys', () => {
    expect(getKeyEnd('Tab', T, buffer, 900)).toEqual(undefined)
    expect(isMoveKey('Tab')).toEqual(false)
    expect(isMoveKey('Home')).toEqual(true)
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
