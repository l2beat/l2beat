import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import type { ContractSource } from '../../utils/IEtherscanClient'
import type { IProvider } from '../provider/IProvider'
import { SourceCodeService } from './SourceCodeService'

describe(SourceCodeService.name, () => {
  const FOO_ADDRESS = ChainSpecificAddress.random()
  const FOO_METADATA: ContractSource = {
    abi: [],
    name: 'Foo',
    isVerified: false,
    solidityVersion: '0.8.0',
    constructorArguments: '',
    files: {},
    remappings: [],
  }

  const BAR_ADDRESS = ChainSpecificAddress.random()
  const BAR_METADATA: ContractSource = {
    abi: ['function bar()'],
    name: 'Bar',
    isVerified: true,
    solidityVersion: '0.8.0',
    constructorArguments: '',
    files: { 'root.sol': 'contract Bar {}' },
    remappings: [],
  }

  const BAZ_ADDRESS = ChainSpecificAddress.random()
  const BAZ_METADATA: ContractSource = {
    abi: ['function baz()'],
    name: 'Baz',
    isVerified: true,
    solidityVersion: '0.8.0',
    constructorArguments: '',
    files: { 'root.sol': 'contract Baz {}' },
    remappings: [],
  }

  it('single, unverified contract', async () => {
    const provider = mockObject<IProvider>({
      getSource: mockFn(),
    })
    provider.getSource.resolvesToOnce(FOO_METADATA)

    const service = new SourceCodeService()

    const result = await service.getSources(provider, [FOO_ADDRESS], {})
    expect(result).toEqual({
      abi: [],
      abis: {},
      isVerified: false,
      name: 'Foo',
      sources: [
        {
          hash: undefined,
          name: 'Foo',
          address: FOO_ADDRESS,
          source: FOO_METADATA,
        },
      ],
    })
  })

  it('single, verified contract', async () => {
    const provider = mockObject<IProvider>({
      getSource: mockFn(),
    })
    provider.getSource.resolvesToOnce(BAR_METADATA)

    const service = new SourceCodeService()

    const result = await service.getSources(provider, [BAR_ADDRESS], {})
    expect(result).toEqual({
      abi: ['function bar()'],
      abis: {
        [BAR_ADDRESS.toString()]: ['function bar()'],
      },
      isVerified: true,
      name: 'Bar',
      sources: [
        {
          hash: Hash256(
            '0xec81a410d9701878fa4bffb9afa6a6602c33e540e61ea2442a7f72a2795c01c2',
          ),
          name: 'Bar',
          address: BAR_ADDRESS,
          source: BAR_METADATA,
        },
      ],
    })
  })

  it('multiple verified contracts', async () => {
    const provider = mockObject<IProvider>({
      getSource: mockFn(),
    })
    provider.getSource.resolvesToOnce(BAR_METADATA).resolvesToOnce(BAZ_METADATA)

    const service = new SourceCodeService()

    const result = await service.getSources(
      provider,
      [BAR_ADDRESS, BAZ_ADDRESS],
      {},
    )
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
          hash: Hash256(
            '0xec81a410d9701878fa4bffb9afa6a6602c33e540e61ea2442a7f72a2795c01c2',
          ),
          name: 'Bar',
          address: BAR_ADDRESS,
          source: BAR_METADATA,
        },
        {
          hash: Hash256(
            '0x4aedd5d0f7a147c734bad2257077654a842ef3840e9641be8859e2bcc707fb3d',
          ),
          name: 'Baz',
          address: BAZ_ADDRESS,
          source: BAZ_METADATA,
        },
      ],
    })
  })

  it('unverified implementation', async () => {
    const provider = mockObject<IProvider>({
      getSource: mockFn(),
    })
    provider.getSource.resolvesToOnce(BAR_METADATA).resolvesToOnce(FOO_METADATA)

    const service = new SourceCodeService()

    const result = await service.getSources(
      provider,
      [BAR_ADDRESS, FOO_ADDRESS],
      {},
    )
    expect(result).toEqual({
      abi: ['function bar()'],
      abis: {
        [BAR_ADDRESS.toString()]: ['function bar()'],
      },
      isVerified: false,
      name: 'Foo',
      sources: [
        {
          hash: Hash256(
            '0xec81a410d9701878fa4bffb9afa6a6602c33e540e61ea2442a7f72a2795c01c2',
          ),
          name: 'Bar',
          address: BAR_ADDRESS,
          source: BAR_METADATA,
        },
        {
          hash: undefined,
          name: 'Foo',
          address: FOO_ADDRESS,
          source: FOO_METADATA,
        },
      ],
    })
  })

  it('single manually verified contract', async () => {
    const provider = mockObject<IProvider>({
      getSource: mockFn(),
    })
    provider.getSource.resolvesToOnce(FOO_METADATA)

    const service = new SourceCodeService()

    const result = await service.getSources(provider, [FOO_ADDRESS], {
      [FOO_ADDRESS]: 'LINK_TO_SOURCE_CODE',
    })

    expect(result).toEqual({
      abi: [],
      abis: {},
      isVerified: true,
      name: 'Foo',
      sources: [
        {
          hash: '0xebfdc649af5aa73605ac6eae403d0f4d855f2674bdee881b0f5f77a49dcf843e',
          name: 'Foo',
          address: FOO_ADDRESS,
          source: FOO_METADATA,
        },
      ],
    })
  })

  it('manually verified implementation', async () => {
    const provider = mockObject<IProvider>({
      getSource: mockFn(),
    })
    provider.getSource.resolvesToOnce(BAR_METADATA).resolvesToOnce(FOO_METADATA)

    const service = new SourceCodeService()

    const result = await service.getSources(
      provider,
      [BAR_ADDRESS, FOO_ADDRESS],
      {
        [FOO_ADDRESS]: 'LINK_TO_SOURCE_CODE',
      },
    )

    expect(result).toEqual({
      abi: ['function bar()'],
      abis: {
        [BAR_ADDRESS.toString()]: ['function bar()'],
      },
      isVerified: true,
      name: 'Foo',
      sources: [
        {
          hash: Hash256(
            '0xec81a410d9701878fa4bffb9afa6a6602c33e540e61ea2442a7f72a2795c01c2',
          ),
          name: 'Bar',
          address: BAR_ADDRESS,
          source: BAR_METADATA,
        },
        {
          hash: '0xebfdc649af5aa73605ac6eae403d0f4d855f2674bdee881b0f5f77a49dcf843e',
          name: 'Foo',
          address: FOO_ADDRESS,
          source: FOO_METADATA,
        },
      ],
    })
  })
})
