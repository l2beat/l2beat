import { assert, Logger } from '@l2beat/backend-tools'
import {
  EscrowEntry,
  json,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  Configuration,
  RemovalConfiguration,
  UpdateConfiguration,
} from '@l2beat/uif'

import { IndexerService } from '../../tools/uif/IndexerService'
import { MangedMultiIndexer } from '../../tools/uif/ManagedMultiIndexer'
import { BlockTimestampIndexer } from './BlockTimestampIndexer'
import { AmountService } from './AmountService'
import { AmountRepository } from './repositories/AmountRepository'
import { BlockTimestampRepository } from './repositories/BlockTimestampRepository'
import { SyncOptimizer } from './SyncOptimizer'

type AmountConfiguration = TotalSupplyEntry | EscrowEntry

export class AmountIndexer extends MangedMultiIndexer<
  AmountConfiguration,
  json
> {
  constructor(
    logger: Logger,
    parents: [BlockTimestampIndexer],
    private readonly amountProvider: AmountService,
    private readonly amountRepository: AmountRepository,
    private readonly blockTimestampRepository: BlockTimestampRepository,
    private readonly chain: string,
    private readonly syncOptimizer: SyncOptimizer,
    indexerService: IndexerService,
    configurations: Configuration<AmountConfiguration>[],
  ) {
    super({
      logger,
      parents,
      id: `chain_indexer_${chain}`,
      configurations,
      encode,
      decode,
      indexerService,
    })
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: UpdateConfiguration<AmountConfiguration>[],
  ): Promise<number> {
    this.logger.debug('Updating...')

    const timestamp = this.syncOptimizer.getTimestampToSync(new UnixTime(from))

    if (timestamp.gt(new UnixTime(to))) {
      return to
    }

    const block = await this.blockTimestampRepository.findByTimestamp(
      this.chain,
      timestamp,
    )
    assert(block, 'Programmer error: Block should be defined')

    const amounts = await this.amountProvider.fetchAmounts(
      configurations,
      timestamp,
      block.blockNumber,
    )

    await this.amountRepository.addMany(amounts)

    this.logger.debug('Updated')
    return timestamp.toNumber()
  }

  override async removeData(
    configurations: RemovalConfiguration<AmountConfiguration>[],
  ): Promise<void> {
    for (const configuration of configurations) {
      await this.amountRepository.deleteInRangeByConfigurationId(
        +configuration.id,
        new UnixTime(configuration.from),
        new UnixTime(configuration.to),
      )
    }
  }
}

function encode(value: AmountConfiguration): json {
  throw new Error('Not implemented')
}

function decode(json: json): AmountConfiguration {
  throw new Error('Not implemented')
}
