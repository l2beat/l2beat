import type { EthereumAddress } from '@l2beat/shared-pure'
import type { AggregateResponse } from '../../../types/api'
import type { AggregateHandler } from './types'

const DEFILLAMA_SLUG = 'aerodrome-slipstream'

// Both CL factories — the new one references the legacy as legacyCLFactory
const CL_FACTORIES = [
  '0x5e7BB104d84c7CB9B682AaC2F3d509f5F406809A',
  '0xaDe65c38CD4849aDBA595a4323a8C7DdfE89716a',
]

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

export class AerodromeClFactoryHandler implements AggregateHandler {
  name = 'aerodrome-cl-factory'

  async fetch(
    contractAddress: EthereumAddress,
    _chain: string,
  ): Promise<AggregateResponse> {
    const [tvlResponse, ...poolCounts] = await Promise.all([
      fetch(`https://api.llama.fi/tvl/${DEFILLAMA_SLUG}`),
      ...CL_FACTORIES.map(getPoolCount),
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

    const totalPools = poolCounts.reduce((sum, c) => sum + c, 0)

    return {
      contract_address: contractAddress.toString(),
      total_usd_value: tvl,
      contract_count: totalPools,
      breakdown: [],
      timestamp: new Date().toISOString(),
      source: `defillama-${DEFILLAMA_SLUG}`,
    }
  }
}
