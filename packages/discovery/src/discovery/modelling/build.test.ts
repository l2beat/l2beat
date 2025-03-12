import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { EntryParameters } from '../output/types'
import { buildAddressToNameMap } from './build'

describe(buildAddressToNameMap.name, () => {
  it('builds a map of addresses to names', () => {
    const entries: EntryParameters[] = [
      {
        type: 'Contract',
        address: EthereumAddress('0x1230000000000000000000000000000000000000'),
        name: 'ContractA',
      },
      {
        type: 'Contract',
        address: EthereumAddress('0xdead00000000000000000000000000000000beef'),
        name: 'ContractB',
      },
      {
        type: 'EOA',
        address: EthereumAddress('0x7890000000000000000000000000000000000000'),
        name: 'EoaName',
      },
      {
        type: 'EOA',
        address: EthereumAddress('0xabc0000000000000000000000000000000000000'),
      },
    ]

    const addressToNameMap = buildAddressToNameMap('ethereum', entries)
    expect(addressToNameMap).toEqual({
      '0x1230000000000000000000000000000000000000':
        'ContractA_ethereum_0x1230000000000000000000000000000000000000',
      '0x7890000000000000000000000000000000000000':
        'EoaName_ethereum_0x7890000000000000000000000000000000000000',
      '0xabc0000000000000000000000000000000000000':
        'eoa_ethereum_0xabc0000000000000000000000000000000000000',
      '0xdead00000000000000000000000000000000beef':
        'ContractB_ethereum_0xdead00000000000000000000000000000000beef',
    })
  })
})
