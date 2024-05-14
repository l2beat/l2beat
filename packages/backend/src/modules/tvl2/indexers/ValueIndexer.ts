import {
  AmountConfigEntry,
  EthereumAddress,
  PriceConfigEntry,
  ProjectId,
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
}

type AssetId = string
type PriceId = string

/**
 * Indexer that aggregates TVL for a project. Skips the configurations that are not included in the total.
 */
export class ValueIndexer extends ManagedChildIndexer {
  private readonly amountConfigs: (AmountConfigEntry & { configId: string })[]
  private readonly priceConfigIds: Map<AssetId, PriceId>

  constructor(private readonly $: ValueIndexerDeps) {
    const logger = $.logger.tag($.tag)
    const name = 'value_indexer'
    super({ ...$, name, logger })

    this.amountConfigs = $.amountConfigs.map((x) => ({
      ...x,
      configId: createAmountId(x),
    }))
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

    const timestamp = this.$.syncOptimizer.getTimestampToSync(from)
    if (timestamp.toNumber() > to) {
      this.logger.info('Skipping update due to sync optimization', {
        from,
        to,
        optimizedTimestamp: timestamp.toNumber(),
      })
      return to
    }

    const configIds = this.amountConfigs.map((x) => x.configId)

    const value = await this.$.valueService.getTvlAt(
      timestamp,
      configIds,
      this.amountConfigs,
      this.priceConfigIds,
    )
    await this.$.valueRepository.addOrUpdate({
      projectId: this.$.project,
      timestamp,
      dataSource: this.$.dataSource,
      ...value,
    })

    return timestamp.toNumber()
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

function getPriceConfigIds(prices: PriceConfigEntry[]) {
  const result = new Map<string, string>()
  for (const p of prices) {
    result.set(createAssetId(p), createPriceId(p))
  }

  return result
}
