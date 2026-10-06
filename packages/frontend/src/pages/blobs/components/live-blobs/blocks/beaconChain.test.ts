import { expect } from 'earl'
import { type ChainBlock, isSameBlock } from './beaconChain'

// Each case holds one block for a slot and checks it against what the server
// could answer for the same slot after the chain moved on.
describe(isSameBlock.name, () => {
  const proposed: ChainBlock = {
    slot: 100,
    status: 'proposed',
    blockNumber: 5,
    batches: [],
  }
  const missed: ChainBlock = { slot: 100, status: 'missed' }

  it('knows the block it holds', () => {
    expect(isSameBlock(proposed, { ...proposed, batches: [] })).toEqual(true)
    expect(isSameBlock(missed, { slot: 100, status: 'missed' })).toEqual(true)
  })

  it('tells a held block from the miss its slot turned into', () => {
    expect(isSameBlock(proposed, { slot: 100, status: 'missed' })).toEqual(
      false,
    )
  })

  it('tells a held miss from the block that filled its slot', () => {
    expect(isSameBlock(missed, { ...proposed, batches: [] })).toEqual(false)
  })

  it('tells a held block from another one in its slot', () => {
    expect(
      isSameBlock(proposed, { ...proposed, blockNumber: 4, batches: [] }),
    ).toEqual(false)
  })

  it('has nothing to match while the slot is not held', () => {
    expect(isSameBlock(undefined, { slot: 100, status: 'missed' })).toEqual(
      false,
    )
  })
})
