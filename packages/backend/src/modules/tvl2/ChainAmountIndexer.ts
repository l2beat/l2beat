import { assert, Logger } from '@l2beat/backend-tools'
import { EscrowEntry, TotalSupplyEntry, UnixTime } from '@l2beat/shared-pure'
import {
  MultiIndexer,
  RemovalConfiguration,
  SavedConfiguration,
  UpdateConfiguration,
} from '@l2beat/uif'

import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { BlockTimestampIndexer } from './BlockTimestampIndexer'
import { ChainAmountService } from './ChainAmountService'
import {
  AmountConfigurationRecord,
  AmountRepository,
} from './repositories/AmountRepository'
import { BlockTimestampRepository } from './repositories/BlockTimestampRepository'
import { SyncOptimizer } from './SyncOptimizer'

export class ChainAmountIndexer extends MultiIndexer<AmountConfigurationRecord> {
  indexerId: string

  constructor(
    logger: Logger,
    parentIndexer: BlockTimestampIndexer,
    private readonly amountProvider: ChainAmountService,
    private readonly stateRepository: IndexerStateRepository,
    private readonly amountRepository: AmountRepository,
    private readonly blockTimestampRepository: BlockTimestampRepository,
    private readonly chain: string,
    private readonly minTimestamp: UnixTime,
    private readonly syncOptimizer: SyncOptimizer,
    private readonly amountConfigurations: (TotalSupplyEntry | EscrowEntry)[],
  ) {
    super(logger, [parentIndexer])
    this.indexerId = `chain_indexer_${chain}`
  }

  override async getInitialConfigurations() {
    const previouslySaved =
      await this.amountRepository.getConfigurationsByIndexerId(this.indexerId)

    const toAdd = []

    for (const configuration of this.amountConfigurations) {
      const oldConfiguration = previouslySaved.find(
        (c) =>
          c.properties.chain === this.chain &&
          c.properties.projectId === configuration.projectId &&
          c.properties.type === configuration.type &&
          c.properties.address === configuration.address &&
          (c.properties.type === 'escrow' && configuration.type === 'escrow'
            ? c.properties.escrowAddress === configuration.escrowAddress
            : true),
      )

      if (!oldConfiguration) {
        toAdd.push(configuration)
      }
    }

    await this.amountRepository.addOrUpdateMany(
      toAdd.map((c) => ({
        ...c,
        indexerId: this.indexerId,
      })),
    )

    return this.amountRepository.getConfigurationsByIndexerId(this.indexerId)
  }

  override async start(): Promise<void> {
    this.logger.debug('Starting...')
    await super.start()
    this.logger.debug('Started')
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: UpdateConfiguration<AmountConfigurationRecord>[],
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

  override async multiInitialize() {
    this.logger.debug('Initializing...')

    const previouslySavedConfigurations =
      await this.amountRepository.getConfigurationsByIndexerId(this.indexerId)

    const indexerState = await this.stateRepository.findIndexerState(
      this.indexerId,
    )

    if (indexerState === undefined) {
      const safeHeight = this.minTimestamp.toNumber() - 1
      await this.stateRepository.add({
        indexerId: this.indexerId,
        safeHeight,
        minTimestamp: this.minTimestamp,
      })
      return previouslySavedConfigurations
    }

    // We prevent updating the minimum timestamp of the indexer.
    // This functionality can be added in the future if needed.
    assert(
      indexerState.minTimestamp &&
        this.minTimestamp.equals(indexerState.minTimestamp),
      'Minimum timestamp of this indexer cannot be updated',
    )

    this.logger.debug('Initialized')

    return previouslySavedConfigurations
  }

  override async removeData(
    configurations: RemovalConfiguration<AmountConfigurationRecord>[],
  ): Promise<void> {
    this.logger.debug('Removing data...')

    for (const configuration of configurations) {
      await this.amountRepository.deleteInRangeByConfigurationId(
        +configuration.id,
        new UnixTime(configuration.from),
        new UnixTime(configuration.to),
      )
    }

    this.logger.debug('Data removed')
  }

  override async saveConfigurations(
    configurations: SavedConfiguration<AmountConfigurationRecord>[],
  ): Promise<void> {
    this.logger.debug('Saving configurations...')

    const records: AmountConfigurationRecord[] = configurations.map((c) => ({
      ...c.properties,
      id: +c.id,
      indexerId: this.indexerId,
      sinceTimestampInclusive: new UnixTime(c.minHeight),
      untilTimestampInclusive: c.maxHeight
        ? new UnixTime(c.maxHeight)
        : undefined,
    }))

    await this.amountRepository.addOrUpdateMany(records)

    await this.amountRepository.deleteConfigurationsNotInList(
      this.indexerId,
      records.map((r) => r.id),
    )

    this.logger.debug('Configurations saved')
  }

  override async invalidate(targetHeight: number): Promise<number> {
    this.logger.debug('Invalidating...')

    await this.amountRepository.deleteAfterExclusiveByIndexerId(
      this.indexerId,
      new UnixTime(targetHeight),
    )

    this.logger.debug('Invalidated')

    return Promise.resolve(targetHeight)
  }
}
