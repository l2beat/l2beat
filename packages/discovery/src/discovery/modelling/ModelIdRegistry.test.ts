import { expect } from 'earl'
import { KnowledgeBase } from './KnowledgeBase'
import { ModelIdRegistry } from './ModelIdRegistry'
import type { ClingoFact } from './factTypes'

describe(ModelIdRegistry.name, () => {
  let registry: ModelIdRegistry
  beforeEach(() => {
    const knowledgeBase = new KnowledgeBase(facts)
    registry = new ModelIdRegistry(knowledgeBase)
  })

  describe(ModelIdRegistry.prototype.getModelIdOrUndefined.name, () => {
    it('returns undefined when address is not found', () => {
      expect(
        registry.getModelIdOrUndefined(
          'ethereum',
          '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        ),
      ).toEqual(undefined)
    })

    it('returns id when found', () => {
      expect(
        registry.getModelId(
          'ethereum',
          '0x000000000000000000000000000000000000ccc1',
        ),
      ).toEqual('contractA_ethereum_0x000000000000000000000000000000000000ccc1')
    })
  })

  describe(ModelIdRegistry.prototype.getModelId.name, () => {
    it('throws when no id is found', () => {
      expect(() =>
        registry.getModelId(
          'ethereum',
          '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        ),
      ).toThrow(
        'No id found for ethereum:0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      )
    })
  })

  describe(ModelIdRegistry.prototype.getAddressData.name, () => {
    it('returns address data', () => {
      expect(
        registry.getAddressData(
          'contractA_ethereum_0x000000000000000000000000000000000000ccc1',
        ),
      ).toEqual({
        modelId:
          'contractA_ethereum_0x000000000000000000000000000000000000ccc1',
        chain: 'ethereum',
        address: '0x000000000000000000000000000000000000ccc1',
        name: 'ContractA',
        type: 'contract',
        description: 'Description of ContractA',
      })

      expect(
        registry.getAddressData(
          'eoaA_ethereum_0x000000000000000000000000000000000000eee1',
        ),
      ).toEqual({
        modelId: 'eoaA_ethereum_0x000000000000000000000000000000000000eee1',
        chain: 'ethereum',
        address: '0x000000000000000000000000000000000000eee1',
        name: 'Special EOA',
        type: 'eoa',
      })
    })

    it('throws when address is not found', () => {
      expect(() => registry.getAddressData('abc')).toThrow(
        'No address data found for modelId abc',
      )
    })
  })

  describe(ModelIdRegistry.prototype.getAddressDataOrUndefined.name, () => {
    it('returns undefined when address is not found', () => {
      expect(registry.getAddressDataOrUndefined('abc')).toEqual(undefined)
    })
  })

  describe(ModelIdRegistry.prototype.replaceIdsWithNames.name, () => {
    it('correctly replaces ids with names', () => {
      const result = registry.replaceIdsWithNames(
        'Contract @@contractA_ethereum_0x000000000000000000000000000000000000ccc1, eoa @@eoaA_ethereum_0x000000000000000000000000000000000000eee1, unknown @@a_b_c',
      )
      expect(result).toEqual(
        'Contract ContractA, eoa Special EOA, unknown a_b_c',
      )
    })
  })
})

const facts: ClingoFact[] = [
  {
    atom: 'address',
    params: [
      'contractA_ethereum_0x000000000000000000000000000000000000ccc1',
      'ethereum',
      '0x000000000000000000000000000000000000ccc1',
    ],
  },
  {
    atom: 'addressName',
    params: [
      'contractA_ethereum_0x000000000000000000000000000000000000ccc1',
      'ContractA',
    ],
  },
  {
    atom: 'addressType',
    params: [
      'contractA_ethereum_0x000000000000000000000000000000000000ccc1',
      'contract',
    ],
  },
  {
    atom: 'addressDescription',
    params: [
      'contractA_ethereum_0x000000000000000000000000000000000000ccc1',
      'Description of ContractA',
    ],
  },
  {
    atom: 'permission',
    params: [
      'contractA_ethereum_0x000000000000000000000000000000000000ccc1',
      'act',
      'eoaA_ethereum_0x000000000000000000000000000000000000eee1',
    ],
  },
  {
    atom: 'permissionDescription',
    params: [
      'contractA_ethereum_0x000000000000000000000000000000000000ccc1',
      'act',
      'eoaA_ethereum_0x000000000000000000000000000000000000eee1',
      'Description of Permission 2',
    ],
  },
  {
    atom: 'permissionDelay',
    params: [
      'contractA_ethereum_0x000000000000000000000000000000000000ccc1',
      'act',
      'eoaA_ethereum_0x000000000000000000000000000000000000eee1',
      3600,
    ],
  },
  {
    atom: 'permission',
    params: [
      'contractA_ethereum_0x000000000000000000000000000000000000ccc1',
      'upgrade',
      'contractB_ethereum_0x000000000000000000000000000000000000ccc2',
    ],
  },
  {
    atom: 'permissionDescription',
    params: [
      'contractA_ethereum_0x000000000000000000000000000000000000ccc1',
      'upgrade',
      'contractB_ethereum_0x000000000000000000000000000000000000ccc2',
      'Description of Permission 1',
    ],
  },
  {
    atom: 'address',
    params: [
      'contractB_ethereum_0x000000000000000000000000000000000000ccc2',
      'ethereum',
      '0x000000000000000000000000000000000000ccc2',
    ],
  },
  {
    atom: 'addressName',
    params: [
      'contractB_ethereum_0x000000000000000000000000000000000000ccc2',
      'ContractB',
    ],
  },
  {
    atom: 'addressType',
    params: [
      'contractB_ethereum_0x000000000000000000000000000000000000ccc2',
      'contract',
    ],
  },
  {
    atom: 'addressDescription',
    params: [
      'contractB_ethereum_0x000000000000000000000000000000000000ccc2',
      'Description of ContractB',
    ],
  },
  {
    atom: 'address',
    params: [
      'eoaA_ethereum_0x000000000000000000000000000000000000eee1',
      'ethereum',
      '0x000000000000000000000000000000000000eee1',
    ],
  },
  {
    atom: 'addressType',
    params: ['eoaA_ethereum_0x000000000000000000000000000000000000eee1', 'eoa'],
  },
  {
    atom: 'addressName',
    params: [
      'eoaA_ethereum_0x000000000000000000000000000000000000eee1',
      'Special EOA',
    ],
  },
]
