import {
  KnowledgeBase,
  groupFacts,
} from '@l2beat/discovery/src/discovery/modelling/KnowledgeBase'
import { expect } from 'earl'
import { ClingoFactFile } from './factTypes'

describe(KnowledgeBase.name, () => {
  it('should return facts', () => {
    const knowledgeBase = new KnowledgeBase(
      'test',
      ClingoFactFile.parse(factsFile).facts,
    )
    const result = knowledgeBase.getFacts('contract', [
      undefined,
      'arbitrum',
      undefined,
      undefined,
    ])
    expect(result).toEqual([
      {
        atom: 'contract',
        params: [
          'constitutionHash_arbitrum_0x1d62ffeb72e4c360ccbbacf7c965153b00260417',
          'arbitrum',
          '0x1d62ffeb72e4c360ccbbacf7c965153b00260417',
          'ConstitutionHash',
        ],
      },
      {
        atom: 'contract',
        params: [
          'l2SurplusFee_arbitrum_0x32e7af5a8151934f3787d0cd59eb6edd0a736b1d',
          'arbitrum',
          '0x32e7af5a8151934f3787d0cd59eb6edd0a736b1d',
          'L2SurplusFee',
        ],
      },
    ])
  })

  it('correctly groups facts', () => {
    const knowledgeBase = new KnowledgeBase(
      'test',
      ClingoFactFile.parse(factsFile).facts,
    )
    const ethereumContractFacts = knowledgeBase.getFacts('contract', [
      undefined,
      'ethereum',
      undefined,
      undefined,
    ])
    const result = groupFacts(ethereumContractFacts, 0)
    expect(result).toEqual([
      {
        atom: 'contract',
        params: [
          [
            'l2ERC20Gateway_ethereum_0x09e9222e96e7b4ae2a407b98d48e330053351eee',
            'alternativeL2ERC20Gateway_ethereum_0x09e9222e96e7b4ae2a407b98d48e330053351eee',
          ],
          'ethereum',
          '0x09e9222e96e7b4ae2a407b98d48e330053351eee',
          'L2ERC20Gateway',
        ],
      },
    ])
  })

  it(KnowledgeBase.prototype.buildIdToNameMap.name, () => {
    const knowledgeBase = new KnowledgeBase(
      'test',
      ClingoFactFile.parse(factsFile).facts,
    )
    const result = knowledgeBase.buildIdToNameMap()
    expect(result).toEqual({
      l2ERC20Gateway_ethereum_0x09e9222e96e7b4ae2a407b98d48e330053351eee:
        'L2ERC20Gateway',
      constitutionHash_arbitrum_0x1d62ffeb72e4c360ccbbacf7c965153b00260417:
        'ConstitutionHash',
      eoa_ethereum_0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee: 'Special EOA',
      eoa_ethereum_0xfe2bf40f2a9183774bf8e871d634a4e50255158b:
        '0xfe2bf40f2a9183774bf8e871d634a4e50255158b',
      alternativeL2ERC20Gateway_ethereum_0x09e9222e96e7b4ae2a407b98d48e330053351eee:
        'L2ERC20Gateway',
      l2SurplusFee_arbitrum_0x32e7af5a8151934f3787d0cd59eb6edd0a736b1d:
        'L2SurplusFee',
    })
  })

  it('correctly replaces ids with names', () => {
    const knowledgeBase = new KnowledgeBase(
      'test',
      ClingoFactFile.parse(factsFile).facts,
    )
    const result = knowledgeBase.replaceIdsWithNames(
      'Contract @@l2ERC20Gateway_ethereum_0x09e9222e96e7b4ae2a407b98d48e330053351eee, eoa @@eoa_ethereum_0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee, unknown @@a_b_c',
    )
    expect(result).toEqual(
      'Contract L2ERC20Gateway, eoa Special EOA, unknown a_b_c',
    )
  })
})

const factsFile = {
  facts: [
    {
      atom: 'contract',
      params: [
        'l2ERC20Gateway_ethereum_0x09e9222e96e7b4ae2a407b98d48e330053351eee',
        'ethereum',
        '0x09e9222e96e7b4ae2a407b98d48e330053351eee',
        'L2ERC20Gateway',
      ],
    },
    {
      atom: 'contract',
      params: [
        'alternativeL2ERC20Gateway_ethereum_0x09e9222e96e7b4ae2a407b98d48e330053351eee', // this is just to test grouping
        'ethereum',
        '0x09e9222e96e7b4ae2a407b98d48e330053351eee',
        'L2ERC20Gateway',
      ],
    },
    {
      atom: 'contract',
      params: [
        'constitutionHash_arbitrum_0x1d62ffeb72e4c360ccbbacf7c965153b00260417',
        'arbitrum',
        '0x1d62ffeb72e4c360ccbbacf7c965153b00260417',
        'ConstitutionHash',
      ],
    },
    {
      atom: 'contract',
      params: [
        'l2SurplusFee_arbitrum_0x32e7af5a8151934f3787d0cd59eb6edd0a736b1d',
        'arbitrum',
        '0x32e7af5a8151934f3787d0cd59eb6edd0a736b1d',
        'L2SurplusFee',
      ],
    },
    {
      atom: 'eoa',
      params: [
        'eoa_ethereum_0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        'ethereum',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        'Special EOA',
      ],
    },
    {
      atom: 'eoa',
      params: [
        'eoa_ethereum_0xfe2bf40f2a9183774bf8e871d634a4e50255158b',
        'ethereum',
        '0xfe2bf40f2a9183774bf8e871d634a4e50255158b',
        '',
      ],
    },
  ],
}
