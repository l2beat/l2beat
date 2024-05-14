import { assert } from '@l2beat/backend-tools'

import {
  AmountConfigEntry,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { calculateValue } from '../utils/calculateValue'

interface Values {
  canonical: bigint
  canonicalForTotal: bigint
  external: bigint
  externalForTotal: bigint
  native: bigint
  nativeForTotal: bigint
}

type AssetId = string
type PriceId = string

export interface ValueServiceDependencies {
  priceRepository: PriceRepository
  amountRepository: AmountRepository
}

export class ValueService {
  constructor(private readonly $: ValueServiceDependencies) {}

  async getTvlAt(
    timestamp: UnixTime,
    configIds: string[],
    amountConfigs: (AmountConfigEntry & { configId: string })[],
    priceConfigIds: Map<AssetId, PriceId>,
  ): Promise<Values> {
    const records = await this.$.amountRepository.getByConfigIdsAndTimestamp(
      configIds,
      timestamp,
    )

    const prices = await this.$.priceRepository.getByTimestamp(timestamp)

    const results = {
      canonical: 0n,
      canonicalForTotal: 0n,
      external: 0n,
      externalForTotal: 0n,
      native: 0n,
      nativeForTotal: 0n,
    }

    for (const amountRecord of records) {
      const amountConfig = amountConfigs.find(
        (x) => x.configId === amountRecord.configId,
      )
      assert(amountConfig, 'Config not found')

      const priceId = priceConfigIds.get(createAssetId(amountConfig))
      const price = prices.find((x) => x.configId === priceId)
      assert(price, 'Price not found')

      const value = calculateValue({
        amount: amountRecord.amount,
        priceUsd: price.priceUsd,
        decimals: amountConfig.decimals,
      })

      results[amountConfig.source] += value

      if (amountConfig.includeInTotal) {
        const forTotalKey = `${amountConfig.source}ForTotal` as const
        results[forTotalKey] += value
      }
    }

    return results
  }
}

function createAssetId(price: {
  address: EthereumAddress | 'native'
  chain: string
}): string {
  return `${price.chain}-${price.address.toString()}`
}
