import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { ConfigReader } from '../config/ConfigReader'
import { ConfigRegistry } from '../config/ConfigRegistry'
import { StructureContract } from '../config/StructureConfig'
import { buildSharedModuleIndex } from '../config/structureUtils'
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
    const index = buildSharedModuleIndex(config.structure)
    const result = shouldSkip(address, config.structure, index, 0, 1)
    expect(result).not.toEqual(undefined)
  })

  it('skips addresses from a shared module', () => {
    const address = ChainSpecificAddress.random()
    const configReader = mockObject<ConfigReader>({
      readDiscovery: () => ({
        name: 'SharedFoo',
        chain: 'ethereum',
        timestamp: 1234,
        entries: [
          {
            type: 'Contract',
            name: 'Foo',
            address: address,
            upgradeability: { type: 'immutable' },
          },
        ],
        abis: {},
        fieldMeta: {},
        configHash: Hash256.random(),
        version: 123,
        usedTemplates: {},
        usedBlockNumbers: {},
        shapeFilesHash: Hash256.random(),
      }),
    })

    const config = new ConfigRegistry({
      name: 'Test',
      chain: 'ethereum',
      initialAddresses: [],
      sharedModules: ['SharedFoo'],
    })
    const index = buildSharedModuleIndex(config.structure, configReader)
    const result = shouldSkip(address, config.structure, index, 0, 1)
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
    const index = buildSharedModuleIndex(config.structure)
    const result = shouldSkip(address, config.structure, index, 2, 1)
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
    const index = buildSharedModuleIndex(config.structure)
    const result = shouldSkip(address, config.structure, index, 0, 2)
    expect(result).not.toEqual(undefined)
  })

  it('does not skip addresses that are not ignored', () => {
    const address = ChainSpecificAddress.random()
    const config = new ConfigRegistry({
      name: 'Test',
      chain: 'ethereum',
      initialAddresses: [],
    })
    const index = buildSharedModuleIndex(config.structure)
    const result = shouldSkip(address, config.structure, index, 0, 1)
    expect(result).toEqual(undefined)
  })
})
