import { Logger } from '@l2beat/backend-tools'
import { ChildIndexer, Indexer, IndexerOptions } from '@l2beat/uif'

import { diffConfigurations } from './diffConfigurations'
import { toRanges } from './toRanges'
import {
  Configuration,
  ConfigurationRange,
  RemovalConfiguration,
  SavedConfiguration,
  UpdateConfiguration,
} from './types'

export abstract class MultiIndexer<T> extends ChildIndexer {
  private ranges: ConfigurationRange<T>[] = []
  private configurations: Configuration<T>[] = []
  private saved: SavedConfiguration<T>[] = []

  constructor(
    logger: Logger,
    parents: Indexer[],
    configurations?: Configuration<T>[],
    options?: IndexerOptions,
  ) {
    super(logger, parents, options)
    if (configurations) {
      this.configurations = configurations
    }
  }

  /**
   * This will run as the first step of initialize() function.
   * Allow overriding to provide configurations from a different source.
   * Example: your configurations have autoincrement id, so you need to
   * first add them to the database to get the MultiIndexer logic to work (it assumes every
   * configuration has a unique id)
   * @returns The configurations that the indexer should use to sync data.
   */
  getInitialConfigurations(): Promise<Configuration<T>[]> | Configuration<T>[] {
    return this.configurations
  }

  /**
   * Initializes the indexer. It returns the configurations that were saved
   * previously. In case no configurations were saved, it should return an empty
   * array.
   *
   * This method is expected to read the configurations that was saved
   * previously with `setStoredConfigurations`. It shouldn't call
   * `setStoredConfigurations` itself.
   *
   * @returns The configurations that were saved previously.
   */
  abstract multiInitialize(): Promise<SavedConfiguration<T>[]>

  /**
   * Implements the main data fetching process. It is up to the indexer to
   * decide how much data to fetch. For example given `.update(100, 200, [...])`, the
   * indexer can only fetch data up to 110 and return 110. The next time this
   * method will be called with `.update(110, 200, [...])`.
   *
   * @param from The height for which the indexer should start syncing data.
   * This value is inclusive. If the indexer hasn't synced anything previously
   * this will equal the minimum height of all configurations.
   *
   * @param to The height at which the indexer should end syncing data. This
   * value is also inclusive so the indexer should eventually sync data for this
   * height.
   *
   * @param configurations The configurations that the indexer should use to
   * sync data. The configurations are guaranteed to be in the range of
   * `from` and `to`. Some of those configurations might have been synced
   * previously for this range. Those configurations will include the `hasData`
   * flag set to `true`.
   *
   * @returns The height that the indexer has synced up to. Returning
   * `from` means that the indexer has synced a single data point. Returning
   * a value greater than `from` means that the indexer has synced up
   * to that height. Returning a value less than `from` or greater than
   * `to` is not permitted.
   */
  abstract multiUpdate(
    from: number,
    to: number,
    configurations: UpdateConfiguration<T>[],
  ): Promise<number>

  /**
   * Removes data that was previously synced but because configurations changed
   * is no longer valid. The data should be removed for the ranges specified
   * in each configuration. It is possible for multiple ranges to share a
   * configuration id!
   *
   * This method can only be called during the initialization of the indexer,
   * after `multiInitialize` returns.
   */
  abstract removeData(configurations: RemovalConfiguration<T>[]): Promise<void>

  /**
   * Saves configurations that the indexer should use to sync data. The
   * configurations saved here should be read in the `multiInitialize` method.
   *
   * @param configurations The configurations that the indexer should save. The
   * indexer should save the returned configurations and ensure that no other
   * configurations are persisted.
   */
  abstract setSavedConfigurations(
    configurations: SavedConfiguration<T>[],
  ): Promise<void>

  abstract updateCurrentHeight(
    configurationIds: string[],
    currentHeight: number,
  ): Promise<void>

  /**
   * It should return a height that the indexer has synced up to. If the indexer
   * has not synced any data, it should return `undefined`.
   *
   * This method is expected to read the height that was saved previously with
   * `setSafeHeight`. It shouldn't call `setSafeHeight` itself.
   *
   * @returns The height that the indexer has synced up to.
   */
  abstract getSafeHeight(): Promise<number | undefined>

  async initialize(): Promise<number> {
    const previouslySaved = await this.multiInitialize()

    this.configurations = await this.getInitialConfigurations()
    this.ranges = toRanges(this.configurations)

    const { toRemove, toSave, safeHeight } = diffConfigurations(
      this.configurations,
      previouslySaved,
    )
    const oldSafeHeight = (await this.getSafeHeight()) ?? safeHeight

    this.saved = toSave
    if (toRemove.length > 0) {
      await this.removeData(toRemove)
    }
    await this.setSavedConfigurations(toSave)

    return Math.min(safeHeight, oldSafeHeight)
  }

  async update(from: number, to: number): Promise<number> {
    const range = findRange(this.ranges, from)
    if (range.configurations.length === 0) {
      return Math.min(range.to, to)
    }

    const { configurations, minCurrentHeight } = getConfigurationsInRange(
      range,
      this.saved,
      from,
    )
    const adjustedTo = Math.min(range.to, to, minCurrentHeight)

    this.logger.info('Calling multiUpdate', {
      from,
      to: adjustedTo,
      configurations: configurations.length,
    })
    const newHeight = await this.multiUpdate(from, adjustedTo, configurations)
    if (newHeight < from || newHeight > adjustedTo) {
      throw new Error(
        'Programmer error, returned height must be between from and to (both inclusive).',
      )
    }

    if (newHeight > from) {
      const updatedIds = this.updateSavedConfigurations(
        configurations,
        newHeight,
      )
      if (updatedIds.length > 0) {
        await this.updateCurrentHeight(updatedIds, newHeight)
      }
    }

    return newHeight
  }

  private updateSavedConfigurations(
    updatedConfigurations: UpdateConfiguration<T>[],
    newHeight: number,
  ): string[] {
    const touched: string[] = []
    for (const updated of updatedConfigurations) {
      const saved = this.saved.find((c) => c.id === updated.id)
      if (!saved) {
        throw new Error('Programmer error, saved configuration not found')
      }
      if (saved.currentHeight === null || saved.currentHeight < newHeight) {
        saved.currentHeight = newHeight
        touched.push(saved.id)
      }
    }
    return touched
  }

  async invalidate(targetHeight: number): Promise<number> {
    return Promise.resolve(targetHeight)
  }
}

function findRange<T>(
  ranges: ConfigurationRange<T>[],
  from: number,
): ConfigurationRange<T> {
  const range = ranges.find((range) => range.from <= from && range.to >= from)
  if (!range) {
    throw new Error('Programmer error, there should always be a range')
  }
  return range
}

function getConfigurationsInRange<T>(
  range: ConfigurationRange<T>,
  savedConfigurations: SavedConfiguration<T>[],
  currentHeight: number,
): { configurations: UpdateConfiguration<T>[]; minCurrentHeight: number } {
  let minCurrentHeight = Infinity
  const configurations = range.configurations.map(
    (configuration): UpdateConfiguration<T> => {
      const saved = savedConfigurations.find((c) => c.id === configuration.id)
      if (
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        saved &&
        saved.currentHeight !== null &&
        saved.currentHeight > currentHeight
      ) {
        minCurrentHeight = Math.min(minCurrentHeight, saved.currentHeight)
        return { ...configuration, hasData: true }
      } else {
        return { ...configuration, hasData: false }
      }
    },
  )
  return { configurations, minCurrentHeight }
}
