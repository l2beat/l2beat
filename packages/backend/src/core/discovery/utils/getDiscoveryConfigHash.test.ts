import { EthereumAddress, Hash256 } from '@l2beat/shared'
import { expect } from 'earljs'

import { hashJson } from '../../../tools/hashJson'
import { DiscoveryConfig } from '../DiscoveryConfig'
import {
  getDiscoveryConfigEntries,
  getDiscoveryConfigHash,
} from './getDiscoveryConfigHash'

const ADDRESS_A = EthereumAddress('0xc186fA914353c44b2E33eBE05f21846F1048bEda')
const ADDRESS_B = EthereumAddress('0xB524735356985D2f267FA010D681f061DfF03715')
const ADDRESS_C = EthereumAddress('0x592349F7DeDB2b75f9d4F194d4b7C16D82E507Dc')

const CONFIG: DiscoveryConfig = {
  name: 'a',
  initialAddresses: [ADDRESS_A],
  maxAddresses: 1,
  maxDepth: 1,
  overrides: {
    [ADDRESS_B.toString()]: {
      ignoreInWatchMode: ['b', 'a'],
      ignoreMethods: ['d', 'c'],
      ignoreDiscovery: false,
    },
  },
}

describe(getDiscoveryConfigHash.name, () => {
  it('correctly generates hash for given config', () => {
    const result = getDiscoveryConfigHash(CONFIG)

    const expected = Hash256(
      '0x800ad499ae413c85dbfd965e91cb0120fd62b38efd4a921995268110f9e238ed',
    )

    expect(result).toEqual(expected)
  })

  it('uses entries sorting algorithm', () => {
    const result = getDiscoveryConfigHash(CONFIG)

    const expected = hashJson(getDiscoveryConfigEntries(CONFIG))

    expect(result).toEqual(expected)
  })

  it(getDiscoveryConfigEntries.name, () => {
    const config: DiscoveryConfig = {
      name: 'a',
      initialAddresses: [ADDRESS_A],
      maxDepth: 1,
      maxAddresses: 1,
      overrides: {
        [ADDRESS_B.toString()]: {
          ignoreInWatchMode: ['b', 'a'],
          ignoreMethods: ['d', 'c'],
          ignoreDiscovery: false,
          proxyType: 'call implementation proxy',
          fields: {
            B: {
              type: 'call',
              method: 'crossChainContracts',
              args: [1],
            },
            A: {
              type: 'call',
              method: 'crossChainContracts',
              args: [10],
            },
          },
        },
        [ADDRESS_C.toString()]: {
          ignoreInWatchMode: ['a', 'b'],
          ignoreMethods: ['c', 'd'],
          ignoreDiscovery: false,
          proxyType: 'call implementation proxy',
          fields: {},
        },
      },
    }

    const expected = {
      // correctly sort params (nest level = 0)
      initialAddresses: [ADDRESS_A.toString()],
      maxAddresses: 1,
      maxDepth: 1,
      name: 'a',
      overrides: {
        // correctly sort params (nest level = 1)
        [ADDRESS_C.toString()]: {
          // correctly sort params (nest level = 2)
          fields: {},
          ignoreDiscovery: false,
          // sort array values
          ignoreInWatchMode: ['a', 'b'],
          ignoreMethods: ['c', 'd'],
          proxyType: 'call implementation proxy',
        },
        [ADDRESS_B.toString()]: {
          fields: {
            // do not sort this (nest level = 3)
            B: {
              type: 'call',
              method: 'crossChainContracts',
              args: [1],
            },
            A: {
              type: 'call',
              method: 'crossChainContracts',
              args: [10],
            },
          },
          ignoreDiscovery: false,
          ignoreInWatchMode: ['a', 'b'],
          ignoreMethods: ['c', 'd'],
          proxyType: 'call implementation proxy',
        },
      },
    }

    const result = getDiscoveryConfigEntries(config)

    expect(result).toEqual(JSON.stringify(expected))
  })
})
