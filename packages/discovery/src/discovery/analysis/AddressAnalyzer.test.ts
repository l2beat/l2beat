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
  })

  describe(AddressAnalyzer.prototype.templateChanged.name, () => {
    const address = ChainSpecificAddress.random()
    const [h1, h2] = [Hash256.random(), Hash256.random()]

    // `templates` is what the analyzer reads of the template files; a test
    // changes it between an analysis and the check, as a write between the
    // levels of discovery does.
    function setup() {
      const templates = {
        matching: [] as string[],
        hashes: {} as Record<string, Hash256>,
      }
      const analyzer = new AddressAnalyzer(
        mockObject<ProxyDetector>({
          detectProxy: async () => ({
            type: 'immutable',
            values: {},
            deployment: undefined,
            addresses: [address],
          }),
        }),
        mockObject<SourceCodeService>({
          getSources: async () => ({
            name: 'Test',
            isVerified: true,
            abi: [],
            abis: {},
            sources: [],
          }),
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
          findMatchingTemplates: () => templates.matching,
          getTemplateHash: (template: string) => {
            const hash = templates.hashes[template]
            if (hash === undefined) {
              throw new Error(`no template ${template}`)
            }
            return hash
          },
          loadContractTemplate: () => StructureContract.parse({}),
        }),
      )
      const analyze = async (suggested?: Set<string>) => {
        const analysis = await analyzer.analyze(
          mockObject<IProvider>({
            getBytecode: async () => Bytes.fromHex('0x1234'),
            chain: 'ethereum',
          }),
          address,
          makeEntryStructureConfig({ overrides: {} }, address),
          suggested,
        )
        if (analysis.type !== 'Contract') {
          throw new Error('expected a contract')
        }
        return analysis
      }
      return { templates, analyzer, analyze }
    }

    it('is false right after the analysis, with or without a template', async () => {
      const { templates, analyzer, analyze } = setup()
      expect(analyzer.templateChanged(await analyze())).toEqual(false)

      templates.matching = ['T']
      templates.hashes = { T: h1, R: h2 }
      expect(analyzer.templateChanged(await analyze())).toEqual(false)
      expect(analyzer.templateChanged(await analyze(new Set(['R'])))).toEqual(
        false,
      )
    })

    it('is true once a template matches a contract analyzed without one', async () => {
      const { templates, analyzer, analyze } = setup()
      const analysis = await analyze()

      templates.matching = ['T']
      templates.hashes = { T: h1 }
      expect(analyzer.templateChanged(analysis)).toEqual(true)
    })

    it('is true once the template it was analyzed with changes', async () => {
      const { templates, analyzer, analyze } = setup()
      templates.matching = ['T']
      templates.hashes = { T: h1 }
      const analysis = await analyze()

      templates.hashes = { T: h2 }
      expect(analyzer.templateChanged(analysis)).toEqual(true)
    })

    it('is true once its code matches another template', async () => {
      const { templates, analyzer, analyze } = setup()
      templates.matching = ['T']
      templates.hashes = { T: h1, U: h2 }
      const analysis = await analyze()

      templates.matching = ['U']
      expect(analyzer.templateChanged(analysis)).toEqual(true)
    })

    it('keeps the template a referrer suggested whatever the shapes match, until that template changes', async () => {
      const { templates, analyzer, analyze } = setup()
      templates.hashes = { R: h1, T: h1 }
      const analysis = await analyze(new Set(['R']))

      templates.matching = ['T']
      expect(analyzer.templateChanged(analysis)).toEqual(false)

      templates.hashes = { R: h2, T: h1 }
      expect(analyzer.templateChanged(analysis)).toEqual(true)
    })
  })
})
