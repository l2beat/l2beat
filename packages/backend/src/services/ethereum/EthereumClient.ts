import { JsonRpcClient, JsonRpcParams } from '../jsonrpc'
import { KeccakHash } from './KeccakHash'
import { asBigIntFromQuantity, blockTagToString } from './primitives'
import { asRpcBlock } from './types'

export type BlockTag = BigInt | 'earliest' | 'latest' | 'pending'

export class EthereumClient {
  constructor(private jsonRpcClient: JsonRpcClient) {}

  async getBlockNumber() {
    const result = await this.execute('eth_blockNumber')
    return asBigIntFromQuantity(result)
  }

  async getBlock(identifier: BlockTag | KeccakHash) {
    if (identifier instanceof KeccakHash) {
      const result = await this.execute('eth_getBlockByHash', [
        identifier.toString(),
        false,
      ])
      return asRpcBlock(result)
    } else {
      const result = await this.execute('eth_getBlockByNumber', [
        blockTagToString(identifier),
        false,
      ])
      return asRpcBlock(result)
    }
  }

  protected execute(method: string, params?: JsonRpcParams) {
    return this.jsonRpcClient.call(method, params)
  }
}
