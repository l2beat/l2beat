import { expect } from 'earl'
import { LIVE_JUMP_SECONDS } from '~/utils/range/liveRanges'
import {
  advancePlayhead,
  CATCH_UP,
  getPlayheadTarget,
  shouldRedraw,
} from './useLivePlayhead'

describe(advancePlayhead.name, () => {
  it('catches up with the target no faster than allowed', () => {
    expect(advancePlayhead({ playhead: 100, at: 50 }, 110, 120, 52)).toEqual(
      100 + 2 * CATCH_UP,
    )
  })

  it('does not move back for a later target', () => {
    expect(advancePlayhead({ playhead: 100, at: 50 }, 95, 120, 52)).toEqual(100)
  })

  it('moves back to where the data ends', () => {
    // Methodology: a 4H window's data ends on a 96 s bucket, before where
    // the 5M window had got to
    expect(advancePlayhead({ playhead: 100, at: 50 }, 40, 40, 52)).toEqual(40)
  })

  it('jumps when far behind', () => {
    const target = 100 + LIVE_JUMP_SECONDS + 1

    expect(
      advancePlayhead({ playhead: 100, at: 50 }, target, target, 52),
    ).toEqual(target)
    expect(
      advancePlayhead({ playhead: 100, at: 50 }, target - 1, target, 52),
    ).toEqual(100 + 2 * CATCH_UP)
  })
})

describe(getPlayheadTarget.name, () => {
  it('trails the clock by the longest lag lately and a second', () => {
    expect(getPlayheadTarget(1005, 1010, [4, 7, 5])).toEqual(1002)
  })

  it('does not pass where the data ends', () => {
    expect(getPlayheadTarget(1000, 1010, [2])).toEqual(1000)
  })
})

describe(shouldRedraw.name, () => {
  it('draws the first window', () => {
    expect(shouldRedraw(undefined, 100, 3)).toEqual(true)
  })

  it('draws again once the window has moved far enough', () => {
    expect(shouldRedraw(100, 102.9, 3)).toEqual(false)
    expect(shouldRedraw(100, 103, 3)).toEqual(true)
  })

  it('draws again when the window moves back', () => {
    expect(shouldRedraw(100, 99.5, 3)).toEqual(true)
  })
})
