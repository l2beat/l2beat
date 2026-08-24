import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { EntryParameters } from '../output/types'
import { buildAddressToNameMap } from './buildAddressToNameMap'

const ADDRESS = ChainSpecificAddress.from('eth', EthereumAddress.from('0x123'))
const OTHER = ChainSpecificAddress.from('eth', EthereumAddress.from('0x456'))

describe(buildAddressToNameMap.name, () => {
  it('names every discovered entry by address', () => {
    expect(
      buildAddressToNameMap([contract(ADDRESS, 'Diamond'), eoa(OTHER)]),
    ).toEqual({
      [ADDRESS.toLowerCase()]: `Diamond_${suffix(ADDRESS)}`,
      [OTHER.toLowerCase()]: `eoa_${suffix(OTHER)}`,
    })
  })

  it('skips Reference entries so the owning project names the address', () => {
    expect(
      buildAddressToNameMap([
        reference(ADDRESS),
        contract(ADDRESS, 'ProxyAdmin'),
      ]),
    ).toEqual({
      [ADDRESS.toLowerCase()]: `ProxyAdmin_${suffix(ADDRESS)}`,
    })
  })

  // An EOA is discovered in full by every project of a cluster that reaches
  // it, so both would otherwise emit a different clingo id for one actor.
  it('keeps the first name when an address is discovered twice', () => {
    expect(
      buildAddressToNameMap([
        contract(ADDRESS, 'OwnName'),
        contract(ADDRESS, 'SharedModuleName'),
      ]),
    ).toEqual({
      [ADDRESS.toLowerCase()]: `OwnName_${suffix(ADDRESS)}`,
    })
  })
})

function suffix(address: ChainSpecificAddress): string {
  return address.toLowerCase().replaceAll(':', '_')
}

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
