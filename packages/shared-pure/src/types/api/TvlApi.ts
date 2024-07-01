import z from 'zod'

import { AssetId } from '../AssetId'
import { ChainId } from '../ChainId'
import { EthereumAddress } from '../EthereumAddress'
import { UnixTime } from '../UnixTime'
import { branded } from '../branded'

const TvlApiChartPoint = z.tuple([
  branded(z.number(), (n) => new UnixTime(n)),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
])
export type TvlApiChartPoint = z.infer<typeof TvlApiChartPoint>

const TvlApiChart = z.object({
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
  data: z.array(TvlApiChartPoint),
})
export type TvlApiChart = z.infer<typeof TvlApiChart>

export const TvlApiCharts = z.object({
  hourly: TvlApiChart,
  sixHourly: TvlApiChart,
  daily: TvlApiChart,
})
export type TvlApiCharts = z.infer<typeof TvlApiCharts>

export const TvlApiToken = z.object({
  assetId: branded(z.string(), AssetId),
  chainId: branded(z.number(), ChainId),
  // TODO(L2B-5614): Make both required
  address: z.string().optional(),
  chain: z.string().optional(),
  source: z.string(),
  usdValue: z.number(),
})

export type TvlApiToken = z.infer<typeof TvlApiToken>

export const TvlApiProject = z.object({
  tokens: z.object({
    canonical: z.array(TvlApiToken),
    external: z.array(TvlApiToken),
    native: z.array(TvlApiToken),
  }),
  charts: TvlApiCharts,
})
export type TvlApiProject = z.infer<typeof TvlApiProject>

export const TvlApiResponse = z.object({
  bridges: TvlApiCharts,
  layers2s: TvlApiCharts,
  combined: TvlApiCharts,
  projects: z.record(z.string(), TvlApiProject.optional()),
})
export type TvlApiResponse = z.infer<typeof TvlApiResponse>

const BaseAssetBreakdownData = z.object({
  assetId: branded(z.string(), AssetId),
  chainId: branded(z.number(), ChainId),
  amount: z.string(),
  usdValue: z.string(),
  usdPrice: z.string(),
})

export const CanonicalAssetBreakdownData = BaseAssetBreakdownData.extend({
  escrows: z.array(
    z.object({
      amount: z.string(),
      usdValue: z.string(),
      escrowAddress: branded(z.string(), EthereumAddress),
    }),
  ),
})

export type CanonicalAssetBreakdownData = z.infer<
  typeof CanonicalAssetBreakdownData
>

export const ExternalAssetBreakdownData = BaseAssetBreakdownData.extend({
  tokenAddress: z.optional(branded(z.string(), EthereumAddress)),
  bridge: z.optional(
    z.object({
      name: z.string(),
      slug: z.optional(z.string()),
      warning: z.optional(z.string()),
    }),
  ),
})

export type ExternalAssetBreakdownData = z.infer<
  typeof ExternalAssetBreakdownData
>

export const NativeAssetBreakdownData = BaseAssetBreakdownData.extend({
  tokenAddress: z.optional(branded(z.string(), EthereumAddress)),
})

export type NativeAssetBreakdownData = z.infer<typeof NativeAssetBreakdownData>

export const ProjectAssetsBreakdownApiResponse = z.object({
  dataTimestamp: branded(z.number(), (n) => new UnixTime(n)),
  breakdowns: z.record(
    z.string(), // Project Id
    z.object({
      // escrow -> asset[]
      canonical: z.array(CanonicalAssetBreakdownData),
      external: z.array(ExternalAssetBreakdownData),
      native: z.array(NativeAssetBreakdownData),
    }),
  ),
})

export type ProjectAssetsBreakdownApiResponse = z.infer<
  typeof ProjectAssetsBreakdownApiResponse
>
