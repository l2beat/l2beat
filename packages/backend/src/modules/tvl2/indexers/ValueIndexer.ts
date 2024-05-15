import {
  AmountConfigEntry,
  PriceConfigEntry,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import {
  ManagedChildIndexer,
  ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { ValueRepository } from '../repositories/ValueRepository'
import { ValueService } from '../services/ValueService'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { AmountId, createAmountId } from '../utils/createAmountId'
import { AssetId, createAssetId } from '../utils/createAssetId'
import { PriceId, createPriceId } from '../utils/createPriceId'

export interface ValueIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  valueService: ValueService
  valueRepository: ValueRepository
  priceConfigs: PriceConfigEntry[]
  amountConfigs: AmountConfigEntry[]
  project: ProjectId
  dataSource: string
  syncOptimizer: SyncOptimizer
  maxTimestampsToProcessAtOnce: number
}

export class ValueIndexer extends ManagedChildIndexer {
  private readonly amountConfigs: Map<AmountId, AmountConfigEntry>
  private readonly priceConfigIds: Map<AssetId, PriceId>

  constructor(private readonly $: ValueIndexerDeps) {
    const logger = $.logger.tag($.tag)
    const name = 'value_indexer'
    super({ ...$, name, logger })

    this.amountConfigs = getAmountConfigs($.amountConfigs)
    this.priceConfigIds = getPriceConfigIds($.priceConfigs)
  }

  override async update(from: number, to: number): Promise<number> {
    if (this.$.minHeight > to) {
      this.logger.info('Skipping update due to minHeight', {
        from,
        to,
        minHeight: this.$.minHeight,
      })
      return to
    }

    const timestamps: UnixTime[] = this.getTimestampsToSync(from, to)

    if (timestamps.length === 0) {
      this.logger.info('Skipping update due to sync optimization', {
        from,
        to,
      })
      return to
    }

    const isAnythingToCalculate = Array.from(this.amountConfigs.values()).some(
      (config) => config.sinceTimestamp.toNumber() <= timestamps[0].toNumber(),
    )

    if (!isAnythingToCalculate) {
      this.logger.info('Skipping update due to no configs in range', {
        from,
        to,
      })
      return to
    }

    const values = await this.$.valueService.calculateTvlForTimestamps(
      this.$.project,
      this.$.dataSource,
      this.amountConfigs,
      this.priceConfigIds,
      timestamps,
    )

    await this.$.valueRepository.addOrUpdateMany(values)

    return timestamps[timestamps.length - 1].toNumber()
  }

  private getTimestampsToSync(from: number, to: number) {
    const timestamps: UnixTime[] = []

    let current = Math.max(from, this.$.minHeight)
    while (
      this.$.syncOptimizer.getTimestampToSync(current).toNumber() <= to &&
      timestamps.length < this.$.maxTimestampsToProcessAtOnce
    ) {
      const newTimestamp = this.$.syncOptimizer.getTimestampToSync(current)
      timestamps.push(newTimestamp)
      current = newTimestamp.toNumber() + 1
    }
    return timestamps
  }

  override async invalidate(targetHeight: number): Promise<number> {
    // Do not delete data
    return await Promise.resolve(targetHeight)
  }
}

function getAmountConfigs(amounts: AmountConfigEntry[]) {
  const result = new Map<AmountId, AmountConfigEntry>()
  for (const p of amounts) {
    result.set(createAmountId(p), p)
  }

  return result
}

function getPriceConfigIds(prices: PriceConfigEntry[]) {
  const result = new Map<AssetId, string>()
  for (const p of prices) {
    result.set(createAssetId(p), createPriceId(p))
  }

  return result
}
