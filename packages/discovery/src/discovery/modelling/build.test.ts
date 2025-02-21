import type { ContractParameters, EoaParameters } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { buildAddressToNameMap } from './build'

describe(buildAddressToNameMap.name, () => {
  it('builds a map of addresses to names', () => {
    const contracts: ContractParameters[] = [
      {
        address: EthereumAddress('0x1230000000000000000000000000000000000000'),
        name: 'ContractA',
      },
      {
        address: EthereumAddress('0xdeadbeef00000000000000000000000000000000'),
        name: 'ContractB',
      },
    ]
    const eoas: EoaParameters[] = [
      {
        address: EthereumAddress('0x7890000000000000000000000000000000000000'),
        name: 'EoaName',
      },
      {
        address: EthereumAddress('0xabc0000000000000000000000000000000000000'),
      },
    ]

    const addressToNameMap = buildAddressToNameMap(contracts, eoas)
    expect(addressToNameMap).toEqual({
      '0x1230000000000000000000000000000000000000': 'ContractA_0x1230',
      '0x7890000000000000000000000000000000000000': 'EoaName_0x7890',
      '0xabc0000000000000000000000000000000000000': 'eoa_0xabc0',
      '0xdeadbeef00000000000000000000000000000000': 'ContractB_0xdead',
    })
  })
})
