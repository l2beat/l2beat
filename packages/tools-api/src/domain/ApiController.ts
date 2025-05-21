import type { Chain } from '../config/types'
import type { AlchemyClient } from '../services/api/AlchemyClient'
import type { Decoder, Transaction } from './Decoder'

export interface ApiQuery {
  hash?: `0x${string}`
  data?: `0x${string}`
  to?: `0x${string}`
  chainId?: number
}

export class ApiController {
  constructor(
    private decoder: Decoder,
    private alchemyClient: AlchemyClient,
    private chains: Chain[],
  ) {}

  async handle(query: ApiQuery) {
    const tx = await this.toTx(query)
    const result = await this.decoder.decode(tx)
    if (query.hash) {
      result.transaction = {
        hash: query.hash,
        explorerLink: `${tx.chain.explorerUrl}/tx/${query.hash}`,
      }
    }
    return result
  }

  private async toTx(query: ApiQuery): Promise<Transaction> {
    const hash = query.hash
    if (!hash) {
      if (!query.data) {
        throw new Error('No data')
      }

      const chainId = query.chainId ?? 1
      const chain = this.chains.find((x) => x.chainId === chainId)
      if (!chain) {
        throw new Error('Unknown chain id!')
      }

      return {
        data: query.data,
        to: query.to ? `${chain.shortName}:${query.to}` : undefined,
        chain,
      }
    }

    if (query.chainId) {
      const chain = this.chains.find((x) => x.chainId === query.chainId)
      if (!chain) {
        throw new Error('Unknown chain id!')
      }
      const tx = await this.alchemyClient.getTransaction(hash, chain)
      if (!tx) {
        throw new Error('Transaction not found!')
      }
      return { chain, data: tx.data, to: tx.to }
    }

    const results = await Promise.allSettled(
      this.chains.map(async (c): Promise<Transaction | undefined> => {
        const tx = await this.alchemyClient.getTransaction(hash, c)
        if (tx) {
          return { chain: c, data: tx.data, to: tx.to }
        }
      }),
    )
    for (const res of results) {
      if (res.status === 'fulfilled' && res.value) {
        return res.value
      }
    }
    throw new Error('Transaction not found!')
  }
}
