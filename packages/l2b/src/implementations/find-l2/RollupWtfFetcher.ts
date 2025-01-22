import { z } from 'zod'
import type { FetchProjects, FetchResult } from './FetchInterface'

const RollupWtfResponse = z.record(
  z.object({
    name: z.string(),
    label: z.string(),
    website: z.string(),
    explorer: z.string(),
    parentChain: z.string(),
    da: z.string(),
    stack: z.string(),
    provider: z.string(),
    g2Enabled: z.boolean().optional(),
  }),
)

const idRemapping: Record<string, string> = {
  ancient8: 'ancient',
  pgn: 'publicgoodsnetwork',
  'proofofplay-apex': 'popapex',
  'proofofplay-boss': 'popboss',
  'superposition-1v9rjalnat': 'superposition',
  'polygon-zkevm': 'polygonzkevm',
  'onchain-9u03waglau': 'onchain',
  'molten-network': 'molten',
  'boba-network': 'bobanetwork',
  'arbitrum-nova': 'nova',
  'arbitrum-one': 'arbitrum',
}

export class RollupWtfFetcher implements FetchProjects {
  async fetch(): Promise<FetchResult> {
    const connection = await fetch(
      'https://tracker-api-gdesfolyga-uw.a.run.app/networkMetadata',
    )
    const content = RollupWtfResponse.parse(await connection.json())
    const projects = Object.keys(content).map((k) => k.split('-mainnet')[0])
    const filtered = projects.filter((p) => p !== 'ethereum')
    return {
      sourcePretty: 'rollup.wtf',
      names: filtered.map((p) => idRemapping[p] ?? p),
    }
  }
}
