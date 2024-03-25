import { SavedConfiguration } from '@l2beat/uif'

import { PriceConfig } from './PriceConfig'

export class PriceIndexerRepository {
  private data: Record<string, SavedConfiguration<PriceConfig>[]> = {}

  async save(
    indexerId: string,
    configurations: SavedConfiguration<PriceConfig>[],
  ): Promise<void> {
    this.data[indexerId] = configurations
    return Promise.resolve()
  }

  async load(indexerId: string): Promise<SavedConfiguration<PriceConfig>[]> {
    return Promise.resolve(this.data[indexerId] ?? [])
  }
}
