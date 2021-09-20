import { JsonRpcHttpClient } from './jsonrpc/JsonRpcHttpClient'

export class HelloService {
  constructor(
    private name: string,
    private jsonRpcHttpClient: JsonRpcHttpClient
  ) {}

  getMessage() {
    return `Hello from ${this.name}!`
  }

  async getBlockNumber() {
    const hex = await this.jsonRpcHttpClient.call('eth_blockNumber')
    return parseInt(('' + hex).substring(2), 16)
  }
}
