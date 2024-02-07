import { assert, Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'
import { Knex } from 'knex'

import { IndexerStateRepository } from '../../peripherals/database/IndexerStateRepository'
import { LivenessConfigurationRepository } from '../../peripherals/database/LivenessConfigurationRepository'
import { LivenessRepository } from '../../peripherals/database/LivenessRepository'
import { HourlyIndexer } from './HourlyIndexer'
import { LivenessClient } from './LivenessClient'
import { LivenessConfigEntry } from './types/LivenessConfig'
import { LivenessId } from './types/LivenessId'
import { adjustToForBigqueryCall } from './utils'
import { diffLivenessConfigurations } from './utils/diffLivenessConfigurations'
import { findConfigurationsToSync } from './utils/findConfigurationsToSync'
import { getSafeHeight } from './utils/getSafeHeight'

export class LivenessIndexer extends ChildIndexer {
  readonly indexerId = 'liveness_indexer'

  constructor(
    logger: Logger,
    parentIndexer: HourlyIndexer,
    private readonly livenessClient: LivenessClient,
    private readonly stateRepository: IndexerStateRepository,
    private readonly livenessRepository: LivenessRepository,
    private readonly configurationRepository: LivenessConfigurationRepository,
    private readonly runtimeConfigurations: LivenessConfigEntry[],
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
    const [configurations, adjustedTo] = await this.getConfiguration(from, to)

    if (configurations.length === 0) {
      this.logger.debug('Update skipped', { from, to: adjustedTo })
      return adjustedTo.toNumber()
    }

    const data = await this.livenessClient.getLivenessData(
      configurations,
      new UnixTime(from),
      adjustedTo,
    )

    await this.livenessRepository.runInTransaction(async (trx) => {
      await this.livenessRepository.addMany(data, trx)

      await this.configurationRepository.setLastSyncedTimestamp(
        configurations.map((c) => c.id),
        adjustedTo,
        trx,
      )
    })

    this.logger.info('Updated', {
      from,
      adjustedTo: adjustedTo,
      usedConfigurations: configurations.length,
      fetchedDataPoints: data.length,
    })
    return adjustedTo.toNumber()
  }

  async getConfiguration(
    from: number,
    to: number,
  ): Promise<[LivenessConfigEntry[], UnixTime]> {
    const adjustedTo = adjustToForBigqueryCall(from, to)

    const databaseEntries = await this.configurationRepository.getAll()

    const configurationsToSync = findConfigurationsToSync(
      this.runtimeConfigurations,
      databaseEntries,
      new UnixTime(from),
      adjustedTo,
    )

    return [configurationsToSync, adjustedTo]
  }

  private async initialize() {
    const databaseEntries = await this.configurationRepository.getAll()
    const { toAdd, toRemove, toTrim } = diffLivenessConfigurations(
      this.runtimeConfigurations,
      databaseEntries,
    )

    const safeHeight = getSafeHeight(databaseEntries, toAdd, this.minTimestamp)

    await this.stateRepository.runInTransaction(async (trx) => {
      await this.configurationRepository.addMany(toAdd, trx)
      // this will also delete records from "liveness" using CASCADE constraint
      await this.configurationRepository.deleteMany(toRemove, trx)
      await this.trimConfigurations(toTrim, trx)
      await this.initializeIndexerState(safeHeight, trx)
    })
  }

  private async trimConfigurations(
    toTrim: { id: LivenessId; untilTimestamp: UnixTime }[],
    trx: Knex.Transaction,
  ) {
    // there can be a situation where untilTimestamp was set retroactively
    // in this case we want to delete the liveness records that were added during this "misconfiguration" period
    await Promise.all(
      toTrim.map(async (c) => {
        await this.configurationRepository.setUntilTimestamp(
          c.id,
          c.untilTimestamp,
          trx,
        )
        await this.livenessRepository.deleteAfter(c.id, c.untilTimestamp, trx)
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
