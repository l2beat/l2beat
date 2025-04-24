import type { Chain } from '../../config/types'
import { JsonRpcClient } from './JsonRpcClient'

export class AlchemyClient {
  private client = new JsonRpcClient()

  constructor(private key: string) {}

  async hasNoCode(address: `0x${string}`, chain: Chain): Promise<boolean> {
    const url = `https://${chain.alchemyId}.g.alchemy.com/v2/${this.key}`
    const code = await this.client.call(url, {
      method: 'eth_getCode',
      params: [address, 'latest'],
    })
    return code === '0x'
  }
}
