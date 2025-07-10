import { v } from '@l2beat/validate'
import type { FetchProjects, FetchResult } from './FetchInterface'

export const ResponsesRollupWithStatsSchema = v.array(
  v.object({
    name: v.union([v.string(), v.null()]).optional(),
    slug: v.union([v.string(), v.null()]).optional(),
  }),
)

const idRemapping: Record<string, string> = {
  ancient8: 'ancient',
  'manta-network': 'mantapacific',
  'public-good-networks': 'publicgoodsnetwork',
  derive: 'lyra',
  'gravity-alpha': 'gravity',
  'pepe-unchained': 'pepeunchained',
  'rari-chain': 'rari',
  'winr-protocol': 'winr',
  'molten-network': 'molten',
  'manta-pacific': 'mantapacific',
  k2: 'karak',
}

export class CeleniumFetcher implements FetchProjects {
  async fetch(): Promise<FetchResult> {
    const connection = await fetch(
      'https://api.celenium.io/v1/rollup?limit=99&offset=0&sort=asc&sort_by=time',
    )
    const content = ResponsesRollupWithStatsSchema.parse(
      await connection.json(),
    )
    const filtered = content
      .map((c) => c.slug)
      .filter((s) => s !== undefined && s !== null)

    return {
      sourcePretty: 'Celenium',
      names: filtered.map((p) => idRemapping[p] ?? p),
    }
  }
}
