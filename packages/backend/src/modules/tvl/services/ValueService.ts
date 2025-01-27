import type { AmountId, PriceId } from '@l2beat/backend-shared'
import type { Database, ValueRecord } from '@l2beat/database'
import {
  assert,
  type AmountConfigEntry,
  type AssetId,
  type ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { calculateValue } from '../utils/calculateValue'

interface Values {
  canonical: bigint
  canonicalAssociated: bigint
  canonicalForTotal: bigint
  canonicalAssociatedForTotal: bigint
  external: bigint
  externalAssociated: bigint
  externalForTotal: bigint
  externalAssociatedForTotal: bigint
  native: bigint
  nativeAssociated: bigint
  nativeForTotal: bigint
  nativeAssociatedForTotal: bigint
  ether: bigint
  stablecoin: bigint
}

export class ValueService {
  constructor(private readonly db: Database) {}

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

    const amounts = await this.db.amount.getByConfigIdsInRange(
      Array.from(amountConfigs.keys()),
      timestamps[0],
      timestamps[timestamps.length - 1],
    )
    // If Indexer is not detecting sinceTimestamp change there is a possibility
    // that we have "dead" amount records, we need to filter them out
    const filteredAmounts = amounts.filter((x) => {
      const amountConfig = amountConfigs.get(x.configId)
      assert(amountConfig, 'Config not found')

      const until = amountConfig.untilTimestamp
        ? amountConfig.untilTimestamp.gt(x.timestamp)
        : true
      return amountConfig.sinceTimestamp.lte(x.timestamp) && until
    })
    const amountsByTimestamp = groupBy(
      filteredAmounts.map((x) => ({ ...x, timestamp: x.timestamp.toNumber() })),
      'timestamp',
    )

    const prices = await this.db.price.getByConfigIdsInRange(
      Array.from(priceConfigIds.values()),
      timestamps[0],
      timestamps[timestamps.length - 1],
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
        assert(amountConfig, `Config not found for ${amount.configId}`)

        const priceId = priceConfigIds.get(amountConfig.assetId)
        const price = pricesAtTimestamp.find((x) => x.configId === priceId)

        assert(price, `Price not found for ${priceId} at ${timestamp}`)

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

        if (amountConfig.isAssociated) {
          const key = `${amountConfig.source}Associated` as const
          result[key] += value
          if (amountConfig.includeInTotal) {
            const forTotalKey =
              `${amountConfig.source}AssociatedForTotal` as const
            result[forTotalKey] += value
          }
        }

        if (
          amountConfig.category === 'ether' ||
          amountConfig.category === 'stablecoin'
        ) {
          result[amountConfig.category] += value
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
    canonicalAssociated: 0n,
    canonicalForTotal: 0n,
    canonicalAssociatedForTotal: 0n,
    external: 0n,
    externalAssociated: 0n,
    externalForTotal: 0n,
    externalAssociatedForTotal: 0n,
    native: 0n,
    nativeAssociated: 0n,
    nativeForTotal: 0n,
    nativeAssociatedForTotal: 0n,
    ether: 0n,
    stablecoin: 0n,
  }
}

function toValueRecords(
  results: Map<number, Values>,
  project: ProjectId,
  source: string,
): ValueRecord[] | PromiseLike<ValueRecord[]> {
  return Array.from(results.entries()).map(
    ([timestamp, value]) =>
      ({
        projectId: project,
        timestamp: new UnixTime(timestamp),
        dataSource: source,
        native: value.native,
        nativeAssociated: value.nativeAssociated,
        nativeForTotal: value.nativeForTotal,
        nativeAssociatedForTotal: value.nativeAssociatedForTotal,
        canonical: value.canonical,
        canonicalAssociated: value.canonicalAssociated,
        canonicalForTotal: value.canonicalForTotal,
        canonicalAssociatedForTotal: value.canonicalAssociated,
        external: value.external,
        externalAssociated: value.externalAssociated,
        externalForTotal: value.externalForTotal,
        externalAssociatedForTotal: value.externalAssociatedForTotal,
        ether: value.ether,
        stablecoin: value.stablecoin,
      }) satisfies ValueRecord,
  )
}
