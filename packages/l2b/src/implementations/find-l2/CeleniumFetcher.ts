import { z } from 'zod'
import type { FetchProjects, FetchResult } from './FetchInterface'

export const ResponsesRollupWithStatsSchema = z.array(
  z.object({
    blobs_count: z.number().nullable().optional(),
    bridge: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    explorer: z.string().nullable().optional(),
    fee: z.string().nullable().optional(),
    first_message_time: z.coerce.date().nullable().optional(),
    github: z.string().nullable().optional(),
    id: z.number().nullable().optional(),
    l2_beat: z.string().nullable().optional(),
    last_message_time: z.coerce.date().nullable().optional(),
    links: z.array(z.string()).nullable().optional(),
    logo: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    size: z.number().nullable().optional(),
    slug: z.string().nullable().optional(),
    stack: z.string().nullable().optional(),
    twitter: z.string().nullable().optional(),
    website: z.string().nullable().optional(),
  }),
)

const idRemapping: Record<string, string> = {
  ancient8: 'ancient',
  'manta-network': 'mantapacific',
  'public-good-networks': 'publicgoodsnetwork',
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
