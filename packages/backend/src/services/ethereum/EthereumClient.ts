import { JsonRpcClient, JsonRpcParams } from '../jsonrpc'
import { asBigIntFromQuantity } from './primitives'

export class EthereumClient {
  constructor(private jsonRpcClient: JsonRpcClient) {}

  async getBlockNumber() {
    const result = await this.execute('eth_blockNumber')
    return asBigIntFromQuantity(result)
  }

  protected execute(method: string, params?: JsonRpcParams) {
    return this.jsonRpcClient.call(method, params)
  }
}
