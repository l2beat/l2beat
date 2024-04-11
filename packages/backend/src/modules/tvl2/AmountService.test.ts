import { Logger } from '@l2beat/backend-tools'
import {
  AmountConfigBase,
  EscrowEntry,
  EthereumAddress,
  ProjectId,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { Configuration } from '@l2beat/uif'
import { expect, mockFn, mockObject } from 'earl'
import { BigNumber } from 'ethers'

import { MulticallClient } from '../../peripherals/multicall/MulticallClient'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
import { AmountService, ChainAmountConfig } from './AmountService'

describe(AmountService.name, () => {
  const NATIVE_CODEC_SINCE_BLOCK = 1_111

  const blockNumber = NATIVE_CODEC_SINCE_BLOCK + 1
  const timestamp = new UnixTime(923_234)

  it('calls RPC if multicall does not support native balance', async () => {
    const mockRpc = mockObject<RpcClient>({
      getBalance: () => Promise.resolve(BigNumber.from(0)),
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
    const configurations: Configuration<ChainAmountConfig>[] = [
      mockUifConfig(escrowNativeConfig),
    ]

    await service.fetchAmounts(configurations, blockNumber, timestamp)

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
    })

    const service = new AmountService({
      rpcClient: mockObject<RpcClient>({}),
      multicallClient: mockMulticall,
      logger: Logger.SILENT,
    })

    const mockEncode = mockFn(service.encodeForMulticall)
    service.encodeForMulticall = mockEncode

    const escrowNativeConfig = mockUifConfig(
      mockEscrowConfig({ address: 'native' }),
    )
    const configurations: Configuration<ChainAmountConfig>[] = [
      escrowNativeConfig,
    ]

    await service.fetchAmounts(configurations, blockNumber, timestamp)

    expect(mockMulticall.multicall).toHaveBeenCalledTimes(1)
    expect(mockEncode).toHaveBeenOnlyCalledWith(escrowNativeConfig)
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
    const configurations: Configuration<ChainAmountConfig>[] = [
      mockUifConfig(erc20TotalSupplyConfig),
      mockUifConfig(erc20BalanceConfig),
    ]

    await service.fetchAmounts(configurations, blockNumber, timestamp)

    expect(mockMulticall.multicall).toHaveBeenCalledTimes(1)
  })
})

function mockUifConfig<T>(
  config: T,
  params: { id?: string; minHeight?: number; maxHeight?: number } = {},
): Configuration<T> {
  return {
    properties: config,
    id: params.id ?? 'id',
    minHeight: params.minHeight ?? 1,
    maxHeight: params.maxHeight ?? 2,
  }
}

function mockEscrowConfig(config: Partial<EscrowEntry> = {}): EscrowEntry {
  return {
    type: 'escrow',
    address: EthereumAddress.random(),
    escrowAddress: EthereumAddress.random(),
    ...mockBaseConfig(config),
    ...config,
  }
}

function mockTotalSupplyConfig(
  config: Partial<TotalSupplyEntry> = {},
): TotalSupplyEntry {
  return {
    type: 'totalSupply',
    address: EthereumAddress.random(),
    ...mockBaseConfig(config),
    ...config,
  }
}

function mockBaseConfig(base: Partial<AmountConfigBase>): AmountConfigBase {
  return {
    chain: 'chain',
    project: ProjectId('project'),
    source: 'canonical' as const,
    sinceTimestamp: new UnixTime(123),
    includeInTotal: true,
    ...base,
  }
}
