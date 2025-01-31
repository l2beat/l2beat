import type {
  AmountConfigEntry,
  CoingeckoPriceConfigEntry,
} from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { getConfigurations } from './get-configuration'
import { getExclusionBoundary } from './get-exclusion-boundary'

export async function getConfigurationsStatus(
  entries: ((AmountConfigEntry | CoingeckoPriceConfigEntry) & {
    configId: string
  })[],
  targetTimestamp: UnixTime,
) {
  const multiIndexerEntries = entries.filter(
    (c) => c.type !== 'circulatingSupply' && c.type !== 'preminted',
  )

  const configurations = await getConfigurations(multiIndexerEntries)

  const processed = new Set<string>()
  const lagging = []
  const excluded = new Set<string>()

  for (const c of configurations) {
    processed.add(c.id)

    const status = c.currentHeight ? new UnixTime(c.currentHeight) : undefined

    // newly added configuration
    if (status === undefined) {
      excluded.add(c.id)
      continue
    }
    // fully synced configuration
    if (status.gte(targetTimestamp)) {
      continue
    }

    // phased out configuration - but we still want to display its data
    if (c.maxHeight && c.maxHeight === c.currentHeight) {
      continue
    }

    // decide whether it is excluded or lagging
    if (status.lt(getExclusionBoundary(targetTimestamp))) {
      excluded.add(c.id)
    } else {
      lagging.push({
        id: c.id,
        latestTimestamp: status,
      })
    }
  }

  const unprocessed = multiIndexerEntries.filter(
    (c) => !processed.has(c.configId),
  )
  unprocessed.forEach((u) => excluded.add(u.configId))

  return {
    excluded,
    lagging,
  }
}
