import type { ConfigReader } from '@l2beat/discovery'
import type { ContractParameters } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { findUnknownContracts } from './findUnknownContracts'

const A = { address: EthereumAddress.random() }
const B = { address: EthereumAddress.random() }
const C = { address: EthereumAddress.random() }

describe(findUnknownContracts.name, () => {
  it('finds contracts not present in discovered.json', () => {
    const configReader = mockObject<ConfigReader>({
      readDiscovery: mockFn().returns({
        contracts: [A, B],
      }),
    })

    const contracts = [A, B, C] as ContractParameters[]
    const result = findUnknownContracts('', contracts, configReader, 'ethereum')
    expect(result).toEqual([C.address])
  })

  it('works for empty arrays', () => {
    const configReader = mockObject<ConfigReader>({
      readDiscovery: mockFn().returns({
        contracts: [],
      }),
    })

    const contracts: ContractParameters[] = []
    const result = findUnknownContracts('', contracts, configReader, 'ethereum')
    expect(result).toEqual([])
  })
})
