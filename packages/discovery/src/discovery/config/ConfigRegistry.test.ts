import { hashJson } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { ConfigRegistry } from './ConfigRegistry'
import { StructureContract, type StructureConfig } from './StructureConfig'
import { getDiscoveryConfigEntries } from './getDiscoveryConfigEntries'

const ADDRESS_A = EthereumAddress.random()
const ADDRESS_B = EthereumAddress.random()

const OVERRIDE_A = {
  ignoreInWatchMode: ['b', 'a'],
  ignoreMethods: ['d', 'c'],
  ignoreDiscovery: false,
}
const OVERRIDE_B = {
  ignoreDiscovery: true,
}
const CONFIG = new ConfigRegistry({
  name: 'a',
  chain: 'ethereum',
  initialAddresses: [ADDRESS_A],
  maxAddresses: 1,
  maxDepth: 1,
  names: {
    [ADDRESS_A.toString()]: 'A',
    [ADDRESS_B.toString()]: 'B',
  },
  overrides: {
    [ADDRESS_A.toString()]: StructureContract.parse(OVERRIDE_A),
    [ADDRESS_B.toString()]: StructureContract.parse(OVERRIDE_B),
  },
})

describe(ConfigRegistry.name, () => {
  describe('overrides', () => {
    it('gets override for given address, ignoring common name since it is already named', () => {
      const result = CONFIG.for(ADDRESS_B)
      expect(result.address).toEqual(ADDRESS_B)
    })
  })

  describe('hash', () => {
    it('uses entries sorting algorithm', () => {
      const result = CONFIG.hash

      const expected = hashJson(getDiscoveryConfigEntries(CONFIG.raw))

      expect(result).toEqual(expected)
    })

    it('does not modify original config object', () => {
      const config: ConfigRegistry = new ConfigRegistry({
        name: 'a',
        chain: 'ethereum',
        initialAddresses: [
          EthereumAddress('0x0000000000000000000000000000000000000003'),
          EthereumAddress('0x0000000000000000000000000000000000000002'),
          EthereumAddress('0x0000000000000000000000000000000000000001'),
        ],
      })
      const copiedConfig = JSON.parse(
        JSON.stringify(config.raw),
      ) as StructureConfig

      // run hash getter, which will run the function that sorts the config
      config.hash

      expect(config.raw).toEqual(copiedConfig)
    })
  })
})
