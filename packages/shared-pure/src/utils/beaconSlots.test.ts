import { expect } from 'earl'
import { SLOT_SECONDS, slotAt, slotStart } from './beaconSlots.js'

describe('beaconSlots', () => {
  describe(slotAt.name, () => {
    it('gives the slot a block of that time belongs to', () => {
      // A block's timestamp is its slot's start, the slot lasts SLOT_SECONDS
      const start = slotStart(12_000_000)

      expect(slotAt(start)).toEqual(12_000_000)
      expect(slotAt(start + SLOT_SECONDS - 1)).toEqual(12_000_000)
      expect(slotAt(start + SLOT_SECONDS)).toEqual(12_000_001)
    })
  })
})
