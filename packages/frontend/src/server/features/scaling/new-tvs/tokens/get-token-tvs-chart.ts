import type { TokenValueRecord } from '@l2beat/database'
import {
  assert,
  ProjectId,
  TokenId,
  UnixTime,
  branded,
} from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { getRangeWithMax } from '~/utils/range/range'
import { getTvsTargetTimestamp } from '../utils/get-tvs-target-timestamp'
import { TvsChartRange, rangeToResolution } from '../utils/range'

const TokenParams = z.object({
  projectId: z.string(),
  tokenId: branded(z.string(), TokenId),
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
    const db = getDb()
    const targetTimestamp = getTvsTargetTimestamp()
    const resolution = rangeToResolution(range)

    const [from, to] = getRangeWithMax(range, resolution, {
      now: targetTimestamp,
    })

    const tokenValues = await db.tvsTokenValue.getByProjectAndToken(
      ProjectId(token.projectId),
      token.tokenId,
      from ?? 0,
      to,
    )

    const tokenValuesByTimestamp = tokenValues.reduce<
      Record<UnixTime, TokenValueRecord>
    >((acc, value) => {
      acc[value.timestamp] = value
      return acc
    }, {})

    const minTimestamp = tokenValues[0]?.timestamp ?? 0
    const timestamps = generateTimestamps([minTimestamp, to], resolution)

    const data: [number, number, number][] = []
    for (const timestamp of timestamps) {
      const value = tokenValuesByTimestamp[timestamp]
      assert(value !== undefined, 'No value')
      data.push([timestamp, value.amount, value.value])
    }

    return data
  },
  ['token-new-tvs-chart'],
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
