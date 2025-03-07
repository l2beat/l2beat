import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
  asNumber,
  branded,
} from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { ps } from '~/server/projects'
import { getRangeWithMax } from '~/utils/range/range'
import { getConfigMapping } from '../utils/get-config-mapping'
import type { TvsChartResolution } from '../utils/range'
import { TvsChartRange, rangeToResolution } from '../utils/range'
import { calculateValue } from './utils/calculate-value'
import { getTokenAmounts } from './utils/get-token-amounts'
import { getTokenPrices } from './utils/get-token-prices'

const TokenParams = z.object({
  projectId: z.string(),
  address: branded(z.string(), EthereumAddress).or(z.literal('native')),
  chain: z.string(),
})

export const TokenTvsChartParams = z.object({
  token: TokenParams,
  range: TvsChartRange,
})

export type TokenTvsChartParams = z.infer<typeof TokenTvsChartParams>
type TokenParams = z.infer<typeof TokenParams>

/**
 * A function that computes values for chart of the token's TVS over time.
 * @returns [timestamp, amount, usdValue][] - all numbers
 */
export async function getTokenTvsChart(params: TokenTvsChartParams) {
  if (env.MOCK) {
    return getMockTokenTvsChartData(params)
  }
  return getCachedTokenTvsChartData(params)
}

type TokenTvsChart = Awaited<ReturnType<typeof getCachedTokenTvsChartData>>

export const getCachedTokenTvsChartData = cache(
  async ({ token, range }: TokenTvsChartParams) => {
    const targetTimestamp =
      UnixTime.toStartOf(UnixTime.now(), 'hour') - 2 * UnixTime.HOUR
    const resolution = rangeToResolution(range)

    const project = await ps.getProject({
      id: ProjectId(token.projectId),
      select: ['tvlConfig'],
      optional: ['chainConfig'],
    })

    assert(project, 'Project not found')

    const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
      (p) => p.chainConfig,
    )
    const configMapping = getConfigMapping(project, chains)

    const tokenAmountConfigs = configMapping.getAmountsByProjectAndToken(
      project.id,
      token,
    )
    const firstTokenAmountConfig = tokenAmountConfigs[0]
    assert(firstTokenAmountConfig, 'No token amount config found')

    const adjustedRange = getAdjustedRange(
      range,
      resolution,
      firstTokenAmountConfig.sinceTimestamp,
      targetTimestamp,
    )

    const tokenPriceConfig = configMapping.getPriceConfigFromAmountConfig(
      firstTokenAmountConfig,
    )

    const timestamps = generateTimestamps(adjustedRange, resolution)
    const [tokenAmounts, tokenPrices] = await Promise.all([
      getTokenAmounts({
        configurations: tokenAmountConfigs,
        range: adjustedRange,
        timestamps,
      }),
      getTokenPrices(tokenPriceConfig, adjustedRange, resolution),
    ])

    const decimals = firstTokenAmountConfig.decimals
    const data: [number, number, number][] = []
    for (const timestamp of timestamps) {
      const amount = tokenAmounts.amounts[timestamp]
      const price = tokenPrices.prices[timestamp]
      assert(amount !== undefined && price !== undefined, 'No amount or price')
      const usdValue = calculateValue({
        amount,
        priceUsd: price,
        decimals,
      })
      data.push([timestamp, asNumber(amount, decimals), asNumber(usdValue, 2)])
    }

    return data
  },
  ['token-tvs-chart'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)

function getMockTokenTvsChartData(params: TokenTvsChartParams): TokenTvsChart {
  const resolution = rangeToResolution(params.range)
  const [from, to] = getRangeWithMax(params.range, 'hourly')
  const adjustedRange: [UnixTime, UnixTime] = [
    from ?? to - 730 * UnixTime.DAY,
    to,
  ]
  const timestamps = generateTimestamps(adjustedRange, resolution)

  return timestamps.map((timestamp) => [timestamp, 30000, 50000])
}

function getAdjustedRange(
  range: TvsChartRange,
  resolution: TvsChartResolution,
  tokenSinceTimestamp: UnixTime,
  targetTimestamp: UnixTime,
): [UnixTime, UnixTime] {
  const [from, to] = getRangeWithMax(range, resolution, {
    now: targetTimestamp,
  })
  const sinceTimestamp = UnixTime.toEndOf(tokenSinceTimestamp, 'day')
  const adjustedFrom = from ? Math.max(from, sinceTimestamp) : sinceTimestamp
  return [adjustedFrom, to]
}
