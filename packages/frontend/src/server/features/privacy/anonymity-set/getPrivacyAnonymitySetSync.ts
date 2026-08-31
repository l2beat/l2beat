import type { Database, IndexerConfigurationRecord } from '@l2beat/database'
import { UnixTime, unique } from '@l2beat/shared-pure'
import {
  getPrivacyAnonymitySetSeries,
  type PrivacyAnonymitySetProject,
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

export function getPrivacyAnonymitySetSyncedUntil(
  project: PrivacyAnonymitySetProject,
  configurations: IndexerConfigurationRecord[],
): UnixTime | undefined {
  const expectedConfigurationIds = unique(
    getPrivacyAnonymitySetSeries(project).map(
      (series) => series.configurationId,
    ),
  )
  if (expectedConfigurationIds.length === 0) return undefined

  const configurationsById = new Map(
    configurations.map((configuration) => [configuration.id, configuration]),
  )
  const currentHeights: number[] = []

  for (const id of expectedConfigurationIds) {
    const configuration = configurationsById.get(id)
    if (
      configuration === undefined ||
      configuration.maxHeight !== null ||
      configuration.currentHeight === null
    ) {
      return undefined
    }
    currentHeights.push(configuration.currentHeight)
  }

  return UnixTime(Math.min(...currentHeights))
}
