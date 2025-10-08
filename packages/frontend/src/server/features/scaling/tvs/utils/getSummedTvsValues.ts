import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import keyBy from 'lodash/keyBy'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { queryExecutor } from '~/server/queryExecutor'
import { getTimestampedValuesRange } from '~/utils/range/range'
import { isTvsSynced } from './isTvsSynced'
import type { TvsChartRange } from './range'
import { rangeToResolution } from './range'

export type SummedTvsValues = {
  timestamp: number
  value: number | null
  canonical: number | null
  external: number | null
  native: number | null
  ether: number | null
  stablecoin: number | null
  btc: number | null
  other: number | null
  associated: number | null
}

export async function getSummedTvsValues(
  projectIds: ProjectId[],
  range: { type: TvsChartRange } | { type: 'custom'; from: number; to: number },
  {
    forSummary,
    excludeAssociatedTokens,
  }: { forSummary: boolean; excludeAssociatedTokens: boolean },
): Promise<SummedTvsValues[]> {
  const resolution = rangeToResolution(range)

  const [from, to] = getTimestampedValuesRange(range, resolution, {
    offset: -UnixTime.HOUR - 15 * UnixTime.MINUTE,
  })

  const valueRecords = await queryExecutor.execute(
    {
      name: 'getSummedByTimestampTvsValuesQuery',
      args: [projectIds, [from, to], forSummary, excludeAssociatedTokens],
    },
    100,
  )

  if (valueRecords.data.length === 0) {
    return []
  }

  const timestamps = valueRecords.data.map((v) => v.timestamp)
  const fromTimestamp = Math.min(...timestamps)
  const maxTimestamp = Math.max(...timestamps)

  const groupedByTimestamp = keyBy(valueRecords.data, (v) => v.timestamp)

  const adjustedTo = isTvsSynced(maxTimestamp) ? maxTimestamp : to

  return generateTimestamps([fromTimestamp, adjustedTo], resolution, {
    addTarget: true,
  }).flatMap((timestamp) => {
    const record = groupedByTimestamp[timestamp]
    if (!record) {
      return {
        timestamp,
        value: null,
        canonical: null,
        external: null,
        native: null,
        ether: null,
        stablecoin: null,
        other: null,
        associated: null,
        btc: null,
      }
    }
    return record
  })
}
