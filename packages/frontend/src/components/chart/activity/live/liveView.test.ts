import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  clampTo,
  formatBucket,
  getEdgeAt,
  getKeyEnd,
  getKeyLength,
  getMoveEnd,
  getResizedFrom,
  getResizedTo,
  getTargetEnd,
  getTouchEdges,
  isMoveKey,
  ticksOf,
} from './liveView'

const T = UnixTime(1_800_000_000)
const MINUTE = UnixTime.MINUTE

describe(getEdgeAt.name, () => {
  it('takes an edge within reach outside the window', () => {
    expect(getEdgeAt(93, [100, 200], 8)).toEqual('from')
    expect(getEdgeAt(207, [100, 200], 8)).toEqual('to')
    expect(getEdgeAt(91, [100, 200], 8)).toEqual(undefined)
  })

  it('leaves the middle third of a narrow window to move it', () => {
    expect(getEdgeAt(103, [100, 112], 8)).toEqual('from')
    expect(getEdgeAt(106, [100, 112], 8)).toEqual(undefined)
    expect(getEdgeAt(109, [100, 112], 8)).toEqual('to')
  })

  it('leaves a window to move it within, reaching nothing inside', () => {
    expect(getEdgeAt(97, [100, 120], 8, 0)).toEqual('from')
    expect(getEdgeAt(102, [100, 120], 8, 0)).toEqual(undefined)
    expect(getEdgeAt(118, [100, 120], 8, 0)).toEqual(undefined)
    expect(getEdgeAt(123, [100, 120], 8, 0)).toEqual('to')
  })
})

describe(getTouchEdges.name, () => {
  it('takes an edge within reach of the strip side as within', () => {
    expect(getTouchEdges([0, 30], 300, 8)).toEqual([8, 30])
    expect(getTouchEdges([270, 299], 300, 8)).toEqual([270, 292])
  })

  it('takes it in by at most a third of the window', () => {
    expect(getTouchEdges([0, 12], 300, 8)).toEqual([4, 12])
    expect(getTouchEdges([292.5, 300], 300, 8)).toEqual([292.5, 297.5])
  })

  it('leaves edges away from the sides', () => {
    expect(getTouchEdges([100, 140], 300, 8)).toEqual([100, 140])
  })

  it('leaves a narrow window at a side its handle and its middle', () => {
    const live = getTouchEdges([292.5, 300], 300, 8)
    expect(getEdgeAt(299, live, 8, 0)).toEqual('to')
    expect(getEdgeAt(296, live, 8, 0)).toEqual(undefined)
    const left = getTouchEdges([0, 16], 300, 8)
    expect(getEdgeAt(2, left, 8, 0)).toEqual('from')
    expect(getEdgeAt(8, left, 8, 0)).toEqual(undefined)
  })
})

describe(getResizedFrom.name, () => {
  const buffer = { from: T - 4 * UnixTime.HOUR, to: T }

  it('holds the end, in whole minutes', () => {
    expect(
      getResizedFrom(
        15 * MINUTE,
        -5 * MINUTE - 10,
        15 * MINUTE,
        T - 3600,
        buffer,
        false,
      ),
    ).toEqual({ end: T - 3600, seconds: 20 * MINUTE, holdsEnd: true })
  })

  it('holds the end of a window at the newest block', () => {
    expect(
      getResizedFrom(
        15 * MINUTE,
        5 * MINUTE,
        15 * MINUTE,
        undefined,
        buffer,
        false,
      ),
    ).toEqual({ end: undefined, seconds: 10 * MINUTE, holdsEnd: true })
  })

  it('keeps where a move not yet read put the end', () => {
    // Methodology: ArrowLeft moved the window to end at T - 3690, then a
    // resize came before that was read
    const target = getResizedFrom(
      15 * MINUTE,
      -5 * MINUTE,
      15 * MINUTE,
      T - 3690,
      buffer,
      true,
    )
    expect(target).toEqual({ end: T - 3690, seconds: 20 * MINUTE, exact: true })
    expect(getTargetEnd(target, buffer)).toEqual(T - 3690)
  })

  it('stops at the start of the buffer', () => {
    expect(
      getResizedFrom(
        5 * MINUTE,
        -15 * MINUTE,
        5 * MINUTE,
        buffer.from + 10 * MINUTE + 30,
        buffer,
        false,
      ).seconds,
    ).toEqual(10 * MINUTE)
  })

  it('does not shorten a window dragged out at the start of the buffer', () => {
    // Methodology: a 31 min window at the oldest position, its end rounded
    // 12 s early to a bucket, leaves 30 min 48 s to the buffer's start
    expect(
      getResizedFrom(
        31 * MINUTE,
        -MINUTE,
        31 * MINUTE,
        buffer.from + 31 * MINUTE - 12,
        buffer,
        false,
      ).seconds,
    ).toEqual(31 * MINUTE)
  })

  it('does not shorten a window drawn shorter than asked, dragged out a little', () => {
    expect(
      getResizedFrom(
        30 * MINUTE + 48,
        -2,
        31 * MINUTE,
        buffer.from + 30 * MINUTE + 48,
        buffer,
        false,
      ).seconds,
    ).toEqual(31 * MINUTE)
  })

  it('does not shorten a window drawn shorter than asked, not dragged across', () => {
    // Methodology: 15 min asked, 10 min stored, the pointer moved only down
    const filling = { from: T - 10 * MINUTE, to: T }
    expect(
      getResizedFrom(10 * MINUTE, 0, 15 * MINUTE, undefined, filling, false)
        .seconds,
    ).toEqual(15 * MINUTE)
  })

  it('does not shorten a window longer than a filling buffer dragged out', () => {
    // Methodology: 15 min asked, 10 min stored, so 10 min drawn
    const filling = { from: T - 10 * MINUTE, to: T }
    expect(
      getResizedFrom(
        10 * MINUTE,
        -MINUTE,
        15 * MINUTE,
        undefined,
        filling,
        false,
      ).seconds,
    ).toEqual(15 * MINUTE)
  })
})

describe(getResizedTo.name, () => {
  const buffer = { from: T - 4 * UnixTime.HOUR, to: T }
  it('holds the start, in whole minutes', () => {
    expect(getResizedTo(T - 3600 + 7 * MINUTE + 5, T - 3600, buffer)).toEqual({
      end: T - 3600 + 7 * MINUTE,
      seconds: 7 * MINUTE,
      exact: true,
    })
  })

  it('holds the start of a live window dragged in from the right', () => {
    const target = getResizedTo(T - 2 * MINUTE, T - 3600, buffer)
    expect(target).toEqual({
      end: T - 2 * MINUTE,
      seconds: 58 * MINUTE,
      exact: true,
    })
    expect(getTargetEnd(target, buffer)).toEqual(T - 2 * MINUTE)
  })

  it('stays short of the newest block when its length rounds up to it', () => {
    const target = getResizedTo(T - 1, T - 10 * MINUTE, buffer)
    expect(target).toEqual({
      end: T - MINUTE,
      seconds: 9 * MINUTE,
      exact: true,
    })
    expect(getMoveEnd(target, buffer, 12)).not.toEqual(undefined)
  })

  it('follows the newest block once it reaches it, not short of it', () => {
    expect(getResizedTo(T, T - 10 * MINUTE, buffer)).toEqual({
      end: undefined,
      seconds: 10 * MINUTE,
      exact: true,
    })
    expect(getResizedTo(T - MINUTE, T - 10 * MINUTE, buffer)).toEqual({
      end: T - MINUTE,
      seconds: 9 * MINUTE,
      exact: true,
    })
  })

  it('keeps at least the shortest preset', () => {
    expect(getResizedTo(T - 3590, T - 3600, buffer).seconds).toEqual(5 * MINUTE)
  })
})

describe(getTargetEnd.name, () => {
  it('keeps an exact end within a buffer that has moved on', () => {
    const buffer = { from: T - 4 * UnixTime.HOUR + 60, to: T }
    expect(
      getTargetEnd(
        { end: T - 4 * UnixTime.HOUR + 900, seconds: 900, exact: true },
        buffer,
      ),
    ).toEqual(T - 4 * UnixTime.HOUR + 960)
  })
})

describe(getKeyLength.name, () => {
  const buffer = { from: T - 4 * UnixTime.HOUR, to: T }

  it('lengthens back and shortens forward by a tenth, in whole minutes', () => {
    expect(getKeyLength('ArrowLeft', 15 * MINUTE, T, buffer)).toEqual(
      17 * MINUTE,
    )
    expect(getKeyLength('ArrowRight', 15 * MINUTE, T, buffer)).toEqual(
      14 * MINUTE,
    )
  })

  it('changes the shortest length by a whole minute', () => {
    expect(getKeyLength('ArrowUp', 5 * MINUTE, T, buffer)).toEqual(5 * MINUTE)
    expect(getKeyLength('ArrowDown', 5 * MINUTE, T, buffer)).toEqual(6 * MINUTE)
  })

  it('stops at the start of the buffer', () => {
    expect(
      getKeyLength('ArrowLeft', 20 * MINUTE, buffer.from + 21 * MINUTE, buffer),
    ).toEqual(21 * MINUTE)
  })

  it('does not shorten a window it lengthens at the start of the buffer', () => {
    // Methodology: the server rounds a 16 min window's end to 959 s into it
    expect(
      getKeyLength('ArrowLeft', 16 * MINUTE, buffer.from + 959, buffer),
    ).toEqual(16 * MINUTE)
  })

  it('resizes with no other key', () => {
    expect(getKeyLength('Home', 15 * MINUTE, T, buffer)).toEqual(undefined)
  })
})

describe(getMoveEnd.name, () => {
  const buffer = { from: T - 4 * UnixTime.HOUR, to: T }

  it('follows the newest block when moved onto it, not short of it', () => {
    expect(getMoveEnd({ end: T, seconds: 300 }, buffer, 12)).toEqual(undefined)
    expect(getMoveEnd({ end: T - 14, seconds: 300 }, buffer, 12)).toEqual(
      Math.ceil((T - 14) / 12) * 12,
    )
  })

  it('returns to the newest block with a key step back and one forward', () => {
    const asked = (end: number | undefined) =>
      getMoveEnd({ end, seconds: 900 }, buffer, 12)
    const back = asked(getKeyEnd('ArrowLeft', T - 5, buffer, 900))
    expect(back).not.toEqual(undefined)
    expect(asked(getKeyEnd('ArrowRight', back ?? 0, buffer, 900))).toEqual(
      undefined,
    )
  })

  it('ends a window looked back on on a bucket', () => {
    expect(getMoveEnd({ end: T - 100, seconds: 300 }, buffer, 12)).toEqual(
      Math.ceil((T - 100) / 12) * 12,
    )
  })

  it('keeps a resized window off the newest block, however close', () => {
    expect(
      getMoveEnd({ end: T - 120, seconds: 3600, exact: true }, buffer, 24),
    ).toEqual(T - 120 - ((T - 120) % 24))
    expect(
      getMoveEnd({ end: T, seconds: 3600, exact: true }, buffer, 24),
    ).toEqual(undefined)
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

  it('follows the newest block only once it reaches it', () => {
    expect(clampTo(T - 1, buffer, 900)).toEqual(T - 1)
    expect(clampTo(T, buffer, 900)).toEqual(undefined)
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
