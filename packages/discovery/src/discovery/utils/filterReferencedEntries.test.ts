import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { DiscoveryOutput, EntryParameters } from '../output/types'
import { filterReferencedEntries } from './filterReferencedEntries'

describe('filterReferencedEntries', () => {
  const mockConfigHash = Hash256.random()
  const mockTimestamp = 1234567890

  const ADDRESSES = {
    A: 'eth:0x1111111111111111111111111111111111111111',
    B: 'eth:0x2222222222222222222222222222222222222222',
    C: 'eth:0x3333333333333333333333333333333333333333',
    D: 'eth:0x4444444444444444444444444444444444444444',
    E: 'eth:0x5555555555555555555555555555555555555555',
    F: 'eth:0x6666666666666666666666666666666666666666',
    G: 'eth:0x7777777777777777777777777777777777777777',
    H: 'eth:0x8888888888888888888888888888888888888888',
    I: 'eth:0x9999999999999999999999999999999999999999',
    J: 'eth:0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',

    ARB_A: 'arb1:0x1111111111111111111111111111111111111111',
    ARB_B: 'arb1:0x2222222222222222222222222222222222222222',
    OPT_A: 'oeth:0x3333333333333333333333333333333333333333',

    BASE_A: 'base:0x4444444444444444444444444444444444444444',
    NONEXISTENT: 'eth:0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
  } as const

  function createMockDiscovery(entries: EntryParameters[]): DiscoveryOutput {
    return {
      name: 'test-project',
      timestamp: mockTimestamp,
      configHash: mockConfigHash,
      entries,
      abis: {},
      usedTemplates: {},
      usedBlockNumbers: {},
    }
  }

  function createMockEntry(
    address: string,
    type: 'Contract' | 'EOA' = 'Contract',
    values?: Record<string, any>,
    name?: string,
  ): EntryParameters {
    return {
      address: ChainSpecificAddress(address),
      type,
      name,
      values,
      proxyType: type === 'EOA' ? 'EOA' : undefined,
    }
  }

  function createMockReferences(addresses: string[]): EntryParameters[] {
    return addresses.map((address) =>
      createMockEntry(
        address,
        'Contract',
        {},
        `Reference-${address.slice(-4)}`,
      ),
    )
  }

  describe('direct references', () => {
    it('should include entries that are direct references', () => {
      const entryA = createMockEntry(ADDRESSES.A, 'Contract', {}, 'EntryA')
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'EntryB')
      const entryC = createMockEntry(ADDRESSES.C, 'Contract', {}, 'EntryC')

      const discovery = createMockDiscovery([entryA, entryB, entryC])
      const references = createMockReferences([ADDRESSES.A])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(1)
      expect(result.entries[0]?.address).toEqual(entryA.address)
    })

    it('should include multiple direct references', () => {
      const entryA = createMockEntry(ADDRESSES.A, 'Contract', {}, 'EntryA')
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'EntryB')
      const entryC = createMockEntry(ADDRESSES.C, 'Contract', {}, 'EntryC')

      const discovery = createMockDiscovery([entryA, entryB, entryC])
      const references = createMockReferences([ADDRESSES.A, ADDRESSES.C])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(2)
      expect(result.entries.map((e) => e.address)).toEqual([
        entryA.address,
        entryC.address,
      ])
    })
  })

  describe('indirect references', () => {
    it('should include entries referenced by entrypoint contract values', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          referencedContract: ADDRESSES.B,
        },
        'EntryA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'EntryB')
      const entryC = createMockEntry(ADDRESSES.C, 'Contract', {}, 'EntryC')

      const discovery = createMockDiscovery([entryA, entryB, entryC])
      const references = createMockReferences([ADDRESSES.A])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(2)
      expect(result.entries.map((e) => e.address)).toEqual([
        entryA.address,
        entryB.address,
      ])
    })

    it('should follow transitive references', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          referencedContract: ADDRESSES.B,
        },
        'EntryA',
      )
      const entryB = createMockEntry(
        ADDRESSES.B,
        'Contract',
        {
          anotherReference: ADDRESSES.C,
        },
        'EntryB',
      )
      const entryC = createMockEntry(ADDRESSES.C, 'Contract', {}, 'EntryC')
      const entryD = createMockEntry(
        'eth:0x4444444444444444444444444444444444444444',
        'Contract',
        {},
        'EntryD',
      )

      const discovery = createMockDiscovery([entryA, entryB, entryC, entryD])
      const references = createMockReferences([ADDRESSES.A])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(3)
      expect(result.entries.map((e) => e.address)).toEqual([
        entryA.address,
        entryB.address,
        entryC.address,
      ])
    })

    it('should handle circular references without infinite loops', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          referencedContract: ADDRESSES.B,
        },
        'EntryA',
      )
      const entryB = createMockEntry(
        ADDRESSES.B,
        'Contract',
        {
          backReference: ADDRESSES.A,
        },
        'EntryB',
      )

      const discovery = createMockDiscovery([entryA, entryB])
      const references = createMockReferences([ADDRESSES.A])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(2)
      expect(result.entries.map((e) => e.address)).toEqual([
        entryA.address,
        entryB.address,
      ])
    })
  })

  describe('complex value structures', () => {
    it('should extract addresses from arrays', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          addressArray: [ADDRESSES.B, ADDRESSES.C],
        },
        'EntryA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'EntryB')
      const entryC = createMockEntry(ADDRESSES.C, 'Contract', {}, 'EntryC')
      const entryD = createMockEntry(
        'eth:0x4444444444444444444444444444444444444444',
        'Contract',
        {},
        'EntryD',
      )

      const discovery = createMockDiscovery([entryA, entryB, entryC, entryD])
      const references = createMockReferences([ADDRESSES.A])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(3)
      expect(result.entries.map((e) => e.address)).toEqual([
        entryA.address,
        entryB.address,
        entryC.address,
      ])
    })

    it('should extract addresses from nested objects', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          nestedObject: {
            innerAddress: ADDRESSES.B,
            anotherLevel: {
              deepAddress: ADDRESSES.C,
            },
          },
        },
        'EntryA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'EntryB')
      const entryC = createMockEntry(ADDRESSES.C, 'Contract', {}, 'EntryC')
      const entryD = createMockEntry(
        'eth:0x4444444444444444444444444444444444444444',
        'Contract',
        {},
        'EntryD',
      )

      const discovery = createMockDiscovery([entryA, entryB, entryC, entryD])
      const references = createMockReferences([ADDRESSES.A])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(3)
      expect(result.entries.map((e) => e.address)).toEqual([
        entryA.address,
        entryB.address,
        entryC.address,
      ])
    })

    it('should extract addresses from mixed array and object structures', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          complexStructure: [
            {
              address1: ADDRESSES.B,
            },
            [
              ADDRESSES.C,
              {
                address2: 'eth:0x4444444444444444444444444444444444444444',
              },
            ],
          ],
        },
        'EntryA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'EntryB')
      const entryC = createMockEntry(ADDRESSES.C, 'Contract', {}, 'EntryC')
      const entryD = createMockEntry(
        'eth:0x4444444444444444444444444444444444444444',
        'Contract',
        {},
        'EntryD',
      )
      const entryE = createMockEntry(
        'eth:0x5555555555555555555555555555555555555555',
        'Contract',
        {},
        'EntryE',
      )

      const discovery = createMockDiscovery([
        entryA,
        entryB,
        entryC,
        entryD,
        entryE,
      ])
      const references = createMockReferences([ADDRESSES.A])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(4)
      expect(result.entries.map((e) => e.address)).toEqual([
        entryA.address,
        entryB.address,
        entryC.address,
        entryD.address,
      ])
    })
  })

  describe('edge cases', () => {
    it('should handle empty discovery', () => {
      const discovery = createMockDiscovery([])
      const references = createMockReferences([])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(0)
    })

    it('should handle empty references', () => {
      const entryA = createMockEntry(ADDRESSES.A, 'Contract', {}, 'EntryA')
      const discovery = createMockDiscovery([entryA])
      const references = createMockReferences([])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(0)
    })

    it('should handle entries with no values', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        undefined,
        'EntryA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'EntryB')

      const discovery = createMockDiscovery([entryA, entryB])
      const references = createMockReferences([ADDRESSES.A])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(1)
      expect(result.entries[0]?.address).toEqual(entryA.address)
    })

    it('should handle entries with empty values', () => {
      const entryA = createMockEntry(ADDRESSES.A, 'Contract', {}, 'EntryA')
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'EntryB')

      const discovery = createMockDiscovery([entryA, entryB])
      const references = createMockReferences([ADDRESSES.A])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(1)
      expect(result.entries[0]?.address).toEqual(entryA.address)
    })

    it('should ignore non-address strings', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          nonAddressString: 'some random string',
          hexString: '0x1234567890abcdef',
          invalidAddress: 'eth:0x123', // too short
          numberString: '12345',
          booleanValue: true,
        },
        'EntryA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'EntryB')

      const discovery = createMockDiscovery([entryA, entryB])
      const references = createMockReferences([ADDRESSES.A])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(1)
      expect(result.entries[0]?.address).toEqual(entryA.address)
    })

    it('should handle references to non-existent entries', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          existingReference: ADDRESSES.B,
          nonExistentReference: ADDRESSES.NONEXISTENT,
        },
        'EntryA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'EntryB')

      const discovery = createMockDiscovery([entryA, entryB])
      const references = createMockReferences([ADDRESSES.A])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(2)
      expect(result.entries.map((e) => e.address)).toEqual([
        entryA.address,
        entryB.address,
      ])
    })

    it('should handle EOA entries', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          eoaReference: ADDRESSES.B,
        },
        'EntryA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'EOA', undefined, 'EntryB')

      const discovery = createMockDiscovery([entryA, entryB])
      const references = createMockReferences([ADDRESSES.A])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(2)
      expect(result.entries.map((e) => e.address)).toEqual([
        entryA.address,
        entryB.address,
      ])
    })
  })

  describe('different chain addresses', () => {
    it('should handle addresses from different chains', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          l2Reference: ADDRESSES.ARB_B,
          optimismReference: ADDRESSES.OPT_A,
        },
        'EntryA',
      )
      const entryB = createMockEntry(ADDRESSES.ARB_B, 'Contract', {}, 'EntryB')
      const entryC = createMockEntry(ADDRESSES.OPT_A, 'Contract', {}, 'EntryC')
      const entryD = createMockEntry(ADDRESSES.BASE_A, 'Contract', {}, 'EntryD')

      const discovery = createMockDiscovery([entryA, entryB, entryC, entryD])
      const references = createMockReferences([ADDRESSES.A])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(3)
      expect(result.entries.map((e) => e.address)).toEqual([
        entryA.address,
        entryB.address,
        entryC.address,
      ])
    })
  })

  describe('metadata preservation', () => {
    it('should preserve all discovery metadata', () => {
      const entryA = createMockEntry(ADDRESSES.A, 'Contract', {}, 'EntryA')

      const originalDiscovery = createMockDiscovery([entryA])
      originalDiscovery.blockNumber = 12345
      originalDiscovery.sharedModules = ['shared-module']
      originalDiscovery.permissionsConfigHash = Hash256.random()

      const references = createMockReferences([ADDRESSES.A])

      const result = filterReferencedEntries(references, originalDiscovery)

      expect(result.name).toEqual(originalDiscovery.name)
      expect(result.timestamp).toEqual(originalDiscovery.timestamp)
      expect(result.configHash).toEqual(originalDiscovery.configHash)
      expect(result.blockNumber).toEqual(originalDiscovery.blockNumber)
      expect(result.sharedModules).toEqual(originalDiscovery.sharedModules)
      expect(result.permissionsConfigHash).toEqual(
        originalDiscovery.permissionsConfigHash,
      )
      expect(result.abis).toEqual(originalDiscovery.abis)
      expect(result.usedTemplates).toEqual(originalDiscovery.usedTemplates)
      expect(result.usedBlockNumbers).toEqual(
        originalDiscovery.usedBlockNumbers,
      )
    })
  })

  describe('complex scenarios', () => {
    it('should handle duplicate references in reference list', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          referencedContract: ADDRESSES.B,
        },
        'EntryA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'EntryB')
      const entryC = createMockEntry(ADDRESSES.C, 'Contract', {}, 'EntryC')

      const discovery = createMockDiscovery([entryA, entryB, entryC])

      // Create references with duplicates
      const references = [
        ...createMockReferences([ADDRESSES.A]),
        ...createMockReferences([ADDRESSES.A]), // duplicate
        ...createMockReferences([ADDRESSES.C]),
      ]

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(3) // Should include A, B (referenced by A), and C
      expect(result.entries.map((e) => e.address)).toEqual([
        entryA.address,
        entryB.address,
        entryC.address,
      ])
    })

    it('should handle complex multi-level reference chains with multiple entry points', () => {
      // Create a complex reference graph:
      // RefA -> EntryA -> EntryB -> EntryD
      // RefC -> EntryC -> EntryE -> EntryF
      // EntryB -> EntryC (creates cross-reference)
      // EntryG is unreferenced

      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          nextContract: ADDRESSES.B,
        },
        'EntryA',
      )
      const entryB = createMockEntry(
        ADDRESSES.B,
        'Contract',
        {
          targetContract: ADDRESSES.D,
          crossReference: ADDRESSES.C,
        },
        'EntryB',
      )
      const entryC = createMockEntry(
        ADDRESSES.C,
        'Contract',
        {
          chainedContract: ADDRESSES.E,
        },
        'EntryC',
      )
      const entryD = createMockEntry(ADDRESSES.D, 'Contract', {}, 'EntryD')
      const entryE = createMockEntry(
        ADDRESSES.E,
        'Contract',
        {
          finalContract: ADDRESSES.F,
        },
        'EntryE',
      )
      const entryF = createMockEntry(ADDRESSES.F, 'Contract', {}, 'EntryF')
      const entryG = createMockEntry(
        ADDRESSES.G,
        'Contract',
        {},
        'EntryG', // This should not be included
      )

      const discovery = createMockDiscovery([
        entryA,
        entryB,
        entryC,
        entryD,
        entryE,
        entryF,
        entryG,
      ])
      const references = createMockReferences([
        ADDRESSES.A, // RefA -> EntryA
        ADDRESSES.C, // RefC -> EntryC
      ])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(6) // Should include A, B, C, D, E, F but not G
      expect(result.entries.map((e) => e.address)).toEqual([
        entryA.address,
        entryB.address,
        entryC.address,
        entryD.address,
        entryE.address,
        entryF.address,
      ])
    })

    it('should handle references with nested array and object structures containing duplicates', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          multipleReferences: [
            ADDRESSES.B,
            ADDRESSES.B, // duplicate in array
            {
              nestedRef: ADDRESSES.C,
              anotherNested: {
                deepRef: ADDRESSES.B, // duplicate reference
              },
            },
          ],
          objectWithDuplicates: {
            ref1: ADDRESSES.C, // duplicate reference
            ref2: ADDRESSES.D,
          },
        },
        'EntryA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'EntryB')
      const entryC = createMockEntry(ADDRESSES.C, 'Contract', {}, 'EntryC')
      const entryD = createMockEntry(ADDRESSES.D, 'Contract', {}, 'EntryD')
      const entryE = createMockEntry(
        ADDRESSES.E,
        'Contract',
        {},
        'EntryE', // This should not be included
      )

      const discovery = createMockDiscovery([
        entryA,
        entryB,
        entryC,
        entryD,
        entryE,
      ])
      const references = createMockReferences([ADDRESSES.A])

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(4) // Should include A, B, C, D but not E
      expect(result.entries.map((e) => e.address)).toEqual([
        entryA.address,
        entryB.address,
        entryC.address,
        entryD.address,
      ])
    })

    it('should handle mixed EOA and Contract references with complex chains', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          eoaReference: ADDRESSES.B,
          contractReference: ADDRESSES.C,
        },
        'EntryA',
      )
      const eoaB = createMockEntry(ADDRESSES.B, 'EOA', undefined, 'EOAB')
      const entryC = createMockEntry(
        ADDRESSES.C,
        'Contract',
        {
          backToEOA: ADDRESSES.B, // duplicate reference to EOA
          chainedContract: ADDRESSES.D,
        },
        'EntryC',
      )
      const entryD = createMockEntry(ADDRESSES.D, 'Contract', {}, 'EntryD')

      const discovery = createMockDiscovery([entryA, eoaB, entryC, entryD])

      // Mix of contract and EOA references
      const references = [
        createMockEntry(ADDRESSES.A, 'Contract', {}, 'RefA'),
        createMockEntry(ADDRESSES.B, 'EOA', undefined, 'RefEOA'),
      ]

      const result = filterReferencedEntries(references, discovery)

      expect(result.entries).toHaveLength(4) // Should include all entries
      expect(result.entries.map((e) => e.address)).toEqual([
        entryA.address,
        eoaB.address,
        entryC.address,
        entryD.address,
      ])
    })
  })
})
