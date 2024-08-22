import { Database } from '@l2beat/database'
import { TrackedTxConfigEntry } from '@l2beat/shared'
import { UnixTime, clampRangeToDay } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedMultiIndexer } from '../../tools/uif/multi/ManagedMultiIndexer'
import {
  Configuration,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
} from '../../tools/uif/multi/types'
import { TrackedTxsClient } from './TrackedTxsClient'
import { TxUpdaterInterface } from './types/TxUpdaterInterface'

interface Dependencies
  extends Omit<ManagedMultiIndexerOptions<TrackedTxConfigEntry>, 'name'> {
  updaters: TxUpdaterInterface[]
  trackedTxsClient: TrackedTxsClient
  db: Database
}

export class TrackedTxsIndexer extends ManagedMultiIndexer<TrackedTxConfigEntry> {
  constructor(private readonly $: Dependencies) {
    super({
      ...$,
      name: 'tracked_txs_indexer',
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<TrackedTxConfigEntry>[],
  ) {
    const { from: unixFrom, to: unixTo } = clampRangeToDay(from, to)

    const txs = await this.$.trackedTxsClient.getData(
      configurations,
      unixFrom,
      unixTo,
    )

    return async () => {
      for (const updater of this.$.updaters) {
        const filteredTxs = txs.filter((tx) => tx.type === updater.type)
        await updater.update(filteredTxs)
      }
      this.logger.info('Saved txs into DB', {
        from,
        to: unixTo.toNumber(),
        configurationsToSync: configurations.length,
      })

      return unixTo.toNumber()
    }
  }

  override async removeData(configurations: RemovalConfiguration[]) {
    for (const configuration of configurations) {
      const [livenessDeletedRecords, l2CostsDeletedRecords] = await Promise.all(
        [
          this.$.db.liveness.deleteByConfigInTimeRange(
            configuration.id,
            new UnixTime(configuration.from),
            new UnixTime(configuration.to),
          ),
          this.$.db.l2Cost.deleteByConfigInTimeRange(
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
