import { Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { CallParameters, RpcClient } from '../../clients'

export class TotalSupplyProvider {
  constructor(private readonly rpcs: RpcClient[]) {}

  async getTotalSupplies(
    tokens: EthereumAddress[],
    blockNumber: number,
    chain: string,
  ) {
    const clients = this.rpcs.filter((r) => r.chain === chain)

    for (const [i, client] of clients.entries()) {
      try {
        const calls = tokens.map(encodeTotalSupply)

        if (client.isMulticallDeployed(blockNumber)) {
          return client.multicall(calls, blockNumber)
        } else {
          return Promise.all(calls.map((c) => client.call(c, blockNumber)))
        }
      } catch (error) {
        if (i === this.rpcs.length - 1) throw error
      }
    }

    throw new Error(`Missing RpcClient for ${chain}`)
  }
}

export const erc20Interface = new utils.Interface([
  'function totalSupply() view returns (uint256)',
])

function encodeTotalSupply(token: EthereumAddress): CallParameters {
  return {
    to: token,
    data: Bytes.fromHex(erc20Interface.encodeFunctionData('totalSupply', [])),
  }
}
