import { JsonRpcClient, JsonRpcParams } from '../jsonrpc'
import { asQuantity } from './primitives'

export class EthereumClient {
  constructor(private jsonRpcClient: JsonRpcClient) {}

  async getBlockNumber() {
    const result = await this.execute('eth_blockNumber')
    return asQuantity(result)
  }

  protected execute(method: string, params?: JsonRpcParams) {
    return this.jsonRpcClient.call(method, params)
  }
}
