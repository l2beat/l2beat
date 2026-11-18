import type { Logger } from '@l2beat/backend-tools'
import type { CoingeckoCorrection } from '@l2beat/config/build/global/coingeckoCorrections'
import type { Database } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import type { TvsConfig } from '../../../config/Config'
import { calculateTokenValueRecords } from '../indexers/TokenValueIndexer'
import { ValueService } from '../services/ValueService'
import { correctedValues } from './coingeckoCorrections'
import { DBStorage } from './DBStorage'
import { extractPricesAndAmounts } from './extractPricesAndAmounts'

/**
 * Makes the data stored before a correction existed match it: overwrites the
 * prices and circulating supplies of the corrected hours, then recomputes the
 * token values that were calculated from them. Hours the indexers have not
 * stored are left to them, since they apply the corrections while fetching.
 *
 * Runs in one transaction, because the next run only recomputes token values
 * for prices and supplies it still finds uncorrected.
 */
export async function overwriteCorrectedHours(
  corrections: CoingeckoCorrection[],
  config: Pick<TvsConfig, 'prices' | 'amounts' | 'projects'>,
  db: Database,
  logger: Logger,
): Promise<void> {
  await db.transaction(async () => {
    const overwritten = new Map<string, UnixTime[]>([
      ...(await overwritePrices(corrections, config, db)),
      ...(await overwriteSupplies(corrections, config, db)),
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
  db: Database,
): Promise<Overwritten> {
  const overwritten: Overwritten = []
  for (const price of config.prices) {
    const corrected = correctedValues(corrections, 'price', price.priceId)
    if (corrected.size === 0) continue
    const stored = await db.tvsPrice.getPricesInRange(
      [price.id],
      ...range(corrected),
    )
    const records = stored.flatMap((record) => {
      const priceUsd = corrected.get(record.timestamp)
      // prices are stored as 32-bit floats, so compare at that precision
      return priceUsd === undefined ||
        Math.fround(priceUsd) === Math.fround(record.priceUsd)
        ? []
        : { ...record, priceUsd }
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
    const stored = await db.tvsAmount.getAmountsInRange(
      [supply.id],
      ...range(corrected),
    )
    const records = stored.flatMap((record) => {
      const value = corrected.get(record.timestamp)
      if (value === undefined) return []
      const amount = BigInt(value * 10 ** supply.decimals)
      return amount === record.amount ? [] : { ...record, amount }
    })
    if (records.length > 0) {
      await db.tvsAmount.upsertMany(records)
      overwritten.push([supply.id, records.map((r) => r.timestamp)])
    }
  }
  return overwritten
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
      const timestamps = stored
        .map((r) => r.timestamp)
        .filter((timestamp) => affected.includes(timestamp))

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
