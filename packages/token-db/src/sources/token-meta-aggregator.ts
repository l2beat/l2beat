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

    const records = await db.tokenMeta.getByTokenId(tokenId)
    const regularRecords = records.filter((r) => r.source !== 'Aggregate')
    const aggregateRecord = records.find((r) => r.source === 'Aggregate')

    const data = {
      name: getMostPopularValue(regularRecords.map((r) => r.name)),
      symbol: getMostPopularValue(regularRecords.map((r) => r.symbol)),
      decimals: getMostPopularValue(regularRecords.map((r) => r.decimals)),
      logoUrl: getMostPopularValue(regularRecords.map((r) => r.logoUrl)),
      contractName: getMostPopularValue(
        regularRecords.map((r) => r.contractName),
      ),
    } as const

    let shouldUpdate = false

    for (const key in data) {
      if (
        data[key as keyof typeof data] !==
        aggregateRecord?.[key as keyof typeof aggregateRecord]
      ) {
        shouldUpdate = true
        break
      }
    }

    if (!shouldUpdate) {
      return
    }

    // Check all records and update the aggregate record with the most popular data

    await db.tokenMeta.upsert({
      tokenId,
      source: 'Aggregate',
      externalId: '',
      ...data,
    })

    logger.info('Updated aggregate token meta', { tokenId })
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

  for (const [value, count] of valueCounts) {
    if (count > maxCount) {
      mostPopularValue = value
      maxCount = count
    }
  }

  return mostPopularValue
}
