import { EthereumAddress } from '@l2beat/shared'
import { expect } from 'earl'

import { hashJson } from '../../../tools/hashJson'
import { getDiscoveryConfigEntries } from '../utils/getDiscoveryConfigEntries'
import { DiscoveryConfig } from './DiscoveryConfig'

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
const CONFIG = new DiscoveryConfig({
  name: 'a',
  initialAddresses: [ADDRESS_A],
  maxAddresses: 1,
  maxDepth: 1,
  names: {
    [ADDRESS_A.toString()]: 'A',
    [ADDRESS_B.toString()]: 'B',
  },
  overrides: {
    A: OVERRIDE_A,
    [ADDRESS_B.toString()]: OVERRIDE_B,
  },
})

describe(DiscoveryConfig.name, () => {
  describe('overrides', () => {
    it('gets override for given address', () => {
      const result = CONFIG.overrides.get(ADDRESS_B)
      expect(result).toEqual({ ...OVERRIDE_B, address: ADDRESS_B, name: 'B' })
    })
    it('gets override for given name', () => {
      const result = CONFIG.overrides.get('A')
      expect(result).toEqual({ ...OVERRIDE_A, address: ADDRESS_A, name: 'A' })
    })
    it('throws if override is not found', () => {
      expect(() => CONFIG.overrides.get('C')).toThrow()
    })
  })

  describe('hash', () => {
    it('uses entries sorting algorithm', () => {
      const result = CONFIG.hash

      const expected = hashJson(getDiscoveryConfigEntries(CONFIG.raw))

      expect(result).toEqual(expected)
    })
  })
})
