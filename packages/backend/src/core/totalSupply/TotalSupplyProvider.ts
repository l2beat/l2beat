import {
  AssetId,
  Bytes,
  ChainId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'

import { TotalSupplyRecord } from '../../peripherals/database/TotalSupplyRepository'
import { MulticallClient } from '../../peripherals/ethereum/multicall/MulticallClient'
import { MulticallRequest } from '../../peripherals/ethereum/multicall/types'

export interface TotalSupplyQuery {
  assetId: AssetId
  tokenAddress: EthereumAddress
}

export class TotalSupplyProvider {
  constructor(
    private readonly multicallClient: MulticallClient,
    private readonly chainId: ChainId,
  ) {}

  public getChainId(): ChainId {
    return this.chainId
  }

  async getTotalSupplies(
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
}

const erc20Interface = new utils.Interface([
  'function totalSupply() view returns (uint256)',
])

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
