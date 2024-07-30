import { assert } from '@l2beat/backend-tools'
import { ChildIndexer } from '@l2beat/uif'
import { assertUniqueConfigId, assertUniqueIndexerId } from '../ids'
import { getNewConfigurationsState } from './getNewConfigurationsState'
import { toRanges } from './toRanges'
import {
  Configuration,
  ConfigurationRange,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
  SavedConfiguration,
} from './types'

export abstract class ManagedMultiIndexer<T> extends ChildIndexer {
  private ranges: ConfigurationRange<T>[] = []
  private readonly indexerId: string

  constructor(private readonly options: ManagedMultiIndexerOptions<T>) {
    assert(
      options.configurations.length > 0,
      'Configurations should not be empty',
    )

    super(options.logger, options.parents, options)

    this.indexerId = options.name
    if (options.tag) {
      this.indexerId += `::${options.tag}`
    }
    assertUniqueIndexerId(this.indexerId)

    for (const configuration of options.configurations) {
      assertUniqueConfigId(configuration.id)
    }
  }

  // #region initialize

  async initialize() {
    const configurations = await this.multiInitialize(
      this.options.configurations,
    )

    this.ranges = toRanges(configurations)

    const safeHeight = configurations.reduce(
      (agg, curr) =>
        (agg = Math.min(agg, curr.currentHeight ?? curr.minHeight - 1)),
      Infinity,
    )

    return { safeHeight }
  }

  async multiInitialize(
    configurations: Configuration<T>[],
  ): Promise<SavedConfiguration<T>[]> {
    const previous = await this.options.indexerService.getSavedConfigurations(
      this.indexerId,
    )

    const state = getNewConfigurationsState(
      configurations,
      this.options.serializeConfiguration,
      previous,
    )

    await this.updateConfigurationsState(state.diff)

    return state.configurations
  }

  async updateConfigurationsState(state: {
    toAdd: Configuration<T>[]
    toUpdate: SavedConfiguration<T>[]
    toDelete: string[]
    toTrim: RemovalConfiguration[]
  }): Promise<void> {
    if (state.toAdd.length > 0) {
      await this.options.indexerService.insertConfigurations(
        this.indexerId,
        state.toAdd,
        this.options.serializeConfiguration,
      )
    }

    if (state.toUpdate.length > 0) {
      await this.options.indexerService.upsertConfigurations(
        this.indexerId,
        state.toUpdate,
        this.options.serializeConfiguration,
      )
    }

    if (state.toDelete.length > 0) {
      await this.options.indexerService.deleteConfigurations(
        this.indexerId,
        state.toDelete,
      )
    }

    if (state.toTrim.length > 0) {
      await this.removeData(state.toTrim)
    }
  }

  // #endregion

  // #region update

  async update(from: number, to: number): Promise<number> {
    const range = this.findRange(from)
    const configurations = range.configurations

    if (configurations.length === 0) {
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

      if (safeHeight < from || safeHeight > adjustedTo) {
        throw new Error(
          'Programmer error, returned height must be between from and to (both inclusive).',
        )
      }

      await this.updateConfigurationsCurrentHeight(safeHeight)

      return safeHeight
    })
  }

  private findRange(from: number): ConfigurationRange<T> {
    const range = this.ranges.find(
      (range) => range.from <= from && range.to >= from,
    )
    if (!range) {
      throw new Error('Programmer error, there should always be a range')
    }
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
