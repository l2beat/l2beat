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

import { ArbitrumMulticallClient } from '../../../peripherals/arbitrum/multicall/ArbitrumMulticall'
import { MulticallResponse } from '../../../peripherals/arbitrum/multicall/interfaces'
import { BalanceRecord } from '../../../peripherals/database/BalanceRepository'
import { EthereumClient } from '../../../peripherals/ethereum/EthereumClient'
import { MulticallRequest } from '../../../peripherals/ethereum/MulticallClient'
import { BalanceProvider, BalanceQuery } from '../BalanceProvider'

const erc20Interface = new utils.Interface([
  'function balanceOf(address account) view returns (uint256)',
])

const multicallInterface = new utils.Interface([
  'function getEthBalance(address account) view returns (uint256)',
])

export class ArbitrumBalanceProvider implements BalanceProvider {
  private readonly chainId = ChainId.ARBITRUM

  constructor(
    private readonly arbitrumClient: EthereumClient,
    private readonly multicallClient: ArbitrumMulticallClient,
  ) {
    assert(
      this.chainId === this.multicallClient.getChainId(),
      'chainId mismatch between multicallClient and balance provider',
    )
  }

  public getChainId(): ChainId {
    return this.chainId
  }

  public async fetchBalances(
    balanceQueries: BalanceQuery[],
    timestamp: UnixTime,
    blockNumber: number,
  ): Promise<BalanceRecord[]> {
    const canMulticallBeUsed = this.multicallClient.canBeUsed(blockNumber)

    if (canMulticallBeUsed) {
      return this.fetchUsingMulticall(balanceQueries, timestamp, blockNumber)
    }

    return this.fetchUsingPlainCalls(balanceQueries, timestamp, blockNumber)
  }

  private async fetchUsingMulticall(
    balanceQueries: BalanceQuery[],
    timestamp: UnixTime,
    blockNumber: number,
  ): Promise<BalanceRecord[]> {
    const calls = balanceQueries.map((balanceQuery) =>
      this.encodeForMulticall(balanceQuery),
    )

    const balanceResponses = await this.multicallClient.multicall(
      calls,
      blockNumber,
    )

    return balanceQueries.map(({ holder, assetId }, i) => ({
      assetId,
      timestamp,
      holderAddress: holder,
      chainId: this.chainId,
      balance: this.decodeForMulticall(balanceResponses[i], assetId) ?? 0n,
    }))
  }

  private async fetchUsingPlainCalls(
    balanceQueries: BalanceQuery[],
    timestamp: UnixTime,
    blockNumber: number,
  ): Promise<BalanceRecord[]> {
    const rpcCalls = balanceQueries.map((balanceQuery) => {
      if (this.isNativeCoin(balanceQuery.assetId)) {
        return this.arbitrumClient.getBalance(balanceQuery.holder, blockNumber)
      }

      const tokenAddress = getTokenByAssetId(balanceQuery.assetId).address

      assert(
        tokenAddress,
        `Unknown token address for balance query: ${balanceQuery.assetId.toString()}`,
      )

      const { address: to, data } = encodeErc20BalanceQuery(
        balanceQuery.holder,
        tokenAddress,
      )

      return this.arbitrumClient.call({ to, data }, blockNumber)
    })

    const responses = await Promise.all(rpcCalls)

    return balanceQueries.map(({ holder, assetId }, i) => {
      const balanceResponse = responses[i]

      const balance = BigNumber.isBigNumber(balanceResponse)
        ? balanceResponse.toBigInt()
        : decodeErc20BalanceQuery(balanceResponse)

      return {
        assetId,
        timestamp,
        holderAddress: holder,
        chainId: this.chainId,
        balance,
      }
    })
  }

  private encodeForMulticall({
    assetId,
    holder,
  }: BalanceQuery): MulticallRequest {
    if (this.isNativeCoin(assetId)) {
      return encodeMulticallGetBalanceQuery(
        holder,
        this.multicallClient.getAddress(),
      )
    }

    const tokenAddress = getTokenByAssetId(assetId).address

    assert(
      tokenAddress,
      `Unknown token address for balance query: ${assetId.toString()}`,
    )

    return encodeErc20BalanceQuery(holder, tokenAddress)
  }

  private isNativeCoin(assetId: AssetId): boolean {
    return assetId === AssetId.ETH
  }

  private decodeForMulticall(response: MulticallResponse, assetId: AssetId) {
    if (!response.success) {
      return
    }

    if (this.isNativeCoin(assetId)) {
      return decodeMulticallGetBalanceQuery(response.data)
    }

    return decodeErc20BalanceQuery(response.data)
  }
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

function encodeMulticallGetBalanceQuery(
  holder: EthereumAddress,
  multicallAddress: EthereumAddress,
): MulticallRequest {
  return {
    address: multicallAddress,
    data: Bytes.fromHex(
      multicallInterface.encodeFunctionData('getEthBalance', [
        holder.toString(),
      ]),
    ),
  }
}

function decodeMulticallGetBalanceQuery(response: Bytes): bigint {
  const [value] = multicallInterface.decodeFunctionResult(
    'getEthBalance',
    response.toString(),
  )

  return (value as BigNumber).toBigInt()
}
