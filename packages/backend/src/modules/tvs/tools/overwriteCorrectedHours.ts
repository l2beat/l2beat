import type { Logger } from '@l2beat/backend-tools'
import type { CoingeckoCorrection } from '@l2beat/config/build/global/coingeckoCorrections'
import type { Database } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import type { TvsConfig } from '../../../config/Config'
import {
  calculateTokenValueRecords,
  TokenValueIndexer,
} from '../indexers/TokenValueIndexer'
import { ValueService } from '../services/ValueService'
import { correctedValues } from './coingeckoCorrections'
import { DBStorage } from './DBStorage'
import { extractPricesAndAmounts } from './extractPricesAndAmounts'
import type { SyncOptimizer } from './SyncOptimizer'

/**
 * Makes the data stored before a correction existed match it: stores the
 * corrected price or circulating supply at each listed hour, then recomputes
 * the token values that were calculated from them.
 *
 * A listed hour without a stored row gets one too, because the indexers skip
 * an hour CoinGecko returned nothing for, and its token value was then
 * calculated from the latest older row.
 *
 * A token value at an unlisted hour is never recomputed, also when it was
 * calculated from a corrected hour's price because its own hour has none. To
 * correct such an hour, list it.
 *
 * Runs in one transaction, because the next run only recomputes token values
 * for prices and supplies it still finds uncorrected. A run that fails keeps
 * nothing and reports the error without throwing: it runs before the
 * indexers start, and the data it could not find may be theirs to fetch.
 */
export async function overwriteCorrectedHours(
  corrections: CoingeckoCorrection[],
  config: Pick<TvsConfig, 'prices' | 'amounts' | 'projects'>,
  syncOptimizer: SyncOptimizer,
  db: Database,
  logger: Logger,
): Promise<void> {
  try {
    await overwriteInTransaction(corrections, config, syncOptimizer, db, logger)
  } catch (error) {
    logger.error(
      'Failed to overwrite stored data with CoinGecko corrections',
      error,
    )
  }
}

async function overwriteInTransaction(
  corrections: CoingeckoCorrection[],
  config: Pick<TvsConfig, 'prices' | 'amounts' | 'projects'>,
  syncOptimizer: SyncOptimizer,
  db: Database,
  logger: Logger,
): Promise<void> {
  await db.transaction(async () => {
    const overwritten = new Map<string, UnixTime[]>([
      ...(await overwritePrices(corrections, config, syncOptimizer, db)),
      ...(await overwriteSupplies(corrections, config, syncOptimizer, db)),
    ])
    if (overwritten.size === 0) {
      return
    }
    const tokenValues = await recomputeTokenValues(
      overwritten,
      config,
      db,
      logger,
    )

    logger.info('Overwrote stored data with CoinGecko corrections', {
      configurations: overwritten.size,
      tokenValues,
    })
  })
}

type Overwritten = [configurationId: string, timestamps: UnixTime[]][]

async function overwritePrices(
  corrections: CoingeckoCorrection[],
  config: Pick<TvsConfig, 'prices'>,
  syncOptimizer: SyncOptimizer,
  db: Database,
): Promise<Overwritten> {
  const overwritten: Overwritten = []
  for (const price of config.prices) {
    const corrected = correctedValues(corrections, 'price', price.priceId)
    if (corrected.size === 0) continue
    const stored = new Map(
      (await db.tvsPrice.getPricesInRange([price.id], ...range(corrected))).map(
        (record) => [record.timestamp, record.priceUsd],
      ),
    )
    const records = [...corrected].flatMap(([timestamp, priceUsd]) => {
      const current = stored.get(timestamp)
      const needsWrite =
        current === undefined
          ? isKeptByIndexer(price, timestamp, syncOptimizer)
          : // prices are stored as 32-bit floats, so compare at that precision
            Math.fround(current) !== Math.fround(priceUsd)
      return needsWrite
        ? {
            configurationId: price.id,
            priceId: price.priceId,
            timestamp,
            priceUsd,
          }
        : []
    })
    if (records.length > 0) {
      await db.tvsPrice.upsertMany(records)
      overwritten.push([price.id, records.map((r) => r.timestamp)])
    }
  }
  return overwritten
}

async function overwriteSupplies(
  corrections: CoingeckoCorrection[],
  config: Pick<TvsConfig, 'amounts'>,
  syncOptimizer: SyncOptimizer,
  db: Database,
): Promise<Overwritten> {
  const overwritten: Overwritten = []
  for (const supply of config.amounts) {
    if (supply.type !== 'circulatingSupply') continue
    const corrected = correctedValues(
      corrections,
      'circulatingSupply',
      supply.apiId,
    )
    if (corrected.size === 0) continue
    const stored = new Map(
      (
        await db.tvsAmount.getAmountsInRange([supply.id], ...range(corrected))
      ).map((record) => [record.timestamp, record.amount]),
    )
    const records = [...corrected].flatMap(([timestamp, value]) => {
      const amount = BigInt(value * 10 ** supply.decimals)
      const current = stored.get(timestamp)
      const needsWrite =
        current === undefined
          ? isKeptByIndexer(supply, timestamp, syncOptimizer)
          : current !== amount
      return needsWrite ? { configurationId: supply.id, timestamp, amount } : []
    })
    if (records.length > 0) {
      await db.tvsAmount.upsertMany(records)
      overwritten.push([supply.id, records.map((r) => r.timestamp)])
    }
  }
  return overwritten
}

/** Whether the indexer of this price or supply would store a row at this hour. */
function isKeptByIndexer(
  config: { sinceTimestamp: UnixTime; untilTimestamp?: UnixTime },
  timestamp: UnixTime,
  syncOptimizer: SyncOptimizer,
): boolean {
  return (
    timestamp >= config.sinceTimestamp &&
    (config.untilTimestamp === undefined ||
      timestamp <= config.untilTimestamp) &&
    syncOptimizer.shouldTimestampBeSynced(timestamp)
  )
}

async function recomputeTokenValues(
  overwritten: Map<string, UnixTime[]>,
  config: Pick<TvsConfig, 'projects'>,
  db: Database,
  logger: Logger,
): Promise<number> {
  const valueService = new ValueService(new DBStorage(db, logger), logger)
  let recomputed = 0

  for (const project of config.projects) {
    for (const token of project.tokens) {
      const { prices, amounts } = extractPricesAndAmounts([token])
      const affected = [...prices, ...amounts].flatMap(
        (c) => overwritten.get(c.id) ?? [],
      )
      if (affected.length === 0) continue

      const stored = await db.tvsTokenValue.getByTokenIdInTimeRange(
        token.id,
        Math.min(...affected),
        Math.max(...affected),
      )
      // Values stored under an older configuration of the token are wiped by
      // its indexer on start, and the data the current one needs at their
      // hours may not be stored yet.
      const configurationId = TokenValueIndexer.idToConfigurationId(
        token,
        project.storeEscrowValues,
      )
      const timestamps = stored
        .filter(
          (r) =>
            r.configurationId === configurationId &&
            affected.includes(r.timestamp),
        )
        .map((r) => r.timestamp)

      const { records, escrowRecords } = await calculateTokenValueRecords(
        valueService,
        { ...project, tokens: [token] },
        timestamps,
      )
      await db.tvsTokenValue.upsertMany(records)
      await db.tvsEscrowValue.upsertMany(escrowRecords)
      recomputed += records.length
    }
  }
  return recomputed
}

function range(corrected: Map<UnixTime, number>): [UnixTime, UnixTime] {
  const timestamps = [...corrected.keys()]
  return [Math.min(...timestamps), Math.max(...timestamps)]
}
