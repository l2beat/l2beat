import { ContractParameters } from '@l2beat/discovery-types'
import { Bytes, EthereumAddress, Hash256, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { DiscoveryLogger } from '../DiscoveryLogger'
import { ContractOverrides } from '../config/DiscoveryOverrides'
import { HandlerExecutor } from '../handlers/HandlerExecutor'
import { IProvider } from '../provider/IProvider'
import { ProxyDetector } from '../proxies/ProxyDetector'
import { ContractSources } from '../source/SourceCodeService'
import { SourceCodeService } from '../source/SourceCodeService'
import { EMPTY_ANALYZED_CONTRACT } from '../utils/testUtils'
import { AddressAnalyzer } from './AddressAnalyzer'
import { TemplateService } from './TemplateService'

describe(AddressAnalyzer.name, () => {
  describe(AddressAnalyzer.prototype.analyze.name, () => {
    it('handles EOAs', async () => {
      const provider = mockObject<IProvider>({
        getBytecode: async () => Bytes.EMPTY,
      })
      const addressAnalyzer = new AddressAnalyzer(
        mockObject<ProxyDetector>(),
        mockObject<SourceCodeService>(),
        mockObject<HandlerExecutor>(),
        mockObject<TemplateService>({
          findMatchingTemplates: () => [],
        }),
        DiscoveryLogger.SILENT,
      )

      const address = EthereumAddress.random()
      const result = await addressAnalyzer.analyze(
        provider,
        address,
        undefined,
        undefined,
        DiscoveryLogger.SILENT,
      )

      expect(result).toEqual({
        type: 'EOA',
        address,
      })
    })

    it('handles contracts', async () => {
      const address = EthereumAddress.random()
      const implementation = EthereumAddress.random()
      const admin = EthereumAddress.random()
      const owner = EthereumAddress.random()

      const sources: ContractSources = {
        name: 'Test',
        isVerified: true,
        abi: ['function foo()', 'function bar()'],
        abis: {
          [address.toString()]: ['function foo()'],
          [implementation.toString()]: ['function bar()'],
        },
        sources: [
          {
            hash: Hash256.random(),
            name: 'Proxy1',
            address: address,
            source: {
              name: 'Proxy1',
              isVerified: true,
              abi: ['function foo()'],
              solidityVersion: '0.8.0',
              constructorArguments: '',
              files: { 'Foo.sol': 'contract Test { function foo() {} }' },
              remappings: [],
            },
          },
          {
            hash: Hash256.random(),
            name: 'Impl1',
            address: implementation,
            source: {
              name: 'Impl1',
              isVerified: true,
              abi: ['function bar()'],
              solidityVersion: '0.8.0',
              constructorArguments: '',
              files: { 'Bar.sol': 'contract Test { function bar() {} }' },
              remappings: [],
            },
          },
        ],
      }

      const provider = mockObject<IProvider>({
        getBytecode: async () => Bytes.fromHex('0x1234'),
        getDeployment: async () => ({
          timestamp: new UnixTime(1234),
          blockNumber: 9876,
          deployer: EthereumAddress.random(),
          transactionHash: Hash256.random(),
        }),
      })

      const addressAnalyzer = new AddressAnalyzer(
        mockObject<ProxyDetector>({
          detectProxy: async () => ({
            type: 'EIP1967 proxy',
            values: {
              $implementation: implementation.toString(),
              $admin: admin.toString(),
            },
          }),
        }),
        mockObject<SourceCodeService>({
          getSources: async () => sources,
        }),
        mockObject<HandlerExecutor>({
          execute: async () => ({
            results: [{ field: 'owner', value: owner.toString() }],
            values: { owner: owner.toString() },
            errors: {},
            usedTypes: [],
          }),
        }),
        mockObject<TemplateService>({
          findMatchingTemplates: () => [],
        }),
        DiscoveryLogger.SILENT,
      )

      const result = await addressAnalyzer.analyze(
        provider,
        address,
        undefined,
        undefined,
        DiscoveryLogger.SILENT,
      )

      expect(result).toEqual({
        ...EMPTY_ANALYZED_CONTRACT,
        address,
        name: 'Test',
        isVerified: true,
        deploymentTimestamp: new UnixTime(1234),
        deploymentBlockNumber: 9876,
        proxyType: 'EIP1967 proxy',
        implementations: [implementation],
        values: {
          $implementation: implementation.toString(),
          $admin: admin.toString(),
          owner: owner.toString(),
        },
        abis: sources.abis,
        sourceBundles: sources.sources,
        targetsMeta: {
          [admin.toString()]: {
            displayName: undefined,
            categories: undefined,
            description: undefined,
            permissions: [{ type: 'upgrade', delay: 0, target: address }],
            severity: undefined,
            types: undefined,
          },
        },
        relatives: {
          [owner.toString()]: new Set(),
          [admin.toString()]: new Set(),
        },
      })
    })

    it('handles unverified contracts', async () => {
      const address = EthereumAddress.random()
      const implementation = EthereumAddress.random()
      const admin = EthereumAddress.random()
      const owner = EthereumAddress.random()

      const sources: ContractSources = {
        name: 'Test',
        isVerified: false,
        abi: ['function foo()'],
        abis: {
          [address.toString()]: ['function foo()'],
        },
        sources: [
          {
            hash: Hash256.random(),
            name: 'Test',
            address,
            source: {
              name: 'Test',
              isVerified: true,
              abi: ['function foo()'],
              solidityVersion: '0.8.0',
              constructorArguments: '',
              files: { 'Foo.sol': 'contract Test { function foo() {} }' },
              remappings: [],
            },
          },
          {
            hash: Hash256.random(),
            name: 'Test2',
            address: implementation,
            source: {
              name: 'Test2',
              isVerified: false,
              abi: [],
              constructorArguments: '',
              files: {},
              remappings: [],
              solidityVersion: '0.8.0',
            },
          },
        ],
      }

      const provider = mockObject<IProvider>({
        getBytecode: async () => Bytes.fromHex('0x1234'),
        getDeployment: async () => ({
          timestamp: new UnixTime(1234),
          blockNumber: 9876,
          deployer: EthereumAddress.random(),
          transactionHash: Hash256.random(),
        }),
      })

      const addressAnalyzer = new AddressAnalyzer(
        mockObject<ProxyDetector>({
          detectProxy: async () => ({
            type: 'EIP1967 proxy',
            values: {
              $implementation: implementation.toString(),
              $admin: admin.toString(),
            },
          }),
        }),
        mockObject<SourceCodeService>({
          getSources: async () => sources,
        }),
        mockObject<HandlerExecutor>({
          execute: async () => ({
            results: [{ field: 'owner', value: owner.toString() }],
            values: { owner: owner.toString() },
            usedTypes: [],
            errors: {},
          }),
        }),
        mockObject<TemplateService>({
          findMatchingTemplates: () => [],
        }),
        DiscoveryLogger.SILENT,
      )

      const result = await addressAnalyzer.analyze(
        provider,
        address,
        undefined,
        undefined,
        DiscoveryLogger.SILENT,
      )

      expect(result).toEqual({
        ...EMPTY_ANALYZED_CONTRACT,
        name: 'Test',
        address,
        isVerified: false,
        deploymentTimestamp: new UnixTime(1234),
        deploymentBlockNumber: 9876,
        proxyType: 'EIP1967 proxy',
        implementations: [implementation],
        values: {
          $implementation: implementation.toString(),
          $admin: admin.toString(),
          owner: owner.toString(),
        },
        abis: sources.abis,
        sourceBundles: sources.sources,
        targetsMeta: {
          [admin.toString()]: {
            displayName: undefined,
            categories: undefined,
            description: undefined,
            permissions: [{ type: 'upgrade', delay: 0, target: address }],
            severity: undefined,
            types: undefined,
          },
        },
        relatives: {
          [owner.toString()]: new Set(),
          [admin.toString()]: new Set(),
        },
      })
    })

    it('handles contracts while omitting the sinceTimestamp', async () => {
      const address = EthereumAddress.random()
      const implementation = EthereumAddress.random()
      const admin = EthereumAddress.random()
      const owner = EthereumAddress.random()

      const sources: ContractSources = {
        name: 'Test',
        isVerified: true,
        abi: ['function foo()', 'function bar()'],
        abis: {
          [address.toString()]: ['function foo()'],
          [implementation.toString()]: ['function bar()'],
        },
        sources: [
          {
            hash: Hash256.random(),
            name: 'Test',
            address,
            source: {
              name: 'Test',
              isVerified: true,
              abi: ['function foo()'],
              solidityVersion: '0.8.0',
              constructorArguments: '',
              files: { 'Foo.sol': 'contract Test { function foo() {} }' },
              remappings: [],
            },
          },
          {
            hash: Hash256.random(),
            name: 'Test',
            address,
            source: {
              name: 'Test',
              isVerified: true,
              abi: ['function bar()'],
              solidityVersion: '0.8.0',
              constructorArguments: '',
              files: { 'Bar.sol': 'contract Test { function bar() {} }' },
              remappings: [],
            },
          },
        ],
      }

      const provider = mockObject<IProvider>({
        getBytecode: async () => Bytes.fromHex('0x1234'),
        getDeployment: mockFn().resolvesTo(undefined),
      })

      const addressAnalyzer = new AddressAnalyzer(
        mockObject<ProxyDetector>({
          detectProxy: async () => ({
            type: 'EIP1967 proxy',
            values: {
              $implementation: implementation.toString(),
              $admin: admin.toString(),
            },
          }),
        }),
        mockObject<SourceCodeService>({
          getSources: async () => sources,
        }),
        mockObject<HandlerExecutor>({
          execute: async () => ({
            results: [{ field: 'owner', value: owner.toString() }],
            values: { owner: owner.toString() },
            usedTypes: [],
            errors: {},
          }),
        }),
        mockObject<TemplateService>({
          findMatchingTemplates: () => [],
        }),
        DiscoveryLogger.SILENT,
      )

      const result = await addressAnalyzer.analyze(
        provider,
        address,
        undefined,
        undefined,
        DiscoveryLogger.SILENT,
      )

      expect(result).toEqual({
        ...EMPTY_ANALYZED_CONTRACT,
        address,
        name: 'Test',
        deploymentBlockNumber: undefined,
        deploymentTimestamp: undefined,
        isVerified: true,
        proxyType: 'EIP1967 proxy',
        implementations: [implementation],
        values: {
          $implementation: implementation.toString(),
          $admin: admin.toString(),
          owner: owner.toString(),
        },
        abis: sources.abis,
        sourceBundles: sources.sources,
        targetsMeta: {
          [admin.toString()]: {
            displayName: undefined,
            categories: undefined,
            description: undefined,
            permissions: [{ type: 'upgrade', delay: 0, target: address }],
            severity: undefined,
            types: undefined,
          },
        },
        relatives: {
          [owner.toString()]: new Set(),
          [admin.toString()]: new Set(),
        },
      })
    })
  })

  describe(AddressAnalyzer.prototype.hasContractChanged.name, () => {
    it('handles immutable contracts', async () => {
      const address = EthereumAddress.random()
      const values = { foo: 'bar' }

      const provider = mockObject<IProvider>({
        getBytecode: async () => Bytes.fromHex('0x10'),
      })

      const addressAnalyzer = new AddressAnalyzer(
        mockObject<ProxyDetector>(),
        mockObject<SourceCodeService>({
          getRelevantAbi: (abis) => abis[0] ?? [],
        }),
        mockObject<HandlerExecutor>({
          execute: mockFn()
            .resolvesToOnce({
              results: [],
              values,
              errors: {},
            })
            .resolvesToOnce({
              results: [],
              // values change on the second run
              values: { foo: 'baz' },
              errors: {},
            })
            .resolvesToOnce({
              results: [],
              values: {},
              // handler executor errors on the third run
              errors: {
                foo: 'error',
              },
            }),
        }),
        mockObject<TemplateService>({
          findMatchingTemplates: () => [],
        }),
        DiscoveryLogger.SILENT,
      )

      const contractParameters: ContractParameters = {
        name: 'name',
        address,
        proxyType: 'immutable',
        values,
      }
      const overrides: ContractOverrides = { address }
      const abis = {
        [address.toString()]: ['function foo()'],
      }

      const result = await addressAnalyzer.hasContractChanged(
        provider,
        contractParameters,
        overrides,
        undefined,
        abis,
      )
      expect(result).toEqual(false)

      const changedResult = await addressAnalyzer.hasContractChanged(
        provider,
        contractParameters,
        overrides,
        undefined,
        abis,
      )
      expect(changedResult).toEqual(true)

      await expect(
        async () =>
          await addressAnalyzer.hasContractChanged(
            provider,
            contractParameters,
            overrides,
            undefined,
            abis,
          ),
      ).toBeRejected()
    })

    it('handles proxy contracts', async () => {
      const proxy = EthereumAddress.random()
      const proxyValues = { foo: 'bar' }

      const implementation = EthereumAddress.random()
      const implementationValues = { bar: 'baz' }

      const values = { ...proxyValues, ...implementationValues }
      const provider = mockObject<IProvider>()

      const addressAnalyzer = new AddressAnalyzer(
        mockObject<ProxyDetector>(),
        mockObject<SourceCodeService>({
          getRelevantAbi: (abis) => [...(abis[0] ?? []), ...(abis[1] ?? [])],
        }),
        mockObject<HandlerExecutor>({
          execute: mockFn()
            .resolvesToOnce({
              results: [],
              values,
              errors: {},
            })
            .resolvesToOnce({
              results: [],
              values: { ...proxyValues, bar: 'changed' },
              errors: {},
            }),
        }),
        mockObject<TemplateService>({
          findMatchingTemplates: () => [],
        }),
        DiscoveryLogger.SILENT,
      )

      const contractParameters: ContractParameters = {
        name: 'name',
        address: proxy,
        proxyType: 'immutable',
        values,
      }
      const overrides: ContractOverrides = { address: proxy }
      const abis = {
        [proxy.toString()]: ['function foo()'],
        [implementation.toString()]: ['function bar()'],
      }

      const result = await addressAnalyzer.hasContractChanged(
        provider,
        contractParameters,
        overrides,
        undefined,
        abis,
      )
      expect(result).toEqual(false)

      const changedResult = await addressAnalyzer.hasContractChanged(
        provider,
        contractParameters,
        overrides,
        undefined,
        abis,
      )
      expect(changedResult).toEqual(true)
    })

    it('handles unverified contracts', async () => {
      const address = EthereumAddress.random()

      const provider = mockObject<IProvider>()
      const addressAnalyzer = new AddressAnalyzer(
        mockObject<ProxyDetector>(),
        mockObject<SourceCodeService>({
          getSources: mockFn()
            .resolvesToOnce(mockSources({ isVerified: false }))
            .resolvesToOnce(mockSources({ isVerified: true })),
        }),
        mockObject<HandlerExecutor>(),
        mockObject<TemplateService>({
          findMatchingTemplates: () => [],
        }),
        DiscoveryLogger.SILENT,
      )

      const contractParameters: ContractParameters = {
        name: 'name',
        address,
        proxyType: 'immutable',
        unverified: true,
      }
      const overrides: ContractOverrides = { address }

      const result = await addressAnalyzer.hasContractChanged(
        provider,
        contractParameters,
        overrides,
        undefined,
        {},
      )

      expect(result).toEqual(false)

      const changedResult = await addressAnalyzer.hasContractChanged(
        provider,
        contractParameters,
        overrides,
        undefined,
        {},
      )

      expect(changedResult).toEqual(true)
    })

    it('handles verified proxy with unverified implementation', async () => {
      const address = EthereumAddress.random()
      const implementation = EthereumAddress.random()

      const provider = mockObject<IProvider>()
      const addressAnalyzer = new AddressAnalyzer(
        mockObject<ProxyDetector>(),
        mockObject<SourceCodeService>({
          getSources: mockFn()
            .resolvesToOnce(mockSources({ isVerified: false }))
            .resolvesToOnce(mockSources({ isVerified: true })),
        }),
        mockObject<HandlerExecutor>(),
        mockObject<TemplateService>({
          findMatchingTemplates: () => [],
        }),
        DiscoveryLogger.SILENT,
      )

      const contractParameters: ContractParameters = {
        name: 'name',
        address,
        proxyType: 'EIP1967 proxy',
        values: {
          $implementation: implementation.toString(),
          $admin: EthereumAddress.random().toString(),
        },
        unverified: true,
      }
      const overrides: ContractOverrides = { address }

      const result = await addressAnalyzer.hasContractChanged(
        provider,
        contractParameters,
        overrides,
        undefined,
        {},
      )

      expect(result).toEqual(false)

      const changedResult = await addressAnalyzer.hasContractChanged(
        provider,
        contractParameters,
        overrides,
        undefined,
        {},
      )

      expect(changedResult).toEqual(true)
    })
  })

  it(AddressAnalyzer.prototype.hasEoaBecomeContract.name, async () => {
    const provider = mockObject<IProvider>({
      getBytecode: mockFn()
        .resolvesToOnce(Bytes.EMPTY)
        .resolvesToOnce(Bytes.fromHex('0x10')),
    })
    const addressAnalyzer = new AddressAnalyzer(
      mockObject<ProxyDetector>(),
      mockObject<SourceCodeService>(),
      mockObject<HandlerExecutor>(),
      mockObject<TemplateService>({
        findMatchingTemplates: () => [],
      }),
      DiscoveryLogger.SILENT,
    )

    const address = EthereumAddress.random()

    const result = await addressAnalyzer.hasEoaBecomeContract(provider, address)

    expect(result).toEqual(false)

    const changedResult = await addressAnalyzer.hasEoaBecomeContract(
      provider,
      address,
    )

    expect(changedResult).toEqual(true)
  })
})

function mockSources({ isVerified }: { isVerified: boolean }): ContractSources {
  return {
    name: '',
    isVerified,
    abi: [],
    abis: {},
    sources: [],
  }
}
