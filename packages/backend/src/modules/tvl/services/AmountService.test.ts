import { Logger } from '@l2beat/backend-tools'
import {
  AmountConfigBase,
  EscrowEntry,
  EthereumAddress,
  ProjectId,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { BigNumber } from 'ethers'

import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { ChainAmountConfig } from '../indexers/types'
import { AmountService } from './AmountService'

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
    dataSource: 'chain',
    project: ProjectId('project'),
    source: 'canonical' as const,
    sinceTimestamp: new UnixTime(123),
    includeInTotal: true,
    decimals: 18,
    symbol: 'SYMBOL',
    isAssociated: false,
    category: 'other',
    ...base,
  }
}
