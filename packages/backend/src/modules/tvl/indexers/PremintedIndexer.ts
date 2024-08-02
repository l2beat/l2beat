import { assert } from '@l2beat/backend-tools'
import { AmountRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { ManagedChildIndexer } from '../../../tools/uif/ManagedChildIndexer'
import { DEFAULT_RETRY_FOR_TVL } from '../../../tools/uif/defaultRetryForTvl'
import { createAmountId } from '../utils/createAmountId'
import { PremintedIndexerDeps } from './types'

export class PremintedIndexer extends ManagedChildIndexer {
  private readonly configurationId: string

  constructor(private readonly $: PremintedIndexerDeps) {
    super({
      ...$,
      name: 'preminted_indexer',
      tag: `${$.configuration.chain}_${$.configuration.address}`,
      updateRetryStrategy: DEFAULT_RETRY_FOR_TVL,
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

    const escrowAmount = await this.getEscrowAmount(timestamp)

    const circulatingSupply = await this.getCirculatingSupply(timestamp)

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

  async getEscrowAmount(timestamp: UnixTime): Promise<AmountRecord> {
    const blockNumber = await this.getBlockNumber(timestamp)

    const configurations = this.$.configuration.escrows.map((escrow) => ({
      ...this.$.configuration,
      type: 'escrow' as const,
      address: this.$.configuration.address,
      escrowAddress: escrow,
      id: this.configurationId,
    }))

    const escrowAmounts = await this.$.amountService.fetchAmounts(
      timestamp,
      blockNumber,
      configurations,
    )

    this.logger.info('Fetched escrows amounts', {
      timestamp: timestamp.toNumber(),
      blockNumber,
      amounts: escrowAmounts.length,
    })

    return {
      timestamp,
      amount: escrowAmounts.reduce((agg, curr) => agg + curr.amount, 0n),
      configId: this.configurationId,
    }
  }

  async getCirculatingSupply(timestamp: UnixTime): Promise<AmountRecord> {
    const configuration = {
      ...this.$.configuration,
      type: 'circulatingSupply' as const,
      address: this.$.configuration.address,
      coingeckoId: this.$.configuration.coingeckoId,
      id: this.configurationId,
    }

    const amounts =
      await this.$.circulatingSupplyService.fetchCirculatingSupplies(
        timestamp,
        timestamp,
        configuration,
      )

    assert(
      amounts.length === 1,
      `One amount should be fetched ${this.$.configuration.coingeckoId}`,
    )

    this.logger.info('Fetched circulating supply', {
      timestamp: timestamp.toNumber(),
    })

    return amounts[0]
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
