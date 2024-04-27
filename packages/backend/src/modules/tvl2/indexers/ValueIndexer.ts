import {
  AmountConfigEntry,
  assert,
  EthereumAddress,
  PriceConfigEntry,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import {
  ManagedChildIndexer,
  ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { ValueRepository } from '../repositories/ValueRepository'
import { createAmountId } from '../utils/createAmountId'
import { createPriceId } from '../utils/createPriceId'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export interface ValueIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  priceRepo: PriceRepository
  amountRepo: AmountRepository
  valueRepo: ValueRepository
  priceConfigs: PriceConfigEntry[]
  amountConfigs: AmountConfigEntry[]
  project: ProjectId
  dataSource: string
  syncOptimizer: SyncOptimizer
}

interface Values {
  canonical: number
  external: number
  native: number
}

type AssetId = string
type PriceId = string

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

    // calculate configHash
  }

  override async update(from: number, to: number): Promise<number> {
    // Potential future optimization
    // check if db.configHash === this.configHash
    // YES - skip update
    // NO - continue update

    const timestamp = this.$.syncOptimizer.getTimestampToSync(
      new UnixTime(from),
    )
    if (timestamp.toNumber() > to) {
      return to
    }

    const value = await this.getTvlAt(timestamp)
    await this.$.valueRepo.add({
      projectId: this.$.project,
      timestamp,
      ...value,
    })

    return timestamp.toNumber()
  }

  async getTvlAt(timestamp: UnixTime): Promise<Values> {
    const configIds = this.amountConfigs.map((x) => x.configId)
    const records = await this.$.amountRepo.getByConfigIdsAndTimestamp(
      configIds,
      timestamp,
    )

    const prices = await this.$.priceRepo.getByTimestamp(timestamp)

    const results = {
      canonical: 0,
      external: 0,
      native: 0,
    }

    for (const record of records) {
      const amountConfig = this.amountConfigs.find(
        (x) => x.configId === record.configId,
      )
      assert(amountConfig, 'Config not found')

      const priceId = this.priceConfigIds.get(createAssetId(amountConfig))
      const price = prices.find((x) => x.configId === priceId)
      assert(price, 'Price not found')
      const value = calculateValue({
        amount: record.amount,
        priceUsd: price.priceUsd,
        decimals: amountConfig.decimals,
      })

      results[amountConfig.source] += value
    }
    return results
  }

  override async invalidate(targetHeight: number): Promise<number> {
    // Do not delete data
    return Promise.resolve(targetHeight)
  }
}

const USD_DECIMALS = 2
function calculateValue({
  amount,
  priceUsd,
  decimals,
}: {
  amount: bigint
  priceUsd: number
  decimals: number
}) {
  const value = (Number(amount) * priceUsd) / 10 ** decimals

  // we want to expose the balance as an integer, keeping the USD decimal places
  // not sure it it's necessary to calculate cents when we calculate billions
  return Math.floor(value * 10 ** USD_DECIMALS)
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
