import { SavedConfiguration } from '@l2beat/uif'

export interface IndexerConfigurationRepository {
  getSavedConfigurations<T>(indexerId: string): Promise<SavedConfiguration<T>[]>

  addSavedConfigurations<T>(
    indexerId: string,
    configurations: SavedConfiguration<T>[],
  ): Promise<void>

  removeSavedConfigurations(
    indexerId: string,
    configurationIds: string[],
  ): Promise<void>

  updateSavedConfigurations(
    indexerId: string,
    configurationIds: string[],
    currentHeight: number | null,
  ): Promise<void>
}
