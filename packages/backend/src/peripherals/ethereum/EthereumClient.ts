import { KeccakHash } from '../../model'
import { JsonRpcClient, JsonRpcParams } from '../jsonrpc'
import {
  asBigIntFromQuantity,
  asBytesFromData,
  blockTagToString,
} from './primitives'
import { asRpcBlock, encodeRpcCallParameters, RpcCallParameters } from './types'

export type BlockTag = BigInt | 'earliest' | 'latest' | 'pending'

export class EthereumClient {
  constructor(private jsonRpcClient: JsonRpcClient) {}

  async getBlockNumber() {
    const result = await this.execute('eth_blockNumber')
    return asBigIntFromQuantity(result)
  }

  async getBlock(blockTagOrHash: BlockTag | KeccakHash) {
    if (blockTagOrHash instanceof KeccakHash) {
      const result = await this.execute('eth_getBlockByHash', [
        blockTagOrHash.toString(),
        false,
      ])
      return asRpcBlock(result)
    } else {
      const result = await this.execute('eth_getBlockByNumber', [
        blockTagToString(blockTagOrHash),
        false,
      ])
      return asRpcBlock(result)
    }
  }

  async call(parameters: RpcCallParameters, blockTag: BlockTag) {
    const encoded = encodeRpcCallParameters(parameters)
    const result = await this.execute('eth_call', [
      encoded,
      blockTagToString(blockTag),
    ])
    return asBytesFromData(result)
  }

  protected execute(method: string, params?: JsonRpcParams) {
    return this.jsonRpcClient.call(method, params)
  }
}
