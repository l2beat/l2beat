import { bridges, layer2s, layer3s, toBackendProject } from '@l2beat/config'
import {
  assert,
  EthereumAddress,
  UnixTime,
  asNumber,
  branded,
} from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { env } from '~/env'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { getRangeWithMax } from '~/utils/range/range'
import { getConfigMapping } from '../utils/get-config-mapping'
import {
  TvlChartRange,
  type TvlChartResolution,
  rangeToResolution,
} from '../utils/range'
import { calculateValue } from './utils/calculate-value'
import { getTokenAmounts } from './utils/get-token-amounts'
import { getTokenPrices } from './utils/get-token-prices'

const TokenParams = z.object({
  projectId: z.string(),
  address: branded(z.string(), EthereumAddress).or(z.literal('native')),
  chain: z.string(),
})

export const TokenTvlChartParams = z.object({
  token: TokenParams,
  range: TvlChartRange,
})

export type TokenTvlChartParams = z.infer<typeof TokenTvlChartParams>
type TokenParams = z.infer<typeof TokenParams>

/**
 * A function that computes values for chart of the token's TVL over time.
 * @returns [timestamp, amount, usdValue][] - all numbers
 */
export async function getTokenTvlChart(params: TokenTvlChartParams) {
  if (env.MOCK) {
    return getMockTokenTvlChartData(params)
  }
  return getCachedTokenTvlChartData(params)
}

type TokenTvlChart = Awaited<ReturnType<typeof getCachedTokenTvlChartData>>

export const getCachedTokenTvlChartData = cache(
  async ({ token, range }: TokenTvlChartParams) => {
    const targetTimestamp = UnixTime.now().toStartOf('hour').add(-2, 'hours')
    const resolution = rangeToResolution(range)

    const project = [...layer2s, ...layer3s, ...bridges].find(
      (p) => p.id === token.projectId,
    )
    assert(project, 'Project not found')
    const backendProject = toBackendProject(project)
    const configMapping = getConfigMapping(backendProject)

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
      const amount = tokenAmounts.amounts[timestamp.toNumber()]
      const price = tokenPrices.prices[timestamp.toNumber()]
      assert(amount !== undefined && price !== undefined, 'No amount or price')
      const usdValue = calculateValue({
        amount,
        priceUsd: price,
        decimals,
      })
      data.push([
        timestamp.toNumber(),
        asNumber(amount, decimals),
        asNumber(usdValue, 2),
      ])
    }

    return data
  },
  ['token-tvl-chart'],
  {
    tags: ['tvl'],
    revalidate: UnixTime.HOUR,
  },
)

function getMockTokenTvlChartData(params: TokenTvlChartParams): TokenTvlChart {
  const resolution = rangeToResolution(params.range)
  const [from, to] = getRangeWithMax(params.range, 'hourly')
  const adjustedRange: [UnixTime, UnixTime] = [from ?? to.add(-730, 'days'), to]
  const timestamps = generateTimestamps(adjustedRange, resolution)

  return timestamps.map((timestamp) => [timestamp.toNumber(), 30000, 50000])
}

function getAdjustedRange(
  range: TvlChartRange,
  resolution: TvlChartResolution,
  tokenSinceTimestamp: UnixTime,
  targetTimestamp: UnixTime,
): [UnixTime, UnixTime] {
  const [from, to] = getRangeWithMax(range, resolution, {
    now: targetTimestamp,
  })
  const sinceTimestamp = tokenSinceTimestamp.toEndOf('day')
  const adjustedFrom = from
    ? UnixTime.max(from, sinceTimestamp)
    : sinceTimestamp
  return [adjustedFrom, to]
}
