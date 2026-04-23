import type { EthereumAddress } from '@l2beat/shared-pure'
import type { AggregateResponse } from '../../../types/api'
import type { AggregateHandler } from './types'

const DEFILLAMA_SLUG = 'aerodrome-v1'
const V2_FACTORY = '0x420DD381b31aEf6683db6B902084cB0FFECe40Da'

// allPoolsLength() selector: 0xefde4e64
const ALL_POOLS_LENGTH_DATA = '0xefde4e64'

async function getPoolCount(factoryAddress: string): Promise<number> {
  try {
    const response = await fetch('https://base.blockscout.com/api/eth-rpc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [{ to: factoryAddress, data: ALL_POOLS_LENGTH_DATA }, 'latest'],
        id: 1,
      }),
    })
    if (!response.ok) return 0
    const result = (await response.json()) as { result?: string }
    return result.result ? parseInt(result.result, 16) : 0
  } catch {
    return 0
  }
}

export class AerodromeV2FactoryHandler implements AggregateHandler {
  name = 'aerodrome-v2-factory'

  async fetch(
    contractAddress: EthereumAddress,
    _chain: string,
  ): Promise<AggregateResponse> {
    const [tvlResponse, poolCount] = await Promise.all([
      fetch(`https://api.llama.fi/tvl/${DEFILLAMA_SLUG}`),
      getPoolCount(V2_FACTORY),
    ])

    if (!tvlResponse.ok) {
      throw new Error(
        `DefiLlama API returned ${tvlResponse.status}: ${await tvlResponse.text()}`,
      )
    }

    const tvl = parseFloat(await tvlResponse.text())

    if (isNaN(tvl)) {
      throw new Error(
        `DefiLlama returned invalid TVL for ${DEFILLAMA_SLUG}`,
      )
    }

    return {
      contract_address: contractAddress.toString(),
      total_usd_value: tvl,
      contract_count: poolCount,
      breakdown: [],
      timestamp: new Date().toISOString(),
      source: `defillama-${DEFILLAMA_SLUG}`,
    }
  }
}
