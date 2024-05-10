import { UnixTime } from '@l2beat/shared-pure'

import { assert } from '@l2beat/backend-tools'
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
  extends Omit<ManagedMultiIndexerOptions<ChainAmountConfig>, 'name'> {
  amountService: AmountService
  amountRepository: AmountRepository
  blockTimestampRepository: BlockTimestampRepository
  syncOptimizer: SyncOptimizer
  chain: string
}

export class ChainAmountIndexer extends ManagedMultiIndexer<ChainAmountConfig> {
  constructor(private readonly $: ChainAmountIndexerDeps) {
    const logger = $.logger.tag($.chain)
    const name = 'chain_amount_indexer'
    super({ ...$, name, logger })
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: UpdateConfiguration<ChainAmountConfig>[],
  ): Promise<number> {
    const timestamp = this.$.syncOptimizer.getTimestampToSync(from, to)

    const blockNumber =
      await this.$.blockTimestampRepository.findByChainAndTimestamp(
        this.$.chain,
        timestamp,
      )
    assert(
      blockNumber,
      `Block number not found for timestamp: ${timestamp.toNumber()}`,
    )

    const configurationsToSync = this.getConfigurationsToSync(
      configurations,
      timestamp,
      blockNumber,
    )

    if (configurationsToSync.length === 0) {
      this.logger.info('No configurations to sync', {
        timestamp: timestamp.toNumber(),
        blockNumber,
      })
      return timestamp.toNumber()
    }

    const amounts = await this.$.amountService.fetchAmounts(
      configurationsToSync,
      blockNumber,
      timestamp,
    )

    this.logger.info('Fetched amounts for timestamp', {
      timestamp: timestamp.toNumber(),
      blockNumber: blockNumber,
      escrows: amounts.filter((a) => a.type === 'escrow').length,
      totalSupplies: amounts.filter((a) => a.type === 'totalSupply').length,
    })

    const nonZeroAmounts = amounts.filter((a) => a.amount > 0)
    await this.$.amountRepository.addMany(nonZeroAmounts)

    this.logger.info('Saved amounts for timestamp into DB', {
      timestamp: timestamp.toNumber(),
      escrows: nonZeroAmounts.filter((a) => a.type === 'escrow').length,
      totalSupplies: nonZeroAmounts.filter((a) => a.type === 'totalSupply')
        .length,
    })

    return timestamp.toNumber()
  }

  private getConfigurationsToSync(
    configurations: UpdateConfiguration<ChainAmountConfig>[],
    timestamp: UnixTime,
    blockNumber: number | undefined,
  ) {
    const configurationsWithMissingData = configurations.filter(
      (c) => !c.hasData,
    )

    if (configurationsWithMissingData.length !== configurations.length) {
      this.logger.info('Filtered out configurations with missing data', {
        timestamp: timestamp.toNumber(),
        blockNumber,
        skippedConfigurations:
          configurations.length - configurationsWithMissingData.length,
        configurationsToSync: configurationsWithMissingData.length,
      })
    }
    return configurationsWithMissingData
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
