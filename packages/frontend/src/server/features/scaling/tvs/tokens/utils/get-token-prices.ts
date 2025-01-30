import type { PriceConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { assert } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { getConfigurationsStatus } from '../../sync-status/get-configurations-status'
import type { TvsChartResolution } from '../../utils/range'

export async function getTokenPrices(
  configuration: PriceConfigEntry & { configId: string },
  range: [UnixTime, UnixTime],
  resolution: TvsChartResolution,
) {
  const db = getDb()
  const [from, to] = range
  const priceRecords = await db.price.getByConfigIdsInRange(
    [configuration.configId],
    from,
    to,
  )
  const status = await getConfigurationsStatus([configuration], to)

  assert(
    !status.excluded.has(configuration.configId),
    `This code should not run when price still syncing id ${configuration.configId}`,
  )

  const pricesByTimestamp: Record<string, number> = {}
  for (const price of priceRecords) {
    pricesByTimestamp[price.timestamp.toString()] = price.priceUsd
  }
  if (status.lagging.length === 0) {
    return {
      prices: pricesByTimestamp,
    }
  }

  const latest = priceRecords[priceRecords.length - 1]
  assert(latest, 'Latest price record not found')
  const missingTimestamps = generateTimestamps(
    [latest.timestamp, to],
    resolution,
  )

  for (const timestamp of missingTimestamps) {
    pricesByTimestamp[timestamp.toString()] = latest.priceUsd
  }

  return {
    prices: pricesByTimestamp,
    laggingFrom: latest.timestamp,
  }
}
