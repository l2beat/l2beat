import { ContractParameters } from '@l2beat/discovery-types'
import { Bytes, EthereumAddress, Hash256, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { DiscoveryLogger } from '../DiscoveryLogger'
import { ContractOverrides } from '../config/DiscoveryOverrides'
import { HandlerExecutor } from '../handlers/HandlerExecutor'
import { IProvider } from '../provider/IProvider'
import { ProxyDetector } from '../proxies/ProxyDetector'
import { ContractSources, SourceCodeService } from '../source/SourceCodeService'
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
          findMatchingTemplates: () => ({}),
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
            name: 'Proxy1',
            address: address,
            source: {
              files: { 'Foo.sol': 'contract Test { function foo() {} }' },
              remappings: [],
              solidityVersion: '0.8.0',
            },
          },
          {
            name: 'Impl1',
            address: implementation,
            source: {
              files: { 'Bar.sol': 'contract Test { function bar() {} }' },
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
            upgradeability: {
              type: 'EIP1967 proxy',
              implementation,
              admin,
            },
            implementations: [implementation],
            relatives: [admin],
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
          findMatchingTemplates: () => ({}),
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
        type: 'Contract',
        address,
        name: 'Test',
        derivedName: undefined,
        isVerified: true,
        deploymentTimestamp: new UnixTime(1234),
        deploymentBlockNumber: 9876,
        upgradeability: { type: 'EIP1967 proxy', implementation, admin },
        implementations: [implementation],
        values: { owner: owner.toString() },
        errors: {},
        abis: sources.abis,
        sourceBundles: sources.sources,
        extendedTemplate: undefined,
        selfMeta: undefined,
        targetsMeta: undefined,
        ignoreInWatchMode: undefined,
        usedTypes: [],
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
            name: 'Test',
            address,
            source: {
              files: { 'Foo.sol': 'contract Test { function foo() {} }' },
              remappings: [],
              solidityVersion: '0.8.0',
            },
          },
          {
            name: 'Test2',
            address: implementation,
            source: {
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
            upgradeability: {
              type: 'EIP1967 proxy',
              implementation,
              admin,
            },
            implementations: [implementation],
            relatives: [admin],
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
          findMatchingTemplates: () => ({}),
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
        type: 'Contract',
        name: 'Test',
        derivedName: undefined,
        address,
        isVerified: false,
        deploymentTimestamp: new UnixTime(1234),
        deploymentBlockNumber: 9876,
        upgradeability: { type: 'EIP1967 proxy', implementation, admin },
        implementations: [implementation],
        values: { owner: owner.toString() },
        errors: {},
        abis: sources.abis,
        sourceBundles: sources.sources,
        extendedTemplate: undefined,
        selfMeta: undefined,
        targetsMeta: undefined,
        ignoreInWatchMode: undefined,
        usedTypes: [],
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
            name: 'Test',
            address,
            source: {
              files: { 'Foo.sol': 'contract Test { function foo() {} }' },
              remappings: [],
              solidityVersion: '0.8.0',
            },
          },
          {
            name: 'Test',
            address,
            source: {
              files: { 'Bar.sol': 'contract Test { function bar() {} }' },
              remappings: [],
              solidityVersion: '0.8.0',
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
            upgradeability: {
              type: 'EIP1967 proxy',
              implementation,
              admin,
            },
            implementations: [implementation],
            relatives: [admin],
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
          findMatchingTemplates: () => ({}),
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
        type: 'Contract',
        address,
        name: 'Test',
        derivedName: undefined,
        deploymentBlockNumber: undefined,
        deploymentTimestamp: undefined,
        isVerified: true,
        upgradeability: { type: 'EIP1967 proxy', implementation, admin },
        implementations: [implementation],
        values: { owner: owner.toString() },
        errors: {},
        abis: sources.abis,
        sourceBundles: sources.sources,
        extendedTemplate: undefined,
        selfMeta: undefined,
        targetsMeta: undefined,
        ignoreInWatchMode: undefined,
        usedTypes: [],
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
          findMatchingTemplates: () => ({}),
        }),
        DiscoveryLogger.SILENT,
      )

      const contractParameters: ContractParameters = {
        name: 'name',
        address,
        upgradeability: { type: 'immutable' },
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
          findMatchingTemplates: () => ({}),
        }),
        DiscoveryLogger.SILENT,
      )

      const contractParameters: ContractParameters = {
        name: 'name',
        address: proxy,
        upgradeability: { type: 'immutable' },
        implementations: [implementation],
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
          findMatchingTemplates: () => ({}),
        }),
        DiscoveryLogger.SILENT,
      )

      const contractParameters: ContractParameters = {
        name: 'name',
        address,
        upgradeability: { type: 'immutable' },
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
          findMatchingTemplates: () => ({}),
        }),
        DiscoveryLogger.SILENT,
      )

      const contractParameters: ContractParameters = {
        name: 'name',
        address,
        upgradeability: {
          type: 'EIP1967 proxy',
          implementation,
          admin: EthereumAddress.random(),
        },
        implementations: [implementation],
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
        findMatchingTemplates: () => ({}),
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
