import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { DiscoveryOutput, EntryParameters } from '../output/types'
import { getReferencedEntries } from './getReferencedEntries'

describe(getReferencedEntries.name, () => {
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

  describe('basic functionality', () => {
    it('should return empty array when no references provided', () => {
      const entries = [createMockEntry(ADDRESSES.A)]
      const discovery = createMockDiscovery(entries)

      const result = getReferencedEntries([], discovery.entries)

      expect(result).toEqual([])
    })

    it('should return empty array when no entries provided', () => {
      const references = [createMockEntry(ADDRESSES.A)]

      const result = getReferencedEntries(references, [])

      expect(result).toEqual([])
    })

    it('should return single entry when it exists in both references and entries', () => {
      const entry = createMockEntry(ADDRESSES.A, 'Contract', {}, 'ContractA')
      const entries = [entry]
      const references = [entry]

      const result = getReferencedEntries(references, entries)

      expect(result).toEqual([entry])
    })

    it('should return empty array when reference does not exist in entries', () => {
      const entries = [createMockEntry(ADDRESSES.A)]
      const references = [createMockEntry(ADDRESSES.B)]

      const result = getReferencedEntries(references, entries)

      expect(result).toEqual([])
    })

    it('should throw error for duplicate entry addresses', () => {
      const entry1 = createMockEntry(ADDRESSES.A, 'Contract', {}, 'ContractA1')
      const entry2 = createMockEntry(ADDRESSES.A, 'Contract', {}, 'ContractA2')
      const entries = [entry1, entry2]
      const references = [entry1]

      expect(() => getReferencedEntries(references, entries)).toThrow(
        `Duplicate entry address: ${ADDRESSES.A}`,
      )
    })
  })

  describe('value-based references', () => {
    it('should follow references from string values', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          owner: ADDRESSES.B,
        },
        'ContractA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'ContractB')
      const entries = [entryA, entryB]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(2)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
    })

    it('should follow references from array values', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          admins: [ADDRESSES.B, ADDRESSES.C],
        },
        'ContractA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'ContractB')
      const entryC = createMockEntry(ADDRESSES.C, 'Contract', {}, 'ContractC')
      const entries = [entryA, entryB, entryC]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(3)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
      expect(result).toInclude(entryC)
    })

    it('should follow references from nested object values', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          config: {
            owner: ADDRESSES.B,
            proxy: {
              implementation: ADDRESSES.C,
            },
          },
        },
        'ContractA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'ContractB')
      const entryC = createMockEntry(ADDRESSES.C, 'Contract', {}, 'ContractC')
      const entries = [entryA, entryB, entryC]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(3)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
      expect(result).toInclude(entryC)
    })

    it('should handle mixed array and object structures', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          validators: [
            { address: ADDRESSES.B, weight: 1 },
            { address: ADDRESSES.C, weight: 2 },
          ],
          fallback: ADDRESSES.D,
        },
        'ContractA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'ContractB')
      const entryC = createMockEntry(ADDRESSES.C, 'Contract', {}, 'ContractC')
      const entryD = createMockEntry(ADDRESSES.D, 'Contract', {}, 'ContractD')
      const entries = [entryA, entryB, entryC, entryD]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(4)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
      expect(result).toInclude(entryC)
      expect(result).toInclude(entryD)
    })

    it('should ignore invalid address strings in values', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          owner: ADDRESSES.B,
          invalidAddress: 'not-an-address',
          number: 123,
          boolean: true,
        },
        'ContractA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'ContractB')
      const entries = [entryA, entryB]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(2)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
    })

    it('should handle cross-chain addresses', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          arbContract: ADDRESSES.ARB_A,
          optContract: ADDRESSES.OPT_A,
        },
        'ContractA',
      )
      const entryArb = createMockEntry(
        ADDRESSES.ARB_A,
        'Contract',
        {},
        'ArbContract',
      )
      const entryOpt = createMockEntry(
        ADDRESSES.OPT_A,
        'Contract',
        {},
        'OptContract',
      )
      const entries = [entryA, entryArb, entryOpt]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(3)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryArb)
      expect(result).toInclude(entryOpt)
    })
  })

  describe('permission-based references', () => {
    it('should follow references from receivedPermissions', () => {
      const entryA = createMockEntry(ADDRESSES.A, 'Contract', {}, 'ContractA')
      entryA.receivedPermissions = [
        {
          permission: 'upgrade',
          from: ChainSpecificAddress(ADDRESSES.B),
        },
      ]
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'ContractB')
      const entries = [entryA, entryB]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(2)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
    })

    it('should follow references from directlyReceivedPermissions', () => {
      const entryA = createMockEntry(ADDRESSES.A, 'Contract', {}, 'ContractA')
      entryA.directlyReceivedPermissions = [
        {
          permission: 'upgrade',
          from: ChainSpecificAddress(ADDRESSES.B),
        },
      ]
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'ContractB')
      const entries = [entryA, entryB]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(2)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
    })

    it('should follow references from permission via paths', () => {
      const entryA = createMockEntry(ADDRESSES.A, 'Contract', {}, 'ContractA')
      entryA.receivedPermissions = [
        {
          permission: 'upgrade',
          from: ChainSpecificAddress(ADDRESSES.B),
          via: [
            { address: ChainSpecificAddress(ADDRESSES.C) },
            { address: ChainSpecificAddress(ADDRESSES.D) },
          ],
        },
      ]
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'ContractB')
      const entryC = createMockEntry(ADDRESSES.C, 'Contract', {}, 'ContractC')
      const entryD = createMockEntry(ADDRESSES.D, 'Contract', {}, 'ContractD')
      const entries = [entryA, entryB, entryC, entryD]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(4)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
      expect(result).toInclude(entryC)
      expect(result).toInclude(entryD)
    })

    it('should handle multiple permissions with different paths', () => {
      const entryA = createMockEntry(ADDRESSES.A, 'Contract', {}, 'ContractA')
      entryA.receivedPermissions = [
        {
          permission: 'upgrade',
          from: ChainSpecificAddress(ADDRESSES.B),
        },
      ]
      entryA.directlyReceivedPermissions = [
        {
          permission: 'upgrade',
          from: ChainSpecificAddress(ADDRESSES.C),
          via: [{ address: ChainSpecificAddress(ADDRESSES.D) }],
        },
      ]
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'ContractB')
      const entryC = createMockEntry(ADDRESSES.C, 'Contract', {}, 'ContractC')
      const entryD = createMockEntry(ADDRESSES.D, 'Contract', {}, 'ContractD')
      const entries = [entryA, entryB, entryC, entryD]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(4)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
      expect(result).toInclude(entryC)
      expect(result).toInclude(entryD)
    })
  })

  describe('deep reference chains', () => {
    it('should follow multi-level reference chains', () => {
      // A -> B -> C -> D
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          next: ADDRESSES.B,
        },
        'ContractA',
      )
      const entryB = createMockEntry(
        ADDRESSES.B,
        'Contract',
        {
          next: ADDRESSES.C,
        },
        'ContractB',
      )
      const entryC = createMockEntry(
        ADDRESSES.C,
        'Contract',
        {
          next: ADDRESSES.D,
        },
        'ContractC',
      )
      const entryD = createMockEntry(ADDRESSES.D, 'Contract', {}, 'ContractD')
      const entries = [entryA, entryB, entryC, entryD]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(4)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
      expect(result).toInclude(entryC)
      expect(result).toInclude(entryD)
    })

    it('should handle branching reference trees', () => {
      // A -> B, C
      // B -> D
      // C -> E
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          left: ADDRESSES.B,
          right: ADDRESSES.C,
        },
        'ContractA',
      )
      const entryB = createMockEntry(
        ADDRESSES.B,
        'Contract',
        {
          child: ADDRESSES.D,
        },
        'ContractB',
      )
      const entryC = createMockEntry(
        ADDRESSES.C,
        'Contract',
        {
          child: ADDRESSES.E,
        },
        'ContractC',
      )
      const entryD = createMockEntry(ADDRESSES.D, 'Contract', {}, 'ContractD')
      const entryE = createMockEntry(ADDRESSES.E, 'Contract', {}, 'ContractE')
      const entries = [entryA, entryB, entryC, entryD, entryE]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(5)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
      expect(result).toInclude(entryC)
      expect(result).toInclude(entryD)
      expect(result).toInclude(entryE)
    })

    it('should handle multiple reference entry points', () => {
      // References: A, C
      // A -> B
      // C -> D
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          next: ADDRESSES.B,
        },
        'ContractA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'ContractB')
      const entryC = createMockEntry(
        ADDRESSES.C,
        'Contract',
        {
          next: ADDRESSES.D,
        },
        'ContractC',
      )
      const entryD = createMockEntry(ADDRESSES.D, 'Contract', {}, 'ContractD')
      const entries = [entryA, entryB, entryC, entryD]
      const references = [entryA, entryC]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(4)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
      expect(result).toInclude(entryC)
      expect(result).toInclude(entryD)
    })
  })

  describe('circular references', () => {
    it('should handle simple circular references without infinite loops', () => {
      // A -> B -> A
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          next: ADDRESSES.B,
        },
        'ContractA',
      )
      const entryB = createMockEntry(
        ADDRESSES.B,
        'Contract',
        {
          next: ADDRESSES.A,
        },
        'ContractB',
      )
      const entries = [entryA, entryB]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(2)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
    })

    it('should handle complex circular references', () => {
      // A -> B -> C -> A
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          next: ADDRESSES.B,
        },
        'ContractA',
      )
      const entryB = createMockEntry(
        ADDRESSES.B,
        'Contract',
        {
          next: ADDRESSES.C,
        },
        'ContractB',
      )
      const entryC = createMockEntry(
        ADDRESSES.C,
        'Contract',
        {
          next: ADDRESSES.A,
        },
        'ContractC',
      )
      const entries = [entryA, entryB, entryC]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(3)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
      expect(result).toInclude(entryC)
    })

    it('should handle self-references', () => {
      // A -> A
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          self: ADDRESSES.A,
        },
        'ContractA',
      )
      const entries = [entryA]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(1)
      expect(result).toInclude(entryA)
    })
  })

  describe('edge cases', () => {
    it('should handle references to non-existent entries', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          existing: ADDRESSES.B,
          nonExistent: ADDRESSES.NONEXISTENT,
        },
        'ContractA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'ContractB')
      const entries = [entryA, entryB]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(2)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
    })

    it('should handle entries with no values', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        undefined,
        'ContractA',
      )
      const entries = [entryA]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(1)
      expect(result).toInclude(entryA)
    })

    it('should handle entries with empty values', () => {
      const entryA = createMockEntry(ADDRESSES.A, 'Contract', {}, 'ContractA')
      const entries = [entryA]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(1)
      expect(result).toInclude(entryA)
    })

    it('should handle EOA entries', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'EOA',
        {
          owner: ADDRESSES.B,
        },
        'EOAA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'ContractB')
      const entries = [entryA, entryB]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(2)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
    })

    it('should handle mixed value types in arrays', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          mixed: [
            ADDRESSES.B,
            123,
            'invalid-address',
            true,
            { nested: ADDRESSES.C },
          ],
        },
        'ContractA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'ContractB')
      const entryC = createMockEntry(ADDRESSES.C, 'Contract', {}, 'ContractC')
      const entries = [entryA, entryB, entryC]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(3)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
      expect(result).toInclude(entryC)
    })

    it('should handle duplicate addresses in values', () => {
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          first: ADDRESSES.B,
          second: ADDRESSES.B,
          array: [ADDRESSES.B, ADDRESSES.B],
        },
        'ContractA',
      )
      const entryB = createMockEntry(ADDRESSES.B, 'Contract', {}, 'ContractB')
      const entries = [entryA, entryB]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(2)
      expect(result).toInclude(entryA)
      expect(result).toInclude(entryB)
    })

    it('should handle large reference graphs efficiently', () => {
      // Create a large graph: A -> B1, B2, ..., B100
      const entryA = createMockEntry(
        ADDRESSES.A,
        'Contract',
        {
          refs: Array.from(
            { length: 10 },
            (_, i) => `eth:0x${(i + 1).toString().padStart(40, '0')}`,
          ),
        },
        'ContractA',
      )

      const bEntries = Array.from({ length: 10 }, (_, i) =>
        createMockEntry(
          `eth:0x${(i + 1).toString().padStart(40, '0')}`,
          'Contract',
          {},
          `ContractB${i + 1}`,
        ),
      )

      const entries = [entryA, ...bEntries]
      const references = [entryA]

      const result = getReferencedEntries(references, entries)

      expect(result).toHaveLength(11) // A + 10 B entries
      expect(result).toInclude(entryA)
      bEntries.forEach((entry) => {
        expect(result).toInclude(entry)
      })
    })
  })
})
