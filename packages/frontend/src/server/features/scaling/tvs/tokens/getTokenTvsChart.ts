import type { TokenValueRecord } from '@l2beat/database'
import { TokenId, UnixTime } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { getRangeWithMax } from '~/utils/range/range'
import { getTvsTargetTimestamp } from '../utils/getTvsTargetTimestamp'
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

type TokenTvsChartPoint = [
  timestamp: number,
  amount: number | null,
  usdValue: number | null,
]

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
  const targetTimestamp = getTvsTargetTimestamp()
  const resolution = rangeToResolution({ type: range })

  const [from, to] = getRangeWithMax({ type: range }, resolution, {
    now: targetTimestamp,
  })

  const tokenValues = await db.tvsTokenValue.getByTokenIdInTimeRange(
    token.tokenId,
    from,
    to,
  )

  const tokenValuesByTimestamp = tokenValues.reduce<
    Record<UnixTime, TokenValueRecord>
  >((acc, value) => {
    acc[value.timestamp] = value
    return acc
  }, {})

  const minTimestamp = tokenValues[0]?.timestamp
  if (!minTimestamp) {
    return {
      chart: [],
      syncedUntil: 0,
    }
  }

  const timestamps = generateTimestamps([minTimestamp, to], resolution)

  const data: TokenTvsChartPoint[] = []
  let syncedUntil = 0
  for (const timestamp of timestamps) {
    const value = tokenValuesByTimestamp[timestamp]
    data.push([timestamp, value?.amount ?? null, value?.value ?? null])
    if (value !== undefined) {
      syncedUntil = timestamp
    }
  }

  return {
    chart: data,
    syncedUntil,
  }
}

function getMockTokenTvsChartData(
  params: TokenTvsChartParams,
): TokenTvsChartData {
  const resolution = rangeToResolution({ type: params.range })
  const [from, to] = getRangeWithMax({ type: params.range }, 'hourly')
  const adjustedRange: [UnixTime, UnixTime] = [
    from ?? to - 730 * UnixTime.DAY,
    to,
  ]
  const timestamps = generateTimestamps(adjustedRange, resolution)

  return {
    chart: timestamps.map((timestamp) => [timestamp, 30000, 50000]),
    syncedUntil: to,
  }
}
