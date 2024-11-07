import { assert } from '@l2beat/shared-pure'
import { TokenMetaRecord, UpsertableTokenMetaRecord } from './entity'

export function getAggregatedTokenMeta(
  records: TokenMetaRecord[],
): UpsertableTokenMetaRecord {
  const regularRecords = records.filter((r) => r.source !== 'Aggregate')
  assert(regularRecords[0], 'No regular records provided')

  return {
    tokenId: regularRecords[0].tokenId,
    source: 'Aggregate',
    externalId: '',
    name: getMostPopularValue(regularRecords.map((r) => r.name)),
    symbol: getMostPopularValue(regularRecords.map((r) => r.symbol)),
    decimals: getMostPopularValue(regularRecords.map((r) => r.decimals)),
    logoUrl: getMostPopularValue(regularRecords.map((r) => r.logoUrl)),
    contractName: getMostPopularValue(
      regularRecords.map((r) => r.contractName),
    ),
  } as const
}

function getMostPopularValue<T>(values: T[]) {
  const valueCounts = new Map<T, number>()
  for (const value of values) {
    if (value === null || value === undefined) {
      continue
    }
    valueCounts.set(value, (valueCounts.get(value) || 0) + 1)
  }

  let mostPopularValue: T | null = null
  let maxCount = 0

  for (const [value, count] of valueCounts) {
    if (count > maxCount) {
      mostPopularValue = value
      maxCount = count
    }
  }

  return mostPopularValue
}
