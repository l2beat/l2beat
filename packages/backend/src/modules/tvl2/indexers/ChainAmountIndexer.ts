import { assert } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import {
  ManagedMultiIndexer,
  ManagedMultiIndexerOptions,
} from '../../../tools/uif/multi/ManagedMultiIndexer'
import {
  RemovalConfiguration,
  UpdateConfiguration,
} from '../../../tools/uif/multi/types'
import { AmountRepository } from '../repositories/AmountRepository'
import { BlockTimestampRepository } from '../repositories/BlockTimestampRepository'
import { AmountService, ChainAmountConfig } from '../services/AmountService'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export interface ChainAmountIndexerDeps
  extends ManagedMultiIndexerOptions<ChainAmountConfig> {
  amountService: AmountService
  amountRepository: AmountRepository
  blockTimestampsRepository: BlockTimestampRepository
  syncOptimizer: SyncOptimizer
  chain: string
}

export class ChainAmountIndexer extends ManagedMultiIndexer<ChainAmountConfig> {
  indexerId: string
  constructor(private readonly $: ChainAmountIndexerDeps) {
    super($)
    this.indexerId = $.id
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: UpdateConfiguration<ChainAmountConfig>[],
  ): Promise<number> {
    const timestamp = this.$.syncOptimizer.getTimestampToSync(
      new UnixTime(from),
    )

    if (timestamp.gt(new UnixTime(to))) {
      return Promise.resolve(to)
    }

    const configurationsWithMissingData = configurations.filter(
      (c) => !c.hasData,
    )

    const blockNumber =
      await this.$.blockTimestampsRepository.findByChainAndTimestamp(
        this.$.chain,
        timestamp,
      )
    assert(blockNumber, 'Block number not found')

    const amounts = await this.$.amountService.fetchAmounts(
      configurationsWithMissingData,
      blockNumber?.blockNumber,
      timestamp,
    )

    this.logger.info('Fetched amounts for timestamp', {
      timestamp: timestamp.toNumber(),
      blockNumber,
      amounts: amounts.length,
      configurations: configurationsWithMissingData.length,
    })

    const nonZeroAmounts = amounts.filter((a) => a.amount > 0)
    await this.$.amountRepository.addMany(nonZeroAmounts)

    this.logger.info('Saved amounts for timestamp into DB', {
      amounts: nonZeroAmounts.length,
      configurations: configurationsWithMissingData.length,
    })

    return timestamp.toNumber()
  }

  override async removeData(
    configurations: RemovalConfiguration<ChainAmountConfig>[],
  ): Promise<void> {
    for (const configuration of configurations) {
      const deletedRecords =
        await this.$.amountRepository.deleteByConfigInTimeRange(
          configuration.id,
          new UnixTime(configuration.from),
          new UnixTime(configuration.to),
        )

      this.logger.info('Deleted amounts for configuration', {
        id: configuration.id,
        from: configuration.from,
        to: configuration.to,
        deletedRecords,
      })
    }
  }
}
