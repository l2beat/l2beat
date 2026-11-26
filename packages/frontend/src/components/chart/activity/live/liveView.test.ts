import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  CHASE_MS,
  chase,
  clampTo,
  getEdgeAt,
  getKeyEnd,
  getKeyLength,
  getLiveView,
  getMoveEnd,
  getResizedFrom,
  getResizedTo,
  getTargetEnd,
  getTouchEdges,
  holdsReads,
  isMoveKey,
  isRead,
  ticksOf,
} from './liveView'

const T = UnixTime(1_800_000_000)
const MINUTE = UnixTime.MINUTE

describe(chase.name, () => {
  it('covers the same share of what each edge has left', () => {
    // Methodology: after CHASE_MS, 1/e of the way is left: 1000/e = 367.9,
    // and of the left edge's 400, 147.2
    const view = chase([0, 1000], [400, 2000], CHASE_MS)

    expect(view?.map(Math.round)).toEqual([253, 1632])
  })

  it('stays where it is with no time passed', () => {
    expect(chase([0, 1000], [400, 2000], 0)).toEqual([0, 1000])
  })

  it('is there within a 2000th of the window', () => {
    // Methodology: 900 / 2000 = 0.45 s
    expect(chase([100.4, 1000.4], [100, 1000], 0)).toEqual(undefined)
    expect(chase([100.5, 1000.5], [100, 1000], 0)).toEqual([100.5, 1000.5])
    expect(chase([100, 1000.5], [100, 1000], 0)).toEqual([100, 1000.5])
  })

  it('gets there from the far end of the buffer', () => {
    // Methodology: 4 h away from a 5 min window, a frame every 16 ms
    let view: [number, number] | undefined = [0, 300]
    let frames = 0
    while (view && frames < 1000) {
      view = chase(view, [14_400, 14_700], 16)
      frames++
    }

    expect(view).toEqual(undefined)
    expect(frames * 16 < 1200).toEqual(true)
  })
})

describe(isRead.name, () => {
  const read = { from: 100, to: 400, bucket: 2 }

  it('needs both edges of the view within the reads', () => {
    expect(isRead([100, 400], read)).toEqual(true)
    expect(isRead([99, 399], read)).toEqual(false)
    expect(isRead([110, 410], read)).toEqual(false)
  })

  it('lets a bar of the reads be missing on the right', () => {
    expect(isRead([102, 402], read)).toEqual(true)
    expect(isRead([103, 403], read)).toEqual(false)
  })

  it("takes the bar's size from the reads, not from the view's length", () => {
    // Methodology: a chain of 12 s blocks has 12 s bars in a 300 s view,
    // which would be drawn in 2 s ones
    const slow = { ...read, bucket: 12 }

    expect(isRead([111, 411], slow)).toEqual(true)
    expect(isRead([113, 413], slow)).toEqual(false)
  })

  it('has nothing without a view or a read', () => {
    expect(isRead(undefined, read)).toEqual(false)
    expect(isRead([100, 400], undefined)).toEqual(false)
  })
})

describe(getLiveView.name, () => {
  const read = { from: 1000, to: 5000, bucket: 2 }
  const live: [number, number] = [4700, 5000]

  it("shows the window read's own view whatever is read", () => {
    // Methodology: the clock has moved the window 3 s past the read's end
    const asked: [number, number] = [4703, 5003]

    expect(
      getLiveView({ asked, own: true, last: undefined, live, read }),
    ).toEqual({ view: asked, covered: true, kept: false })
  })

  it('shows a window the reads have', () => {
    expect(
      getLiveView({
        asked: [2000, 2300],
        own: false,
        last: live,
        live,
        read,
      }),
    ).toEqual({ view: [2000, 2300], covered: true, kept: false })
  })

  it('ends a window on the last bar read while the newest block is past it', () => {
    // Methodology: 12 s bars read up to 5000, the newest block at 5011. A
    // drag towards it asks for 5009: drawn as asked, 9 s of 300 would be
    // empty, 3% of the plot
    const slow = { ...read, bucket: 12 }

    expect(
      getLiveView({
        asked: [4709, 5009],
        own: false,
        last: [4600, 4900],
        live,
        read: slow,
      }),
    ).toEqual({ view: [4700, 5000], covered: true, kept: false })
    expect(
      getLiveView({
        asked: [4713, 5013],
        own: false,
        last: [4600, 4900],
        live,
        read: slow,
      }),
    ).toEqual({ view: [4600, 4900], covered: false, kept: true })
  })

  it('does not move a window before what is read to end on its last bar', () => {
    expect(
      getLiveView({
        asked: [1001, 5002],
        own: false,
        last: undefined,
        live,
        read,
      }),
    ).toEqual({ view: [1000, 5001], covered: true, kept: false })
  })

  it('stays where it was, asked for a window the reads lack', () => {
    expect(
      getLiveView({
        asked: [800, 1100],
        own: false,
        last: [1200, 1500],
        live,
        read,
      }),
    ).toEqual({ view: [1200, 1500], covered: false, kept: true })
  })

  it("falls back to the window read's own view once the reads lack the last one too", () => {
    expect(
      getLiveView({
        asked: [800, 1100],
        own: false,
        last: [700, 1000],
        live,
        read,
      }),
    ).toEqual({ view: live, covered: false, kept: false })
  })

  it('stays put when a key moves a new preset back before its bars are read', () => {
    // Methodology: 4H then 5M, the 5M read not there yet. The 4H read's 96 s
    // bars end 90 s before the newest block, so 5M one step (30 s) back ends
    // 60 s past them: drawn, a fifth of the plot would be empty
    const newest = T + 90
    const buffer = { from: T - 4 * UnixTime.HOUR, to: newest }
    const fourHours = { from: buffer.from - 96, to: T, bucket: 2 }
    const fiveMinutes = 5 * MINUTE
    const last: [number, number] = [T - fiveMinutes, T]
    const end = clampTo(
      getKeyEnd('ArrowLeft', newest, buffer, fiveMinutes),
      buffer,
      fiveMinutes,
    )
    if (end === undefined) throw new Error('Expected a window looked back to')

    expect(
      getLiveView({
        asked: [end - fiveMinutes, end],
        own: false,
        last,
        live: [T - 4 * UnixTime.HOUR, T],
        read: fourHours,
      }),
    ).toEqual({ view: last, covered: false, kept: true })
  })
})

describe(holdsReads.name, () => {
  const idle = { isRead: true, pending: false }
  const fetching = { isRead: true, pending: true }

  it('holds a window looked back to until both reads have come, in either order', () => {
    // Methodology: a tab shown again after long reads both anew. Each row
    // is the window read, then the buffer read
    const steps = (rows: [boolean, boolean][]) =>
      rows.map(([window, whole]) =>
        holdsReads({
          hovered: false,
          lookingBack: true,
          window: window ? fetching : idle,
          whole: { pending: whole },
        }),
      )

    // the buffer read comes first
    expect(
      steps([
        [true, true],
        [true, false],
        [false, false],
      ]),
    ).toEqual([true, true, false])
    // the window read comes first
    expect(
      steps([
        [true, true],
        [false, true],
        [false, false],
      ]),
    ).toEqual([true, true, false])
  })

  it("holds a window looked back to while another length's read is drawn", () => {
    expect(
      holdsReads({
        hovered: false,
        lookingBack: true,
        window: { isRead: false, pending: false },
        whole: { pending: false },
      }),
    ).toEqual(true)
  })

  it('holds nothing for reads on their way while following the newest block', () => {
    expect(
      holdsReads({
        hovered: false,
        lookingBack: false,
        window: fetching,
        whole: { pending: true },
      }),
    ).toEqual(false)
  })

  it("holds under the pointer once this window's data is read", () => {
    const whole = { pending: false }

    expect(
      holdsReads({ hovered: true, lookingBack: false, window: idle, whole }),
    ).toEqual(true)
    expect(
      holdsReads({
        hovered: true,
        lookingBack: false,
        window: { isRead: false, pending: true },
        whole,
      }),
    ).toEqual(false)
  })
})

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

  it('stays short of the newest block when rounding up would reach it', () => {
    expect(getMoveEnd({ end: T - 5, seconds: 300 }, buffer, 12)).toEqual(T - 12)
    expect(getMoveEnd({ end: T - 12, seconds: 3600 }, buffer, 24)).toEqual(
      T - 24,
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

  it('steps forward in whole steps from the newest block as it moves on', () => {
    // Methodology: a step back read before the newest block moved on 5 s
    const moved = { ...buffer, to: T + 5 }
    expect(getKeyEnd('ArrowRight', T - 90, moved, 900)).toEqual(T + 5)
    expect(getKeyEnd('ArrowRight', T - 1800, moved, 900)).toEqual(
      T + 5 - 1800 + 90,
    )
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
