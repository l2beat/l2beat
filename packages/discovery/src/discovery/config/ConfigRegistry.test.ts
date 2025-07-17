import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { ConfigRegistry } from './ConfigRegistry'
import { StructureContract } from './StructureConfig'
import { makeEntryStructureConfig } from './structureUtils'

const ADDRESS_A = ChainSpecificAddress.random()
const ADDRESS_B = ChainSpecificAddress.random()

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
      const result = makeEntryStructureConfig(CONFIG.structure, ADDRESS_B)
      expect(result.address).toEqual(ADDRESS_B)
    })
  })
})
