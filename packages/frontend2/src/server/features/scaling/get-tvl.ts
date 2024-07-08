import { layer2s } from '@l2beat/config'
import { AssetId, ChainId, UnixTime, branded } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'

export async function getTvl() {
  // Once we will get data from DB we will not use mock as default
  return getCachedMockTvlApiResponse()
}

const getCachedMockTvlApiResponse = cache(async () => {
  const result: TvlResponse = {
    bridges: getMockTvlApiCharts(),
    layers2s: getMockTvlApiCharts(),
    combined: getMockTvlApiCharts(),
    projects: {},
  }
  for (const project of layer2s.slice(0, layer2s.length - 1)) {
    result.projects[project.id.toString()] = {
      charts: getMockTvlApiCharts(),
      tokens: {
        canonical: [
          {
            assetId: AssetId.ETH,
            chain: 'ethereum',
            chainId: ChainId.ETHEREUM,
            source: 'canonical',
            usdValue: 100,
          },
        ],
        external: [
          {
            assetId: AssetId.ETH,
            chain: 'ethereum',
            chainId: ChainId.ETHEREUM,
            source: 'external',
            usdValue: 100,
          },
        ],
        native: [
          {
            assetId: AssetId.ETH,
            chain: 'ethereum',
            chainId: ChainId.ETHEREUM,
            source: 'native',
            usdValue: 100,
          },
        ],
      },
    }
  }

  return result
}, ['mockTvl'])

const LABELS: TvlChart['types'] = [
  'timestamp',
  'totalUsd',
  'canonicalUsd',
  'externalUsd',
  'nativeUsd',
  'totalEth',
  'canonicalEth',
  'externalEth',
  'nativeEth',
]

const MOCK_VALUES = [60, 30, 20, 10, 5, 3, 2, 1] as const

function getMockTvlApiCharts(): TvlCharts {
  let now = UnixTime.now().toStartOf('hour')
  const charts: TvlCharts = {
    hourly: {
      types: LABELS,
      data: [],
    },
    sixHourly: {
      types: LABELS,
      data: [],
    },
    daily: {
      types: LABELS,
      data: [],
    },
  }
  for (let i = -7 * 24; i <= 0; i++) {
    const timestamp = now.add(i, 'hours')
    charts.hourly.data.push([timestamp.toNumber(), ...MOCK_VALUES])
  }
  for (let i = -30 * 4; i <= 0; i++) {
    const timestamp = now.add(i * 6, 'hours')
    charts.sixHourly.data.push([timestamp.toNumber(), ...MOCK_VALUES])
  }
  now = UnixTime.now().toStartOf('day')
  for (let i = -180; i <= 0; i++) {
    const timestamp = now.add(i, 'days')
    charts.daily.data.push([timestamp.toNumber(), ...MOCK_VALUES])
  }
  return charts
}

type TvlChart = z.infer<typeof TvlChart>
const TvlChart = z.object({
  types: z.tuple([
    z.literal('timestamp'),
    z.literal('totalUsd'),
    z.literal('canonicalUsd'),
    z.literal('externalUsd'),
    z.literal('nativeUsd'),
    z.literal('totalEth'),
    z.literal('canonicalEth'),
    z.literal('externalEth'),
    z.literal('nativeEth'),
  ]),
  data: z.array(
    z.tuple([
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
    ]),
  ),
})

export type TvlCharts = z.infer<typeof TvlCharts>
export const TvlCharts = z.object({
  hourly: TvlChart,
  sixHourly: TvlChart,
  daily: TvlChart,
})

export type TvlProjectToken = z.infer<typeof TvlProjectToken>
export const TvlProjectToken = z.object({
  assetId: branded(z.string(), AssetId),
  chainId: branded(z.number(), ChainId),
  // TODO(L2B-5614): Make both required
  address: z.string().optional(),
  chain: z.string().optional(),
  source: z.string(),
  usdValue: z.number(),
})

export type TvlProject = z.infer<typeof TvlProject>
export const TvlProject = z.object({
  tokens: z.object({
    canonical: z.array(TvlProjectToken),
    external: z.array(TvlProjectToken),
    native: z.array(TvlProjectToken),
  }),
  charts: TvlCharts,
})

export type TvlResponse = z.infer<typeof TvlResponse>
export const TvlResponse = z.object({
  layers2s: TvlCharts,
  bridges: TvlCharts,
  combined: TvlCharts,
  projects: z.record(z.string(), TvlProject),
})
