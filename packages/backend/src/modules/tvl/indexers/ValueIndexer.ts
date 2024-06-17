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
import { getValuesConfigHash } from '../utils/getValuesConfigHash'

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
  minHeight: number
  maxHeight: number
}

export class ValueIndexer extends ManagedChildIndexer {
  // Maps used for performance optimization
  private readonly amountConfigs: Map<AmountId, AmountConfigEntry>
  private readonly priceConfigIds: Map<AssetId, PriceId>

  constructor(private readonly $: ValueIndexerDeps) {
    const logger = $.logger.tag($.tag)
    const name = 'value_indexer'
    const configHash = getValuesConfigHash($.amountConfigs, $.priceConfigs)

    super({ ...$, name, logger, configHash })

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

    if (this.$.maxHeight < from) {
      this.logger.info('Skipping update due to maxHeight', {
        from,
        to,
        maxHeight: this.$.maxHeight,
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

    const values = await this.$.valueService.calculateTvlForTimestamps(
      this.$.project,
      this.$.dataSource,
      this.amountConfigs,
      this.priceConfigIds,
      timestamps,
    )

    await this.$.valueRepository.addOrUpdateMany(values)

    this.logger.info('Saved values into DB', {
      from,
      to,
      timestamps: timestamps.length,
      values: values.length,
    })

    return timestamps[timestamps.length - 1].toNumber()
  }

  private getTimestampsToSync(from: number, to: number) {
    const start = Math.max(from, this.$.minHeight)
    const end = Math.min(to, this.$.maxHeight)

    return this.$.syncOptimizer.getTimestampsToSync(
      start,
      end,
      this.$.maxTimestampsToProcessAtOnce,
    )
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
