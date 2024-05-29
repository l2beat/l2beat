import { assert } from '@l2beat/backend-tools'
import { AmountConfigEntry, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
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
    assert(timestamps.length > 0, 'Timestamps should not be empty')
    assert(amountConfigs.size > 0, 'Configs should not be empty')
    assert(priceConfigIds.size > 0, 'Price configs should not be empty')

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

    const amountsByTimestamp = groupBy(
      amounts.map((x) => ({ ...x, timestamp: x.timestamp.toNumber() })),
      'timestamp',
    )
    const pricesByTimestamp = groupBy(
      prices.map((x) => ({ ...x, timestamp: x.timestamp.toNumber() })),
      'timestamp',
    )

    const results = new Map<number, Values>()

    for (const timestamp of timestamps.map((t) => t.toNumber())) {
      const result = createEmptyResult()

      const amountsAtTimestamp = amountsByTimestamp[timestamp]
      // It is possible that there are no amounts, we do not store zero values
      if (!amountsAtTimestamp) {
        results.set(timestamp, result)
        continue
      }

      const pricesAtTimestamp = pricesByTimestamp[timestamp]

      for (const amount of amountsAtTimestamp) {
        const amountConfig = amountConfigs.get(amount.configId)
        assert(amountConfig, 'Config not found')

        const priceId = priceConfigIds.get(createAssetId(amountConfig))
        const price = pricesAtTimestamp.find((x) => x.configId === priceId)
        assert(price, 'Price not found')

        const value = calculateValue({
          amount: amount.amount,
          priceUsd: price.priceUsd,
          decimals: amountConfig.decimals,
        })

        result[amountConfig.source] += value

        if (amountConfig.includeInTotal) {
          const forTotalKey = `${amountConfig.source}ForTotal` as const
          result[forTotalKey] += value
        }
      }

      results.set(timestamp, result)
    }

    return toValueRecords(results, project, source)
  }
}

function createEmptyResult() {
  return {
    canonical: 0n,
    canonicalForTotal: 0n,
    external: 0n,
    externalForTotal: 0n,
    native: 0n,
    nativeForTotal: 0n,
  }
}

function toValueRecords(
  results: Map<number, Values>,
  project: ProjectId,
  source: string,
): ValueRecord[] | PromiseLike<ValueRecord[]> {
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
