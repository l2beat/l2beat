import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'

type Dependencies = {
  logger: Logger
  db: Database
}

export function buildTokenMetaAggregatorSource({ db, logger }: Dependencies) {
  return async function (tokenId: string) {
    const token = await db.token.findById(tokenId)

    if (!token) {
      logger.error('Token not found', { tokenId })
      return
    }

    const records = (await db.tokenMeta.getByTokenId(tokenId)).filter(
      (r) => r.source === 'Aggregate',
    )

    // Check all records and update the aggregate record with the most popular data

    await db.tokenMeta.upsert({
      tokenId,
      source: 'Aggregate',
      externalId: '',
      name: getMostPopularValue(records.map((r) => r.name)),
      symbol: getMostPopularValue(records.map((r) => r.symbol)),
      decimals: getMostPopularValue(records.map((r) => r.decimals)),
      logoUrl: getMostPopularValue(records.map((r) => r.logoUrl)),
      contractName: getMostPopularValue(records.map((r) => r.contractName)),
    })
  }
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

  valueCounts.forEach((count, value) => {
    if (count > maxCount) {
      mostPopularValue = value
      maxCount = count
    }
  })

  return mostPopularValue
}
