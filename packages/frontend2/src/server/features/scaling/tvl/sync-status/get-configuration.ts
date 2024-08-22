import { db } from '~/server/database'
import { type MultiIndexerEntry, toIndexerId } from './to-indexer-entry'

const MAX_CONFIGURATIONS_LENGTH_FOR_QUERY = 100

export async function getConfigurations(
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  entries: (MultiIndexerEntry & { configId: string })[],
) {
  if (entries.length <= MAX_CONFIGURATIONS_LENGTH_FOR_QUERY) {
    return db.indexerConfiguration.getByConfigurationIds(
      entries.map((c) => c.configId),
    )
  }

  const indexerIds = [...new Set(entries.map(toIndexerId)).values()]

  const configurations =
    await db.indexerConfiguration.getByIndexerIds(indexerIds)

  const requestedIds = new Set(entries.map((c) => c.configId))

  return configurations.filter((c) => requestedIds.has(c.id))
}
