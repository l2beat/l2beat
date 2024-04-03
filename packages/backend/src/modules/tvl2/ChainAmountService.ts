import { assert } from '@l2beat/backend-tools'
import {
  assertUnreachable,
  Bytes,
  EscrowEntry,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { UpdateConfiguration } from '@l2beat/uif'
import { BigNumber, utils } from 'ethers'
import { partition } from 'lodash'

import { MulticallClient } from '../../peripherals/multicall/MulticallClient'
import {
  MulticallRequest,
  MulticallResponse,
} from '../../peripherals/multicall/types'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
import {
  AmountConfigurationRecord,
  AmountRecord,
} from './repositories/AmountRepository'

export interface NativeAssetBalanceEncoder {
  sinceBlock: number
  address: EthereumAddress
  encode: (address: EthereumAddress) => Bytes
  decode: (response: Bytes) => bigint
}

export class ChainAmountService {
  constructor(
    private readonly rpcClient: RpcClient,
    private readonly multicallClient: MulticallClient,
    private readonly nativeAssetBalanceEncoder?: NativeAssetBalanceEncoder,
  ) {}

  public async fetchAmounts(
    configurations: UpdateConfiguration<AmountConfigurationRecord>[],
    timestamp: UnixTime,
    blockNumber: number,
  ): Promise<AmountRecord[]> {
    const nativeAssetBalanceEncoder =
      this.getNativeAssetBalanceEncoder(blockNumber)

    const [nonMulticall, multicall] = partition(configurations, (c) =>
      isNotSupportedByMulticall(nativeAssetBalanceEncoder, c),
    )

    const nonMulticallAmounts = await this.getNonMulticallAmounts(
      nonMulticall as UpdateConfiguration<EscrowEntry>[],
      blockNumber,
      timestamp,
    )

    const multicallAmounts = await this.getMulticallAmounts(
      multicall,
      nativeAssetBalanceEncoder,
      blockNumber,
      timestamp,
    )

    return [...nonMulticallAmounts, ...multicallAmounts]
  }

  getNativeAssetBalanceEncoder(blockNumber: number) {
    return this.nativeAssetBalanceEncoder &&
      this.nativeAssetBalanceEncoder.sinceBlock <= blockNumber
      ? this.nativeAssetBalanceEncoder
      : undefined
  }

  async getNonMulticallAmounts(
    nonMulticall: UpdateConfiguration<EscrowEntry>[],
    blockNumber: number,
    timestamp: UnixTime,
  ): Promise<AmountRecord[]> {
    return Promise.all(
      nonMulticall.map(async (configuration) => {
        const amount = await this.rpcClient.getBalance(
          configuration.properties.escrowAddress,
          blockNumber,
        )

        return {
          configurationId: +configuration.id,
          timestamp,
          amount: amount.toBigInt(),
        }
      }),
    )
  }

  private async getMulticallAmounts(
    configurations: UpdateConfiguration<AmountConfigurationRecord>[],
    nativeAssetBalanceEncoder: NativeAssetBalanceEncoder | undefined,
    blockNumber: number,
    timestamp: UnixTime,
  ) {
    const encoded = configurations.map((configuration) => ({
      request: this.encodeForMulticall(
        configuration.properties,
        nativeAssetBalanceEncoder,
      ),
      metadata: configuration,
    }))

    const responses = await this.multicallClient.multicallWithMetadata(
      encoded,
      blockNumber,
    )

    return responses.map(({ response, metadata }) => {
      const amount = this.decodeForMulticall(
        response,
        metadata.properties,
        nativeAssetBalanceEncoder,
      )

      return {
        configurationId: +metadata.id,
        timestamp,
        amount,
      }
    })
  }

  private encodeForMulticall(
    configuration: AmountConfigurationRecord,
    nativeEncoding: NativeAssetBalanceEncoder | undefined,
  ): MulticallRequest {
    switch (configuration.type) {
      case 'totalSupply':
        assert(configuration.address !== 'native')
        return encodeErc20TotalSupplyQuery(configuration.address)
      case 'escrow':
        assert(configuration.escrowAddress)
        if (configuration.address === 'native') {
          assert(
            nativeEncoding,
            `No native balance encoding for chain ${configuration.chain}`,
          )
          return {
            address: nativeEncoding.address,
            data: nativeEncoding.encode(configuration.escrowAddress),
          }
        }
        return encodeErc20BalanceQuery(
          configuration.escrowAddress,
          configuration.address,
        )
      case 'circulatingSupply':
        throw new Error('Circulating supply not supported')
      default:
        assertUnreachable(configuration.type)
    }
  }

  private decodeForMulticall(
    response: MulticallResponse,
    configuration: AmountConfigurationRecord,
    nativeEncoding: NativeAssetBalanceEncoder | undefined,
  ) {
    if (!response.success) {
      throw new Error(
        'Multicall failed for ' + configuration.address.toString(),
      )
    }
    switch (configuration.type) {
      case 'totalSupply':
        return decodeErc20TotalSupplyQuery(response.data)
      case 'escrow':
        if (configuration.address === 'native') {
          assert(nativeEncoding, `No native balance encoding `)
          return nativeEncoding.decode(response.data)
        }
        return decodeErc20BalanceQuery(response.data)
      case 'circulatingSupply':
        throw new Error('Circulating supply not supported')
      default:
        assertUnreachable(configuration.type)
    }
  }
}

function isNotSupportedByMulticall(
  nativeEncoding: NativeAssetBalanceEncoder | undefined,
  configuration: UpdateConfiguration<AmountConfigurationRecord>,
) {
  return (
    configuration.properties.type === 'escrow' &&
    configuration.properties.address === 'native' &&
    nativeEncoding === undefined
  )
}

const erc20Interface = new utils.Interface([
  'function balanceOf(address account) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
])

function encodeErc20BalanceQuery(
  holder: EthereumAddress,
  tokenAddress: EthereumAddress,
): MulticallRequest {
  return {
    address: tokenAddress,
    data: Bytes.fromHex(
      erc20Interface.encodeFunctionData('balanceOf', [holder.toString()]),
    ),
  }
}

function decodeErc20BalanceQuery(response: Bytes): bigint {
  const [value] = erc20Interface.decodeFunctionResult(
    'balanceOf',
    response.toString(),
  )

  return (value as BigNumber).toBigInt()
}

export function encodeErc20TotalSupplyQuery(
  tokenAddress: EthereumAddress,
): MulticallRequest {
  return {
    address: tokenAddress,
    data: Bytes.fromHex(erc20Interface.encodeFunctionData('totalSupply', [])),
  }
}

export function decodeErc20TotalSupplyQuery(response: Bytes): bigint {
  const [value] = erc20Interface.decodeFunctionResult(
    'totalSupply',
    response.toString(),
  )

  return (value as BigNumber).toBigInt()
}
