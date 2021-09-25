import { EthereumClient } from './ethereum'

export class HelloService {
  constructor(private name: string, private ethereumClient: EthereumClient) {}

  getMessage() {
    return `Hello from ${this.name}!`
  }

  async getBlockNumber() {
    const blockNumber = await this.ethereumClient.getBlockNumber()
    return blockNumber.toString()
  }
}
