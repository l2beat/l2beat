import {
  TrackedTxsConfigType,
  UnixTime,
  clampRangeToDay,
  notUndefined,
} from '@l2beat/shared-pure'
import { pickBy } from 'lodash'
import {
  DatabaseMiddleware,
  DatabaseTransaction,
} from '../../peripherals/database/DatabaseMiddleware'
import { DEFAULT_RETRY_FOR_TVL } from '../../tools/uif/defaultRetryForTvl'
import {
  ManagedMultiIndexer,
  ManagedMultiIndexerOptions,
} from '../../tools/uif/multi/ManagedMultiIndexer'
import {
  RemovalConfiguration,
  UpdateConfiguration,
} from '../../tools/uif/multi/types'
import { TrackedTxsClient } from './TrackedTxsClient'
import { L2CostsRepository } from './modules/l2-costs/repositories/L2CostsRepository'
import { LivenessRepository } from './modules/liveness/repositories/LivenessRepository'
import { TrackedTxConfigEntry } from './types/TrackedTxsConfig'
import { TxUpdaterInterface } from './types/TxUpdaterInterface'

export type TrackedTxsIndexerUpdaters = Record<
  TrackedTxsConfigType,
  TxUpdaterInterface | undefined
>

export interface TrackedTxsIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<TrackedTxConfigEntry>, 'name'> {
  updaters: TrackedTxsIndexerUpdaters
  trackedTxsClient: TrackedTxsClient
  livenessRepository: LivenessRepository
  l2CostsRepository: L2CostsRepository
}

export class TrackedTxsIndexer extends ManagedMultiIndexer<TrackedTxConfigEntry> {
  readonly enabledUpdaters: Partial<TrackedTxsIndexerUpdaters>

  constructor(private readonly $: TrackedTxsIndexerDeps) {
    const name = 'tracked_txs_indexer'
    const logger = $.logger.tag(name)
    super({ ...$, name, logger, updateRetryStrategy: DEFAULT_RETRY_FOR_TVL })
    this.enabledUpdaters = pickBy(this.$.updaters, notUndefined)
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: UpdateConfiguration<TrackedTxConfigEntry>[],
    dbMiddleware: DatabaseMiddleware,
  ): Promise<number> {
    const configurationsToSync = configurations.filter((c) => !c.hasData)

    if (configurationsToSync.length !== configurations.length) {
      this.logger.info('Filtered out configurations with data', {
        skippedConfigurations:
          configurations.length - configurationsToSync.length,
        configurationsToSync: configurationsToSync.length,
        from,
        to,
      })
    }

    if (configurationsToSync.length === 0) {
      this.logger.info('No configurations to sync', {
        from,
        to,
      })
      return to
    }
    const { from: unixFrom, to: unixTo } = clampRangeToDay(from, to)

    const allSyncTo = configurationsToSync
      .map((config) => config.maxHeight)
      .filter((c) => !!c) as number[]
    const syncTo = new UnixTime(Math.min(unixTo.toNumber(), ...allSyncTo))

    const txs = await this.$.trackedTxsClient.getData(
      configurationsToSync,
      unixFrom,
      syncTo,
    )

    dbMiddleware.add(async (trx?: DatabaseTransaction) => {
      for (const [type, updater] of Object.entries(this.enabledUpdaters)) {
        const filteredTxs = txs.filter((tx) => tx.type === type)
        await updater?.update(filteredTxs, trx)
      }
      this.logger.info('Saving txs into DB', {
        from,
        to: syncTo.toNumber(),
        configurationsToSync: configurationsToSync.length,
      })
    })
    return syncTo.toNumber()
  }

  override async removeData(
    configurations: RemovalConfiguration[],
  ): Promise<void> {
    for (const configuration of configurations) {
      const livenessDeletedRecords =
        await this.$.livenessRepository.deleteByConfigInTimeRange(
          configuration.id,
          new UnixTime(configuration.from),
          new UnixTime(configuration.to),
        )
      const l2CostsDeletedRecords =
        await this.$.l2CostsRepository.deleteByConfigInTimeRange(
          configuration.id,
          new UnixTime(configuration.from),
          new UnixTime(configuration.to),
        )

      if (livenessDeletedRecords > 0) {
        this.logger.info('Deleted liveness records', {
          from: configuration.from,
          to: configuration.to,
          id: configuration.id,
          livenessDeletedRecords,
        })
      }
      if (l2CostsDeletedRecords > 0) {
        this.logger.info('Deleted liveness records', {
          from: configuration.from,
          to: configuration.to,
          id: configuration.id,
          l2CostsDeletedRecords,
        })
      }
    }
  }
}
