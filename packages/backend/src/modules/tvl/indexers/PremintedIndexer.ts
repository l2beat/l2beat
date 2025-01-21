import {
  INDEXER_NAMES,
  createAmountId,
  createIndexerTag,
} from '@l2beat/backend-shared'
import type { AmountRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedChildIndexer } from '../../../tools/uif/ManagedChildIndexer'
import type { PremintedIndexerDeps } from './types'

export class PremintedIndexer extends ManagedChildIndexer {
  private readonly configurationId: string

  constructor(private readonly $: PremintedIndexerDeps) {
    super({
      ...$,
      name: INDEXER_NAMES.PREMINTED,
      tags: {
        tag: createIndexerTag($.configuration.chain, $.configuration.address),
        chain: $.configuration.chain,
      },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      configHash: $.minHeight.toString(),
    })
    this.configurationId = createAmountId($.configuration)
  }

  async update(from: number, to: number): Promise<number> {
    const timestamp = this.$.syncOptimizer.getTimestampToSync(from)
    if (timestamp.toNumber() > to) {
      this.logger.info('Skipping update due to sync optimization', {
        from,
        to,
        timestamp: timestamp.toNumber(),
      })
      return to
    }

    if (this.$.minHeight > to) {
      this.logger.info('Skipping update due to minHeight', {
        from,
        to,
        timestamp: timestamp.toNumber(),
      })
      return to
    }

    const circulatingSupply = await this.getCirculatingSupply(timestamp)

    const escrowAmount = await this.getEscrowAmount(timestamp)

    if (escrowAmount.amount < circulatingSupply.amount) {
      await this.$.db.amount.insertMany([escrowAmount])
      this.logger.info(`Saved escrow amount into DB`, {
        timestamp: timestamp.toNumber(),
      })
    } else {
      await this.$.db.amount.insertMany([circulatingSupply])
      this.logger.info(`Saved circulating supply into DB`, {
        timestamp: timestamp.toNumber(),
      })
    }

    return timestamp.toNumber()
  }

  private async getCirculatingSupply(
    timestamp: UnixTime,
  ): Promise<AmountRecord> {
    const configuration = {
      ...this.$.configuration,
      type: 'circulatingSupply' as const,
      address: this.$.configuration.address,
      coingeckoId: this.$.configuration.coingeckoId,
      id: this.configurationId,
    }

    const circulatingSupplyAmounts =
      await this.$.circulatingSupplyService.fetchCirculatingSupplies(
        timestamp,
        timestamp,
        configuration,
      )

    assert(
      circulatingSupplyAmounts.length === 1,
      `One amount should be fetched ${this.$.configuration.coingeckoId}`,
    )

    this.logger.info('Fetched circulating supply', {
      timestamp: timestamp.toNumber(),
    })

    return circulatingSupplyAmounts[0]
  }

  private async getEscrowAmount(timestamp: UnixTime): Promise<AmountRecord> {
    const blockNumber = await this.getBlockNumber(timestamp)

    const configuration = {
      ...this.$.configuration,
      type: 'escrow' as const,
      address: this.$.configuration.address,
      id: this.configurationId,
    }

    const escrowAmounts = await this.$.amountService.fetchAmounts(
      timestamp,
      blockNumber,
      [configuration],
    )

    assert(
      escrowAmounts.length === 1,
      `One amount should be fetched ${this.$.configuration.address}`,
    )

    this.logger.info('Fetched escrow amount', {
      timestamp: timestamp.toNumber(),
      blockNumber,
    })

    return escrowAmounts[0]
  }

  private async getBlockNumber(timestamp: UnixTime) {
    const blockNumber =
      await this.$.db.blockTimestamp.findBlockNumberByChainAndTimestamp(
        this.$.configuration.chain,
        timestamp,
      )
    assert(
      blockNumber,
      `Block number not found for timestamp: ${timestamp.toNumber()}`,
    )
    return blockNumber
  }

  override async invalidate(targetHeight: number): Promise<number> {
    const deletedRecords = await this.$.db.amount.deleteByConfigAfter(
      this.configurationId,
      new UnixTime(targetHeight),
    )

    if (deletedRecords > 0) {
      this.logger.info('Deleted records', {
        targetHeight,
        deletedRecords,
      })
    }

    return targetHeight
  }
}
