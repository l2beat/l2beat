import { assert } from '@l2beat/backend-tools'
import { EscrowEntry, TotalSupplyEntry, UnixTime } from '@l2beat/shared-pure'

import {
  ManagedMultiIndexer,
  ManagedMultiIndexerOptions,
} from '../../tools/uif/multi/ManagedMultiIndexer'
import {
  RemovalConfiguration,
  UpdateConfiguration,
} from '../../tools/uif/multi/types'
import { AmountService } from './AmountService'
import { AmountRepository } from './repositories/AmountRepository'
import { BlockTimestampRepository } from './repositories/BlockTimestampRepository'
import { SyncOptimizer } from './SyncOptimizer'

type AmountType = EscrowEntry | TotalSupplyEntry

export interface ChainAmountIndexerDeps
  extends ManagedMultiIndexerOptions<AmountType> {
  amountService: AmountService
  amountRepository: AmountRepository
  blockTimestampsRepository: BlockTimestampRepository
  syncOptimizer: SyncOptimizer
  chain: string
}

export class ChainAmountIndexer extends ManagedMultiIndexer<AmountType> {
  indexerId: string
  constructor(private readonly $: ChainAmountIndexerDeps) {
    super($)
    this.indexerId = $.id
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: UpdateConfiguration<AmountType>[],
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

    const nonZeroAmounts = amounts.filter((a) => a.amount > 0)
    try {
      await this.$.amountRepository.addMany(nonZeroAmounts)
    } catch (error) {
      this.$.logger.error('Error while adding amounts', error)
    }

    return timestamp.toNumber()
  }

  override async removeData(
    configurations: RemovalConfiguration<AmountType>[],
  ): Promise<void> {
    for (const configuration of configurations) {
      await this.$.amountRepository.deleteByConfigInTimeRange(
        configuration.id,
        new UnixTime(configuration.from),
        new UnixTime(configuration.to),
      )
    }
  }
}
