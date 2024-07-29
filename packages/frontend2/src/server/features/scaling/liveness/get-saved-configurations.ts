import { type SavedConfiguration } from '@l2beat/shared-pure'

export async function getSavedConfigurations<T>({
  indexerId,
  getConfigurationByIndexerId,
}: {
  indexerId: string
  getConfigurationByIndexerId: (indexerId: string) => Promise<
    (Omit<SavedConfiguration<T>, 'properties'> & {
      indexerId?: string
      properties?: string
    })[]
  >
}): Promise<Omit<SavedConfiguration<T>, 'properties'>[]> {
  const configurations: (Omit<SavedConfiguration<T>, 'properties'> & {
    indexerId?: string
    properties?: string
  })[] = await getConfigurationByIndexerId(indexerId)

  for (const config of configurations) {
    // biome-ignore lint/performance/noDelete: not a performance problem
    delete config.indexerId
    // biome-ignore lint/performance/noDelete: not a performance problem
    delete config.properties
  }

  return configurations
}

export async function getSavedConfigurationsLogic