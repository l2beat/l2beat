import { Logger } from '@l2beat/backend-tools'
import { ChildIndexer, Indexer, IndexerOptions } from '@l2beat/uif'

import { DatabaseMiddleware } from '../../../peripherals/database/DatabaseMiddleware'
import { diffConfigurations } from './diffConfigurations'
import { toRanges } from './toRanges'
import {
  Configuration,
  ConfigurationRange,
  RemovalConfiguration,
  SavedConfiguration,
} from './types'

export abstract class MultiIndexer<T> extends ChildIndexer {
  private ranges: ConfigurationRange<T>[] = []
  private saved = new Map<string, SavedConfiguration<T>>()

  constructor(
    logger: Logger,
    parents: Indexer[],
    private readonly createDatabaseMiddleware: () => Promise<DatabaseMiddleware>,
    private readonly configurations: Configuration<T>[],
    options?: IndexerOptions,
  ) {
    super(logger, parents, options)
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
   * @returns The configurations that were saved previously. Properties are omitted
   * because they are not needed for the initialization.
   */
  abstract multiInitialize(): Promise<
    Omit<SavedConfiguration<T>, 'properties'>[]
  >

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
    configurations: Configuration<T>[],
    dbMiddleware: DatabaseMiddleware,
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
  abstract removeData(configurations: RemovalConfiguration[]): Promise<void>

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

  abstract updateConfigurationsCurrentHeight(
    currentHeight: number,
    dbMiddleware?: DatabaseMiddleware,
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

  async initialize() {
    const previouslySaved = await this.multiInitialize()

    this.ranges = toRanges(
      toConfigurationsWithPreviousState(this.configurations, previouslySaved),
    )

    const { toRemove, toSave, safeHeight } = diffConfigurations(
      this.configurations,
      previouslySaved,
    )
    const oldSafeHeight = (await this.getSafeHeight()) ?? safeHeight

    this.saved = new Map(toSave.map((c) => [c.id, c]))
    // TODO: should we remove data in a transaction?
    if (toRemove.length > 0) {
      await this.removeData(toRemove)
    }
    await this.setSavedConfigurations(toSave)

    return { safeHeight: Math.min(safeHeight, oldSafeHeight) }
  }

  async update(from: number, to: number): Promise<number> {
    const range = findRange(this.ranges, from)
    const configurationsInRange = range.configurations

    if (configurationsInRange.length === 0) {
      return Math.min(range.to, to)
    }

    const adjustedTo = Math.min(range.to, to)

    this.logger.info('Calling multiUpdate', {
      from,
      to: adjustedTo,
      configurations: configurationsInRange.length,
    })

    const dbMiddleware = await this.createDatabaseMiddleware()
    const safeHeight = await this.multiUpdate(
      from,
      adjustedTo,
      configurationsInRange,
      dbMiddleware,
    )
    if (safeHeight < from || safeHeight > adjustedTo) {
      throw new Error(
        'Programmer error, returned height must be between from and to (both inclusive).',
      )
    }

    this.updateSavedConfigurations(configurationsInRange, safeHeight)
    await this.updateConfigurationsCurrentHeight(safeHeight, dbMiddleware)

    await dbMiddleware.execute()

    return safeHeight
  }

  private updateSavedConfigurations(
    updatedConfigurations: Configuration<T>[],
    newHeight: number,
  ) {
    for (const updated of updatedConfigurations) {
      const saved = this.saved.get(updated.id)
      if (!saved) {
        throw new Error('Programmer error, saved configuration not found')
      }

      saved.currentHeight = newHeight
    }
  }

  async invalidate(targetHeight: number): Promise<number> {
    return await Promise.resolve(targetHeight)
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

function toConfigurationsWithPreviousState<T>(
  configurations: Configuration<T>[],
  previouslySaved: Omit<SavedConfiguration<T>, 'properties'>[],
): SavedConfiguration<T>[] {
  const previousStateMapping = new Map(previouslySaved.map((p) => [p.id, p]))

  return configurations.map((c) => {
    const config = previousStateMapping.get(c.id)

    return {
      ...c,
      currentHeight: config?.currentHeight ?? null,
    }
  })
}
