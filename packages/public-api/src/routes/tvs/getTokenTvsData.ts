import type { Database } from '@l2beat/database'
import { type TokenId, UnixTime } from '@l2beat/shared-pure'
import keyBy from 'lodash/keyBy'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { getTimestampedValuesRange } from '../../utils/getTimestampedValuesRange'
import { rangeToResolution } from '../../utils/range'
import type { TokenTvsResultItem, TvsRange } from './types'

export async function getTokenTvsData(
  db: Database,
  range: TvsRange,
  tokenId: TokenId,
): Promise<TokenTvsResultItem[]> {
  const resolution = rangeToResolution(range)
  const [from, to] = getTimestampedValuesRange(range, resolution, {
    offset: -UnixTime.HOUR - 15 * UnixTime.MINUTE,
  })

  const records = await db.tvsTokenValue.getByTokenIdInTimeRange(
    tokenId,
    from,
    to,
  )

  if (records.length === 0) {
    return []
  }

  const timestamps = records.map(({ timestamp }) => timestamp)
  const fromTimestamp = Math.min(...timestamps)
  const maxTimestamp = Math.max(...timestamps)
  const groupedByTimestamp = keyBy(records, ({ timestamp }) => timestamp)

  return generateTimestamps([fromTimestamp, maxTimestamp], resolution).flatMap(
    (timestamp: UnixTime) => {
      const record = groupedByTimestamp[timestamp]
      return {
        timestamp,
        valueUsd: record?.valueForProject ?? null,
        amount: record?.amount ?? null,
      }
    },
  )
}
