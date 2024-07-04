import { TrackedTxConfigEntry } from '@l2beat/shared'
import { UnixTime, clampRangeToDay } from '@l2beat/shared-pure'
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
import { TxUpdaterInterface } from './types/TxUpdaterInterface'

export interface TrackedTxsIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<TrackedTxConfigEntry>, 'name'> {
  updaters: TxUpdaterInterface[]
  trackedTxsClient: TrackedTxsClient
  livenessRepository: LivenessRepository
  l2CostsRepository: L2CostsRepository
}

export class TrackedTxsIndexer extends ManagedMultiIndexer<TrackedTxConfigEntry> {
  constructor(private readonly $: TrackedTxsIndexerDeps) {
    const name = 'tracked_txs_indexer'
    const logger = $.logger.tag(name)
    super({ ...$, name, logger, updateRetryStrategy: DEFAULT_RETRY_FOR_TVL })
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

    const txs = await this.$.trackedTxsClient.getData(
      configurationsToSync,
      unixFrom,
      unixTo,
    )

    dbMiddleware.add(async (trx?: DatabaseTransaction) => {
      for (const updater of this.$.updaters) {
        const filteredTxs = txs.filter((tx) => tx.type === updater.type)
        await updater.update(filteredTxs, trx)
      }
      this.logger.info('Saving txs into DB', {
        from,
        to: unixTo.toNumber(),
        configurationsToSync: configurationsToSync.length,
      })
    })
    return unixTo.toNumber()
  }

  override async removeData(
    configurations: RemovalConfiguration[],
  ): Promise<void> {
    for (const configuration of configurations) {
      const [livenessDeletedRecords, l2CostsDeletedRecords] = await Promise.all(
        [
          this.$.livenessRepository.deleteByConfigInTimeRange(
            configuration.id,
            new UnixTime(configuration.from),
            new UnixTime(configuration.to),
          ),
          this.$.l2CostsRepository.deleteByConfigInTimeRange(
            configuration.id,
            new UnixTime(configuration.from),
            new UnixTime(configuration.to),
          ),
        ],
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
