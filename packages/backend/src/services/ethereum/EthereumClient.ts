import { JsonRpcClient } from '../jsonrpc'
import { asQuantity } from './primitives'

export class EthereumClient {
  constructor(private jsonRpcClient: JsonRpcClient) {}

  async getBlockNumber() {
    const result = await this.jsonRpcClient.call('eth_blockNumber')
    return asQuantity(result)
  }
}
