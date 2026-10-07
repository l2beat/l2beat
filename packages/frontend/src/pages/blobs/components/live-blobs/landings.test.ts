import { expect } from 'earl'
import { BATCH_STAGGER, LAND_AFTER } from './blocks/motion'
import { firstHeld, type Held, holdBack, holdLimitMs } from './landings'

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

// Methodology: a number at 100 blobs over the hour at slot 1000 is told the
// totals that one more block, or one taken back, make of it.
describe(holdBack.name, () => {
  const held: Held = {
    stamp: 1000,
    total: 100,
    blockBlobs: 0,
    arriving: 0,
    departed: 0,
  }

  it('holds back what a new block brought, and what left the hour with it', () => {
    expect(holdBack(held, 1001, 103, 5, 7)).toEqual({
      stamp: 1001,
      total: 103,
      blockBlobs: 7,
      arriving: 5,
      departed: 2,
    })
  })

  it('lets go of all it held when the chain takes its newest block back', () => {
    const arriving = holdBack(held, 1001, 103, 5, 7)

    expect(holdBack(arriving, 1000, 100, 0, 0)).toEqual(held)
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
