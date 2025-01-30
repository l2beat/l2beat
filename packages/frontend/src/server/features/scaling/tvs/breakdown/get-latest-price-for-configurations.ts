import type { PriceConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { assert } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { getConfigurationsStatus } from '../sync-status/get-configurations-status'

export async function getLatestPriceForConfigurations(
  configurations: (PriceConfigEntry & { configId: string })[],
  targetTimestamp: UnixTime,
) {
  const db = getDb()
  const [prices, status] = await Promise.all([
    db.price.getByTimestamp(targetTimestamp),
    getConfigurationsStatus(configurations, targetTimestamp),
  ])

  const result = {
    prices,
    lagging: new Map(),
    excluded: new Set(status.excluded),
  }

  if (prices.length + status.excluded.size === configurations.length) {
    return result
  }

  await Promise.all(
    status.lagging.map(async (laggingConfig) => {
      const latestRecord = await db.price.findByConfigAndTimestamp(
        laggingConfig.id,
        laggingConfig.latestTimestamp,
      )

      assert(latestRecord, `Undefined record for ${laggingConfig.id}`)

      result.lagging.set(laggingConfig.id, {
        latestTimestamp: laggingConfig.latestTimestamp,
        latestValue: latestRecord,
      })

      result.prices.push({ ...latestRecord, timestamp: targetTimestamp })
    }),
  )

  return result
}
