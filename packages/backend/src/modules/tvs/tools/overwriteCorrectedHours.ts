import type { Logger } from '@l2beat/backend-tools'
import type { TvsToken } from '@l2beat/config'
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
 * Makes the stored data match the corrections: stores the corrected price or
 * circulating supply at each listed hour, then recomputes the token values of
 * the listed hours and stores the ones that differ.
 *
 * A listed hour without a stored row gets one too, because the indexers skip
 * an hour CoinGecko returned nothing for, and its token value was then
 * calculated from the latest older row.
 *
 * Token values are recomputed on every run, not only when a price or supply
 * was just written. One saved from the old price after the price was
 * corrected, for example by an instance still running during a deploy, would
 * otherwise stay wrong for good.
 *
 * A token value at an unlisted hour is never recomputed, also when it was
 * calculated from a corrected hour's price because its own hour has none. To
 * correct such an hour, list it.
 *
 * Nothing here throws, and a token that cannot be recomputed does not stop
 * the others: this runs before the indexers start, and the data it could not
 * find may be theirs to fetch. A failure is logged as critical, which alerts,
 * and the next run tries again.
 */
export async function overwriteCorrectedHours(
  corrections: CoingeckoCorrection[],
  config: Pick<TvsConfig, 'prices' | 'amounts' | 'projects'>,
  syncOptimizer: SyncOptimizer,
  db: Database,
  logger: Logger,
): Promise<void> {
  try {
    const prices = await overwritePrices(corrections, config, syncOptimizer, db)
    const supplies = await overwriteSupplies(
      corrections,
      config,
      syncOptimizer,
      db,
    )
    const tokenValues = await recomputeTokenValues(
      new Map([...prices.listed, ...supplies.listed]),
      config,
      db,
      logger,
    )

    if (prices.written + supplies.written + tokenValues > 0) {
      logger.info('Overwrote stored data with CoinGecko corrections', {
        prices: prices.written,
        supplies: supplies.written,
        tokenValues,
      })
    }
  } catch (error) {
    logger.critical(
      'Failed to overwrite stored data with CoinGecko corrections',
      error,
    )
  }
}

interface Overwrite {
  /** Every listed hour of each price or supply, written or not. */
  listed: [configurationId: string, hours: UnixTime[]][]
  written: number
}

async function overwritePrices(
  corrections: CoingeckoCorrection[],
  config: Pick<TvsConfig, 'prices'>,
  syncOptimizer: SyncOptimizer,
  db: Database,
): Promise<Overwrite> {
  const result: Overwrite = { listed: [], written: 0 }
  for (const price of config.prices) {
    const corrected = correctedValues(corrections, 'price', price.priceId)
    if (corrected.size === 0) continue
    result.listed.push([price.id, [...corrected.keys()]])

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
          : !sameFloat(current, priceUsd)
      return needsWrite
        ? {
            configurationId: price.id,
            priceId: price.priceId,
            timestamp,
            priceUsd,
          }
        : []
    })
    await db.tvsPrice.upsertMany(records)
    result.written += records.length
  }
  return result
}

async function overwriteSupplies(
  corrections: CoingeckoCorrection[],
  config: Pick<TvsConfig, 'amounts'>,
  syncOptimizer: SyncOptimizer,
  db: Database,
): Promise<Overwrite> {
  const result: Overwrite = { listed: [], written: 0 }
  for (const supply of config.amounts) {
    if (supply.type !== 'circulatingSupply') continue
    const corrected = correctedValues(
      corrections,
      'circulatingSupply',
      supply.apiId,
    )
    if (corrected.size === 0) continue
    result.listed.push([supply.id, [...corrected.keys()]])

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
    await db.tvsAmount.upsertMany(records)
    result.written += records.length
  }
  return result
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
  listed: Map<string, UnixTime[]>,
  config: Pick<TvsConfig, 'projects'>,
  db: Database,
  logger: Logger,
): Promise<number> {
  let recomputed = 0
  for (const project of config.projects) {
    for (const token of project.tokens) {
      const { prices, amounts } = extractPricesAndAmounts([token])
      const hours = [...prices, ...amounts].flatMap(
        (c) => listed.get(c.id) ?? [],
      )
      if (hours.length === 0) continue

      try {
        recomputed += await recomputeToken(project, token, hours, db, logger)
      } catch (error) {
        logger.critical(
          'Failed to recompute token values of CoinGecko corrections',
          { projectId: project.projectId, tokenId: token.id, error },
        )
      }
    }
  }
  return recomputed
}

async function recomputeToken(
  project: TvsConfig['projects'][number],
  token: TvsToken,
  hours: UnixTime[],
  db: Database,
  logger: Logger,
): Promise<number> {
  // Values stored under an older configuration of the token are wiped by its
  // indexer on start, and the data the current one needs at their hours may
  // not be stored yet.
  const configurationId = TokenValueIndexer.idToConfigurationId(
    token,
    project.storeEscrowValues,
  )
  const stored = new Map(
    (
      await db.tvsTokenValue.getByTokenIdInTimeRange(
        token.id,
        Math.min(...hours),
        Math.max(...hours),
      )
    )
      .filter(
        (r) =>
          r.configurationId === configurationId && hours.includes(r.timestamp),
      )
      .map((r) => [r.timestamp, r]),
  )

  const valueService = new ValueService(new DBStorage(db, logger), logger)
  const { records, escrowRecords } = await calculateTokenValueRecords(
    valueService,
    { ...project, tokens: [token] },
    [...stored.keys()],
  )
  const changed = records.filter((computed) => {
    const current = stored.get(computed.timestamp)
    return (
      current === undefined ||
      TOKEN_VALUE_FIELDS.some((f) => !sameFloat(current[f], computed[f]))
    )
  })
  if (changed.length === 0) return 0

  const changedHours = new Set(changed.map((r) => r.timestamp))
  await db.transaction(async () => {
    await db.tvsTokenValue.upsertMany(changed)
    await db.tvsEscrowValue.upsertMany(
      escrowRecords.filter((r) => changedHours.has(r.timestamp)),
    )
  })
  return changed.length
}

const TOKEN_VALUE_FIELDS = [
  'amount',
  'value',
  'valueForProject',
  'valueForSummary',
  'priceUsd',
] as const

/** Prices and token values are stored as 32-bit floats, so compare as such. */
function sameFloat(a: number, b: number): boolean {
  return Math.fround(a) === Math.fround(b)
}

function range(corrected: Map<UnixTime, number>): [UnixTime, UnixTime] {
  const timestamps = [...corrected.keys()]
  return [Math.min(...timestamps), Math.max(...timestamps)]
}
