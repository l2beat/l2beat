import { assert, Logger } from '@l2beat/backend-tools'
import { Hash256, UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'
import { Knex } from 'knex'

import { Project } from '../../model'
import {
  IndexerStateRecord,
  IndexerStateRepository,
} from '../../peripherals/database/IndexerStateRepository'
import { LivenessConfigurationRepository } from '../../peripherals/database/LivenessConfigurationRepository'
import { LivenessRepository } from '../../peripherals/database/LivenessRepository'
import { HourlyIndexer } from './HourlyIndexer'
import { LivenessClient } from './LivenessClient'
import { LivenessFunctionCall, LivenessTransfer } from './types/LivenessConfig'
import {
  adjustToForBigqueryCall,
  getLivenessConfigHash,
  isTimestampInRange,
  mergeConfigs,
} from './utils'
import { processLivenessConfigurations } from './utils/processLivenessConfigurations'

export class LivenessIndexer extends ChildIndexer {
  private readonly indexerId = 'liveness_indexer'
  private readonly configHash: Hash256

  constructor(
    logger: Logger,
    parentIndexer: HourlyIndexer,
    private readonly projects: Project[],
    private readonly livenessClient: LivenessClient,
    private readonly stateRepository: IndexerStateRepository,
    private readonly livenessRepository: LivenessRepository,
    private readonly livenessConfigurationRepository: LivenessConfigurationRepository,
    private readonly minTimestamp: UnixTime,
  ) {
    super(logger, [parentIndexer])
    this.configHash = getLivenessConfigHash(this.projects)
  }

  override async start(): Promise<void> {
    await this.initialize()

    await super.start()
  }

  override async update(from: number, to: number): Promise<number> {
    const { transfersConfig, functionCallsConfig, adjustedTo } =
      await this.getConfiguration(from, to)

    if (transfersConfig.length === 0 && functionCallsConfig.length === 0) {
      this.logger.info('Update skipped', { from, to: adjustedTo })
      return Promise.resolve(adjustedTo.toNumber())
    }

    const data = await this.livenessClient.getLivenessData(
      transfersConfig,
      functionCallsConfig,
      new UnixTime(from),
      adjustedTo,
    )

    await this.livenessRepository.runInTransaction(async (trx) => {
      await this.livenessRepository.addMany(data, trx)

      await Promise.all(
        [...transfersConfig, ...functionCallsConfig].map((c) =>
          this.livenessConfigurationRepository.setLastSyncedTimestamp(
            c.livenessConfigurationId,
            adjustedTo,
            trx,
          ),
        ),
      )
    })

    this.logger.info('Updated', {
      from,
      adjustedTo: adjustedTo,
      usedConfigurations: transfersConfig.length + functionCallsConfig.length,
      fetchedDataPoints: data.length,
    })
    return Promise.resolve(adjustedTo.toNumber())
  }

  async getConfiguration(
    from: number,
    to: number,
  ): Promise<{
    transfersConfig: LivenessTransfer[]
    functionCallsConfig: LivenessFunctionCall[]
    adjustedTo: UnixTime
  }> {
    const configurations = await this.livenessConfigurationRepository.getAll()

    const adjustedTo = adjustToForBigqueryCall(
      new UnixTime(from).toNumber(),
      new UnixTime(to).toNumber(),
    )

    const config = mergeConfigs(this.projects, configurations)

    const transfersConfig = config.transfers.filter((c) =>
      isTimestampInRange(
        c.sinceTimestamp,
        c.untilTimestamp,
        c.latestSyncedTimestamp,
        new UnixTime(from),
        adjustedTo,
      ),
    )
    const functionCallsConfig = config.functionCalls.filter((c) =>
      isTimestampInRange(
        c.sinceTimestamp,
        c.untilTimestamp,
        c.latestSyncedTimestamp,
        new UnixTime(from),
        adjustedTo,
      ),
    )
    return { transfersConfig, functionCallsConfig, adjustedTo }
  }

  private async initialize() {
    const indexerState = await this.stateRepository.findIndexerState(
      this.indexerId,
    )

    await this.stateRepository.runInTransaction(async (trx) => {
      await this.initializeIndexerState(indexerState, trx)
      await this.initializeConfigurations(indexerState, trx)
    })

    this.logger.info('Initialized state and configurations')
  }

  private async initializeIndexerState(
    indexerState: IndexerStateRecord | undefined,
    trx: Knex.Transaction,
  ) {
    if (indexerState === undefined) {
      await this.stateRepository.add(
        {
          indexerId: this.indexerId,
          configHash: this.configHash,
          safeHeight: this.minTimestamp.toNumber(),
          minTimestamp: this.minTimestamp,
        },
        trx,
      )
      this.logger.info('Added new indexer state to the database')
      return
    }

    // We prevent updating the minimum timestamp of the indexer.
    // This functionality can be added in the future if needed.
    assert(
      indexerState.minTimestamp &&
        this.minTimestamp.equals(indexerState.minTimestamp),
      'Minimum timestamp of this indexer cannot be updated',
    )

    if (indexerState.configHash !== this.configHash) {
      await this.stateRepository.setConfigHash(
        this.indexerId,
        this.configHash,
        trx,
      )
      await this.stateRepository.setSafeHeight(
        this.indexerId,
        this.minTimestamp.toNumber(),
        trx,
      )
      this.logger.info('Updated indexer state')
    }
  }

  private async initializeConfigurations(
    indexerState: IndexerStateRecord | undefined,
    trx: Knex.Transaction,
  ) {
    if (indexerState && indexerState.configHash === this.configHash) {
      return
    }
    const configurations = await this.livenessConfigurationRepository.getAll()
    const { added, phasedOut, updated } = processLivenessConfigurations(
      this.projects,
      configurations,
    )

    await this.livenessConfigurationRepository.addMany(added, trx)

    // this will also delete records from "liveness" using CASCADE constraint
    await this.livenessConfigurationRepository.deleteMany(
      phasedOut.map((c) => c.id),
      trx,
    )

    // there can be a situation where untilTimestamp was set retroactively
    // in this case we want to delete the liveness records that were added during this "misconfiguration" period
    await Promise.all(
      updated.map(async (u) => {
        const untilTimestamp = u.untilTimestamp
        assert(untilTimestamp, 'untilTimestamp should not be undefined there')
        await this.livenessConfigurationRepository.setUntilTimestamp(
          u.id,
          untilTimestamp,
          trx,
        )
        await this.livenessRepository.deleteAfter(u.id, untilTimestamp, trx)
      }),
    )

    this.logger.info('Saved configurations to the database', {
      added: added.length,
      phasedOut: phasedOut.length,
      updated: updated.length,
    })
  }

  override async getSafeHeight(): Promise<number> {
    const indexerState = await this.stateRepository.findIndexerState(
      this.indexerId,
    )
    const height = indexerState?.safeHeight
    return height ?? this.minTimestamp.toNumber()
  }

  override async setSafeHeight(height: number): Promise<void> {
    await this.stateRepository.setSafeHeight(this.indexerId, height)
  }

  // This function will not be used, but it is required by the UIF.
  // In our case there is no re-org handling so we do not have to worry
  // that our data will become invalid.
  // Also there is no need to handle the case when the server is randomly shut down during update,
  // liveness configurations are storing the latest synced timestamp, so even if the server is shut down
  // without setting new safeHeight. And although the next update will run on the already processed timestamp,
  // the configuration's lastSyncedTimestamp will filter out already processed configurations
  // and the data will not be fetched again
  override async invalidate(targetHeight: number): Promise<number> {
    return Promise.resolve(targetHeight)
  }
}
