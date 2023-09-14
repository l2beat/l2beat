import { getTokenByAssetId } from '@l2beat/config'
import {
  assert,
  AssetId,
  Bytes,
  ChainId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'
import { partition } from 'lodash'

import { BalanceRecord } from '../../peripherals/database/BalanceRepository'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { MulticallClient } from '../../peripherals/ethereum/multicall/MulticallClient'
import {
  ARBITRUM_MULTICALL_ADDRESS,
  ARBITRUM_MULTICALL_BLOCK,
  ETHEREUM_MULTICALL_V1_ADDRESS,
  ETHEREUM_MULTICALL_V1_BLOCK,
} from '../../peripherals/ethereum/multicall/MulticallConfig'
import {
  MulticallRequest,
  MulticallResponse,
} from '../../peripherals/ethereum/multicall/types'

const erc20Interface = new utils.Interface([
  'function balanceOf(address account) view returns (uint256)',
])

const multicallInterface = new utils.Interface([
  'function getEthBalance(address account) view returns (uint256)',
])

export interface BalanceQuery {
  holder: EthereumAddress
  assetId: AssetId
}

export interface NativeBalanceEncoding {
  sinceBlock: number
  address: EthereumAddress
  encode: (address: EthereumAddress) => Bytes
  decode: (response: Bytes) => bigint
}

export const ETHEREUM_BALANCE_ENCODING: NativeBalanceEncoding = {
  sinceBlock: ETHEREUM_MULTICALL_V1_BLOCK,
  address: ETHEREUM_MULTICALL_V1_ADDRESS,
  encode: encodeGetEthBalance,
  decode: decodeGetEthBalance,
}

export const ARBITRUM_BALANCE_ENCODING: NativeBalanceEncoding = {
  sinceBlock: ARBITRUM_MULTICALL_BLOCK,
  address: ARBITRUM_MULTICALL_ADDRESS,
  encode: encodeGetEthBalance,
  decode: decodeGetEthBalance,
}

export class BalanceProvider {
  constructor(
    private readonly ethereumClient: EthereumClient,
    private readonly multicallClient: MulticallClient,
    private readonly chainId: ChainId,
    private readonly nativeBalanceEncoding: NativeBalanceEncoding | undefined,
  ) {}

  public getChainId(): ChainId {
    return this.chainId
  }

  public async fetchBalances(
    balanceQueries: BalanceQuery[],
    timestamp: UnixTime,
    blockNumber: number,
  ): Promise<BalanceRecord[]> {
    const nativeEncoding =
      this.nativeBalanceEncoding &&
      this.nativeBalanceEncoding.sinceBlock <= blockNumber
        ? this.nativeBalanceEncoding
        : undefined

    const [native, nonNative] = partition(balanceQueries, (q) =>
      this.usesNativeCall(q.assetId, nativeEncoding),
    )

    const nonNativeCalls = nonNative.map((balanceQuery) =>
      this.encodeForMulticall(balanceQuery, nativeEncoding),
    )
    const nonNativeResponses = await this.multicallClient.multicall(
      nonNativeCalls,
      blockNumber,
    )

    const nativeResponses = await Promise.all(
      native.map((balanceQuery) =>
        this.ethereumClient.getBalance(balanceQuery.holder, blockNumber),
      ),
    )

    let nonNativeIndex = 0
    let nativeIndex = 0
    return balanceQueries.map(({ holder, assetId }): BalanceRecord => {
      if (this.usesNativeCall(assetId, nativeEncoding)) {
        const response = nativeResponses[nativeIndex++]
        return {
          assetId,
          timestamp,
          holderAddress: holder,
          chainId: this.chainId,
          balance: response.toBigInt(),
        }
      } else {
        const response = nonNativeResponses[nonNativeIndex++]
        return {
          assetId,
          timestamp,
          holderAddress: holder,
          chainId: this.chainId,
          balance:
            this.decodeForMulticall(response, assetId, nativeEncoding) ?? 0n,
        }
      }
    })
  }

  private encodeForMulticall(
    { assetId, holder }: BalanceQuery,
    nativeEncoding: NativeBalanceEncoding | undefined,
  ): MulticallRequest {
    if (this.isNativeCoin(assetId)) {
      assert(
        nativeEncoding,
        `No native balance encoding for asset ${assetId.toString()}`,
      )
      return {
        address: nativeEncoding.address,
        data: nativeEncoding.encode(holder),
      }
    }

    const tokenAddress = getTokenByAssetId(assetId).address

    assert(
      tokenAddress,
      `Unknown token address for balance query: ${assetId.toString()}`,
    )

    return encodeErc20BalanceQuery(holder, tokenAddress)
  }

  private usesNativeCall(
    assetId: AssetId,
    nativeEncoding: NativeBalanceEncoding | undefined,
  ): boolean {
    return this.isNativeCoin(assetId) && nativeEncoding === undefined
  }

  private isNativeCoin(assetId: AssetId): boolean {
    return assetId === AssetId.ETH
  }

  private decodeForMulticall(
    response: MulticallResponse,
    assetId: AssetId,
    nativeEncoding: NativeBalanceEncoding | undefined,
  ) {
    if (!response.success) {
      return
    }
    if (this.isNativeCoin(assetId)) {
      assert(
        nativeEncoding,
        `No native balance encoding for asset ${assetId.toString()}`,
      )
      return nativeEncoding.decode(response.data)
    }
    return decodeErc20BalanceQuery(response.data)
  }
}

function encodeGetEthBalance(address: EthereumAddress): Bytes {
  return Bytes.fromHex(
    multicallInterface.encodeFunctionData('getEthBalance', [
      address.toString(),
    ]),
  )
}

function decodeGetEthBalance(response: Bytes) {
  return (
    multicallInterface.decodeFunctionResult(
      'getEthBalance',
      response.toString(),
    )[0] as BigNumber
  ).toBigInt()
}

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
