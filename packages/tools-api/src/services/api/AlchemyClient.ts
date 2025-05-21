import { z } from 'zod'
import type { Address, Chain } from '../../config/types'
import { JsonRpcClient } from './JsonRpcClient'

export interface BasicTxInfo {
  to: Address
  data: `0x${string}`
}

export class AlchemyClient {
  private client = new JsonRpcClient()

  constructor(private key: string) {}

  async hasNoCode(address: `0x${string}`, chain: Chain): Promise<boolean> {
    const code = await this.client.call(this.url(chain), {
      method: 'eth_getCode',
      params: [address, 'latest'],
    })
    return code === '0x'
  }

  async getTransaction(
    hash: `0x${string}`,
    chain: Chain,
  ): Promise<BasicTxInfo | undefined> {
    const tx = await this.client.call(this.url(chain), {
      method: 'eth_getTransactionByHash',
      params: [hash],
    })
    if (!tx) {
      return undefined
    }
    const response = TransactionResponse.safeParse(tx)
    if (response.error) {
      return undefined
    }
    return {
      data: response.data.input.toLowerCase() as `0x${string}`,
      to: `${chain.shortName}:${response.data.to.toLowerCase()}` as Address,
    }
  }

  private url(chain: Chain) {
    return `https://${chain.alchemyId}.g.alchemy.com/v2/${this.key}`
  }
}

const TransactionResponse = z.object({
  input: z.string().regex(/^0x[a-f\d]*$/i),
  to: z.string().regex(/^0x[a-f\d]{40}$/i),
})
