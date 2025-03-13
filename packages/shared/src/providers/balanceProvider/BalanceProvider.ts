import { assert, Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { CallParameters, RpcClient } from '../../clients'
import type { MulticallV3Client } from '../../clients/rpc/multicall/MulticallV3Client'

interface BalanceQuery {
  token: EthereumAddress | 'native'
  holder: EthereumAddress
}

export class BalanceProvider {
  constructor(private readonly rpcs: RpcClient[]) {}

  async getBalances(
    queries: BalanceQuery[],
    blockNumber: number,
    chain: string,
  ) {
    const clients = this.rpcs.filter((r) => r.chain === chain)

    for (const [index, client] of clients.entries()) {
      try {
        if (client.isMulticallDeployed(blockNumber)) {
          const calls = queries.map((q) => {
            assert(client.multicallClient)
            return encodeBalanceForMulticall(q, client.multicallClient)
          })
          return client.multicall(calls, blockNumber)
        } else {
          return Promise.all(
            queries.map(({ token, holder }) => {
              if (token === 'native') {
                return client.getBalance(holder, blockNumber)
              } else {
                return client.call(
                  encodeErc20Balance(token, holder),
                  blockNumber,
                )
              }
            }),
          )
        }
      } catch (error) {
        if (index === this.rpcs.length - 1) throw error
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

export const erc20Interface = new utils.Interface([
  'function balanceOf(address account) view returns (uint256)',
])

function encodeErc20Balance(
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
