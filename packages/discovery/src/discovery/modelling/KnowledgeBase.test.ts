import { expect } from 'earl'
import { KnowledgeBase, groupFacts } from './KnowledgeBase'
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
      contract_0x1d62ffeb72e4c360ccbbacf7c965153b00260417,
      contract_0x32e7af5a8151934f3787d0cd59eb6edd0a736b1d,
    ])
  })

  it('properly builds internal mappings', () => {
    const knowledgeBase = new KnowledgeBase(
      'test',
      ClingoFactFile.parse(factsFile).facts,
    )
    expect(knowledgeBase.idToNameMap).toEqual({
      l2ERC20Gateway_ethereum_0x09e9222e96e7b4ae2a407b98d48e330053351eee:
        'L2ERC20Gateway',
      constitutionHash_arbitrum_0x1d62ffeb72e4c360ccbbacf7c965153b00260417:
        'ConstitutionHash',
      eoa_ethereum_0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee: 'Special EOA',
      eoa_ethereum_0xfe2bf40f2a9183774bf8e871d634a4e50255158b:
        '0xfe2bf40f2a9183774bf8e871d634a4e50255158b',
      l2SurplusFee_arbitrum_0x32e7af5a8151934f3787d0cd59eb6edd0a736b1d:
        'L2SurplusFee',
    })
    expect(knowledgeBase.addressToIdMap).toEqual({
      'arbitrum:0x1d62ffeb72e4c360ccbbacf7c965153b00260417':
        'constitutionHash_arbitrum_0x1d62ffeb72e4c360ccbbacf7c965153b00260417',
      'arbitrum:0x32e7af5a8151934f3787d0cd59eb6edd0a736b1d':
        'l2SurplusFee_arbitrum_0x32e7af5a8151934f3787d0cd59eb6edd0a736b1d',
      'ethereum:0x09e9222e96e7b4ae2a407b98d48e330053351eee':
        'l2ERC20Gateway_ethereum_0x09e9222e96e7b4ae2a407b98d48e330053351eee',
      'ethereum:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee':
        'eoa_ethereum_0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      'ethereum:0xfe2bf40f2a9183774bf8e871d634a4e50255158b':
        'eoa_ethereum_0xfe2bf40f2a9183774bf8e871d634a4e50255158b',
    })
  })

  it('fails when duplicate addresses are found', () => {
    const factsWithDup = {
      facts: [
        ...factsFile.facts,
        {
          atom: 'contract',
          params: [
            'alternativeL2ERC20Gateway_ethereum_0x09e9222e96e7b4ae2a407b98d48e330053351eee',
            'ethereum',
            '0x09e9222e96e7b4ae2a407b98d48e330053351eee',
            'L2ERC20Gateway',
          ],
        },
      ],
    }
    expect(
      () => new KnowledgeBase('test', ClingoFactFile.parse(factsWithDup).facts),
    ).toThrow(
      'Duplicate address found ethereum:0x09e9222e96e7b4ae2a407b98d48e330053351eee',
    )
  })

  describe(KnowledgeBase.prototype.getFactOrUndefined.name, () => {
    it('returns single fact when found', () => {
      const knowledgeBase = new KnowledgeBase(
        'test',
        ClingoFactFile.parse(factsFile).facts,
      )
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
      const knowledgeBase = new KnowledgeBase(
        'test',
        ClingoFactFile.parse(factsFile).facts,
      )
      expect(
        knowledgeBase.getFactOrUndefined('contract', ['abc', 'def']),
      ).toEqual(undefined)
    })

    it('throws when multiple facts are found', () => {
      const factsFile = {
        facts: [
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
        ],
      }
      const knowledgeBase = new KnowledgeBase(
        'test',
        ClingoFactFile.parse(factsFile).facts,
      )
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
      const knowledgeBase = new KnowledgeBase(
        'test',
        ClingoFactFile.parse(factsFile).facts,
      )
      expect(() => knowledgeBase.getFact('contract', ['abc', 'def'])).toThrow(
        'No fact found with id "contract" and params: ["abc","def"]',
      )
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

  describe(KnowledgeBase.prototype.getIdOrUndefined.name, () => {
    it('returns undefined when no id is found', () => {
      const knowledgeBase = new KnowledgeBase(
        'test',
        ClingoFactFile.parse(factsFile).facts,
      )
      expect(
        knowledgeBase.getIdOrUndefined(
          'ethereum',
          '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        ),
      ).toEqual(undefined)
    })

    it('returns id when found', () => {
      const knowledgeBase = new KnowledgeBase(
        'test',
        ClingoFactFile.parse(factsFile).facts,
      )
      expect(
        knowledgeBase.getId(
          'ethereum',
          '0x09e9222e96e7b4ae2a407b98d48e330053351eee',
        ),
      ).toEqual(
        'l2ERC20Gateway_ethereum_0x09e9222e96e7b4ae2a407b98d48e330053351eee',
      )
    })

    it('throws when no id is found', () => {
      const knowledgeBase = new KnowledgeBase(
        'test',
        ClingoFactFile.parse(factsFile).facts,
      )
      expect(() =>
        knowledgeBase.getId(
          'ethereum',
          '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        ),
      ).toThrow(
        'No id found for ethereum:0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      )
    })
  })
})

describe(groupFacts.name, () => {
  it('correctly groups facts', () => {
    const factsFile = {
      facts: [
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
      ],
    }
    const knowledgeBase = new KnowledgeBase(
      'test',
      ClingoFactFile.parse(factsFile).facts,
    )
    const ethereumContractFacts = knowledgeBase.getFacts('fact', [
      undefined,
      undefined,
      undefined,
      'apple',
    ])
    const result = groupFacts(ethereumContractFacts, 0)
    expect(result).toEqual([
      {
        atom: 'fact',
        params: [['personA', 'personB'], 'can', 'eat', 'apple'],
      },
    ])
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

const factsFile = {
  facts: [
    contract_0x09e9222e96e7b4ae2a407b98d48e330053351eee,
    contract_0x1d62ffeb72e4c360ccbbacf7c965153b00260417,
    contract_0x32e7af5a8151934f3787d0cd59eb6edd0a736b1d,
    eoa_0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee,
    eoa_0xfe2bf40f2a9183774bf8e871d634a4e50255158b,
  ],
}
