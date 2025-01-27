import { INDEXER_NAMES } from '@l2beat/backend-shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  RemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { ChainAmountConfig, ChainAmountIndexerDeps } from './types'

export class ChainAmountIndexer extends ManagedMultiIndexer<ChainAmountConfig> {
  constructor(private readonly $: ChainAmountIndexerDeps) {
    super({
      ...$,
      name: INDEXER_NAMES.CHAIN_AMOUNT,
      tags: {
        tag: $.chain,
        chain: $.chain,
      },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<ChainAmountConfig>[],
  ) {
    const timestamp = this.$.syncOptimizer.getTimestampToSync(from)
    if (timestamp.toNumber() > to) {
      this.logger.info('Skipping update due to sync optimization', {
        from,
        to,
        optimizedTimestamp: timestamp.toNumber(),
      })
      return () => Promise.resolve(to)
    }

    const blockNumber = await this.getBlockNumber(timestamp)

    const amounts = await this.$.amountService.fetchAmounts(
      timestamp,
      blockNumber,
      configurations.map((c) => ({ id: c.id, ...c.properties })),
    )

    this.logger.info('Fetched amounts for timestamp', {
      timestamp: timestamp.toNumber(),
      blockNumber,
      escrows: amounts.filter((a) => a.type === 'escrow').length,
      totalSupplies: amounts.filter((a) => a.type === 'totalSupply').length,
    })

    const nonZeroAmounts = amounts.filter((a) => a.amount > 0)

    return async () => {
      await this.$.db.amount.insertMany(nonZeroAmounts)
      this.logger.info('Saved amounts for timestamp into DB', {
        timestamp: timestamp.toNumber(),
        escrows: nonZeroAmounts.filter((a) => a.type === 'escrow').length,
        totalSupplies: nonZeroAmounts.filter((a) => a.type === 'totalSupply')
          .length,
      })

      return timestamp.toNumber()
    }
  }

  private async getBlockNumber(timestamp: UnixTime) {
    const blockNumber =
      await this.$.db.blockTimestamp.findBlockNumberByChainAndTimestamp(
        this.$.chain,
        timestamp,
      )
    assert(
      blockNumber,
      `Block number not found for timestamp: ${timestamp.toNumber()}`,
    )
    return blockNumber
  }

  override async removeData(configurations: RemovalConfiguration[]) {
    for (const configuration of configurations) {
      const deletedRecords = await this.$.db.amount.deleteByConfigInTimeRange(
        configuration.id,
        new UnixTime(configuration.from),
        new UnixTime(configuration.to),
      )

      if (deletedRecords > 0) {
        this.logger.info('Deleted amounts for configuration', {
          id: configuration.id,
          from: configuration.from,
          to: configuration.to,
          deletedRecords,
        })
      }
    }
  }
}
