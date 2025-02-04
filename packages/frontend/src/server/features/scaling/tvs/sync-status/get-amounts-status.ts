import type { AmountConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { getCirculatingSupplyStatus } from './get-circulating-supply-status'
import { getConfigurationsStatus } from './get-configurations-status'
import { getPremintedStatus } from './get-preminted-status'

export async function getAmountsStatus(
  entries: (AmountConfigEntry & { configId: string })[],
  targetTimestamp: UnixTime,
) {
  const [configurations, preminted, circulating] = await Promise.all([
    getConfigurationsStatus(entries, targetTimestamp),
    getPremintedStatus(entries, targetTimestamp),
    getCirculatingSupplyStatus(entries, targetTimestamp),
  ])

  return {
    lagging: [
      ...configurations.lagging,
      ...preminted.lagging,
      ...circulating.lagging,
    ],
    excluded: new Set([
      ...configurations.excluded,
      ...preminted.excluded,
      ...circulating.excluded,
    ]),
  }
}
