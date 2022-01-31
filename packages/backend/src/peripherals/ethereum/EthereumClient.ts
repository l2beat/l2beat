import { KeccakHash } from '@l2beat/common'

import { JsonRpcClient } from '../jsonrpc'
import {
  asBigIntFromQuantity,
  asBytesFromData,
  BlockTag,
  blockTagToString,
} from './primitives'
import { asRpcBlock, encodeRpcCallParameters, RpcCallParameters } from './types'

export class EthereumClient {
  constructor(private jsonRpcClient: JsonRpcClient) {}

  async getBlockNumber() {
    const result = await this.jsonRpcClient.call('eth_blockNumber')
    return asBigIntFromQuantity(result)
  }

  async getBlock(blockTagOrHash: BlockTag | KeccakHash) {
    if (blockTagOrHash instanceof KeccakHash) {
      const result = await this.jsonRpcClient.call('eth_getBlockByHash', [
        blockTagOrHash.toString(),
        false,
      ])
      return asRpcBlock(result)
    } else {
      const result = await this.jsonRpcClient.call('eth_getBlockByNumber', [
        blockTagToString(blockTagOrHash),
        false,
      ])
      return asRpcBlock(result)
    }
  }

  async call(parameters: RpcCallParameters, blockTag: BlockTag) {
    const encoded = encodeRpcCallParameters(parameters)
    const result = await this.jsonRpcClient.call('eth_call', [
      encoded,
      blockTagToString(blockTag),
    ])
    return asBytesFromData(result)
  }
}
