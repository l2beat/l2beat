import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { shouldSkip } from './shouldSkip'

describe(shouldSkip.name, () => {
  it('skips addresses marked as ignored', () => {
    const address = EthereumAddress.random()
    const config = new DiscoveryConfig({
      name: 'Test',
      initialAddresses: [],
      overrides: {
        [address.toString()]: {
          ignoreDiscovery: true,
        },
      },
    })
    const result = shouldSkip({ address, depth: 0, counter: 1 }, config)
    expect(result).not.toEqual(undefined)
  })

  it('skips addresses from a shared module', () => {
    const address = EthereumAddress.random()
    const config = new DiscoveryConfig({
      name: 'Test',
      initialAddresses: [],
      names: {
        [address.toString()]: 'Foo',
      },
      sharedModules: {
        Foo: 'SharedFoo',
      },
    })
    const result = shouldSkip({ address, depth: 0, counter: 1 }, config)
    expect(result).not.toEqual(undefined)
  })

  it('skips addresses that exceed max depth', () => {
    const address = EthereumAddress.random()
    const config = new DiscoveryConfig({
      name: 'Test',
      initialAddresses: [],
      maxDepth: 1,
    })
    const result = shouldSkip({ address, depth: 2, counter: 1 }, config)
    expect(result).not.toEqual(undefined)
  })

  it('skips addresses that exceed max addresses', () => {
    const address = EthereumAddress.random()
    const config = new DiscoveryConfig({
      name: 'Test',
      initialAddresses: [],
      maxAddresses: 1,
    })
    const result = shouldSkip({ address, depth: 0, counter: 2 }, config)
    expect(result).not.toEqual(undefined)
  })

  it('does not skip addresses that are not ignored', () => {
    const address = EthereumAddress.random()
    const config = new DiscoveryConfig({
      name: 'Test',
      initialAddresses: [],
    })
    const result = shouldSkip({ address, depth: 0, counter: 1 }, config)
    expect(result).toEqual(undefined)
  })
})
