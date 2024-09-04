import { createIndexerId } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'
import { assertUniqueConfigId, assertUniqueIndexerId } from '../ids'
import { ConfigurationsDiff, mergeConfigurations } from './mergeConfigurations'
import { toRanges } from './toRanges'
import {
  Configuration,
  ConfigurationRange,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
} from './types'

export abstract class ManagedMultiIndexer<T> extends ChildIndexer {
  private ranges: ConfigurationRange<T>[] = []
  private readonly indexerId: string

  constructor(readonly options: ManagedMultiIndexerOptions<T>) {
    const logger = options.logger.tag(options.tag)
    super(logger, options.parents, options)

    assert(
      options.configurations.length > 0,
      `Configurations should not be empty ${options.tag}`,
    )

    this.indexerId = createIndexerId(options.name, options.tag)
    assertUniqueIndexerId(this.indexerId)
    for (const configuration of options.configurations) {
      assertUniqueConfigId(configuration.id)
    }
  }

  // #region initialize

  async initialize() {
    const saved = await this.options.indexerService.getSavedConfigurations(
      this.indexerId,
    )
    const state = mergeConfigurations(
      saved,
      this.options.configurations,
      this.options.serializeConfiguration,
    )
    await this.updateSavedConfigurations(state.diff)
    this.ranges = toRanges(state.configurations)
    return { safeHeight: state.safeHeight }
  }

  async updateSavedConfigurations(diff: ConfigurationsDiff<T>) {
    if (
      diff.toAdd.length === 0 &&
      diff.toUpdate.length === 0 &&
      diff.toDelete.length === 0 &&
      diff.toRemoveData.length === 0
    ) {
      return
    }

    return await this.options.db.transaction(async () => {
      if (diff.toAdd.length > 0) {
        await this.options.indexerService.insertConfigurations(
          this.indexerId,
          diff.toAdd,
          this.options.serializeConfiguration,
        )
        this.logger.info('Inserted configurations', {
          configurations: diff.toAdd.length,
        })
      }

      if (diff.toUpdate.length > 0) {
        await this.options.indexerService.upsertConfigurations(
          this.indexerId,
          diff.toUpdate,
          this.options.serializeConfiguration,
        )
        this.logger.info('Updated configurations', {
          configurations: diff.toUpdate.length,
        })
      }

      if (diff.toDelete.length > 0) {
        await this.options.indexerService.deleteConfigurations(
          this.indexerId,
          diff.toDelete,
        )
        this.logger.info('Deleted configurations', {
          configurations: diff.toDelete.length,
        })
      }

      if (diff.toRemoveData.length > 0) {
        await this.removeData(diff.toRemoveData)
      }
    })
  }

  // #endregion

  // #region update

  async update(from: number, to: number): Promise<number> {
    const range = this.findRange(from)
    const configurations = range.configurations

    if (configurations.length === 0) {
      this.logger.info('Skipping update', {
        from,
        to: Math.min(range.to, to),
      })
      return Math.min(range.to, to)
    }

    const adjustedTo = Math.min(range.to, to)

    this.logger.info('Calling multiUpdate', {
      from,
      to: adjustedTo,
      configurations: configurations.length,
    })

    const saveData = await this.multiUpdate(from, adjustedTo, configurations)

    return await this.options.db.transaction(async () => {
      const safeHeight = await saveData()

      assert(
        safeHeight >= from && safeHeight <= adjustedTo,
        'Returned height must be between from and to (both inclusive).',
      )

      await this.updateConfigurationsCurrentHeight(safeHeight)

      return safeHeight
    })
  }

  findRange(from: number): ConfigurationRange<T> {
    const range = this.ranges.find(
      (range) => range.from <= from && range.to >= from,
    )
    assert(range, 'There should always be a range')

    return range
  }

  async updateConfigurationsCurrentHeight(
    currentHeight: number,
  ): Promise<void> {
    await this.options.indexerService.updateConfigurationsCurrentHeight(
      this.indexerId,
      currentHeight,
    )
  }

  // #endregion

  // #region invalidate

  async invalidate(targetHeight: number): Promise<number> {
    return await Promise.resolve(targetHeight)
  }

  // #endregion

  // #region Indexer state

  async setInitialState(
    safeHeight: number,
    configHash?: string | undefined,
  ): Promise<void> {
    return await this.options.indexerService.setInitialState(
      this.indexerId,
      safeHeight,
      configHash,
    )
  }

  async setSafeHeight(safeHeight: number) {
    return await this.options.indexerService.setSafeHeight(
      this.indexerId,
      safeHeight,
    )
  }

  // #endregion

  // #region abstract methods

  abstract multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<T>[],
  ): Promise<() => Promise<number>>

  abstract removeData(configurations: RemovalConfiguration[]): Promise<void>

  // #endregion
}
