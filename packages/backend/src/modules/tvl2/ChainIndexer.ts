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
import { SyncOptimizer } from './SyncOptimizer'

type AmountType = EscrowEntry | TotalSupplyEntry

export interface ChainIndexerDependencies
  extends ManagedMultiIndexerOptions<AmountType> {
  amountService: AmountService
  amountRepository: AmountRepository
  syncOptimizer: SyncOptimizer
}

export class ChainIndexer extends ManagedMultiIndexer<AmountType> {
  constructor(private readonly $: ChainIndexerDependencies) {
    super($)
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
    const amounts = await this.$.amountService.fetchAmounts(
      configurationsWithMissingData,
      to,
      timestamp,
    )

    const nonZeroAmounts = amounts.filter((a) => a.amount > 0)
    await this.$.amountRepository.addMany(nonZeroAmounts)

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
