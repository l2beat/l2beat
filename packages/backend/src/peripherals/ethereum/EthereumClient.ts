import { Bytes, KeccakHash } from '../../model'
import { IJsonRpcClient } from '../jsonrpc'
import {
  asBigIntFromQuantity,
  asBytesFromData,
  blockTagToString,
} from './primitives'
import {
  asRpcBlock,
  encodeRpcCallParameters,
  RpcBlock,
  RpcCallParameters,
} from './types'

export type BlockTag = bigint | 'earliest' | 'latest' | 'pending'

export interface IEthereumClient {
  getBlockNumber(): Promise<bigint>
  getBlock(blockTagOrHash: BlockTag | KeccakHash): Promise<RpcBlock>
  call(parameters: RpcCallParameters, blockTag: BlockTag): Promise<Bytes>
}

export class EthereumClient implements IEthereumClient {
  constructor(private jsonRpcClient: IJsonRpcClient) {}

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
