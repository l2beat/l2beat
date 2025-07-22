import type { Logger } from '@l2beat/backend-tools'
import { assert, Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { CallParameters, RpcClient } from '../../clients'
import type { MulticallV3Client } from '../../clients/rpc/multicall/MulticallV3Client'

interface BalanceQuery {
  token: EthereumAddress | 'native'
  holder: EthereumAddress
}

export class BalanceProvider {
  private logger: Logger
  constructor(
    private readonly rpcs: RpcClient[],
    logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  async getBalances(
    queries: BalanceQuery[],
    blockNumber: number,
    chain: string,
  ): Promise<bigint[]> {
    const clients = this.rpcs.filter((r) => r.chain === chain)

    for (const [index, client] of clients.entries()) {
      try {
        if (client.isMulticallDeployed(blockNumber)) {
          const calls = queries.map((q) => {
            assert(client.multicallClient)
            return encodeBalanceForMulticall(q, client.multicallClient)
          })
          const res = await client.multicall(calls, blockNumber)
          return res.map((r, i) => {
            if (r.success === false) {
              this.logger.tag({ chain }).warn('Issue with balance fetching', {
                token: queries[i].token,
                blockNumber,
              })
              return 0n
            }
            return BigInt(r.data.toString())
          })
        }
        return Promise.all(
          queries.map(async (q) => {
            if (q.token === 'native') {
              try {
                const res = await client.getBalance(q.holder, blockNumber)
                return res.toString() === '0x' ? 0n : BigInt(res.toString())
              } catch {
                this.logger.tag({ chain }).warn('Issue with balance fetching', {
                  token: q.token,
                  blockNumber,
                })
                return 0n
              }
            } else {
              try {
                const res = await client.call(
                  encodeErc20Balance(q.token, q.holder),
                  blockNumber,
                )
                return res.toString() === '0x' ? 0n : BigInt(res.toString())
              } catch {
                this.logger.tag({ chain }).warn('Issue with balance fetching', {
                  token: q.token,
                  blockNumber,
                })
                return 0n
              }
            }
          }),
        )
      } catch (error) {
        if (index === clients.length - 1) throw error
      }
    }

    throw new Error(`Missing RpcClient for ${chain}`)
  }
}

function encodeBalanceForMulticall(
  query: BalanceQuery,
  multicall: MulticallV3Client,
): CallParameters {
  if (query.token === 'native') {
    return multicall.encodeGetEthBalance(query.holder)
  }

  return encodeErc20Balance(query.token, query.holder)
}

const erc20Interface = new utils.Interface([
  'function balanceOf(address account) view returns (uint256)',
])

export function encodeErc20Balance(
  token: EthereumAddress,
  holder: EthereumAddress,
): CallParameters {
  return {
    to: token,
    data: Bytes.fromHex(
      erc20Interface.encodeFunctionData('balanceOf', [holder]),
    ),
  }
}
