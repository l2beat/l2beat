import { v } from '@l2beat/validate'
import type { FetchProjects, FetchResult } from './FetchInterface'

const RollupWtfResponse = v.record(
  v.string(),
  v.object({
    name: v.string(),
    label: v.string(),
    website: v.string(),
    explorer: v.string(),
    parentChain: v.string(),
    da: v.string(),
    stack: v.string(),
    provider: v.string(),
    g2Enabled: v.boolean().optional(),
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
  'corn-mainnet': 'corn',
  'pepe-unchained-gupg0lo9wf': 'pepeunchained',
  'onyx-6l1k4gho61': 'onyx',
  'g7-network': 'game7',
  'corn-maizenet': 'corn',
  pontem: 'superlumio',
  polygon: 'polygon-pos',
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
