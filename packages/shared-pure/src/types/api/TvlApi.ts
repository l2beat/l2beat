import z from 'zod'

import { AssetId } from '../AssetId'
import { AssetType } from '../AssetType'
import { branded } from '../branded'
import { ChainId } from '../ChainId'
import { EthereumAddress } from '../EthereumAddress'
import { UnixTime } from '../UnixTime'

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
    z.literal('valueUsd'),
    z.literal('cbvUsd'),
    z.literal('ebvUsd'),
    z.literal('nmvUsd'),
    z.literal('valueEth'),
    z.literal('cbvEth'),
    z.literal('ebvEth'),
    z.literal('nmvEth'),
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
  assetType: branded(z.string(), AssetType),
  usdValue: z.number(),
})

export type TvlApiToken = z.infer<typeof TvlApiToken>

export const TvlApiProject = z.object({
  tokens: z.object({
    CBV: z.array(TvlApiToken),
    EBV: z.array(TvlApiToken),
    NMV: z.array(TvlApiToken),
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

type BaseAssetBreakdownData = z.infer<typeof BaseAssetBreakdownData>

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
