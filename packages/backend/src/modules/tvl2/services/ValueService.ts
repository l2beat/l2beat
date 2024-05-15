import { assert } from '@l2beat/backend-tools'

import { AmountConfigEntry, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { ValueRecord } from '../repositories/ValueRepository'
import { calculateValue } from '../utils/calculateValue'
import { AmountId } from '../utils/createAmountId'
import { AssetId, createAssetId } from '../utils/createAssetId'
import { PriceId } from '../utils/createPriceId'

interface Values {
  canonical: bigint
  canonicalForTotal: bigint
  external: bigint
  externalForTotal: bigint
  native: bigint
  nativeForTotal: bigint
}

export interface ValueServiceDependencies {
  priceRepository: PriceRepository
  amountRepository: AmountRepository
}

export class ValueService {
  constructor(private readonly $: ValueServiceDependencies) {}

  async calculateTvlForTimestamps(
    project: ProjectId,
    source: string,
    amountConfigs: Map<AmountId, AmountConfigEntry>,
    priceConfigIds: Map<AssetId, PriceId>,
    timestamps: UnixTime[],
  ): Promise<ValueRecord[]> {
    const amounts = await this.$.amountRepository.getByConfigIdsInRange(
      Array.from(amountConfigs.keys()),
      timestamps[0],
      timestamps[timestamps.length - 1],
    )

    const prices = await this.$.priceRepository.getByConfigIdsInRange(
      Array.from(priceConfigIds.values()),
      timestamps[0],
      timestamps[timestamps.length - 1],
    )

    const results = new Map<number, Values>()

    for (const timestamp of timestamps) {
      results.set(timestamp.toNumber(), {
        canonical: 0n,
        canonicalForTotal: 0n,
        external: 0n,
        externalForTotal: 0n,
        native: 0n,
        nativeForTotal: 0n,
      })
    }

    for (const amount of amounts) {
      const amountConfig = amountConfigs.get(amount.configId)
      assert(amountConfig, 'Config not found')

      const priceId = priceConfigIds.get(createAssetId(amountConfig))
      const price = prices.find((x) => x.configId === priceId)
      assert(price, 'Price not found')

      const value = calculateValue({
        amount: amount.amount,
        priceUsd: price.priceUsd,
        decimals: amountConfig.decimals,
      })

      const result = results.get(amount.timestamp.toNumber())
      assert(result, 'Programmer error: result should be defined')
      result[amountConfig.source] += value

      if (amountConfig.includeInTotal) {
        const forTotalKey = `${amountConfig.source}ForTotal` as const
        result[forTotalKey] += value
      }
    }

    return Array.from(results.entries()).map(([timestamp, value]) => ({
      projectId: project,
      timestamp: new UnixTime(timestamp),
      dataSource: source,
      native: value.native,
      nativeForTotal: value.nativeForTotal,
      canonical: value.canonical,
      canonicalForTotal: value.canonicalForTotal,
      external: value.external,
      externalForTotal: value.externalForTotal,
    }))
  }
}
