import type { HttpClient } from '@l2beat/shared'
import { v } from '@l2beat/validate'

const DefiLlamaTvlPoint = v.object({
  date: v.number(),
  totalLiquidityUSD: v.number(),
})

const DefiLlamaChainTvl = v.object({
  tvl: v.array(DefiLlamaTvlPoint).optional(),
})

export const DefiLlamaProtocol = v.object({
  currentChainTvls: v.record(v.string(), v.union([v.number(), v.null()])),
  chainTvls: v.record(v.string(), DefiLlamaChainTvl),
})

export type DefiLlamaProtocol = v.infer<typeof DefiLlamaProtocol>

export class DefiLlamaClient {
  private readonly apiUrl: string

  constructor(
    private readonly httpClient: HttpClient,
    apiUrl: string,
  ) {
    this.apiUrl = apiUrl.replace(/\/$/, '')
  }

  async getProtocol(protocolSlug: string): Promise<DefiLlamaProtocol> {
    const data = await this.httpClient.fetch(
      `${this.apiUrl}/protocol/${encodeURIComponent(protocolSlug)}`,
      {
        headers: { 'user-agent': 'L2BEAT DeFi TVL indexer' },
        timeout: 30_000,
      },
    )

    return DefiLlamaProtocol.parse(data)
  }
}
