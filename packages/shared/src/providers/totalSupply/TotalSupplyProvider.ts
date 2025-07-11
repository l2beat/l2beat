import type { Logger } from '@l2beat/backend-tools'
import { Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { CallParameters, RpcClient } from '../../clients'

export class TotalSupplyProvider {
  private logger: Logger
  constructor(
    private readonly rpcs: RpcClient[],
    logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

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
          return res.map((r, i) => {
            if (r.success === false) {
              this.logger
                .tag({ chain })
                .warn('Issue with totalSupply fetching', {
                  token: tokens[i],
                  blockNumber,
                })
              return 0n
            }
            return BigInt(r.data.toString())
          })
        }
        return Promise.all(
          calls.map(async (c, i) => {
            try {
              const res = await client.call(c, blockNumber)
              return res.toString() === '0x' ? 0n : BigInt(res.toString())
            } catch {
              this.logger
                .tag({ chain })
                .warn('Issue with totalSupply fetching', {
                  token: tokens[i],
                  blockNumber,
                })
              return 0n
            }
          }),
        )
      } catch (error) {
        if (i === clients.length - 1) throw error
      }
    }

    throw new Error(`Missing RpcClient for ${chain}`)
  }
}

const erc20Interface = new utils.Interface([
  'function totalSupply() view returns (uint256)',
])

export function encodeTotalSupply(token: EthereumAddress): CallParameters {
  return {
    to: token,
    data: Bytes.fromHex(erc20Interface.encodeFunctionData('totalSupply', [])),
  }
}
