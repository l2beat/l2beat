import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { ConfigRegistry } from '../config/ConfigRegistry'
import { StructureContract } from '../config/StructureConfig'
import { shouldSkip } from './shouldSkip'

describe(shouldSkip.name, () => {
  it('skips addresses marked as ignored', () => {
    const address = ChainSpecificAddress.random()
    const config = new ConfigRegistry({
      name: 'Test',
      chain: 'ethereum',
      initialAddresses: [],
      overrides: {
        [address.toString()]: StructureContract.parse({
          ignoreDiscovery: true,
        }),
      },
    })
    const result = shouldSkip(address, config.structure, 0, 1)
    expect(result).not.toEqual(undefined)
  })

  it('skips addresses that exceed max depth', () => {
    const address = ChainSpecificAddress.random()
    const config = new ConfigRegistry({
      name: 'Test',
      chain: 'ethereum',
      initialAddresses: [],
      maxDepth: 1,
    })
    const result = shouldSkip(address, config.structure, 2, 1)
    expect(result).not.toEqual(undefined)
  })

  it('skips addresses that exceed max addresses', () => {
    const address = ChainSpecificAddress.random()
    const config = new ConfigRegistry({
      name: 'Test',
      chain: 'ethereum',
      initialAddresses: [],
      maxAddresses: 1,
    })
    const result = shouldSkip(address, config.structure, 0, 2)
    expect(result).not.toEqual(undefined)
  })

  it('does not skip addresses that are not ignored', () => {
    const address = ChainSpecificAddress.random()
    const config = new ConfigRegistry({
      name: 'Test',
      chain: 'ethereum',
      initialAddresses: [],
    })
    const result = shouldSkip(address, config.structure, 0, 1)
    expect(result).toEqual(undefined)
  })
})
