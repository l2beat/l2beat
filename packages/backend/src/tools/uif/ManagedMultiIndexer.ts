import { Logger } from '@l2beat/backend-tools'
import {
  Configuration,
  Indexer,
  IndexerOptions,
  MultiIndexer,
  SavedConfiguration,
} from '@l2beat/uif'

import { IndexerService } from './IndexerService'

export interface ManagedMultiIndexerOptions<T> extends IndexerOptions {
  parents: Indexer[]
  id: string
  indexerService: IndexerService
  configurations: Configuration<T>[]
  encode: (value: T) => string
  decode: (blob: string) => T
  logger: Logger
}

export abstract class MangedMultiIndexer<T> extends MultiIndexer<T> {
  constructor(public readonly options: ManagedMultiIndexerOptions<T>) {
    super(options.logger, options.parents, options.configurations, options)
  }

  async getSafeHeight() {
    return this.options.indexerService.getSafeHeight(this.options.id)
  }

  async setSafeHeight(safeHeight: number) {
    return this.options.indexerService.setSafeHeight(
      this.options.id,
      safeHeight,
    )
  }

  private readonly savedHeights = new Map<string, number | null>()
  override async multiInitialize(): Promise<SavedConfiguration<T>[]> {
    const saved = await this.options.indexerService.getSavedConfigurations(
      this.options.id,
      this.options.decode,
    )
    for (const config of saved) {
      this.savedHeights.set(config.id, config.currentHeight)
    }
    return saved
  }

  private savedOnce = false
  override async saveConfigurations(
    configurations: SavedConfiguration<T>[],
  ): Promise<void> {
    if (!this.savedOnce) {
      await this.addNewConfigurations(configurations)
      await this.removeOldConfigurations(configurations)
      this.savedOnce = true
    } else {
      await this.updateSavedHeights(configurations)
    }
  }

  private async addNewConfigurations(configurations: SavedConfiguration<T>[]) {
    const toAdd = configurations.filter(
      (config) => !this.savedHeights.has(config.id),
    )
    await this.options.indexerService.addSavedConfigurations(
      this.options.id,
      toAdd,
      this.options.encode,
    )
    for (const added of toAdd) {
      this.savedHeights.set(added.id, added.currentHeight)
    }
  }

  private async removeOldConfigurations(
    configurations: SavedConfiguration<T>[],
  ) {
    const toRemove = Array.from(this.savedHeights.keys()).filter(
      (id) => !configurations.some((config) => config.id === id),
    )
    await this.options.indexerService.deleteSavedConfigurations(
      this.options.id,
      toRemove,
    )
    for (const removed of toRemove) {
      this.savedHeights.delete(removed)
    }
  }

  private async updateSavedHeights(configurations: SavedConfiguration<T>[]) {
    const updated = new Set<string>()
    let newHeight: number | null | undefined
    for (const { id, currentHeight } of configurations) {
      if (this.savedHeights.get(id) !== currentHeight) {
        updated.add(id)
        if (newHeight === undefined) {
          newHeight = currentHeight
        } else if (newHeight !== currentHeight) {
          throw new Error(
            'All updated configurations must have the same height',
          )
        }
      }
    }
    if (newHeight !== undefined) {
      await this.options.indexerService.updateSavedConfigurations(
        this.options.id,
        Array.from(updated),
        newHeight,
      )
    }
  }
}
