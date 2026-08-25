import type { Logger } from '@l2beat/backend-tools'
import { assert, Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { CallParameters } from '../../clients'
import type { MulticallV3Client } from '../../clients/rpc/multicall/MulticallV3Client'
import type { IRpcClient } from '../../clients2'

interface BalanceQuery {
  token: EthereumAddress | 'native'
  holder: EthereumAddress
}

export class BalanceProvider {
  private logger: Logger
  constructor(
    private readonly rpcs: IRpcClient[],
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
            // a revert gives no number - throw instead of storing a
            // poisoned 0. getEthBalance always returns data, so empty
            // data for native is a fault too
            if (
              !r.success ||
              (r.data.length === 0 && queries[i].token === 'native')
            ) {
              throw new Error(
                `Failed to fetch balance of ${queries[i].token} for ${queries[i].holder} at block ${blockNumber}`,
              )
            }
            if (r.data.length === 0) {
              // token not deployed at this block
              this.logger.tag({ chain }).warn('Issue with balance fetching', {
                token: queries[i].token,
                blockNumber,
              })
              return 0n
            }
            return BigInt(r.data.toString())
          })
        }
        return await Promise.all(
          queries.map(async (q) => {
            const res =
              q.token === 'native'
                ? await client.getBalance(q.holder, blockNumber)
                : await client.call(
                    encodeErc20Balance(q.token, q.holder),
                    blockNumber,
                  )
            return res.toString() === '0x' ? 0n : BigInt(res.toString())
          }),
        )
      } catch (error) {
        this.logger.tag({ chain }).warn('Balance fetching failed', {
          blockNumber,
        })
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
    input: Bytes.fromHex(
      erc20Interface.encodeFunctionData('balanceOf', [holder]),
    ),
  }
}
