import { expect } from 'earl'
import { SLIDE_TIME } from './blocks/beltPosition'
import { BATCH_STAGGER, LAND_AFTER } from './blocks/motion'
import {
  firstHeld,
  type Held,
  holdBack,
  holdLimitMs,
  secondsUntilSlideEnds,
} from './landings'

// A block of n one-blob batches lands its last one latest; the number must
// still be waiting for it then, whatever n the blob limit allows.
describe(holdLimitMs.name, () => {
  it('outlasts the landing of the last of as many batches as blobs', () => {
    for (const blobs of [1, 6, 21, 48]) {
      const lastLandsMs = 1000 * ((blobs - 1) * BATCH_STAGGER + LAND_AFTER)
      expect(holdLimitMs(blobs)).toBeGreaterThan(lastLandsMs)
    }
  })
})

// Methodology: the clock is put at a progress into a slot, in slots, and the
// wait is checked against where the belt's slide into that slot ends.
describe(secondsUntilSlideEnds.name, () => {
  it('waits for the slide under way to end', () => {
    const progress = 1000 + SLIDE_TIME / 2 / 12
    expect(secondsUntilSlideEnds(progress)).toBeCloseTo(SLIDE_TIME / 2, 6)
  })

  it("waits for the next slide once this slot's is over", () => {
    expect(secondsUntilSlideEnds(1000.5)).toBeCloseTo(6 + SLIDE_TIME, 6)
  })
})

// Methodology: a number at 100 blobs over the window at slot 1000 is told the
// totals that one more block, or one taken back, make of it.
describe(holdBack.name, () => {
  const held: Held = {
    stamp: 1000,
    total: 100,
    blockBlobs: 0,
    arriving: 0,
    departed: 0,
  }

  it('holds back what a new block brought, and what left the window with it', () => {
    expect(holdBack(held, 1001, 103, 5, 7, 1001)).toEqual({
      stamp: 1001,
      total: 103,
      blockBlobs: 7,
      arriving: 5,
      departed: 2,
    })
  })

  it('lets go of all it held when the chain takes its newest block back', () => {
    const arriving = holdBack(held, 1001, 103, 5, 7, 1001)

    expect(holdBack(arriving, 1000, 100, 0, 0, 1001)).toEqual(held)
  })

  it('waits for the newest block to land when the first data comes after the number started', () => {
    const empty = firstHeld(undefined, 0, 0, 0, 1000)

    expect(holdBack(empty, 1000, 103, 5, 7, 1000).arriving).toEqual(5)
    expect(holdBack(empty, 1000, 103, 5, 7, 1002).arriving).toEqual(0)
  })
})

describe(firstHeld.name, () => {
  it('waits for the newest block to land when the number starts as the belt drops it', () => {
    expect(firstHeld(1000, 103, 5, 7, 1000).arriving).toEqual(5)
    expect(firstHeld(1000, 103, 5, 7, 1001).arriving).toEqual(5)
  })

  it('starts whole when the newest block is past landing', () => {
    expect(firstHeld(1000, 103, 5, 7, 1002).arriving).toEqual(0)
  })
})
