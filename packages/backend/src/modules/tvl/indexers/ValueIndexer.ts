import {
  type AmountId,
  type PriceId,
  createAmountId,
  createPriceId,
} from '@l2beat/backend-shared'
import type {
  AmountConfigEntry,
  AssetId,
  PriceConfigEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { ManagedChildIndexer } from '../../../tools/uif/ManagedChildIndexer'
import { getValuesConfigHash } from '../utils/getValuesConfigHash'
import type { ValueIndexerDeps } from './types'

export class ValueIndexer extends ManagedChildIndexer {
  private readonly amountConfigs: Map<AmountId, AmountConfigEntry>
  private readonly priceConfigIds: Map<AssetId, PriceId>

  constructor(private readonly $: ValueIndexerDeps) {
    super({
      ...$,
      name: 'value_indexer',
      tags: {
        tag: `${$.project}_${$.dataSource}`,
        project: $.project,
      },
      configHash: getValuesConfigHash(
        $.amountConfigs,
        $.priceConfigs,
        $.minHeight,
      ),
    })

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

    if (this.$.maxHeight && this.$.maxHeight < from) {
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

    await this.$.db.value.upsertMany(values)

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
    const end = this.$.maxHeight ? Math.min(to, this.$.maxHeight) : to

    return this.$.syncOptimizer.getTimestampsToSync(
      start,
      end,
      this.$.maxTimestampsToProcessAtOnce,
    )
  }

  override async invalidate(targetHeight: number): Promise<number> {
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
    result.set(p.assetId, createPriceId(p))
  }

  return result
}
