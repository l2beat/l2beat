import { EthereumAddress } from '@l2beat/types'
import { expect } from 'earljs'

import { hashJson } from '../../../tools/hashJson'
import { DiscoveryConfig } from '../DiscoveryConfig'
import { getDiscoveryConfigHash } from './getDiscoveryConfigHash'

const ADDRESS_A = EthereumAddress.random()
const ADDRESS_B = EthereumAddress.random()

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
})
