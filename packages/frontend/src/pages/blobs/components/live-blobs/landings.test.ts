import { expect } from 'earl'
import { BATCH_STAGGER, LAND_AFTER } from './blocks/motion'
import { holdLimitMs } from './landings'

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
