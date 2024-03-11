import { assert, Logger } from '@l2beat/backend-tools'
import { TrackedTxsConfigType, UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'
import { Knex } from 'knex'

import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { HourlyIndexer } from './HourlyIndexer'
import { TrackedTxsConfigsRepository } from './repositories/TrackedTxsConfigsRepository'
import { TrackedTxsClient } from './TrackedTxsClient'
import { TrackedTxId } from './types/TrackedTxId'
import { TrackedTxConfigEntry } from './types/TrackedTxsConfig'
import { TxUpdaterInterface } from './types/TxUpdaterInterface'
import { adjustToForBigqueryCall } from './utils'
import { diffTrackedTxConfigurations } from './utils/diffTrackedTxConfigurations'
import { findConfigurationsToSync } from './utils/findConfigurationsToSync'
import { getSafeHeight } from './utils/getSafeHeight'

export type TrackedTxsIndexerUpdaters = Record<
  TrackedTxsConfigType,
  TxUpdaterInterface
>

export class TrackedTxsIndexer extends ChildIndexer {
  readonly indexerId = 'tracked_txs_indexer'

  constructor(
    logger: Logger,
    parentIndexer: HourlyIndexer,
    private readonly trackedTxsClient: TrackedTxsClient,
    private readonly stateRepository: IndexerStateRepository,
    private readonly configRepository: TrackedTxsConfigsRepository,
    private readonly configs: TrackedTxConfigEntry[],
    private readonly updaters: TrackedTxsIndexerUpdaters,
    private readonly minTimestamp: UnixTime,
  ) {
    super(logger, [parentIndexer])
  }

  override async start(): Promise<void> {
    this.logger.info('Starting...')
    await this.initialize()
    await super.start()
  }

  override async update(from: number, to: number): Promise<number> {
    const unixFrom = new UnixTime(from)
    const [configurations, adjustedTo] = await this.getConfiguration(from, to)

    if (configurations.length === 0) {
      this.logger.debug('Update skipped', { from, to: adjustedTo })
      return adjustedTo.toNumber()
    }

    const txs = await this.trackedTxsClient.getData(
      this.configs,
      unixFrom,
      adjustedTo,
    )

    await this.configRepository.runInTransaction(async (trx) => {
      for (const [type, updater] of Object.entries(this.updaters)) {
        const filteredTxs = txs.filter((tx) => tx.use.type === type)
        await updater.update(filteredTxs, trx)
      }

      const configIds = configurations.flatMap((config) =>
        config.uses.map((use) => use.id),
      )
      await this.configRepository.setLastSyncedTimestamp(
        configIds,
        adjustedTo,
        trx,
      )
    })

    this.logger.info('Updated', {
      from,
      adjustedTo: adjustedTo,
      usedConfigurations: configurations.length,
      fetchedTxsCount: txs.length,
    })
    return adjustedTo.toNumber()
  }

  async getConfiguration(
    from: number,
    to: number,
  ): Promise<[TrackedTxConfigEntry[], UnixTime]> {
    const adjustedTo = adjustToForBigqueryCall(from, to)

    const databaseEntries = await this.configRepository.getAll()

    const configurationsToSync = findConfigurationsToSync(
      this.configs,
      databaseEntries,
      new UnixTime(from),
      adjustedTo,
    )

    return [configurationsToSync, adjustedTo]
  }

  private async initialize(): Promise<void> {
    this.logger.info('Initializing...')
    const databaseEntries = await this.configRepository.getAll()
    const { toAdd, toRemove, toTrim } = diffTrackedTxConfigurations(
      this.configs,
      databaseEntries,
    )

    this.logger.info('Modifying tracked txs configs', {
      added: toAdd.map((add) => add.id),
      removed: toRemove,
      trimmed: toTrim.map((trim) => trim.id),
    })

    const safeHeight = getSafeHeight(databaseEntries, toAdd, this.minTimestamp)

    await this.stateRepository.runInTransaction(async (trx) => {
      await this.configRepository.addMany(toAdd, trx)

      await this.configRepository.deleteMany(toRemove, trx)
      await this.trimConfigurations(toTrim, trx)
      await this.initializeIndexerState(safeHeight, trx)
    })
  }

  private async trimConfigurations(
    toTrim: { id: TrackedTxId; untilTimestamp: UnixTime }[],
    trx: Knex.Transaction,
  ) {
    // there can be a situation where untilTimestamp was set retroactively
    // in this case we want to invoke deleteAfter on updaters for all the configurations that were added during this "misconfiguration" period
    await Promise.all(
      toTrim.map(async (c) => {
        await this.configRepository.setUntilTimestamp(
          c.id,
          c.untilTimestamp,
          trx,
        )
        for (const updater of Object.values(this.updaters)) {
          await updater.deleteAfter(c.id, c.untilTimestamp, trx)
        }
      }),
    )
  }

  async initializeIndexerState(safeHeight: number, trx?: Knex.Transaction) {
    const indexerState = await this.stateRepository.findIndexerState(
      this.indexerId,
    )

    if (indexerState === undefined) {
      await this.stateRepository.add(
        {
          indexerId: this.indexerId,
          safeHeight,
          minTimestamp: this.minTimestamp,
        },
        trx,
      )
      return
    }

    // We prevent updating the minimum timestamp of the indexer.
    // This functionality can be added in the future if needed.
    assert(
      indexerState.minTimestamp &&
        this.minTimestamp.equals(indexerState.minTimestamp),
      'Minimum timestamp of this indexer cannot be updated',
    )

    await this.setSafeHeight(safeHeight, trx)
  }

  override async getSafeHeight(): Promise<number> {
    const indexerState = await this.stateRepository.findIndexerState(
      this.indexerId,
    )

    return indexerState?.safeHeight ?? this.minTimestamp.toNumber()
  }

  override async setSafeHeight(
    safeHeight: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    assert(
      safeHeight >= this.minTimestamp.toNumber(),
      'Cannot set height to be lower than the minimum timestamp',
    )

    await this.stateRepository.setSafeHeight(this.indexerId, safeHeight, trx)
  }

  /**
   * WARNING: this method does not do anything
   *
    In our case there is no re-org handling so we do not have to worry
    that our data will become invalid.
    Also there is no need to handle the case when the server is randomly shut down during update,
    liveness configurations are storing the latest synced timestamp, so even if the server is shut down
    without setting new safeHeight. And although the next update will run on the already processed timestamp,
    the configuration's lastSyncedTimestamp will filter out already processed configurations
    and the data will not be fetched again
  **/
  override async invalidate(targetHeight: number): Promise<number> {
    return Promise.resolve(targetHeight)
  }
}
