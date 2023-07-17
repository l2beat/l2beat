import {
  assert,
  Bytes,
  ChainId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'

import { ArbitrumMulticallClient } from '../../../peripherals/arbitrum/multicall/ArbitrumMulticall'
import { TotalSupplyRecord } from '../../../peripherals/database/TotalSupplyRepository'
import { EthereumClient } from '../../../peripherals/ethereum/EthereumClient'
import { MulticallRequest } from '../../../peripherals/ethereum/MulticallClient'
import { TotalSupplyProvider, TotalSupplyQuery } from '../TotalSupplyProvider'

const erc20Interface = new utils.Interface([
  'function totalSupply() view returns (uint256)',
])

export class ArbitrumTotalSupplyProvider implements TotalSupplyProvider {
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

  public async getTotalSupplies(
    totalSupplyQueries: TotalSupplyQuery[],
    timestamp: UnixTime,
    blockNumber: number,
  ): Promise<TotalSupplyRecord[]> {
    const canMulticallBeUsed = this.multicallClient.canBeUsed(blockNumber)

    if (canMulticallBeUsed) {
      return this.fetchUsingMulticall(
        totalSupplyQueries,
        timestamp,
        blockNumber,
      )
    }

    return this.fetchUsingPlainCalls(totalSupplyQueries, timestamp, blockNumber)
  }

  private async fetchUsingMulticall(
    totalSupplyQueries: TotalSupplyQuery[],
    timestamp: UnixTime,
    blockNumber: number,
  ): Promise<TotalSupplyRecord[]> {
    const calls = totalSupplyQueries.map(({ tokenAddress }) =>
      encodeErc20TotalSupplyQuery(tokenAddress),
    )

    const totalSupplyResponses = await this.multicallClient.multicall(
      calls,
      blockNumber,
    )

    return totalSupplyResponses.map((totalSupplyResponse, i) => {
      const assetId = totalSupplyQueries[i].assetId
      if (!totalSupplyResponse.success) {
        throw new Error(
          `Could not obtain total supply of ${assetId.toString()} at timestamp ${timestamp.toString()} for block ${blockNumber}`,
        )
      }

      const totalSupply = decodeErc20TotalSupplyQuery(totalSupplyResponse.data)

      return {
        timestamp,
        totalSupply,
        assetId: totalSupplyQueries[i].assetId,
        chainId: this.chainId,
      }
    })
  }

  private async fetchUsingPlainCalls(
    totalSupplyQueries: TotalSupplyQuery[],
    timestamp: UnixTime,
    blockNumber: number,
  ): Promise<TotalSupplyRecord[]> {
    const rpcCalls = totalSupplyQueries.map(({ tokenAddress }) => {
      const { address: to, data } = encodeErc20TotalSupplyQuery(tokenAddress)

      return this.arbitrumClient.call({ to, data }, blockNumber)
    })

    const responses = await Promise.all(rpcCalls)

    return totalSupplyQueries.map(({ assetId }, i) => {
      const totalSupplyResponse = responses[i]

      const totalSupply = decodeErc20TotalSupplyQuery(totalSupplyResponse)

      return {
        assetId,
        timestamp,
        chainId: this.chainId,
        totalSupply,
      }
    })
  }
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
