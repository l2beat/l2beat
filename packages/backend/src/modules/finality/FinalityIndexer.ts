import { Logger } from '@l2beat/backend-tools'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'

import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { LivenessIndexer } from '../liveness/LivenessIndexer'
import {
  FinalityRecord,
  FinalityRepository,
} from './repositories/FinalityRepository'
import { FinalityConfig } from './types/FinalityConfig'
import { findConfigurationsToSync } from './utils/findConfigurationsToSync'

/*
  Once per day we want to fetch finality data for each project for last 24h, with granularity of 10 minutes,
  so in every hour there will be 6 calls
*/
const FINALITY_GRANULARITY = 24 * 6

export class FinalityIndexer extends ChildIndexer {
  readonly indexerId = 'finality_indexer'
  readonly minTimestamp = UnixTime.fromDate(
    new Date('2024-02-07T00:00:00.000Z'),
  )

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
    if (to < this.minTimestamp.toNumber()) {
      this.logger.debug(
        'Update skipped: target earlier than minimumTimestamp',
        { from, to },
      )
      return to
    }
    const targetTimestamp = new UnixTime(to).toStartOf('day')

    const configurationsToSync = await this.getSyncStatus(targetTimestamp)

    if (configurationsToSync.length === 0) {
      this.logger.debug('Update skipped: no configurations to sync', {
        from,
        to,
      })
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

  async getSyncStatus(targetTimestamp: UnixTime) {
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

    const data: FinalityRecord[] = []

    for (const configuration of configurations) {
      const projectFinalityData =
        await configuration.analyzer.getFinalityWithGranularity(
          from,
          to,
          FINALITY_GRANULARITY,
        )

      if (projectFinalityData) {
        data.push({
          projectId: configuration.projectId,
          timestamp: to,
          ...projectFinalityData,
        })
      }
    }

    return data
  }

  private async initialize() {
    await this.initializeIndexerState(this.minTimestamp.toNumber())
  }

  async initializeIndexerState(safeHeight: number) {
    const indexerState = await this.stateRepository.findIndexerState(
      this.indexerId,
    )

    if (indexerState === undefined) {
      await this.stateRepository.add({
        indexerId: this.indexerId,
        safeHeight,
        minTimestamp: this.minTimestamp,
      })
      return
    }

    // We prevent updating the minimum timestamp of the indexer.
    // This functionality can be added in the future if needed.
    assert(
      indexerState.minTimestamp &&
        this.minTimestamp.equals(indexerState.minTimestamp),
      'Minimum timestamp of this indexer cannot be updated',
    )

    await this.setSafeHeight(safeHeight)
  }

  override async getSafeHeight(): Promise<number> {
    const indexerState = await this.stateRepository.findIndexerState(
      this.indexerId,
    )
    return indexerState?.safeHeight ?? this.minTimestamp.toNumber()
  }

  override async setSafeHeight(safeHeight: number): Promise<void> {
    await this.stateRepository.setSafeHeight(this.indexerId, safeHeight)
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
