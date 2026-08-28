import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { Analysis, AnalyzedContract } from '../analysis/AddressAnalyzer'
import { EMPTY_ANALYZED_CONTRACT, EMPTY_ANALYZED_EOA } from '../utils/testUtils'
import { remapDiscoverySourceNames } from './remapDiscoverySourceNames'
import type { DiscoveryOutput } from './types'

describe(remapDiscoverySourceNames.name, () => {
  it('uses output names only for matching contracts', () => {
    const renamedContract = contract('Original')
    const unnamedContract = contract('Fallback')
    const eoa = {
      ...EMPTY_ANALYZED_EOA,
      address: ChainSpecificAddress.random('eth'),
      name: 'EOA',
    }
    const reference: Analysis = {
      type: 'Reference',
      address: ChainSpecificAddress.random('eth'),
      name: 'Reference',
      targetType: 'Contract',
      targetProject: 'shared',
    }
    const output: DiscoveryOutput = {
      name: 'project',
      timestamp: 0,
      configHash: Hash256.ZERO,
      entries: [
        {
          type: 'Contract',
          address: renamedContract.address,
          name: 'Remapped',
        },
        {
          type: 'Contract',
          address: unnamedContract.address,
        },
        {
          type: 'EOA',
          address: eoa.address,
          name: 'Ignored EOA name',
        },
        {
          type: 'Reference',
          address: reference.address,
          name: 'Ignored reference name',
        },
      ],
      abis: {},
      usedTemplates: {},
      usedBlockNumbers: {},
    }

    const result = remapDiscoverySourceNames(
      [renamedContract, unnamedContract, eoa, reference],
      output,
    )

    expect(result).toEqual([
      { ...renamedContract, name: 'Remapped' },
      unnamedContract,
      eoa,
      reference,
    ])
  })
})

function contract(name: string): AnalyzedContract {
  return {
    ...EMPTY_ANALYZED_CONTRACT,
    address: ChainSpecificAddress.random('eth'),
    name,
  }
}
