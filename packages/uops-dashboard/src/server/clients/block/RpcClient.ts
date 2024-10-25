import { Block, EVMBlock, EVMTransaction } from '@l2beat/shared'
import { providers } from 'ethers'
import { Chain } from '../../../chains'
import { getApiKey, getApiUrl } from '../apiUrls'
import { BlockClient } from './BlockClient'

// TODO: To be replaced by BlockProvider from @l2beat/shared
export class RpcClient implements BlockClient {
  private readonly provider: providers.Provider

  constructor(private readonly chain: Chain) {
    const apiUrl = getApiUrl(chain.id)
    const apiKey = getApiKey(chain.id, 'RPC')
    this.provider = new providers.StaticJsonRpcProvider({
      url: `${apiUrl}/${apiKey}`,
      timeout: 15_000,
    })
  }

  async getBlockNumber(): Promise<number> {
    // eth_blockNumber
    const result = await this.provider.getBlockNumber()
    return result
  }

  async getBlock(blockNumber: number): Promise<Block> {
    // eth_getBlockByNumber
    const rpcBlock = (await this.provider.getBlockWithTransactions(
      blockNumber,
    )) as EVMBlock

    return {
      number: rpcBlock.number,
      timestamp: rpcBlock.timestamp,
      hash: rpcBlock.hash,
      status: '<unknown>',
      transactions: rpcBlock.transactions.map((tx: EVMTransaction) => ({
        hash: tx.hash,
        data: tx.data,
        from: tx.from,
        to: tx.to,
        type: tx.type,
      })),
    }
  }
}
