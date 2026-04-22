import type { EthereumAddress } from '@l2beat/shared-pure'
import type { AggregateResponse } from '../../../types/api'
import type { AggregateHandler } from './types'

const DEFILLAMA_PROTOCOL_SLUG = 'uniswap-v3'

// Maps the internal chain id (as used in `eth:0x...` / `arb1:0x...` prefixes)
// to the chain name DeFiLlama uses in its `currentChainTvls` map.
// Only Ethereum is wired up here because the V3 Factory contract this handler
// targets lives on Ethereum mainnet. Add more entries when the same handler
// is reused for other-chain factory deployments.
const CHAIN_ID_TO_DEFILLAMA_NAME: Record<string, string> = {
  eth: 'Ethereum',
  arb1: 'Arbitrum',
  base: 'Base',
  oeth: 'Optimism',
  matic: 'Polygon',
  bsc: 'Binance',
  avax: 'Avalanche',
}

interface DefiLlamaProtocolResponse {
  name?: string
  currentChainTvls?: Record<string, number>
}

/**
 * Aggregate handler for the Uniswap V3 Factory.
 *
 * Data source: DeFiLlama protocol API (`/protocol/uniswap-v3`).
 *
 * Why not the official Uniswap V3 subgraph? The subgraph's `totalValueLockedUSD`
 * is unreliable due to a long-standing pricing bug (spam pools with manipulated
 * tick prices inflate totals into the trillions). DeFiLlama runs its own
 * adapter that filters spam and prices via reliable oracles, so its numbers
 * line up with the figures shown on the Uniswap interface and DeFiLlama UI.
 *
 * Note: DeFiLlama doesn't expose a pool count for V3, so `contract_count` is 0.
 * If a pool count becomes important we can add a secondary subgraph call here.
 */
export class UniswapV3FactoryHandler implements AggregateHandler {
  name = 'uniswap-v3-factory'

  async fetch(
    contractAddress: EthereumAddress,
    chain: string,
  ): Promise<AggregateResponse> {
    const chainName = CHAIN_ID_TO_DEFILLAMA_NAME[chain]
    if (!chainName) {
      throw new Error(
        `UniswapV3FactoryHandler: unsupported chain "${chain}". Add it to CHAIN_ID_TO_DEFILLAMA_NAME.`,
      )
    }

    const url = `https://api.llama.fi/protocol/${DEFILLAMA_PROTOCOL_SLUG}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(
        `DeFiLlama API returned ${response.status}: ${await response.text()}`,
      )
    }

    const data = (await response.json()) as DefiLlamaProtocolResponse
    const tvl = data.currentChainTvls?.[chainName] ?? 0

    return {
      contract_address: contractAddress.toString(),
      total_usd_value: tvl,
      contract_count: 0,
      breakdown: [],
      timestamp: new Date().toISOString(),
      source: `defillama-${DEFILLAMA_PROTOCOL_SLUG}`,
    }
  }
}
