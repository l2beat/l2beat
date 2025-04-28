import type { Chain } from '../config/types'
import type { Decoder } from './Decoder'

export interface ApiQuery {
  hash?: `0x${string}`
  data?: `0x${string}`
  to?: `0x${string}`
  chainId?: number
}

export class ApiController {
  constructor(
    private decoder: Decoder,
    private chains: Chain[],
  ) {}
  async handle(query: ApiQuery) {
    if (!query.data) {
      throw new Error('No data')
    }

    const chainid = query.chainId ?? 1
    const chain = this.chains.find((x) => x.chainId === chainid)
    if (!chain) {
      throw new Error('Unknown chain id!')
    }

    const decoded = await this.decoder.decode({
      data: query.data,
      to: query.to ? `${chain.shortName}:${query.to}` : undefined,
      chain,
    })

    return decoded
  }
}
