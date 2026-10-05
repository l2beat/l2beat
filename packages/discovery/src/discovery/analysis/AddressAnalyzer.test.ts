import {
  Bytes,
  ChainSpecificAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { StructureContract } from '../config/StructureConfig'
import { makeEntryStructureConfig } from '../config/structureUtils'
import type { HandlerExecutor } from '../handlers/HandlerExecutor'
import type { IProvider } from '../provider/IProvider'
import type { ProxyDetector } from '../proxies/ProxyDetector'
import type {
  ContractSources,
  SourceCodeService,
} from '../source/SourceCodeService'
import type { Templatizer } from '../templatizer/Templatizer'
import { EMPTY_ANALYZED_CONTRACT, EMPTY_ANALYZED_EOA } from '../utils/testUtils'
import { AddressAnalyzer } from './AddressAnalyzer'
import type { TemplateService } from './TemplateService'

describe(AddressAnalyzer.name, () => {
  const overrides = StructureContract.parse({})
  const address = ChainSpecificAddress.random()
  const config = makeEntryStructureConfig(
    { overrides: { [address]: overrides } },
    address,
  )

  describe(AddressAnalyzer.prototype.analyze.name, () => {
    it('handles EOAs', async () => {
      const sources: ContractSources = {
        name: '',
        isVerified: false,
        abi: [],
        abis: {},
        sources: [],
      }

      const provider = mockObject<IProvider>({
        getBytecode: async () => Bytes.EMPTY,
        chain: 'ethereum',
      })
      const addressAnalyzer = new AddressAnalyzer(
        mockObject<ProxyDetector>({
          detectProxy: async () => ({
            type: 'EOA',
            values: {},
            deployment: undefined,
            addresses: [],
          }),
        }),
        mockObject<SourceCodeService>({
          getSources: async () => sources,
        }),
        mockObject<HandlerExecutor>({
          execute: async () => ({
            results: [],
            values: {},
            usedTypes: [],
            errors: {},
          }),
        }),
        mockObject<TemplateService>({
          findMatchingTemplates: () => [],
        }),
      )

      const address = ChainSpecificAddress.random()
      const result = await addressAnalyzer.analyze(provider, address, config)

      expect(result).toEqual({
        ...EMPTY_ANALYZED_EOA,
        type: 'EOA',
        name: undefined,
        deploymentTimestamp: undefined,
        deploymentBlockNumber: undefined,
        implementationNames: undefined,
        address,
      })
    })

    it('handles contracts', async () => {
      const address = ChainSpecificAddress.random()
      const implementation = ChainSpecificAddress.random()
      const admin = ChainSpecificAddress.random()
      const owner = ChainSpecificAddress.random()
      const deployer = ChainSpecificAddress.random()

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
              rootFile: 'Foo.sol',
              isVerified: true,
              abi: ['function foo()'],
              solidityVersion: '0.8.0',
              constructorArguments: '',
              files: { 'Foo.sol': 'contract Test { function foo() {} }' },
              remappings: [],
              libraries: {},
            },
          },
          {
            hash: Hash256.random(),
            name: 'Impl1',
            address: implementation,
            source: {
              name: 'Impl1',
              rootFile: 'Bar.sol',
              isVerified: true,
              abi: ['function bar()'],
              solidityVersion: '0.8.0',
              constructorArguments: '',
              files: { 'Bar.sol': 'contract Test { function bar() {} }' },
              remappings: [],
              libraries: {},
            },
          },
        ],
      }

      const provider = mockObject<IProvider>({
        getBytecode: async () => Bytes.fromHex('0x1234'),
        chain: 'ethereum',
      })

      const addressAnalyzer = new AddressAnalyzer(
        mockObject<ProxyDetector>({
          detectProxy: async () => ({
            type: 'EIP1967 proxy',
            values: {
              $implementation: implementation.toString(),
              $admin: admin.toString(),
            },
            deployment: {
              timestamp: UnixTime(1234),
              blockNumber: 9876,
              deployer,
              transactionHash: Hash256.random(),
            },
            addresses: [],
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
      )

      const result = await addressAnalyzer.analyze(provider, address, config)

      expect(result).toEqual({
        ...EMPTY_ANALYZED_CONTRACT,
        address,
        name: 'Test',
        isVerified: true,
        deployerAddress: deployer,
        deploymentTimestamp: UnixTime(1234),
        deploymentBlockNumber: 9876,
        proxyType: 'EIP1967 proxy',
        implementations: [implementation],
        values: {
          $implementation: implementation.toString(),
          $admin: admin.toString(),
          owner: owner.toString(),
        },
        implementationNames: {
          [address.toString()]: 'Proxy1',
          [implementation.toString()]: 'Impl1',
        },
        abis: sources.abis,
        sourceBundles: sources.sources,
        relatives: {
          [owner.toString()]: new Set(),
          [admin.toString()]: new Set(),
        },
      })
    })

    it('handles unverified contracts', async () => {
      const address = ChainSpecificAddress.random()
      const implementation = ChainSpecificAddress.random()
      const admin = ChainSpecificAddress.random()
      const owner = ChainSpecificAddress.random()
      const deployer = ChainSpecificAddress.random()

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
              rootFile: 'Foo.sol',
              isVerified: true,
              abi: ['function foo()'],
              solidityVersion: '0.8.0',
              constructorArguments: '',
              files: { 'Foo.sol': 'contract Test { function foo() {} }' },
              remappings: [],
              libraries: {},
            },
          },
          {
            hash: Hash256.random(),
            name: 'Test2',
            address: implementation,
            source: {
              name: 'Test2',
              rootFile: '',
              isVerified: false,
              abi: [],
              constructorArguments: '',
              files: {},
              remappings: [],
              solidityVersion: '0.8.0',
              libraries: {},
            },
          },
        ],
      }

      const provider = mockObject<IProvider>({
        getBytecode: async () => Bytes.fromHex('0x1234'),
        chain: 'ethereum',
      })

      const addressAnalyzer = new AddressAnalyzer(
        mockObject<ProxyDetector>({
          detectProxy: async () => ({
            type: 'EIP1967 proxy',
            values: {
              $implementation: implementation.toString(),
              $admin: admin.toString(),
            },
            deployment: {
              timestamp: UnixTime(1234),
              blockNumber: 9876,
              deployer,
              transactionHash: Hash256.random(),
            },
            addresses: [],
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
      )

      const result = await addressAnalyzer.analyze(provider, address, config)

      expect(result).toEqual({
        ...EMPTY_ANALYZED_CONTRACT,
        name: 'Test',
        address,
        isVerified: false,
        deployerAddress: deployer,
        deploymentTimestamp: UnixTime(1234),
        deploymentBlockNumber: 9876,
        proxyType: 'EIP1967 proxy',
        implementations: [implementation],
        values: {
          $implementation: implementation.toString(),
          $admin: admin.toString(),
          owner: owner.toString(),
        },
        implementationNames: {
          [address.toString()]: 'Test',
          [implementation.toString()]: 'Test2',
        },
        abis: sources.abis,
        sourceBundles: sources.sources,
        relatives: {
          [owner.toString()]: new Set(),
          [admin.toString()]: new Set(),
        },
      })
    })

    it('handles contracts while omitting the sinceTimestamp', async () => {
      const address = ChainSpecificAddress.random()
      const implementation = ChainSpecificAddress.random()
      const admin = ChainSpecificAddress.random()
      const owner = ChainSpecificAddress.random()

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
              rootFile: 'Foo.sol',
              isVerified: true,
              abi: ['function foo()'],
              solidityVersion: '0.8.0',
              constructorArguments: '',
              files: { 'Foo.sol': 'contract Test { function foo() {} }' },
              remappings: [],
              libraries: {},
            },
          },
          {
            hash: Hash256.random(),
            name: 'Test',
            address,
            source: {
              name: 'Test',
              rootFile: 'Bar.sol',
              isVerified: true,
              abi: ['function bar()'],
              solidityVersion: '0.8.0',
              constructorArguments: '',
              files: { 'Bar.sol': 'contract Test { function bar() {} }' },
              remappings: [],
              libraries: {},
            },
          },
        ],
      }

      const provider = mockObject<IProvider>({
        getBytecode: async () => Bytes.fromHex('0x1234'),
        getDeployment: mockFn().resolvesTo(undefined),
        chain: 'ethereum',
      })

      const addressAnalyzer = new AddressAnalyzer(
        mockObject<ProxyDetector>({
          detectProxy: async () => ({
            type: 'EIP1967 proxy',
            values: {
              $implementation: implementation.toString(),
              $admin: admin.toString(),
            },
            deployment: undefined,
            addresses: [],
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
      )

      const result = await addressAnalyzer.analyze(provider, address, config)

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
        implementationNames: {
          [address.toString()]: 'Test',
        },
        abis: sources.abis,
        sourceBundles: sources.sources,
        relatives: {
          [owner.toString()]: new Set(),
          [admin.toString()]: new Set(),
        },
      })
    })

    describe('with a templatizer that revisits matched templates', () => {
      function analyzerWith(revisits: boolean, calls: string[]) {
        const verified: ContractSources = {
          name: 'Registry',
          isVerified: true,
          abi: [],
          abis: {},
          sources: [],
        }
        const templatizer = mockObject<Templatizer>({
          revisitsMatchedTemplates: revisits,
          canTemplatize: () => true,
          revisit: async () => {
            calls.push('revisit')
          },
          settledFor: async () => {
            calls.push('settled')
          },
        })
        const analyzer = new AddressAnalyzer(
          mockObject<ProxyDetector>({
            detectProxy: async () => ({
              type: 'immutable',
              values: {},
              addresses: [],
              deployment: undefined,
            }),
          }),
          mockObject<SourceCodeService>({ getSources: async () => verified }),
          mockObject<HandlerExecutor>({
            execute: async () => ({
              results: [],
              values: {},
              errors: {},
              usedTypes: [],
            }),
          }),
          mockObject<TemplateService>({
            findMatchingTemplates: () => ['proj/Registry'],
            loadContractTemplate: () => {
              calls.push('load')
              return StructureContract.parse({})
            },
            getTemplateHash: () => Hash256.random(),
          }),
          templatizer,
        )
        return { analyzer, templatizer }
      }
      const provider = mockObject<IProvider>({
        getBytecode: async () => Bytes.fromHex('0x1234'),
        chain: 'ethereum',
      })

      it('lets the model extend the matched template before it is applied', async () => {
        const calls: string[] = []
        const { analyzer, templatizer } = analyzerWith(true, calls)

        await analyzer.analyze(provider, address, config)

        expect(calls).toEqual(['revisit', 'settled', 'load'])
        // The request carries the address's own config, before the
        // template is pushed, so the templatizer dry-runs with it.
        expect(templatizer.revisit).toHaveBeenOnlyCalledWith(
          expect.subset({ address, config }),
          'proj/Registry',
        )
      })

      it('applies the matched template as it is without --ai-revisit', async () => {
        const calls: string[] = []
        const { analyzer, templatizer } = analyzerWith(false, calls)

        await analyzer.analyze(provider, address, config)

        expect(calls).toEqual(['settled', 'load'])
        expect(templatizer.revisit).not.toHaveBeenCalled()
      })
    })
  })
})
