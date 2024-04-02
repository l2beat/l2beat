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

type AmountConfigEntry = TotalSupplyEntry | EscrowEntry

export class ChainIndexer extends MultiIndexer<AmountConfigEntry> {
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
    private readonly amountConfigurations: AmountConfigEntry[],
  ) {
    super(logger, [parentIndexer])
    this.indexerId = `chain_indexer_${chain}`
  }

  override async getInitialConfigurations() {
    const oldConfigurations =
      await this.amountRepository.getConfigurationsByIndexerId(this.indexerId)

    const toAdd: AmountConfigEntry[] = []

    for (const configuration of this.amountConfigurations) {
      const oldConfiguration = oldConfigurations.find(
        (c) =>
          c.chain === this.chain &&
          c.projectId === configuration.projectId &&
          c.type === configuration.type &&
          c.address === configuration.address &&
          (c.type === 'escrow' && configuration.type === 'escrow'
            ? c.escrowAddress === configuration.escrowAddress
            : true),
      )

      if (!oldConfiguration) {
        toAdd.push(configuration)
      }
    }

    await this.amountRepository.addManyConfigurations(
      toAdd.map((c) => ({
        ...c,
        indexerId: this.indexerId,
      })),
    )

    const configurations =
      await this.amountRepository.getConfigurationsByIndexerId(this.indexerId)

    return configurations.map((c) => {
      switch (c.type) {
        case 'totalSupply':
          assert(c.address !== 'native', 'Native total supply is not supported')
          return {
            id: c.id.toString(),
            properties: {
              chain: c.chain,
              projectId: c.projectId,
              origin: c.origin,
              type: c.type,
              sinceTimestampInclusive: c.sinceTimestampInclusive,
              untilTimestampInclusive: c.untilTimestampInclusive,
              includeInTotal: c.includeInTotal,
              address: c.address,
            },
            minHeight: c.sinceTimestampInclusive.toNumber(),
            maxHeight: c.untilTimestampInclusive?.toNumber() ?? null,
          }
        case 'escrow':
          assert(c.escrowAddress, 'Escrow address should be defined')
          return {
            id: c.id.toString(),
            properties: {
              chain: c.chain,
              projectId: c.projectId,
              origin: c.origin,
              type: c.type,
              sinceTimestampInclusive: c.sinceTimestampInclusive,
              untilTimestampInclusive: c.untilTimestampInclusive,
              includeInTotal: c.includeInTotal,
              address: c.address,
              escrowAddress: c.escrowAddress,
            },
            minHeight: c.sinceTimestampInclusive.toNumber(),
            maxHeight: c.untilTimestampInclusive?.toNumber() ?? null,
          }
        case 'circulatingSupply':
          throw new Error(
            'Programmer error: There should not be circulating supply configurations for this type of indexer',
          )
      }
    })
  }

  override async start(): Promise<void> {
    this.logger.debug('Starting...')
    await super.start()
    this.logger.debug('Started')
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: UpdateConfiguration<AmountConfigEntry>[],
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

  override async multiInitialize(): Promise<
    SavedConfiguration<AmountConfigEntry>[]
  > {
    this.logger.debug('Initializing...')

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
      return safeHeight
    }

    // We prevent updating the minimum timestamp of the indexer.
    // This functionality can be added in the future if needed.
    assert(
      indexerState.minTimestamp &&
        this.minTimestamp.equals(indexerState.minTimestamp),
      'Minimum timestamp of this indexer cannot be updated',
    )

    this.logger.debug('Initialized')

    return indexerState.safeHeight
  }

  override async removeData(
    configurations: RemovalConfiguration<AmountConfigEntry>[],
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
    configurations: SavedConfiguration<AmountConfigEntry>[],
  ): Promise<void> {
    this.logger.debug('Saving configurations...')

    // TODO: ensure that no other configurations are persisted

    const records: AmountConfigurationRecord[] = configurations.map((c) => ({
      ...c.properties,
      id: +c.id,
      indexerId: this.indexerId,
      sinceTimestampInclusive: new UnixTime(c.minHeight),
      untilTimestampInclusive: c.maxHeight
        ? new UnixTime(c.maxHeight)
        : undefined,
    }))

    await this.amountRepository.addManyConfigurations(records)

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
