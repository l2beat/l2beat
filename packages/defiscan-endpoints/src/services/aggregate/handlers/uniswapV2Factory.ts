import type { EthereumAddress } from '@l2beat/shared-pure'
import type { AggregateResponse } from '../../../types/api'
import type { AggregateHandler } from './types'

const SUBGRAPH_ID = 'EYCKATKGBKLWvSfwvBjzfCBmGwYNdVkduYXVivCsLRFu'

interface SubgraphResponse {
  data?: {
    uniswapFactory?: {
      totalLiquidityUSD: string
      pairCount: number
    }
  }
  errors?: Array<{ message: string }>
}

export class UniswapV2FactoryHandler implements AggregateHandler {
  name = 'uniswap-v2-factory'

  constructor(private readonly apiKey: string) {}

  async fetch(
    contractAddress: EthereumAddress,
    chain: string,
  ): Promise<AggregateResponse> {
    if (!this.apiKey) {
      throw new Error(
        'THEGRAPH_API_KEY is not configured — cannot fetch Uniswap V2 aggregate data',
      )
    }

    const url = `https://gateway.thegraph.com/api/${this.apiKey}/subgraphs/id/${SUBGRAPH_ID}`
    const factoryId = contractAddress.toString()

    const query = `{
      uniswapFactory(id: "${factoryId}") {
        totalLiquidityUSD
        pairCount
      }
    }`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(
        `The Graph API returned ${response.status}: ${await response.text()}`,
      )
    }

    const result = (await response.json()) as SubgraphResponse

    if (result.errors?.length) {
      throw new Error(
        `The Graph query error: ${result.errors.map((e) => e.message).join(', ')}`,
      )
    }

    const factory = result.data?.uniswapFactory
    if (!factory) {
      return {
        contract_address: contractAddress.toString(),
        total_usd_value: 0,
        contract_count: 0,
        breakdown: [],
        timestamp: new Date().toISOString(),
        source: 'thegraph-uniswap-v2',
      }
    }

    return {
      contract_address: contractAddress.toString(),
      total_usd_value: parseFloat(factory.totalLiquidityUSD),
      contract_count: factory.pairCount,
      breakdown: [],
      timestamp: new Date().toISOString(),
      source: 'thegraph-uniswap-v2',
    }
  }
}
