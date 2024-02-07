import { Logger } from '@l2beat/backend-tools'
import { assert, notUndefined, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'
import { Knex } from 'knex'

import { FinalityRepository } from '../../peripherals/database/FinalityRepository'
import { IndexerStateRepository } from '../../peripherals/database/IndexerStateRepository'
import { LivenessIndexer } from '../liveness/LivenessIndexer'
import { FinalityConfig } from './types/FinalityConfig'
import { findConfigurationsToSync } from './utils/findConfigurationsToSync'

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
    await super.start()
  }

  override async update(from: number, to: number): Promise<number> {
    const [configurationsToSync, adjustedTo] = await this.getConfiguration(to)
    if (configurationsToSync.length === 0) {
      this.logger.info('Update skipped', { from, to: adjustedTo })
      return adjustedTo
    }
    const finalityData = await this.getFinalityData(
      new UnixTime(adjustedTo).add(-1, 'days').toNumber(),
      adjustedTo,
      configurationsToSync,
    )
    await this.finalityRepository.addMany(
      finalityData.map((d) => ({ ...d, timestamp: new UnixTime(adjustedTo) })),
    )

    return adjustedTo
  }

  async getConfiguration(to: number): Promise<[FinalityConfig[], number]> {
    const syncedProjectsForLastDay =
      await this.finalityRepository.getProjectsSyncedOnTimestamp(
        new UnixTime(to).toStartOf('day'),
      )
    const configurationsToSyncForLastDay = findConfigurationsToSync(
      this.runtimeConfigurations,
      syncedProjectsForLastDay,
    )
    if (configurationsToSyncForLastDay.length > 0) {
      return [
        configurationsToSyncForLastDay,
        new UnixTime(to).toStartOf('day').toNumber(),
      ]
    } else if (UnixTime.now().toStartOf('day').toNumber() !== to) {
      return [[], to]
    } else {
      return [this.runtimeConfigurations, to]
    }
  }

  async getFinalityData(
    from: number,
    to: number,
    configurations: FinalityConfig[],
  ): Promise<
    {
      projectId: ProjectId
      minimum: number
      maximum: number
      average: number
    }[]
  > {
    const fromUnixTime = new UnixTime(from)
    const toUnixTime = new UnixTime(to)
    const finalityPromises = configurations.map(async (config) => {
      const projectFinalityData =
        await config.analyzer.getFinalityWithGranularity(
          fromUnixTime,
          toUnixTime,
          24 * 6,
        )
      if (projectFinalityData === undefined) {
        return
      }
      return {
        projectId: config.projectId,
        ...projectFinalityData,
      }
    })
    const data = await Promise.all(finalityPromises)
    return data.filter(notUndefined)
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
