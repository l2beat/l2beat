import { Logger } from '@l2beat/backend-tools'
import { assert, notUndefined, UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'
import { Knex } from 'knex'

import {
  FinalityRecord,
  FinalityRepository,
} from '../../peripherals/database/FinalityRepository'
import { IndexerStateRepository } from '../../peripherals/database/IndexerStateRepository'
import { LivenessIndexer } from '../liveness/LivenessIndexer'
import { FinalityConfig } from './types/FinalityConfig'
import { findConfigurationsToSync } from './utils/findConfigurationsToSync'

const FINALITY_GRANULARITY = 24 * 6

export class FinalityIndexer extends ChildIndexer {
  readonly indexerId = 'finality_indexer'
  readonly minTimestamp = UnixTime.fromDate(new Date('2024-02-07T00:00:00Z'))

  constructor(
    logger: Logger,
    parentIndexer: LivenessIndexer,
    private readonly stateRepository: IndexerStateRepository,
    private readonly finalityRepository: FinalityRepository,
    private readonly runtimeConfigurations: FinalityConfig[],
  ) {
    super(logger, [parentIndexer])
  }

  override async start(): Promise<void> {
    this.logger.info('Starting...')
    await this.initialize()
    await super.start()
  }

  override async update(from: number, to: number): Promise<number> {
    const targetTimestamp = new UnixTime(to).toStartOf('day')

    const configurationsToSync = await this.getSyncStatus(targetTimestamp)

    if (configurationsToSync.length === 0) {
      this.logger.debug('Update skipped', { from, to })
      return to
    }

    const finalityData = await this.getFinalityData(
      targetTimestamp,
      configurationsToSync,
    )

    await this.finalityRepository.addMany(finalityData)

    this.logger.info('Update finished', {
      from,
      to,
      targetTimestamp,
      projects: configurationsToSync.map((c) => c.projectId.toString()),
    })
    return to
  }

  private async getSyncStatus(targetTimestamp: UnixTime) {
    const syncedProjectsForLastDay =
      await this.finalityRepository.getProjectsSyncedOnTimestamp(
        targetTimestamp,
      )

    const configurationsToSyncForLastDay = findConfigurationsToSync(
      this.runtimeConfigurations,
      syncedProjectsForLastDay,
    )

    return configurationsToSyncForLastDay
  }

  async getFinalityData(
    to: UnixTime,
    configurations: FinalityConfig[],
  ): Promise<FinalityRecord[]> {
    const from = to.add(-1, 'days')

    const finalityPromises = configurations.map(async (config) => {
      const projectFinalityData =
        await config.analyzer.getFinalityWithGranularity(
          from,
          to,
          FINALITY_GRANULARITY,
        )

      if (projectFinalityData === undefined) {
        return
      }

      return {
        projectId: config.projectId,
        timestamp: to,
        ...projectFinalityData,
      }
    })

    const data = await Promise.all(finalityPromises)
    return data.filter(notUndefined)
  }

  private async initialize() {
    await this.initializeIndexerState(this.minTimestamp.toNumber())
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
