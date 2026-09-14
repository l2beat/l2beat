import type { Database, IndexerConfigurationRecord } from '@l2beat/database'
import { type UnixTime, unique } from '@l2beat/shared-pure'
import {
  getPrivacyAnonymitySetSeries,
  type PrivacyAnonymitySetProject,
  type PrivacyAnonymitySetSeries,
} from './getPrivacyAnonymitySetSeries'

export async function getPrivacyAnonymitySetConfigurations(
  db: Database,
  projects: PrivacyAnonymitySetProject[],
): Promise<IndexerConfigurationRecord[]> {
  const configurationIds = unique(
    projects
      .flatMap(getPrivacyAnonymitySetSeries)
      .map((series) => series.configurationId),
  )
  return await db.indexerConfiguration.getByConfigurationIds(configurationIds)
}

export function getPrivacyAnonymitySetSyncStatus(
  series: PrivacyAnonymitySetSeries[],
  configurations: IndexerConfigurationRecord[],
  target: UnixTime,
) {
  const configurationsById = new Map(
    configurations.map((configuration) => [configuration.id, configuration]),
  )
  const syncedSeries: PrivacyAnonymitySetSeries[] = []
  const syncingSeries: PrivacyAnonymitySetSeries[] = []

  for (const item of series) {
    const configuration = configurationsById.get(item.configurationId)
    const destination =
      configuration !== undefined &&
      configuration.maxHeight === null &&
      configuration.currentHeight !== null &&
      configuration.currentHeight >= target
        ? syncedSeries
        : syncingSeries
    destination.push(item)
  }

  return {
    syncedSeries,
    syncingSeries,
    syncingTokens: unique(syncingSeries.map((item) => item.token)),
  }
}
