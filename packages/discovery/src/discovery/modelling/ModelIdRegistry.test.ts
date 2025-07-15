import { expect } from 'earl'
import type { ClingoFact } from './clingoparser'
import { KnowledgeBase } from './KnowledgeBase'
import { ModelIdRegistry } from './ModelIdRegistry'

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
          'eth',
          '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        ),
      ).toEqual(undefined)
    })

    it('returns id when found', () => {
      expect(
        registry.getModelId(
          'eth',
          '0x000000000000000000000000000000000000ccc1',
        ),
      ).toEqual('contractA_eth_0x000000000000000000000000000000000000ccc1')
    })
  })

  describe(ModelIdRegistry.prototype.getModelId.name, () => {
    it('throws when no id is found', () => {
      expect(() =>
        registry.getModelId(
          'eth',
          '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        ),
      ).toThrow(
        'No id found for eth:0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      )
    })
  })

  describe(ModelIdRegistry.prototype.getAddressData.name, () => {
    it('returns address data', () => {
      expect(
        registry.getAddressData(
          'contractA_eth_0x000000000000000000000000000000000000ccc1',
        ),
      ).toEqual({
        modelId: 'contractA_eth_0x000000000000000000000000000000000000ccc1',
        shortChain: 'eth',
        address: '0x000000000000000000000000000000000000ccc1',
        name: 'ContractA',
        type: 'contract',
        description: 'Description of ContractA',
      })

      expect(
        registry.getAddressData(
          'eoaA_eth_0x000000000000000000000000000000000000eee1',
        ),
      ).toEqual({
        modelId: 'eoaA_eth_0x000000000000000000000000000000000000eee1',
        shortChain: 'eth',
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
        'Contract @@contractA_eth_0x000000000000000000000000000000000000ccc1, eoa @@eoaA_eth_0x000000000000000000000000000000000000eee1, unknown @@a_b_c',
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
      'contractA_eth_0x000000000000000000000000000000000000ccc1',
      'eth',
      '0x000000000000000000000000000000000000ccc1',
    ],
  },
  {
    atom: 'addressName',
    params: [
      'contractA_eth_0x000000000000000000000000000000000000ccc1',
      'ContractA',
    ],
  },
  {
    atom: 'addressType',
    params: [
      'contractA_eth_0x000000000000000000000000000000000000ccc1',
      'contract',
    ],
  },
  {
    atom: 'addressDescription',
    params: [
      'contractA_eth_0x000000000000000000000000000000000000ccc1',
      'Description of ContractA',
    ],
  },
  {
    atom: 'permission',
    params: [
      'contractA_eth_0x000000000000000000000000000000000000ccc1',
      'act',
      'eoaA_eth_0x000000000000000000000000000000000000eee1',
    ],
  },
  {
    atom: 'permissionDescription',
    params: [
      'contractA_eth_0x000000000000000000000000000000000000ccc1',
      'act',
      'eoaA_eth_0x000000000000000000000000000000000000eee1',
      'Description of Permission 2',
    ],
  },
  {
    atom: 'permissionDelay',
    params: [
      'contractA_eth_0x000000000000000000000000000000000000ccc1',
      'act',
      'eoaA_eth_0x000000000000000000000000000000000000eee1',
      3600,
    ],
  },
  {
    atom: 'permission',
    params: [
      'contractA_eth_0x000000000000000000000000000000000000ccc1',
      'upgrade',
      'contractB_eth_0x000000000000000000000000000000000000ccc2',
    ],
  },
  {
    atom: 'permissionDescription',
    params: [
      'contractA_eth_0x000000000000000000000000000000000000ccc1',
      'upgrade',
      'contractB_eth_0x000000000000000000000000000000000000ccc2',
      'Description of Permission 1',
    ],
  },
  {
    atom: 'address',
    params: [
      'contractB_eth_0x000000000000000000000000000000000000ccc2',
      'eth',
      '0x000000000000000000000000000000000000ccc2',
    ],
  },
  {
    atom: 'addressName',
    params: [
      'contractB_eth_0x000000000000000000000000000000000000ccc2',
      'ContractB',
    ],
  },
  {
    atom: 'addressType',
    params: [
      'contractB_eth_0x000000000000000000000000000000000000ccc2',
      'contract',
    ],
  },
  {
    atom: 'addressDescription',
    params: [
      'contractB_eth_0x000000000000000000000000000000000000ccc2',
      'Description of ContractB',
    ],
  },
  {
    atom: 'address',
    params: [
      'eoaA_eth_0x000000000000000000000000000000000000eee1',
      'eth',
      '0x000000000000000000000000000000000000eee1',
    ],
  },
  {
    atom: 'addressType',
    params: ['eoaA_eth_0x000000000000000000000000000000000000eee1', 'eoa'],
  },
  {
    atom: 'addressName',
    params: [
      'eoaA_eth_0x000000000000000000000000000000000000eee1',
      'Special EOA',
    ],
  },
]
