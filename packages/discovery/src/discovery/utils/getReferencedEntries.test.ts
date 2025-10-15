import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { EntryParameters, ReceivedPermission } from '../output/types'
import { mapToReferenceNodes } from './getReferencedEntries'

function createMockEntry2(
  address: ChainSpecificAddress,
  values?: Record<string, any>,
  other?: {
    receivedPermissions?: ReceivedPermission[]
    directlyReceivedPermissions?: ReceivedPermission[]
  },
): EntryParameters {
  return {
    address: address,
    type: 'Contract',
    name: address.toString(),
    values,
    receivedPermissions: other?.receivedPermissions,
    directlyReceivedPermissions: other?.directlyReceivedPermissions,
  }
}

const ADDRESSES = {
  A: ChainSpecificAddress('eth:0x1111111111111111111111111111111111111111'),
  B: ChainSpecificAddress('eth:0x2222222222222222222222222222222222222222'),
  C: ChainSpecificAddress('eth:0x3333333333333333333333333333333333333333'),
  D: ChainSpecificAddress('eth:0x4444444444444444444444444444444444444444'),
  E: ChainSpecificAddress('eth:0x5555555555555555555555555555555555555555'),
  F: ChainSpecificAddress('eth:0x6666666666666666666666666666666666666666'),
  G: ChainSpecificAddress('eth:0x7777777777777777777777777777777777777777'),
}

describe(mapToReferenceNodes.name, () => {
  /*
   *    initial:
   *       A                B
   *     ┌───┐   ref      ┌───┐
   *     │ Y ├───────────►│ Y │
   *     └───┘            └─┬─┘
   *                        │
   *                        │
   *                        │ref
   * SHARED─MODULE          │
   * ┌──────────────────────┼────────────────────────────────────┐
   * │                      │                                    │
   * │          gives       ▼                                    │
   * │ ┌───┐  permission  ┌───┐   ref     ┌───┐                  │
   * │ │   ├─────────────►│ Y ├──────────►│ Y │                  │
   * │ └───┘ (eg. update) └──┬┘           └───┘                  │
   * │   C                  D│              E                    │
   * │                       │                                   │
   * │                       │   gives            gives          │
   * │                       │ permission ┌───┐ permission ┌───┐ │
   * │                       └───────────►│ Y │───────────►│ Y │ │
   * │                          (update)  └───┘   (act)    └───┘ │
   * │                                      F                G   │
   * └───────────────────────────────────────────────────────────┘
   *
   *  Y = should be part of project page / disco
   *  ref = references directly (value of some field)
   *
   *  Notes:
   *
   *  Contract C is irrelevant from the point of view of the project
   *  (think like this: contract D can receive multiple permissions from
   *  many other projects in Ethereum, but from the point of view of
   *  analysed project they're not relevant)
   *
   *  Remember, that in discovery, we have "receivedPermissions",
   *  not "issuedPermission", so the arrow is reversed.
   * 
   *  Btw, notice that G has two permissions, one direct and one indirect:
   *
   *  G: {
   *   receivedPermissions: [ update D via F ]
   *   directlyReceivedPermissions: [ act from F ]?
   *  }
   */
  it('correctly converts entries into graph with correct references', () => {
    const entryA = createMockEntry2(ADDRESSES.A, { ref: ADDRESSES.B })
    const entryB = createMockEntry2(ADDRESSES.B, { ref: ADDRESSES.D })
    const entryC = createMockEntry2(ADDRESSES.C, { ref: ADDRESSES.D })
    const entryD = createMockEntry2(
      ADDRESSES.D,
      { ref: ADDRESSES.E },
      {
        receivedPermissions: [
          {
            permission: 'upgrade',
            from: entryC.address,
          },
        ],
      },
    )
    const entryE = createMockEntry2(ADDRESSES.E)
    const entryF = createMockEntry2(
      ADDRESSES.F,
      {},
      {
        directlyReceivedPermissions: [
          { permission: 'upgrade', from: entryD.address },
        ],
      },
    )
    const entryG = createMockEntry2(
      ADDRESSES.G,
      {},
      {
        receivedPermissions: [
          {
            permission: 'upgrade',
            from: ChainSpecificAddress(entryD.address),
            via: [{ address: ChainSpecificAddress(ADDRESSES.F) }],
          },
        ],
        directlyReceivedPermissions: [
          { permission: 'act', from: ChainSpecificAddress(entryF.address) },
        ],
      },
    )

    const entries = [entryA, entryB, entryC, entryD, entryE, entryF, entryG]

    const result = mapToReferenceNodes(entries)
    expect(result).toEqualUnsorted([
      {
        address: entryA.address,
        references: [entryB.address],
      },
      {
        address: entryB.address,
        references: [entryD.address],
      },
      {
        address: entryC.address,
        references: [entryD.address],
      },
      {
        address: entryD.address,
        references: [entryE.address, entryF.address],
      },
      {
        address: entryE.address,
        references: [],
      },
      {
        address: entryF.address,
        references: [entryG.address],
      },
      {
        address: entryG.address,
        references: [],
      },
    ])
  })
})
