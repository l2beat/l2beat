import { Logger } from '@l2beat/backend-tools'
import {
  type AmountConfigBase,
  AssetId,
  Bytes,
  type EscrowEntry,
  EthereumAddress,
  ProjectId,
  type TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import type { RpcClient } from '@l2beat/shared'
import type { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import type { ChainAmountConfig } from '../indexers/types'
import {
  AmountService,
  encodeErc20BalanceQuery,
  encodeErc20TotalSupplyQuery,
  encodeGetEthBalance,
  erc20Interface,
  multicallInterface,
} from './AmountService'

describe(AmountService.name, () => {
  const NATIVE_CODEC_SINCE_BLOCK = 1_111

  const blockNumber = NATIVE_CODEC_SINCE_BLOCK + 1
  const timestamp = new UnixTime(923_234)

  it('calls RPC if multicall does not support native balance', async () => {
    const mockRpc = mockObject<RpcClient>({
      getBalance: () => Promise.resolve(BigInt(0)),
    })
    const mockMulticall = mockObject<MulticallClient>({
      isNativeBalanceSupported: () => false,
      multicall: async () => [],
    })
    const service = new AmountService({
      rpcClient: mockRpc,
      multicallClient: mockMulticall,
      logger: Logger.SILENT,
    })

    const escrowNativeConfig = mockEscrowConfig({ address: 'native' })
    const configurations = [mockConfig(escrowNativeConfig)]

    await service.fetchAmounts(timestamp, blockNumber, configurations)

    expect(mockRpc.getBalance).toHaveBeenOnlyCalledWith(
      escrowNativeConfig.escrowAddress,
      blockNumber,
    )
    expect(mockMulticall.multicall).not.toHaveBeenCalled()
  })

  it('calls multicall if supports native balance', async () => {
    const mockMulticall = mockObject<MulticallClient>({
      multicall: () => Promise.resolve([]),
      isNativeBalanceSupported: () => true,
      getMulticallAddressAt: () => EthereumAddress.random(),
    })

    const service = new AmountService({
      rpcClient: mockObject<RpcClient>({}),
      multicallClient: mockMulticall,
      logger: Logger.SILENT,
    })

    const escrowNativeConfig = mockConfig(
      mockEscrowConfig({ address: 'native' }),
    )
    const configurations = [escrowNativeConfig]

    await service.fetchAmounts(timestamp, blockNumber, configurations)

    expect(mockMulticall.multicall).toHaveBeenCalledTimes(1)
    expect(mockMulticall.getMulticallAddressAt).toHaveBeenOnlyCalledWith(
      blockNumber,
    )
  })

  it('calls RPC for ERC20s', async () => {
    const mockMulticall = mockObject<MulticallClient>({
      multicall: () => Promise.resolve([]),
    })

    const service = new AmountService({
      rpcClient: mockObject<RpcClient>({}),
      multicallClient: mockMulticall,
      logger: Logger.SILENT,
    })

    const erc20TotalSupplyConfig = mockTotalSupplyConfig()
    const erc20BalanceConfig = mockEscrowConfig()
    const configurations = [
      mockConfig(erc20TotalSupplyConfig),
      mockConfig(erc20BalanceConfig),
    ]

    await service.fetchAmounts(timestamp, blockNumber, configurations)

    expect(mockMulticall.multicall).toHaveBeenCalledTimes(1)
  })

  describe(AmountService.prototype.fetchWithMulticall.name, () => {
    it('encodes, calls and decodes data', async () => {
      const multicallAddress = EthereumAddress.random()
      const multicallClient = mockObject<MulticallClient>({
        getMulticallAddressAt: () => multicallAddress,
        multicall: mockFn().resolvesTo([
          {
            success: true,
            data: encodeTotalSupplyResult(123n),
          },
          {
            success: true,
            data: encodeErc20BalanceResult(300n),
          },
          {
            success: true,
            data: encodeGetEthBalanceResult(200n),
          },
        ]),
      })
      const service = new AmountService({
        rpcClient: mockObject<RpcClient>({}),
        multicallClient,
        logger: Logger.SILENT,
      })

      const erc20TotalSupplyConfig = mockConfig(mockTotalSupplyConfig())
      const escrowConfig = mockConfig(mockEscrowConfig())
      const escrowConfigWithNative = mockConfig(
        mockEscrowConfig({
          address: 'native',
        }),
      )

      const result = await service.fetchWithMulticall(
        [erc20TotalSupplyConfig, escrowConfig, escrowConfigWithNative],
        blockNumber,
      )

      // encodes and calls
      expect(multicallClient.multicall).toHaveBeenCalledWith(
        [
          encodeErc20TotalSupplyQuery(
            erc20TotalSupplyConfig.address as EthereumAddress,
          ),
          encodeErc20BalanceQuery(
            (escrowConfig as EscrowEntry).escrowAddress,
            (escrowConfig as EscrowEntry).address as EthereumAddress,
          ),
          encodeGetEthBalance(
            multicallAddress,
            (escrowConfigWithNative as EscrowEntry)
              .escrowAddress as EthereumAddress,
          ),
        ],
        blockNumber,
      )

      // decodes and returns
      expect(result).toEqual([
        {
          configId: erc20TotalSupplyConfig.id,
          type: 'totalSupply',
          amount: 123n,
        },
        {
          configId: escrowConfig.id,
          type: 'escrow',
          amount: 300n,
        },
        {
          configId: escrowConfigWithNative.id,
          type: 'escrow',
          amount: 200n,
        },
      ])
    })
  })
})

function mockConfig(
  config: ChainAmountConfig,
): ChainAmountConfig & { id: string } {
  return {
    ...config,
    id: 'id',
  }
}

function mockEscrowConfig(config: Partial<EscrowEntry> = {}): EscrowEntry {
  return {
    type: 'escrow',
    address: EthereumAddress.random(),
    escrowAddress: EthereumAddress.random(),
    ...mockBaseConfig(config, config.address),
    ...config,
  }
}

function mockTotalSupplyConfig(
  config: Partial<TotalSupplyEntry> = {},
): TotalSupplyEntry {
  return {
    type: 'totalSupply',
    address: EthereumAddress.random(),
    ...mockBaseConfig(config, config.address),
    ...config,
  }
}

function mockBaseConfig(
  base: Partial<AmountConfigBase>,
  address: EthereumAddress | 'native' | undefined,
): AmountConfigBase {
  return {
    assetId: AssetId.create(base.chain ?? 'chain', address),
    chain: 'chain',
    dataSource: 'chain',
    project: ProjectId('project'),
    source: 'canonical' as const,
    sinceTimestamp: new UnixTime(123),
    includeInTotal: true,
    untilTimestamp: undefined,
    decimals: 18,
    symbol: 'SYMBOL',
    isAssociated: false,
    category: 'other',
    ...base,
  }
}

function encodeTotalSupplyResult(totalSupply: bigint): Bytes {
  return Bytes.fromHex(
    erc20Interface.encodeFunctionResult('totalSupply', [totalSupply]),
  )
}

function encodeErc20BalanceResult(totalSupply: bigint): Bytes {
  return Bytes.fromHex(
    erc20Interface.encodeFunctionResult('balanceOf', [totalSupply]),
  )
}

function encodeGetEthBalanceResult(totalSupply: bigint): Bytes {
  return Bytes.fromHex(
    multicallInterface.encodeFunctionResult('getEthBalance', [totalSupply]),
  )
}
