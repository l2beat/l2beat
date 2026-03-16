import type { EthereumAddress } from '@l2beat/shared-pure'
import type { AggregateResponse } from '../../../types/api'
import type { AggregateHandler } from './types'

const FRANKENCOIN_API = 'https://api.frankencoin.com'

// Map MintingHub contract addresses to their position version
const MINTINGHUB_VERSION: Record<string, number> = {
  '0x7546762fdb1a6d9146b33960545c3f6394265219': 1, // MintingHub V1
  '0xde12b620a8a714476a97efd14e6f7180ca653557': 2, // MintingHub V2
}

interface FrankencoinPosition {
  version: number
  position: string
  collateral: string
  collateralSymbol: string
  collateralDecimals: number
  collateralBalance: string
  denied: boolean
  closed: boolean
}

interface PositionsResponse {
  num: number
  addresses: string[]
  map: Record<string, FrankencoinPosition>
}

interface PriceEntry {
  address: string
  symbol: string
  price: { usd: number; chf: number }
}

/**
 * Aggregate handler for Frankencoin MintingHub contracts.
 * Fetches all open positions from the Frankencoin API, prices from
 * the prices endpoint, and computes total collateral value in USD.
 *
 * No API key required — all endpoints are public.
 */
export class FrankencoinMintinghubHandler implements AggregateHandler {
  name = 'frankencoin-mintinghub'

  async fetch(
    contractAddress: EthereumAddress,
    _chain: string,
  ): Promise<AggregateResponse> {
    // Fetch positions and prices in parallel
    const [positionsRes, pricesRes] = await Promise.all([
      fetch(`${FRANKENCOIN_API}/positions/open`),
      fetch(`${FRANKENCOIN_API}/prices/mapping`),
    ])

    if (!positionsRes.ok) {
      throw new Error(
        `Frankencoin positions API returned ${positionsRes.status}: ${await positionsRes.text()}`,
      )
    }
    if (!pricesRes.ok) {
      throw new Error(
        `Frankencoin prices API returned ${pricesRes.status}: ${await pricesRes.text()}`,
      )
    }

    const positions = (await positionsRes.json()) as PositionsResponse
    const priceMap = (await pricesRes.json()) as Record<string, PriceEntry>

    // Build breakdown per position
    const breakdown: Array<{ address: string; name?: string; usd_value: number }> = []
    let totalUsdValue = 0

    // Filter by MintingHub version if the contract address matches a known hub
    const versionFilter =
      MINTINGHUB_VERSION[contractAddress.toString().toLowerCase()]

    for (const addr of positions.addresses) {
      const pos = positions.map[addr]
      if (!pos || pos.denied || pos.closed) continue
      if (versionFilter !== undefined && pos.version !== versionFilter) continue

      // Look up collateral price (prices mapping uses lowercase keys)
      const priceEntry = priceMap[pos.collateral.toLowerCase()]
      if (!priceEntry) continue

      const balance =
        Number(pos.collateralBalance) / 10 ** pos.collateralDecimals
      const usdValue = balance * priceEntry.price.usd

      if (usdValue > 0) {
        breakdown.push({
          address: pos.position,
          name: `Position (${pos.collateralSymbol})`,
          usd_value: usdValue,
        })
        totalUsdValue += usdValue
      }
    }

    // Sort by value descending
    breakdown.sort((a, b) => b.usd_value - a.usd_value)

    return {
      contract_address: contractAddress.toString(),
      total_usd_value: totalUsdValue,
      contract_count: breakdown.length,
      breakdown,
      timestamp: new Date().toISOString(),
      source: 'frankencoin-api',
    }
  }
}
