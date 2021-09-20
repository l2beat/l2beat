import { JsonRpcHttpClient } from './jsonrpc/JsonRpcHttpClient'

export class HelloService {
  constructor(
    private name: string,
    private jsonRpcHttpClient: JsonRpcHttpClient
  ) {}

  async getMessage() {
    const blockNumber = await this.jsonRpcHttpClient.call('eth_blockNumber')
    return `Hello from ${this.name} at ${blockNumber}!`
  }
}
