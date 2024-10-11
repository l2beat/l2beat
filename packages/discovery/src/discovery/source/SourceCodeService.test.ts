import { EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { ContractSource } from '../../utils/IEtherscanClient'
import { IProvider } from '../provider/IProvider'
import { SourceCodeService } from './SourceCodeService'

describe(SourceCodeService.name, () => {
  const FOO_ADDRESS = EthereumAddress.random()
  const FOO_METADATA: ContractSource = {
    abi: [],
    name: 'Foo',
    isVerified: false,
    solidityVersion: '0.8.0',
    constructorArguments: '',
    files: {},
    remappings: [],
  }

  const BAR_ADDRESS = EthereumAddress.random()
  const BAR_METADATA: ContractSource = {
    abi: ['function bar()'],
    name: 'Bar',
    isVerified: true,
    solidityVersion: '0.8.0',
    constructorArguments: '',
    files: {},
    remappings: [],
  }

  const BAZ_ADDRESS = EthereumAddress.random()
  const BAZ_METADATA: ContractSource = {
    abi: ['function baz()'],
    name: 'Baz',
    isVerified: true,
    solidityVersion: '0.8.0',
    constructorArguments: '',
    files: {},
    remappings: [],
  }

  it('single, unverified contract', async () => {
    const provider = mockObject<IProvider>({
      getSource: mockFn(),
    })
    provider.getSource.resolvesToOnce(FOO_METADATA)

    const service = new SourceCodeService()

    const result = await service.getSources(provider, FOO_ADDRESS)
    expect(result).toEqual({
      abi: [],
      abis: {},
      isVerified: false,
      name: 'Foo',
      sources: [
        {
          hash: Hash256.random(),
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

    const result = await service.getSources(provider, BAR_ADDRESS)
    expect(result).toEqual({
      abi: ['function bar()'],
      abis: {
        [BAR_ADDRESS.toString()]: ['function bar()'],
      },
      isVerified: true,
      name: 'Bar',
      sources: [
        {
          hash: Hash256.random(),
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

    const result = await service.getSources(provider, BAR_ADDRESS, [
      BAZ_ADDRESS,
    ])
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
          hash: Hash256.random(),
          name: 'Bar',
          address: BAR_ADDRESS,
          source: BAR_METADATA,
        },
        {
          hash: Hash256.random(),
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

    const result = await service.getSources(provider, BAR_ADDRESS, [
      FOO_ADDRESS,
    ])
    expect(result).toEqual({
      abi: ['function bar()'],
      abis: {
        [BAR_ADDRESS.toString()]: ['function bar()'],
      },
      isVerified: false,
      name: 'Foo',
      sources: [
        {
          hash: Hash256.random(),
          name: 'Bar',
          address: BAR_ADDRESS,
          source: BAR_METADATA,
        },
        {
          hash: Hash256.random(),
          name: 'Foo',
          address: FOO_ADDRESS,
          source: FOO_METADATA,
        },
      ],
    })
  })
})
