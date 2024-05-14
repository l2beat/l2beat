import {
  AmountConfigEntry,
  EthereumAddress,
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
import { createAmountId } from '../utils/createAmountId'
import { createPriceId } from '../utils/createPriceId'

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

type AssetId = string
type PriceId = string

/**
 * Indexer that aggregates TVL for a project. Skips the configurations that are not included in the total.
 */
export class ValueIndexer extends ManagedChildIndexer {
  private readonly amountConfigs: Map<string, AmountConfigEntry>
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

    const timestamps: UnixTime[] = []

    let current = from > this.$.minHeight ? from : this.$.minHeight
    while (
      this.$.syncOptimizer.getTimestampToSync(current).toNumber() <= to &&
      timestamps.length < this.$.maxTimestampsToProcessAtOnce
    ) {
      timestamps.push(this.$.syncOptimizer.getTimestampToSync(current))
      current += 1
    }

    const values = await this.$.valueService.getTvlAt(
      this.$.project,
      this.$.dataSource,
      this.amountConfigs,
      this.priceConfigIds,
      timestamps,
    )

    await this.$.valueRepository.addOrUpdateMany(values)

    return timestamps[timestamps.length - 1].toNumber()
  }

  override async invalidate(targetHeight: number): Promise<number> {
    // Do not delete data
    return await Promise.resolve(targetHeight)
  }
}

function createAssetId(price: {
  address: EthereumAddress | 'native'
  chain: string
}): string {
  return `${price.chain}-${price.address.toString()}`
}

function getAmountConfigs(amounts: AmountConfigEntry[]) {
  const result = new Map<string, AmountConfigEntry>()
  for (const p of amounts) {
    result.set(createAmountId(p), p)
  }

  return result
}

function getPriceConfigIds(prices: PriceConfigEntry[]) {
  const result = new Map<string, string>()
  for (const p of prices) {
    result.set(createAssetId(p), createPriceId(p))
  }

  return result
}
