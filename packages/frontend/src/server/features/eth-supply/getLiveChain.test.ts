import { expect } from 'earl'
import { getSlotStatuses } from './getLiveChain'

describe(getSlotStatuses.name, () => {
  it('settles each checkpoint epoch up to and including its first slot', () => {
    const slots = getSlotStatuses({
      firstSlot: 63,
      headSlot: 98,
      blockSlots: new Set([63, 64, 65, 96, 98]),
      finality: { finalizedEpoch: 2, justifiedEpoch: 3 },
    })

    expect(
      slots.filter((s) => s.status !== 'missed').map((s) => [s.slot, s.status]),
    ).toEqual([
      [63, 'finalized'],
      [64, 'finalized'],
      [65, 'justified'],
      [96, 'justified'],
      [98, 'proposed'],
    ])
    expect(slots.length).toEqual(36)
    expect(slots.find((s) => s.slot === 97)?.status).toEqual('missed')
  })
})
