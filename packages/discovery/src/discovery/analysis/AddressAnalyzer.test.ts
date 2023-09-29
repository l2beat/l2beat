import { expect, mockObject } from 'earl'

import { Bytes } from '../../utils/Bytes'
import { EthereumAddress } from '../../utils/EthereumAddress'
import { UnixTime } from '../../utils/UnixTime'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { HandlerExecutor } from '../handlers/HandlerExecutor'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { ProxyDetector } from '../proxies/ProxyDetector'
import { ContractSources, SourceCodeService } from '../source/SourceCodeService'
import { AddressAnalyzer } from './AddressAnalyzer'

describe(AddressAnalyzer.name, () => {
  const BLOCK_NUMBER = 1234

  it('handles EOAs', async () => {
    const addressAnalyzer = new AddressAnalyzer(
      mockObject<DiscoveryProvider>({
        getCode: async () => Bytes.EMPTY,
      }),
      mockObject<ProxyDetector>(),
      mockObject<SourceCodeService>(),
      mockObject<HandlerExecutor>(),
      DiscoveryLogger.SILENT,
    )

    const address = EthereumAddress.random()
    const result = await addressAnalyzer.analyze(
      address,
      undefined,
      BLOCK_NUMBER,
    )

    expect(result).toEqual({
      analysis: { type: 'EOA', address },
      relatives: [],
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
      files: [
        { 'Foo.sol': 'contract Test { function foo() {} }' },
        { 'Bar.sol': 'contract Test { function bar() {} }' },
      ],
    }

    const addressAnalyzer = new AddressAnalyzer(
      mockObject<DiscoveryProvider>({
        getCode: async () => Bytes.fromHex('0x1234'),
        getDeploymentInfo: async () => ({
          timestamp: new UnixTime(1234),
          blockNumber: 9876,
        }),
      }),
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
        }),
      }),
      DiscoveryLogger.SILENT,
    )

    const result = await addressAnalyzer.analyze(
      address,
      undefined,
      BLOCK_NUMBER,
    )

    expect(result).toEqual({
      analysis: {
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
        sources: sources.files,
      },
      relatives: [owner, admin],
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
      files: [{ 'Foo.sol': 'contract Test { function foo() {} }' }, {}],
    }

    const addressAnalyzer = new AddressAnalyzer(
      mockObject<DiscoveryProvider>({
        getCode: async () => Bytes.fromHex('0x1234'),
        getDeploymentInfo: async () => ({
          timestamp: new UnixTime(1234),
          blockNumber: 9876,
        }),
      }),
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
        }),
      }),
      DiscoveryLogger.SILENT,
    )

    const result = await addressAnalyzer.analyze(
      address,
      undefined,
      BLOCK_NUMBER,
    )

    expect(result).toEqual({
      analysis: {
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
        sources: sources.files,
      },
      relatives: [owner, admin],
    })
  })
})
