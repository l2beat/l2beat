import { assert, Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { ChildIndexer, Indexer, IndexerOptions } from '@l2beat/uif'
import { toRanges } from './toRanges'
import { Configuration, ConfigurationRange, SavedConfiguration } from './types'

export abstract class MultiIndexer<T> extends ChildIndexer {
  private ranges: ConfigurationRange<T>[] = []

  constructor(
    logger: Logger,
    parents: Indexer[],
    private readonly db: Database,
    private readonly configurations: Configuration<T>[],
    options?: IndexerOptions,
  ) {
    assert(configurations.length > 0, 'Configurations should not be empty')

    super(logger, parents, options)
  }

  /**
   * Initializes indexer state. In most cases it will mean that it reads the
   * previously saved configurations, finds the diff between saved and currently injected,
   * updates database state accordingly and returns configurations with the currentHeight
   */
  abstract multiInitialize(
    configurations: Configuration<T>[],
  ): Promise<SavedConfiguration<T>[]>

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
   * `from` and `to`.
   *
   * @returns Callback returning the height that the indexer has synced up to.
   * Saving data to the database should be executed inside this callback.
   * Returning `from` means that the indexer has synced a single data point. Returning
   * a value greater than `from` means that the indexer has synced up
   * to that height. Returning a value less than `from` or greater than
   * `to` is not permitted.
   */
  abstract multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<T>[],
  ): Promise<() => Promise<number>>

  abstract updateConfigurationsCurrentHeight(
    currentHeight: number,
  ): Promise<void>

  async initialize() {
    const configurations = await this.multiInitialize(this.configurations)

    this.ranges = toRanges(configurations)

    const safeHeight = configurations.reduce(
      (agg, curr) =>
        (agg = Math.min(agg, curr.currentHeight ?? curr.minHeight - 1)),
      Infinity,
    )

    return { safeHeight }
  }

  async update(from: number, to: number): Promise<number> {
    const range = findRange(this.ranges, from)
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

    return await this.db.transaction(async () => {
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
