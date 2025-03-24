import type { Logger } from '@l2beat/backend-tools'
import { Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { CallParameters, RpcClient } from '../../clients'

export class TotalSupplyProvider {
  constructor(
    private readonly rpcs: RpcClient[],
    private logger: Logger,
  ) {}

  async getTotalSupplies(
    tokens: EthereumAddress[],
    blockNumber: number,
    chain: string,
  ): Promise<bigint[]> {
    const clients = this.rpcs.filter((r) => r.chain === chain)

    for (const [i, client] of clients.entries()) {
      try {
        const calls = tokens.map(encodeTotalSupply)

        if (client.isMulticallDeployed(blockNumber)) {
          const res = await client.multicall(calls, blockNumber)
          return res.map((r) => {
            if (r.success === false) {
              return 0n
            }
            return BigInt(r.data.toString())
          })
        } else {
          return Promise.all(
            calls.map(async (c) =>
              BigInt((await client.call(c, blockNumber)).toString()),
            ),
          )
        }
      } catch (error) {
        if (i === this.rpcs.length - 1) throw error
      }
    }

    throw new Error(`Missing RpcClient for ${chain}`)
  }
}

const erc20Interface = new utils.Interface([
  'function totalSupply() view returns (uint256)',
])

function encodeTotalSupply(token: EthereumAddress): CallParameters {
  return {
    to: token,
    data: Bytes.fromHex(erc20Interface.encodeFunctionData('totalSupply', [])),
  }
}
