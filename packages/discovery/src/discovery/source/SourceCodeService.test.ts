import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import {
  ContractMetadata,
  DiscoveryProvider,
} from '../provider/DiscoveryProvider'
import { processSources } from './processSources'
import { SourceCodeService } from './SourceCodeService'

describe(SourceCodeService.name, () => {
  const FOO_ADDRESS = EthereumAddress.random()
  const FOO_METADATA: ContractMetadata = {
    abi: [],
    name: 'Foo',
    source: 'foo',
    isVerified: false,
  }

  const BAR_ADDRESS = EthereumAddress.random()
  const BAR_METADATA: ContractMetadata = {
    abi: ['function bar()'],
    name: 'Bar',
    source: 'bar',
    isVerified: true,
  }

  const BAZ_ADDRESS = EthereumAddress.random()
  const BAZ_METADATA: ContractMetadata = {
    abi: ['function baz()'],
    name: 'Baz',
    source: 'baz',
    isVerified: true,
  }

  it('single, unverified contract', async () => {
    const provider = mockObject<DiscoveryProvider>({
      getMetadata: mockFn(),
    })
    provider.getMetadata.resolvesToOnce(FOO_METADATA)

    const service = new SourceCodeService(provider)

    const result = await service.getSources(FOO_ADDRESS)
    expect(result).toEqual({
      abi: [],
      abis: {},
      isVerified: false,
      name: 'Foo',
      files: [processSources(FOO_ADDRESS, FOO_METADATA)],
    })
  })

  it('single, verified contract', async () => {
    const provider = mockObject<DiscoveryProvider>({
      getMetadata: mockFn(),
    })
    provider.getMetadata.resolvesToOnce(BAR_METADATA)

    const service = new SourceCodeService(provider)

    const result = await service.getSources(BAR_ADDRESS)
    expect(result).toEqual({
      abi: ['function bar()'],
      abis: {
        [BAR_ADDRESS.toString()]: ['function bar()'],
      },
      isVerified: true,
      name: 'Bar',
      files: [processSources(BAR_ADDRESS, BAR_METADATA)],
    })
  })

  it('multiple verified contracts', async () => {
    const provider = mockObject<DiscoveryProvider>({
      getMetadata: mockFn(),
    })
    provider.getMetadata
      .resolvesToOnce(BAR_METADATA)
      .resolvesToOnce(BAZ_METADATA)

    const service = new SourceCodeService(provider)

    const result = await service.getSources(BAR_ADDRESS, [BAZ_ADDRESS])
    expect(result).toEqual({
      abi: ['function bar()', 'function baz()'],
      abis: {
        [BAR_ADDRESS.toString()]: ['function bar()'],
        [BAZ_ADDRESS.toString()]: ['function baz()'],
      },
      isVerified: true,
      name: 'Baz',
      files: [
        processSources(BAR_ADDRESS, BAR_METADATA),
        processSources(BAZ_ADDRESS, BAZ_METADATA),
      ],
    })
  })

  it('unverified implementation', async () => {
    const provider = mockObject<DiscoveryProvider>({
      getMetadata: mockFn(),
    })
    provider.getMetadata
      .resolvesToOnce(BAR_METADATA)
      .resolvesToOnce(FOO_METADATA)

    const service = new SourceCodeService(provider)

    const result = await service.getSources(BAR_ADDRESS, [FOO_ADDRESS])
    expect(result).toEqual({
      abi: ['function bar()'],
      abis: {
        [BAR_ADDRESS.toString()]: ['function bar()'],
      },
      isVerified: false,
      name: 'Foo',
      files: [
        processSources(BAR_ADDRESS, BAR_METADATA),
        processSources(FOO_ADDRESS, FOO_METADATA),
      ],
    })
  })
})
