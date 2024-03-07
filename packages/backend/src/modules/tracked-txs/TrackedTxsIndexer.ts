import { assert, Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'
import { Knex } from 'knex'

import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { HourlyIndexer } from './HourlyIndexer'
import { TrackedTxsConfigEntry } from './types/TrackedTxsConfig'
import { TxUpdaterInterface } from './types/TxUpdaterInterface'
import { adjustToForBigqueryCall } from './utils'
import { TrackedTxsClient } from './utils/TrackedTxsClient'

export class TrackedTxsIndexer extends ChildIndexer {
  readonly indexerId = 'tracked_txs_indexer'

  constructor(
    logger: Logger,
    parentIndexer: HourlyIndexer,
    private readonly trackedTxsClient: TrackedTxsClient,
    private readonly stateRepository: IndexerStateRepository,
    private readonly configs: TrackedTxsConfigEntry[],
    private readonly updaters: TxUpdaterInterface[],
    private readonly minTimestamp: UnixTime,
  ) {
    super(logger, [parentIndexer])
  }

  protected override async update(from: number, to: number): Promise<number> {
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

    this.updaters.forEach((updater) => updater.update(txs))

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
  ): Promise<[TrackedTxsConfigEntry[], UnixTime]> {
    const adjustedTo = adjustToForBigqueryCall(from, to)

    const databaseEntries = await this.configurationRepository.getAll()

    const configurationsToSync = findConfigurationsToSync(
      this.configs,
      databaseEntries,
      new UnixTime(from),
      adjustedTo,
    )

    return [configurationsToSync, adjustedTo]
  }

  override async getSafeHeight(): Promise<number> {
    const indexerState = await this.stateRepository.findIndexerState(
      this.indexerId,
    )

    return indexerState?.safeHeight ?? this.minTimestamp.toNumber()
  }

  protected override async setSafeHeight(
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
