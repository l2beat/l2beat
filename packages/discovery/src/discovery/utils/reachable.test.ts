import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { EntryParameters, ReceivedPermission } from '../output/types'
import { getReachableEntries, mapToReferenceNodes } from './reachable'

function createMockEntry(
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
    const entryA = createMockEntry(ADDRESSES.A, { ref: ADDRESSES.B })
    const entryB = createMockEntry(ADDRESSES.B, { ref: ADDRESSES.D })
    const entryC = createMockEntry(ADDRESSES.C, { ref: ADDRESSES.D })
    const entryD = createMockEntry(
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
    const entryE = createMockEntry(ADDRESSES.E)
    const entryF = createMockEntry(
      ADDRESSES.F,
      {},
      {
        directlyReceivedPermissions: [
          { permission: 'upgrade', from: entryD.address },
        ],
      },
    )
    const entryG = createMockEntry(
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

describe(getReachableEntries.name, () => {
  it('should return everything but entry E', () => {
    // Base
    const entryA = createMockEntry(ADDRESSES.A, { ref: ADDRESSES.C })
    const entryB = createMockEntry(ADDRESSES.B, { ref: ADDRESSES.C })
    // Shared
    const entryC = createMockEntry(ADDRESSES.C, { ref: ADDRESSES.D })
    const entryD = createMockEntry(ADDRESSES.D)
    // Not reachable
    const entryE = createMockEntry(ADDRESSES.E)

    const entries = [entryA, entryB, entryC, entryD, entryE]
    const entrypoints = [entryA.address, entryB.address]

    const result = getReachableEntries(entries, entrypoints)
    expect(result).toEqual([entryA, entryB, entryC, entryD])
  })

  /*
   * Single node test case - simplest possible scenario
   *
   *    ┌───┐
   *    │ A │ (entrypoint)
   *    └───┘
   *
   * Expected: Only A should be returned
   */
  it('should handle single node with no references', () => {
    const entryA = createMockEntry(ADDRESSES.A)
    const entries = [entryA]
    const entrypoints = [entryA.address]

    const result = getReachableEntries(entries, entrypoints)
    expect(result).toEqual([entryA])
  })

  /*
   * Simple linear chain test case
   *
   *    ┌───┐ ref  ┌───┐ ref  ┌───┐
   *    │ A ├─────►│ B ├─────►│ C │
   *    └───┘      └───┘      └───┘
   *      ▲
   *   entrypoint
   *
   * Expected: A, B, C should all be returned
   */
  it('should handle simple linear chain', () => {
    const entryA = createMockEntry(ADDRESSES.A, { ref: ADDRESSES.B })
    const entryB = createMockEntry(ADDRESSES.B, { ref: ADDRESSES.C })
    const entryC = createMockEntry(ADDRESSES.C)

    const entries = [entryA, entryB, entryC]
    const entrypoints = [entryA.address]

    const result = getReachableEntries(entries, entrypoints)
    expect(result).toEqual([entryA, entryB, entryC])
  })

  /*
   * Diamond pattern test case
   *
   *         ┌───┐
   *    ┌───►│ B │
   *    │    └─┬─┘
   *    │      │
   *  ┌─┴─┐    │ ref
   *  │ A │    │
   *  └─┬─┘    │
   *    │      │
   *    │    ┌─▼─┐
   *    └───►│ C │
   *         └─┬─┘
   *           │
   *           │ ref
   *           ▼
   *         ┌───┐
   *         │ D │
   *         └───┘
   *    ▲
   *   entrypoint
   *
   * Expected: A, B, C, D should all be returned
   */
  it('should handle diamond pattern with convergence', () => {
    const entryA = createMockEntry(ADDRESSES.A, {
      refs: [ADDRESSES.B, ADDRESSES.C],
    })
    const entryB = createMockEntry(ADDRESSES.B, { ref: ADDRESSES.D })
    const entryC = createMockEntry(ADDRESSES.C, { ref: ADDRESSES.D })
    const entryD = createMockEntry(ADDRESSES.D)

    const entries = [entryA, entryB, entryC, entryD]
    const entrypoints = [entryA.address]

    const result = getReachableEntries(entries, entrypoints)
    expect(result).toEqual([entryA, entryB, entryC, entryD])
  })

  /*
   * Circular reference test case
   *
   *    ┌───┐ ref  ┌───┐ ref  ┌───┐
   *    │ A ├─────►│ B ├─────►│ C │
   *    └─▲─┘      └───┘      └─┬─┘
   *      │                     │
   *      └─────────────────────┘
   *               ref
   *      ▲
   *   entrypoint
   *
   * Expected: A, B, C should all be returned (no infinite loop)
   */
  it('should handle circular references without infinite loop', () => {
    const entryA = createMockEntry(ADDRESSES.A, { ref: ADDRESSES.B })
    const entryB = createMockEntry(ADDRESSES.B, { ref: ADDRESSES.C })
    const entryC = createMockEntry(ADDRESSES.C, { ref: ADDRESSES.A })

    const entries = [entryA, entryB, entryC]
    const entrypoints = [entryA.address]

    const result = getReachableEntries(entries, entrypoints)
    expect(result).toEqual([entryA, entryB, entryC])
  })

  /*
   * Multiple disconnected entrypoints test case
   *
   *    ┌───┐ ref  ┌───┐     ┌───┐ ref  ┌───┐
   *    │ A ├─────►│ B │     │ C ├─────►│ D │
   *    └───┘      └───┘     └───┘      └───┘
   *      ▲                    ▲
   *   entrypoint          entrypoint
   *
   *                 ┌───┐ (isolated)
   *                 │ E │
   *                 └───┘
   *
   * Expected: A, B, C, D should be returned (E is isolated)
   */
  it('should handle multiple disconnected entrypoints', () => {
    const entryA = createMockEntry(ADDRESSES.A, { ref: ADDRESSES.B })
    const entryB = createMockEntry(ADDRESSES.B)
    const entryC = createMockEntry(ADDRESSES.C, { ref: ADDRESSES.D })
    const entryD = createMockEntry(ADDRESSES.D)
    const entryE = createMockEntry(ADDRESSES.E) // isolated

    const entries = [entryA, entryB, entryC, entryD, entryE]
    const entrypoints = [entryA.address, entryC.address]

    const result = getReachableEntries(entries, entrypoints)
    expect(result).toEqual([entryA, entryB, entryC, entryD])
  })

  /*
   * Complex permissions chain test case
   *
   *    ┌───┐ permission ┌───┐ ref  ┌───┐
   *    │ A ├───────────►│ B ├─────►│ C │
   *    └───┘  (upgrade) └─┬─┘      └───┘
   *      ▲                │
   *   entrypoint          │ permission
   *                       │ (act)
   *                       ▼
   *                     ┌───┐ ref  ┌───┐
   *                     │ D ├─────►│ E │
   *                     └───┘      └───┘
   *
   * Expected: A, B, C, D, E should all be returned
   */
  it('should handle complex permissions chain', () => {
    const entryA = createMockEntry(ADDRESSES.A)
    const entryB = createMockEntry(
      ADDRESSES.B,
      { ref: ADDRESSES.C },
      {
        receivedPermissions: [{ permission: 'upgrade', from: ADDRESSES.A }],
      },
    )
    const entryC = createMockEntry(ADDRESSES.C)
    const entryD = createMockEntry(
      ADDRESSES.D,
      { ref: ADDRESSES.E },
      {
        receivedPermissions: [{ permission: 'act', from: ADDRESSES.B }],
      },
    )
    const entryE = createMockEntry(ADDRESSES.E)

    const entries = [entryA, entryB, entryC, entryD, entryE]
    const entrypoints = [entryA.address]

    const result = getReachableEntries(entries, entrypoints)
    expect(result).toEqual([entryA, entryB, entryC, entryD, entryE])
  })

  /*
   * Star pattern test case - central hub with multiple spokes
   *
   *         ┌───┐
   *         │ B │
   *         └─▲─┘
   *           │ ref
   *    ┌───┐  │  ┌───┐
   *    │ A ├──┼─►│ C │
   *    └───┘  │  └───┘
   *      ▲    │
   *   entrypoint
   *           │ ref
   *         ┌─▼─┐
   *         │ D │
   *         └─┬─┘
   *           │ ref
   *           ▼
   *         ┌───┐
   *         │ E │
   *         └───┘
   *
   * Expected: A, B, C, D, E should all be returned
   */
  it('should handle star pattern with central hub', () => {
    const entryA = createMockEntry(ADDRESSES.A, {
      refs: [ADDRESSES.B, ADDRESSES.C, ADDRESSES.D],
    })
    const entryB = createMockEntry(ADDRESSES.B)
    const entryC = createMockEntry(ADDRESSES.C)
    const entryD = createMockEntry(ADDRESSES.D, { ref: ADDRESSES.E })
    const entryE = createMockEntry(ADDRESSES.E)

    const entries = [entryA, entryB, entryC, entryD, entryE]
    const entrypoints = [entryA.address]

    const result = getReachableEntries(entries, entrypoints)
    expect(result).toEqual([entryA, entryB, entryC, entryD, entryE])
  })

  /*
   * Isolated nodes test case - nodes unreachable from entrypoints
   *
   *    ┌───┐ ref  ┌───┐     ┌───┐ ref  ┌───┐
   *    │ A ├─────►│ B │     │ C ├─────►│ D │ (isolated)
   *    └───┘      └───┘     └───┘      └───┘
   *      ▲
   *   entrypoint
   *
   *                 ┌───┐ (isolated)
   *                 │ E │
   *                 └───┘
   *
   * Expected: Only A, B should be returned (C, D, E are isolated)
   */
  it('should exclude isolated nodes unreachable from entrypoints', () => {
    const entryA = createMockEntry(ADDRESSES.A, { ref: ADDRESSES.B })
    const entryB = createMockEntry(ADDRESSES.B)
    const entryC = createMockEntry(ADDRESSES.C, { ref: ADDRESSES.D }) // isolated chain
    const entryD = createMockEntry(ADDRESSES.D)
    const entryE = createMockEntry(ADDRESSES.E) // isolated single node

    const entries = [entryA, entryB, entryC, entryD, entryE]
    const entrypoints = [entryA.address]

    const result = getReachableEntries(entries, entrypoints)
    expect(result).toEqual([entryA, entryB])
  })

  /*
   * Empty entrypoints test case
   *
   *    ┌───┐ ref  ┌───┐ ref  ┌───┐
   *    │ A ├─────►│ B ├─────►│ C │
   *    └───┘      └───┘      └───┘
   *
   *    No entrypoints specified
   *
   * Expected: Empty array (nothing is reachable)
   */
  it('should return empty array when no entrypoints specified', () => {
    const entryA = createMockEntry(ADDRESSES.A, { ref: ADDRESSES.B })
    const entryB = createMockEntry(ADDRESSES.B, { ref: ADDRESSES.C })
    const entryC = createMockEntry(ADDRESSES.C)

    const entries = [entryA, entryB, entryC]
    const entrypoints: ChainSpecificAddress[] = []

    const result = getReachableEntries(entries, entrypoints)
    expect(result).toEqual([])
  })

  /*
   * Complex permissions with isolated nodes test case
   *
   *    ┌───┐ permission ┌───┐ ref  ┌───┐
   *    │ A ├───────────►│ B ├─────►│ C │
   *    └───┘  (upgrade) └─┬─┘      └───┘
   *      ▲                │
   *   entrypoint          │ directPermission
   *                       │ (act)
   *                       ▼
   *                     ┌───┐
   *                     │ D │
   *                     └───┘
   *
   *    ISOLATED NODES:
   *    ┌───┐ permission ┌───┐     ┌───┐ ref  ┌───┐
   *    │ E ├───────────►│ F │     │ G ├─────►│ ? │ (missing node)
   *    └───┘  (member)  └───┘     └───┘      └───┘
   *
   * Expected: A, B, C, D should be returned (E, F, G are isolated)
   */
  it('should handle complex permissions with isolated nodes', () => {
    const entryA = createMockEntry(ADDRESSES.A)
    const entryB = createMockEntry(
      ADDRESSES.B,
      { ref: ADDRESSES.C },
      {
        receivedPermissions: [{ permission: 'upgrade', from: ADDRESSES.A }],
        directlyReceivedPermissions: [{ permission: 'act', from: ADDRESSES.A }],
      },
    )
    const entryC = createMockEntry(ADDRESSES.C)
    const entryD = createMockEntry(ADDRESSES.D, undefined, {
      directlyReceivedPermissions: [{ permission: 'act', from: ADDRESSES.B }],
    })

    // Isolated nodes
    const entryE = createMockEntry(ADDRESSES.E) // isolated issuer
    const entryF = createMockEntry(ADDRESSES.F, undefined, {
      receivedPermissions: [{ permission: 'member', from: ADDRESSES.E }],
    })
    const entryG = createMockEntry(ADDRESSES.G, {
      ref: ChainSpecificAddress(
        'eth:0x9999999999999999999999999999999999999999',
      ), // missing node
    })

    const entries = [entryA, entryB, entryC, entryD, entryE, entryF, entryG]
    const entrypoints = [entryA.address]

    const result = getReachableEntries(entries, entrypoints)
    expect(result).toEqual([entryA, entryB, entryC, entryD])
  })
})
