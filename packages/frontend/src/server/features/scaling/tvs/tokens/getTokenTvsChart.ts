import type { TokenValueRecord } from '@l2beat/database'
import { assert, TokenId, UnixTime } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import {
  getBucketValuesRange,
  getTimestampedValuesRange,
} from '~/utils/range/range'
import { isTvsSynced } from '../utils/isTvsSynced'
import { rangeToResolution, TvsChartRange } from '../utils/range'

const TokenParams = z.object({
  projectId: z.string(),
  tokenId: z.string().transform((v) => TokenId(v)),
})

export const TokenTvsChartParams = z.object({
  token: TokenParams,
  range: TvsChartRange,
})

export type TokenTvsChartParams = z.infer<typeof TokenTvsChartParams>

type TokenTvsChartPoint = [timestamp: number, usdValue: number | null]

type TokenTvsChartData = {
  chart: TokenTvsChartPoint[]
  syncedUntil: number
}

/**
 * A function that computes values for chart of the token's TVS over time.
 * @returns [timestamp, amount, usdValue][] - all numbers
 */
export async function getTokenTvsChart({
  range,
  token,
}: TokenTvsChartParams): Promise<TokenTvsChartData> {
  if (env.MOCK) {
    return getMockTokenTvsChartData({ range, token })
  }

  const db = getDb()
  const resolution = rangeToResolution({ type: range })

  const [from, to] = getTimestampedValuesRange({ type: range }, resolution, {
    offset: -UnixTime.HOUR - 15 * UnixTime.MINUTE,
  })

  const tokenValues = await db.tvsTokenValue.getByTokenIdInTimeRange(
    token.tokenId,
    from,
    to,
  )

  if (tokenValues.length === 0) {
    return {
      chart: [],
      syncedUntil: UnixTime.now(),
    }
  }

  const tokenValuesByTimestamp = tokenValues.reduce<
    Record<UnixTime, TokenValueRecord>
  >((acc, value) => {
    acc[value.timestamp] = value
    return acc
  }, {})

  const minTimestamp = tokenValues.at(0)?.timestamp
  assert(minTimestamp, 'minTimestamp is undefined')

  const maxTimestamp = tokenValues.at(-1)?.timestamp
  assert(maxTimestamp, 'maxTimestamp is undefined')

  const adjustedTo = isTvsSynced(maxTimestamp) ? maxTimestamp : to

  const timestamps = generateTimestamps(
    [minTimestamp, adjustedTo],
    resolution,
    {
      addTarget: true,
    },
  )

  const data: TokenTvsChartPoint[] = []
  for (const timestamp of timestamps) {
    const value = tokenValuesByTimestamp[timestamp]
    data.push([timestamp, value?.valueForProject ?? null])
  }

  return {
    chart: data,
    syncedUntil: maxTimestamp,
  }
}

function getMockTokenTvsChartData(
  params: TokenTvsChartParams,
): TokenTvsChartData {
  const resolution = rangeToResolution({ type: params.range })
  const [from, to] = getBucketValuesRange({ type: params.range }, 'hourly')
  const adjustedRange: [UnixTime, UnixTime] = [
    from ?? to - 730 * UnixTime.DAY,
    to,
  ]
  const timestamps = generateTimestamps(adjustedRange, resolution)

  return {
    chart: timestamps.map((timestamp) => [timestamp, 50000]),
    syncedUntil: to,
  }
}
