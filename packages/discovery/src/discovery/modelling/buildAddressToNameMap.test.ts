import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { EntryParameters } from '../output/types'
import { buildAddressToNameMap } from './buildAddressToNameMap'

const ADDRESS = ChainSpecificAddress.from('eth', EthereumAddress.from('0x123'))
const OTHER = ChainSpecificAddress.from('eth', EthereumAddress.from('0x456'))

describe(buildAddressToNameMap.name, () => {
  it('gives every discovered entry an id built from its address', () => {
    expect(
      buildAddressToNameMap([contract(ADDRESS, 'Diamond'), eoa(OTHER)]),
    ).toEqual({
      'eth:0x0000000000000000000000000000000000000123':
        'eth_0x0000000000000000000000000000000000000123',
      'eth:0x0000000000000000000000000000000000000456':
        'eth_0x0000000000000000000000000000000000000456',
    })
  })

  it('skips Reference entries so the owning project claims the address', () => {
    expect(
      buildAddressToNameMap([
        reference(ADDRESS),
        contract(ADDRESS, 'ProxyAdmin'),
      ]),
    ).toEqual({
      'eth:0x0000000000000000000000000000000000000123':
        'eth_0x0000000000000000000000000000000000000123',
    })
  })

  // An EOA is discovered in full by every project of a cluster that reaches
  // it, and the two entries can carry different names.
  it('agrees on one id when an address is discovered twice', () => {
    expect(
      buildAddressToNameMap([
        contract(ADDRESS, 'OwnName'),
        contract(ADDRESS, 'SharedModuleName'),
      ]),
    ).toEqual({
      'eth:0x0000000000000000000000000000000000000123':
        'eth_0x0000000000000000000000000000000000000123',
    })
  })
})

function contract(
  address: ChainSpecificAddress,
  name: string,
): EntryParameters {
  return { type: 'Contract', address, name }
}

function eoa(address: ChainSpecificAddress): EntryParameters {
  return { type: 'EOA', address }
}

function reference(address: ChainSpecificAddress): EntryParameters {
  return { type: 'Reference', address, targetProject: 'shared-zk-stack' }
}
