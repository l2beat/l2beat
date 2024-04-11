import { Logger } from '@l2beat/backend-tools'
import {
  AmountConfigBase,
  Bytes,
  EscrowEntry,
  EthereumAddress,
  ProjectId,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { Configuration } from '@l2beat/uif'
import { expect, mockFn, mockObject } from 'earl'
import { BigNumber } from 'ethers'

import {
  ERC20MulticallCodec,
  NativeAssetMulticallCodec,
} from '../../peripherals/multicall/codecs'
import { MulticallClient } from '../../peripherals/multicall/MulticallClient'
import { MulticallRequest } from '../../peripherals/multicall/types'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
import { AmountConfiguration, AmountService } from './AmountService'

describe(AmountService.name, () => {
  const NATIVE_CODEC_SINCE_BLOCK = 1_111
  const mockNativeCodec = mockObject<NativeAssetMulticallCodec>({
    sinceBlock: NATIVE_CODEC_SINCE_BLOCK,
    balance: mockMulticallCoding(),
  })
  const mockErc20Codec = mockObject<ERC20MulticallCodec>({
    balance: mockMulticallCoding(),
    totalSupply: mockMulticallCoding(),
  })

  const blockNumber = NATIVE_CODEC_SINCE_BLOCK + 1
  const timestamp = new UnixTime(923_234)

  it('calls RPC if no nativeAssetCodec provided', async () => {
    const mockRpc = mockObject<RpcClient>({
      getBalance: () => Promise.resolve(BigNumber.from(0)),
    })
    const service = new AmountService({
      rpcClient: mockRpc,
      multicallClient: mockObject<MulticallClient>({}),
      erc20Codec: mockErc20Codec,
      nativeAssetCodec: undefined,
      logger: Logger.SILENT,
    })

    const escrowNativeConfig = mockEscrowConfig({ address: 'native' })
    const configurations: Configuration<AmountConfiguration>[] = [
      mockUifConfig(escrowNativeConfig),
    ]

    await service.fetchAmounts(configurations, blockNumber, timestamp)

    expect(mockRpc.getBalance).toHaveBeenOnlyCalledWith(
      escrowNativeConfig.escrowAddress,
      blockNumber,
    )
  })

  it('calls RPC if nativeAssetCodec provided but before sinceBlock', async () => {
    const mockRpc = mockObject<RpcClient>({
      getBalance: () => Promise.resolve(BigNumber.from(0)),
    })

    const service = new AmountService({
      rpcClient: mockRpc,
      multicallClient: mockObject<MulticallClient>({}),
      erc20Codec: mockErc20Codec,
      nativeAssetCodec: mockNativeCodec,
      logger: Logger.SILENT,
    })

    const blockNumber = NATIVE_CODEC_SINCE_BLOCK - 100
    const escrowNativeConfig = mockEscrowConfig({ address: 'native' })
    const configurations: Configuration<AmountConfiguration>[] = [
      mockUifConfig(escrowNativeConfig),
    ]

    await service.fetchAmounts(configurations, blockNumber, timestamp)

    expect(mockRpc.getBalance).toHaveBeenOnlyCalledWith(
      escrowNativeConfig.escrowAddress,
      blockNumber,
    )
  })

  it('calls multicall if nativeAssetCodec provided', async () => {
    const mockMulticall = mockObject<MulticallClient>({
      multicall: () => Promise.resolve([]),
    })

    const mockNativeEncode = mockFn((_: EthereumAddress) =>
      mockObject<MulticallRequest>(),
    )

    const service = new AmountService({
      rpcClient: mockObject<RpcClient>({}),
      multicallClient: mockMulticall,
      erc20Codec: mockErc20Codec,
      nativeAssetCodec: {
        sinceBlock: 0,
        balance: {
          encode: mockNativeEncode,
          decode: mockFn(() => 0n),
        },
      },
      logger: Logger.SILENT,
    })

    const escrowNativeConfig = mockEscrowConfig({ address: 'native' })
    const configurations: Configuration<AmountConfiguration>[] = [
      mockUifConfig(escrowNativeConfig),
    ]

    await service.fetchAmounts(configurations, blockNumber, timestamp)

    expect(mockMulticall.multicall).toHaveBeenCalledTimes(1)
    expect(mockNativeEncode).toHaveBeenOnlyCalledWith(
      escrowNativeConfig.escrowAddress,
    )
  })

  it('calls RPC for ERC20s', async () => {
    const mockMulticall = mockObject<MulticallClient>({
      multicall: () => Promise.resolve([]),
    })

    const mockErc20BalanceEncode = mockFn(
      (_holder: EthereumAddress, _token: EthereumAddress) =>
        mockObject<MulticallRequest>(),
    )

    const mockErc20TotalSupplyEncode = mockFn((_: EthereumAddress) =>
      mockObject<MulticallRequest>(),
    )

    const service = new AmountService({
      rpcClient: mockObject<RpcClient>({}),
      multicallClient: mockMulticall,
      erc20Codec: {
        totalSupply: {
          encode: mockErc20TotalSupplyEncode,
          decode: mockFn(() => 0n),
        },
        balance: {
          encode: mockErc20BalanceEncode,
          decode: mockFn(() => 0n),
        },
      },
      nativeAssetCodec: mockNativeCodec,
      logger: Logger.SILENT,
    })

    const erc20TotalSupplyConfig = mockTotalSupplyConfig()
    const erc20BalanceConfig = mockEscrowConfig()
    const configurations: Configuration<AmountConfiguration>[] = [
      mockUifConfig(erc20TotalSupplyConfig),
      mockUifConfig(erc20BalanceConfig),
    ]

    await service.fetchAmounts(configurations, blockNumber, timestamp)

    expect(mockMulticall.multicall).toHaveBeenCalledTimes(1)
    expect(mockErc20TotalSupplyEncode).toHaveBeenOnlyCalledWith(
      erc20TotalSupplyConfig.address,
    )
    expect(mockErc20BalanceEncode).toHaveBeenOnlyCalledWith(
      erc20BalanceConfig.escrowAddress,
      erc20BalanceConfig.address as EthereumAddress,
    )
  })

  it('works with complex example', async () => {
    const mockRpc = mockObject<RpcClient>({
      getBalance: () => Promise.resolve(BigNumber.from(20)),
    })
    const mockMulticall = mockObject<MulticallClient>({
      multicall: (reqs) =>
        Promise.resolve(reqs.map(() => ({ success: true, data: Bytes.EMPTY }))),
    })

    const service = new AmountService({
      rpcClient: mockRpc,
      multicallClient: mockMulticall,
      erc20Codec: {
        balance: mockMulticallCoding(20n),
        totalSupply: mockMulticallCoding(40n),
      },
      nativeAssetCodec: {
        balance: mockMulticallCoding(60n),
        sinceBlock: 1,
      },
      logger: Logger.SILENT,
    })

    const totalSupplyConfig = mockTotalSupplyConfig()
    const balanceConfig = mockEscrowConfig()
    const nativeConfig = mockEscrowConfig({ address: 'native' })
    const configurations: Configuration<AmountConfiguration>[] = [
      mockUifConfig(totalSupplyConfig, { id: 'totalSupply' }),
      mockUifConfig(balanceConfig, { id: 'balance' }),
      mockUifConfig(nativeConfig, { id: 'native' }),
    ]

    const amounts = await service.fetchAmounts(
      configurations,
      blockNumber,
      timestamp,
    )

    expect(amounts).toEqual([
      { configId: 'totalSupply', timestamp, amount: 40n },
      { configId: 'balance', timestamp, amount: 20n },
      { configId: 'native', timestamp, amount: 60n },
    ])
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

function mockBaseConfig(base: Partial<AmountConfigBase>) {
  return {
    chain: 'chain',
    project: ProjectId('project'),
    source: 'canonical',
    sinceTimestamp: new UnixTime(123),
    includeInTotal: true,
    ...base,
  }
}

function mockMulticallCoding(amount: bigint = 0n) {
  return {
    encode: () => ({
      address: EthereumAddress.random(),
      data: Bytes.EMPTY,
    }),
    decode: () => amount,
  }
}
