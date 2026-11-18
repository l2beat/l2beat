import { expect } from 'earl'
import { advancePlayhead } from './useLivePlayhead'

describe(advancePlayhead.name, () => {
  it('catches up with the target at most half again as fast as the clock', () => {
    expect(advancePlayhead({ playhead: 100, at: 50 }, 110, 120, 52)).toEqual(
      103,
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
    expect(advancePlayhead({ playhead: 100, at: 50 }, 300, 300, 52)).toEqual(
      300,
    )
  })
})
