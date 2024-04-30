import { expect, mockFn, mockObject } from 'earl'

import { EthereumAddress } from '../../utils/EthereumAddress'
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
    solidityVersion: '0.8.0',
  }

  const BAR_ADDRESS = EthereumAddress.random()
  const BAR_METADATA: ContractMetadata = {
    abi: ['function bar()'],
    name: 'Bar',
    source: 'bar',
    isVerified: true,
    solidityVersion: '0.8.0',
  }

  const BAZ_ADDRESS = EthereumAddress.random()
  const BAZ_METADATA: ContractMetadata = {
    abi: ['function baz()'],
    name: 'Baz',
    source: 'baz',
    isVerified: true,
    solidityVersion: '0.8.0',
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
      sources: [
        {
          name: 'Foo',
          address: FOO_ADDRESS,
          source: processSources(FOO_ADDRESS, FOO_METADATA),
        },
      ],
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
      sources: [
        {
          name: 'Bar',
          address: BAR_ADDRESS,
          source: processSources(BAR_ADDRESS, BAR_METADATA),
        },
      ],
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
      sources: [
        {
          name: 'Bar',
          address: BAR_ADDRESS,
          source: processSources(BAR_ADDRESS, BAR_METADATA),
        },
        {
          name: 'Baz',
          address: BAZ_ADDRESS,
          source: processSources(BAZ_ADDRESS, BAZ_METADATA),
        },
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
      sources: [
        {
          name: 'Bar',
          address: BAR_ADDRESS,
          source: processSources(BAR_ADDRESS, BAR_METADATA),
        },
        {
          name: 'Foo',
          address: FOO_ADDRESS,
          source: processSources(FOO_ADDRESS, FOO_METADATA),
        },
      ],
    })
  })
})
