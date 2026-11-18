import { expect } from 'earl'
import type { ClingoFact } from './clingoparser'
import { KnowledgeBase } from './KnowledgeBase'

describe(KnowledgeBase.name, () => {
  it('should return facts', () => {
    const knowledgeBase = new KnowledgeBase(FACTS)
    const result = knowledgeBase.getFacts('contract', [
      undefined,
      'arbitrum',
      undefined,
      undefined,
    ])
    expect(result).toEqual([
      contract_0x1d62ffeb72e4c360ccbbacf7c965153b00260417,
      contract_0x32e7af5a8151934f3787d0cd59eb6edd0a736b1d,
    ])
  })

  describe(KnowledgeBase.prototype.getFactOrUndefined.name, () => {
    it('returns single fact when found', () => {
      const knowledgeBase = new KnowledgeBase(FACTS)
      expect(
        knowledgeBase.getFactOrUndefined('eoa', [
          undefined,
          undefined,
          '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          'Special EOA',
        ]),
      ).toEqual(eoa_0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee)
    })

    it('returns undefined when no facts are found', () => {
      const knowledgeBase = new KnowledgeBase(FACTS)
      expect(
        knowledgeBase.getFactOrUndefined('contract', ['abc', 'def']),
      ).toEqual(undefined)
    })

    it('throws when multiple facts are found', () => {
      const facts: ClingoFact[] = [
        {
          atom: 'fact',
          params: ['personA', 'can', 'eat', 'apple'],
        },
        {
          atom: 'fact',
          params: ['personB', 'can', 'eat', 'apple'],
        },
        {
          atom: 'fact',
          params: ['personC', 'can', 'eat', 'fruit'],
        },
      ]
      const knowledgeBase = new KnowledgeBase(facts)
      expect(() =>
        knowledgeBase.getFactOrUndefined('fact', [undefined, 'can', 'eat']),
      ).toThrow(
        'Found multiple facts with "fact" id and params: [null,"can","eat"]',
      )
      expect(() =>
        knowledgeBase.getFact('fact', [undefined, 'can', 'eat']),
      ).toThrow(
        'Found multiple facts with "fact" id and params: [null,"can","eat"]',
      )
    })
  })

  describe(KnowledgeBase.prototype.getFact.name, () => {
    it('throws when no facts are found', () => {
      const knowledgeBase = new KnowledgeBase(FACTS)
      expect(() => knowledgeBase.getFact('contract', ['abc', 'def'])).toThrow(
        'No fact found with id "contract" and params: ["abc","def"]',
      )
    })
  })
})

const contract_0x09e9222e96e7b4ae2a407b98d48e330053351eee = {
  atom: 'contract',
  params: [
    'l2ERC20Gateway_ethereum_0x09e9222e96e7b4ae2a407b98d48e330053351eee',
    'ethereum',
    '0x09e9222e96e7b4ae2a407b98d48e330053351eee',
    'L2ERC20Gateway',
  ],
}

const contract_0x1d62ffeb72e4c360ccbbacf7c965153b00260417 = {
  atom: 'contract',
  params: [
    'constitutionHash_arbitrum_0x1d62ffeb72e4c360ccbbacf7c965153b00260417',
    'arbitrum',
    '0x1d62ffeb72e4c360ccbbacf7c965153b00260417',
    'ConstitutionHash',
  ],
}

const contract_0x32e7af5a8151934f3787d0cd59eb6edd0a736b1d = {
  atom: 'contract',
  params: [
    'l2SurplusFee_arbitrum_0x32e7af5a8151934f3787d0cd59eb6edd0a736b1d',
    'arbitrum',
    '0x32e7af5a8151934f3787d0cd59eb6edd0a736b1d',
    'L2SurplusFee',
  ],
}

const eoa_0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee = {
  atom: 'eoa',
  params: [
    'eoa_ethereum_0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    'ethereum',
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    'Special EOA',
  ],
}

const eoa_0xfe2bf40f2a9183774bf8e871d634a4e50255158b = {
  atom: 'eoa',
  params: [
    'eoa_ethereum_0xfe2bf40f2a9183774bf8e871d634a4e50255158b',
    'ethereum',
    '0xfe2bf40f2a9183774bf8e871d634a4e50255158b',
    '',
  ],
}

const FACTS: ClingoFact[] = [
  contract_0x09e9222e96e7b4ae2a407b98d48e330053351eee,
  contract_0x1d62ffeb72e4c360ccbbacf7c965153b00260417,
  contract_0x32e7af5a8151934f3787d0cd59eb6edd0a736b1d,
  eoa_0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee,
  eoa_0xfe2bf40f2a9183774bf8e871d634a4e50255158b,
]
