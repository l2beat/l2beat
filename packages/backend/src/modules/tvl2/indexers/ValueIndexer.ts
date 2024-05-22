import {
  AmountConfigEntry,
  CoingeckoPriceConfigEntry,
  PriceConfigEntry,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { createHash } from 'crypto'
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
import { createValueId } from '../utils/createValueId'
import { assert } from '@l2beat/backend-tools'

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
  private readonly minHeight: number
  private readonly maxHeight: number

  constructor(private readonly $: ValueIndexerDeps) {
    const logger = $.logger.tag($.tag)
    const name = 'value_indexer'
    const configHash = getValuesConfigHash($.amountConfigs, $.priceConfigs)
    super({ ...$, name, logger, configHash })

    this.amountConfigs = getAmountConfigs($.amountConfigs)
    this.priceConfigIds = getPriceConfigIds($.priceConfigs)
    this.minHeight = Math.min(
      $.minHeight,
      ...$.amountConfigs.map((c) => c.sinceTimestamp.toNumber()),
    )
    this.maxHeight = Math.max(
      ...$.amountConfigs.map((c) => c.untilTimestamp?.toNumber() ?? Infinity),
    )
  }

  override async update(from: number, to: number): Promise<number> {
    if (this.minHeight > to) {
      this.logger.info('Skipping update due to minHeight', {
        from,
        to,
        minHeight: this.minHeight,
      })
      return to
    }

    if (this.maxHeight < from) {
      this.logger.info('Skipping update due to maxHeight', {
        from,
        to,
        maxHeight: this.maxHeight,
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

    return timestamps[timestamps.length - 1].toNumber()
  }

  private getTimestampsToSync(from: number, to: number) {
    const timestamps: UnixTime[] = []

    let current = Math.max(from, this.minHeight)
    const last = Math.min(to, this.maxHeight)
    while (
      this.$.syncOptimizer.getTimestampToSync(current).toNumber() <= last &&
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

function getValuesConfigHash(
  amountConfigs: AmountConfigEntry[],
  priceConfigs: CoingeckoPriceConfigEntry[],
): string {
  const input = []

  for (const amount of amountConfigs) {
    const price = priceConfigs.find(
      (p) => p.address === amount.address && p.chain === amount.chain,
    )
    assert(price, `Price config not found for ${createAmountId(amount)}`)
    const valueId = createValueId(amount, price)
    input.push(valueId)
  }

  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
