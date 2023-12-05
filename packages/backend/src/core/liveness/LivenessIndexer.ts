import { assert, Logger } from '@l2beat/backend-tools'
import { notUndefined, UnixTime } from '@l2beat/shared-pure'
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
import { LivenessConfigEntry } from './types/LivenessConfig'
import { LivenessId } from './types/LivenessId'
import { adjustToForBigqueryCall, isTimestampInRange } from './utils'
import { diffLivenessConfigurations } from './utils/diffLivenessConfigurations'

// TODO: add logs?
export class LivenessIndexer extends ChildIndexer {
  readonly indexerId = 'liveness_indexer'

  constructor(
    logger: Logger,
    parentIndexer: HourlyIndexer,
    private readonly projects: Project[],
    private readonly livenessClient: LivenessClient,
    private readonly stateRepository: IndexerStateRepository,
    private readonly livenessRepository: LivenessRepository,
    private readonly configurationRepository: LivenessConfigurationRepository,
    private readonly minTimestamp: UnixTime,
  ) {
    super(logger, [parentIndexer])
  }

  override async start(): Promise<void> {
    await this.initialize()
    await super.start()
  }

  override async update(from: number, to: number): Promise<number> {
    const [configurations, adjustedTo] = await this.getConfiguration(from, to)

    if (configurations.length === 0) {
      this.logger.info('Update skipped', { from, to: adjustedTo })
      return adjustedTo.toNumber()
    }

    const data = await this.livenessClient.getLivenessData(
      configurations,
      new UnixTime(from),
      adjustedTo,
    )

    await this.livenessRepository.runInTransaction(async (trx) => {
      await this.livenessRepository.addMany(data, trx)

      await Promise.all(
        configurations.map((c) =>
          this.configurationRepository.setLastSyncedTimestamp(
            c.id,
            adjustedTo,
            trx,
          ),
        ),
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
    const databaseEntries = await this.configurationRepository.getAll()

    const adjustedTo = adjustToForBigqueryCall(
      new UnixTime(from).toNumber(),
      new UnixTime(to).toNumber(),
    )

    const runtimeEntries = this.projects.flatMap(
      (p) => p.livenessConfig?.entries ?? [],
    )

    const filteredConfigurations = runtimeEntries.filter((entry) => {
      const dbEntry = databaseEntries.find((dbEntry) => dbEntry.id === entry.id)
      assert(dbEntry, 'Database entry should not be undefined here!')

      return isTimestampInRange(
        entry.sinceTimestamp,
        entry.untilTimestamp,
        dbEntry.lastSyncedTimestamp,
        new UnixTime(from),
        adjustedTo,
      )
    })

    return [filteredConfigurations, adjustedTo]
  }

  private async initialize() {
    const indexerState = await this.stateRepository.findIndexerState(
      this.indexerId,
    )
    const databaseConfigurations = await this.configurationRepository.getAll()
    const { toAdd, toRemove, toTrim } = diffLivenessConfigurations(
      this.projects,
      databaseConfigurations,
    )

    const syncedTimestamps = databaseConfigurations
      .map((c) => c.lastSyncedTimestamp)
      .filter(notUndefined)

    // TODO: test
    const syncStatus =
      toAdd.length > 0 || syncedTimestamps.length === 0
        ? this.minTimestamp
        : syncedTimestamps.reduce((min, value) => (min.lt(value) ? min : value))

    await this.stateRepository.runInTransaction(async (trx) => {
      await this.initializeIndexerState(indexerState, syncStatus, trx)
      await this.initializeConfigurations(toAdd, toTrim, toRemove, trx)
    })

    this.logger.info('Initialized state and configurations')
  }

  private async initializeIndexerState(
    indexerState: IndexerStateRecord | undefined,
    status: UnixTime,
    trx: Knex.Transaction,
  ) {
    if (indexerState === undefined) {
      await this.stateRepository.add(
        {
          indexerId: this.indexerId,
          safeHeight: this.minTimestamp.toNumber(),
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

    await this.stateRepository.setSafeHeight(
      this.indexerId,
      status.toNumber(),
      trx,
    )
  }

  private async initializeConfigurations(
    toAdd: LivenessConfigEntry[],
    toTrim: { id: LivenessId; untilTimestamp: UnixTime }[],
    toRemove: LivenessId[],
    trx: Knex.Transaction,
  ) {
    await this.configurationRepository.addMany(toAdd, trx)

    // this will also delete records from "liveness" using CASCADE constraint
    await this.configurationRepository.deleteMany(toRemove, trx)

    // there can be a situation where untilTimestamp was set retroactively
    // in this case we want to delete the liveness records that were added during this "misconfiguration" period
    await Promise.all(
      toTrim.map(async (u) => {
        const untilTimestamp = u.untilTimestamp
        assert(untilTimestamp, 'untilTimestamp should not be undefined there')
        await this.configurationRepository.setUntilTimestamp(
          u.id,
          untilTimestamp,
          trx,
        )
        await this.livenessRepository.deleteAfter(u.id, untilTimestamp, trx)
      }),
    )

    this.logger.info('Saved configurations to the database', {
      added: toAdd.length,
      phasedOut: toRemove.length,
      updated: toTrim.length,
    })
  }

  override async getSafeHeight(): Promise<number> {
    const indexerState = await this.stateRepository.findIndexerState(
      this.indexerId,
    )
    return indexerState?.safeHeight ?? this.minTimestamp.toNumber()
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
