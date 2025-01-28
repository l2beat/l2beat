import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import {
  DiscoveryContract,
  type RawDiscoveryConfig,
} from '../config/RawDiscoveryConfig'
import { getDiscoveryConfigEntries } from './getDiscoveryConfigEntries'

const ADDRESS_A = EthereumAddress('0xc186fA914353c44b2E33eBE05f21846F1048bEda')
const ADDRESS_B = EthereumAddress('0xB524735356985D2f267FA010D681f061DfF03715')
const ADDRESS_C = EthereumAddress('0x592349F7DeDB2b75f9d4F194d4b7C16D82E507Dc')

describe(getDiscoveryConfigEntries.name, () => {
  it('correctly sorts raw config object keys', () => {
    const config: RawDiscoveryConfig = {
      name: 'a',
      chain: 'ethereum',
      initialAddresses: [ADDRESS_A],
      maxDepth: 1,
      maxAddresses: 1,
      overrides: {
        [ADDRESS_B.toString()]: DiscoveryContract.parse({
          ignoreInWatchMode: ['b', 'a'],
          ignoreMethods: ['d', 'c'],
          ignoreDiscovery: false,
          proxyType: 'call implementation proxy',
          fields: {
            B: {
              handler: {
                type: 'call',
                method: 'crossChainContracts',
                args: [1],
              },
            },
            A: {
              handler: {
                type: 'call',
                method: 'crossChainContracts',
                args: [10],
              },
            },
          },
        }),
        [ADDRESS_C.toString()]: DiscoveryContract.parse({
          ignoreInWatchMode: ['a', 'b'],
          ignoreMethods: ['c', 'd'],
          ignoreDiscovery: false,
          proxyType: 'call implementation proxy',
          fields: {},
        }),
      },
    }

    const expected = {
      // correctly sort params (nest level = 0)
      chain: 'ethereum',
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
          ignoreRelatives: [],
          manualSourcePaths: {},
          methods: {},
          proxyType: 'call implementation proxy',
          types: {},
        },
        [ADDRESS_B.toString()]: {
          fields: {
            // do not sort this (nest level = 3)
            B: {
              handler: {
                type: 'call',
                method: 'crossChainContracts',
                args: [1],
              },
            },
            A: {
              handler: {
                type: 'call',
                method: 'crossChainContracts',
                args: [10],
              },
            },
          },
          ignoreDiscovery: false,
          ignoreInWatchMode: ['a', 'b'],
          ignoreMethods: ['c', 'd'],
          ignoreRelatives: [],
          manualSourcePaths: {},
          methods: {},
          proxyType: 'call implementation proxy',
          types: {},
        },
      },
    }

    const result = getDiscoveryConfigEntries(config)

    expect(result).toEqual(JSON.stringify(expected))
  })
})
