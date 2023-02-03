import { EthereumAddress } from '@l2beat/types'
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

describe(getDiscoveryConfigHash.name, () => {
  it('correctly generates hash for given config', () => {
    const config: DiscoveryConfig = {
      name: 'a',
      initialAddresses: [ADDRESS_A],
      maxAddresses: 1,
      maxDepth: 1,
      overrides: {
        [ADDRESS_B.toString()]: {
          ignoreInWatchMode: ['a', 'b'],
          ignoreMethods: ['c', 'd'],
          ignoreDiscovery: false,
        },
      },
    }

    const result = getDiscoveryConfigHash(config)

    const expected = hashJson(JSON.stringify(config))

    expect(result).toEqual(expected)
  })

  it.only(getDiscoveryConfigEntries.name, () => {
    const config: DiscoveryConfig = {
      name: 'a',
      initialAddresses: [ADDRESS_A],
      maxDepth: 1,
      maxAddresses: 1,
      overrides: {
        [ADDRESS_B.toString()]: {
          ignoreInWatchMode: ['a', 'b'],
          ignoreMethods: ['c', 'd'],
          ignoreDiscovery: false,
          proxyType: 'call implementation proxy',
          fields: {},
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
      initialAddresses: [ADDRESS_A.toString()],
      maxAddresses: 1,
      maxDepth: 1,
      name: 'a',
      overrides: {
        [ADDRESS_C.toString()]: {
          fields: {},
          ignoreDiscovery: false,
          ignoreInWatchMode: ['a', 'b'],
          ignoreMethods: ['c', 'd'],
          proxyType: 'call implementation proxy',
        },
        [ADDRESS_B.toString()]: {
          fields: {},
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
