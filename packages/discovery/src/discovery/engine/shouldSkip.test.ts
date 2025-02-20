import { EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { ConfigReader } from '../config/ConfigReader'
import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { DiscoveryContract } from '../config/RawDiscoveryConfig'
import { shouldSkip } from './shouldSkip'

describe(shouldSkip.name, () => {
  it('skips addresses marked as ignored', () => {
    const address = EthereumAddress.random()
    const config = new DiscoveryConfig({
      name: 'Test',
      chain: 'ethereum',
      initialAddresses: [],
      overrides: {
        [address.toString()]: DiscoveryContract.parse({
          ignoreDiscovery: true,
        }),
      },
    })
    const result = shouldSkip(address, config, 0, 1)
    expect(result).not.toEqual(undefined)
  })

  it('skips addresses from a shared module', () => {
    const address = EthereumAddress.random()
    const configReader = mockObject<ConfigReader>({
      readDiscovery: () => ({
        name: 'SharedFoo',
        chain: 'ethereum',
        blockNumber: 1234,
        contracts: [
          {
            name: 'Foo',
            address,
            upgradeability: { type: 'immutable' },
          },
        ],
        eoas: [],
        abis: {},
        fieldMeta: {},
        configHash: Hash256.random(),
        version: 123,
        usedTemplates: {},
        shapeFilesHash: Hash256.random(),
      }),
    })

    const config = new DiscoveryConfig(
      {
        name: 'Test',
        chain: 'ethereum',
        initialAddresses: [],
        names: {
          [address.toString()]: 'Foo',
        },
        sharedModules: {
          Foo: 'SharedFoo',
        },
      },
      configReader,
    )
    const result = shouldSkip(address, config, 0, 1)
    expect(result).not.toEqual(undefined)
  })

  it('skips addresses that exceed max depth', () => {
    const address = EthereumAddress.random()
    const config = new DiscoveryConfig({
      name: 'Test',
      chain: 'ethereum',
      initialAddresses: [],
      maxDepth: 1,
    })
    const result = shouldSkip(address, config, 2, 1)
    expect(result).not.toEqual(undefined)
  })

  it('skips addresses that exceed max addresses', () => {
    const address = EthereumAddress.random()
    const config = new DiscoveryConfig({
      name: 'Test',
      chain: 'ethereum',
      initialAddresses: [],
      maxAddresses: 1,
    })
    const result = shouldSkip(address, config, 0, 2)
    expect(result).not.toEqual(undefined)
  })

  it('does not skip addresses that are not ignored', () => {
    const address = EthereumAddress.random()
    const config = new DiscoveryConfig({
      name: 'Test',
      chain: 'ethereum',
      initialAddresses: [],
    })
    const result = shouldSkip(address, config, 0, 1)
    expect(result).toEqual(undefined)
  })
})
