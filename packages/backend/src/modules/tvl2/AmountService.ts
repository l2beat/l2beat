import { assert, Logger } from '@l2beat/backend-tools'
import {
  assertUnreachable,
  Bytes,
  EscrowEntry,
  EthereumAddress,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { Configuration } from '@l2beat/uif'
import { BigNumber, utils } from 'ethers'
import { partition } from 'lodash'

import { MulticallClient } from '../../peripherals/multicall/MulticallClient'
import {
  MulticallRequest,
  MulticallResponse,
} from '../../peripherals/multicall/types'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
import { AmountRecord } from './repositories/AmountRepository'

type AmountConfiguration = EscrowEntry | TotalSupplyEntry

export interface AmountServiceOptions {
  readonly logger: Logger
  readonly rpcClient: RpcClient
  readonly multicallClient: MulticallClient
  readonly nativeAssetBalanceEncoder?: NativeAssetBalanceEncoder
}

export class AmountService {
  constructor(private readonly options: AmountServiceOptions) {}

  public async fetchAmounts(
    configurations: Configuration<AmountConfiguration>[],
    timestamp: UnixTime,
    blockNumber: number,
  ): Promise<AmountRecord[]> {
    const nativeAssetBalanceEncoder = getNativeAssetBalanceEncoder(
      this.options.nativeAssetBalanceEncoder,
      blockNumber,
    )

    const [nonMulticall, multicall] = partition(configurations, (c) =>
      isNotSupportedByMulticall(nativeAssetBalanceEncoder, c),
    )

    const nonMulticallAmounts = await this.getNonMulticallAmounts(
      // TODO: solve it better with types
      nonMulticall as Configuration<EscrowEntry>[],
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

  async getNonMulticallAmounts(
    nonMulticall: Configuration<EscrowEntry>[],
    blockNumber: number,
    timestamp: UnixTime,
  ): Promise<AmountRecord[]> {
    return Promise.all(
      nonMulticall.map(async (configuration) => {
        const amount = await this.options.rpcClient.getBalance(
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
    configurations: Configuration<AmountConfiguration>[],
    nativeAssetBalanceEncoder: NativeAssetBalanceEncoder | undefined,
    blockNumber: number,
    timestamp: UnixTime,
  ) {
    const encoded = configurations.map((configuration) => ({
      ...this.encodeForMulticall(configuration, nativeAssetBalanceEncoder),
    }))

    const responses = await this.options.multicallClient.multicall(
      encoded,
      blockNumber,
    )

    return responses.map((response, i) => {
      const configuration = configurations[i]
      // In the rare event of a contract call revert we do not want backend to stop because of it
      // That is why we set the amount to 0n & report the error to the logger
      const amount =
        this.decodeForMulticall(
          response,
          configuration,
          nativeAssetBalanceEncoder,
        ) ?? 0n

      return {
        configurationId: +configuration.id,
        timestamp,
        amount,
      }
    })
  }

  private encodeForMulticall(
    { properties }: Configuration<AmountConfiguration>,
    nativeEncoding: NativeAssetBalanceEncoder | undefined,
  ): MulticallRequest {
    switch (properties.type) {
      case 'totalSupply':
        return encodeErc20TotalSupplyQuery(properties.address)
      case 'escrow':
        if (properties.address === 'native') {
          assert(
            nativeEncoding,
            `No native balance encoding for chain ${properties.chain}`,
          )
          return {
            address: nativeEncoding.address,
            data: nativeEncoding.encode(properties.escrowAddress),
          }
        }
        return encodeErc20BalanceQuery(
          properties.escrowAddress,
          properties.address,
        )
      default:
        assertUnreachable(properties)
    }
  }

  private decodeForMulticall(
    response: MulticallResponse,
    { id, properties }: Configuration<AmountConfiguration>,
    nativeEncoding: NativeAssetBalanceEncoder | undefined,
  ) {
    if (!response.success) {
      this.options.logger.error(`Multicall failed for configuration: ${id}}`)
      return
    }
    switch (properties.type) {
      case 'totalSupply':
        return decodeErc20TotalSupplyQuery(response.data)
      case 'escrow':
        if (properties.address === 'native') {
          assert(nativeEncoding, `No native balance encoding `)
          return nativeEncoding.decode(response.data)
        }
        return decodeErc20BalanceQuery(response.data)
      default:
        assertUnreachable(properties)
    }
  }
}

export interface NativeAssetBalanceEncoder {
  sinceBlock: number
  address: EthereumAddress
  encode: (address: EthereumAddress) => Bytes
  decode: (response: Bytes) => bigint
}

function getNativeAssetBalanceEncoder(
  nativeAssetBalanceEncoder: NativeAssetBalanceEncoder | undefined,
  blockNumber: number,
) {
  return nativeAssetBalanceEncoder &&
    nativeAssetBalanceEncoder.sinceBlock <= blockNumber
    ? nativeAssetBalanceEncoder
    : undefined
}

function isNotSupportedByMulticall(
  nativeEncoding: NativeAssetBalanceEncoder | undefined,
  configuration: Configuration<AmountConfiguration>,
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
