import { Logger } from '@l2beat/backend-tools'
import type { TvsToken } from '@l2beat/config'
import type { CoingeckoCorrection } from '@l2beat/config/build/global/coingeckoCorrections'
import type { Database } from '@l2beat/database'
import { EthereumAddress, TokenId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { describeDatabase } from '../../../test/database'
import type { Clock } from '../../../tools/Clock'
import { TokenValueIndexer } from '../indexers/TokenValueIndexer'
import { extractPricesAndAmounts } from './extractPricesAndAmounts'
import { overwriteCorrectedHours } from './overwriteCorrectedHours'
import { SyncOptimizer } from './SyncOptimizer'

const WRONG_HOUR = UnixTime.fromDate(new Date('2026-05-31T00:00:00Z'))
const NEXT_HOUR = UnixTime(WRONG_HOUR + UnixTime.HOUR)
const DAY_BEFORE = UnixTime(WRONG_HOUR - UnixTime.DAY)

// Half a year after the corrected hours, where the indexers keep one point a
// day.
const syncOptimizer = new SyncOptimizer(
  mockObject<Clock>({
    getLastHour: () => UnixTime.fromDate(new Date('2026-11-18T00:00:00Z')),
  }),
)

// Runs against Postgres because the behavior depends on it: prices are stored
// as 32-bit floats, supplies as 80-digit decimals, and the overwrite and the
// recomputation have to land in one transaction.
describeDatabase(overwriteCorrectedHours.name, (db) => {
  beforeEach(async () => {
    await db.tvsPrice.deleteAll()
    await db.tvsAmount.deleteAll()
    await db.tvsTokenValue.deleteAll()
  })

  // Stores what the indexers saved before the correction existed: a wrong
  // price at one hour, a fine one at the next, and token values computed from
  // both. Only the wrong hour may change.
  it('overwrites the stored price of a corrected hour and recomputes its token value', async () => {
    const token = tokenWith({
      type: 'totalSupply',
      address: EthereumAddress.ZERO,
      chain: 'ethereum',
      decimals: 0,
      sinceTimestamp: UnixTime(0),
    })
    const { config, price, amount } = configFor(token)
    for (const timestamp of [WRONG_HOUR, NEXT_HOUR]) {
      await storePrice(db, price.id, timestamp, 1545)
      await db.tvsAmount.upsertMany([
        { configurationId: amount.id, timestamp, amount: 10n },
      ])
      await storeTokenValue(db, token, timestamp, { amount: 10, value: 15450 })
    }
    const corrections = [
      correction('price', [
        { at: '2026-05-31T00:00:00Z', value: 2119 },
        // an hour the indexers no longer keep gets no row
        { at: '2026-05-31T03:00:00Z', value: 2119 },
      ]),
    ]

    await overwriteCorrectedHours(
      corrections,
      config,
      syncOptimizer,
      db,
      Logger.SILENT,
    )

    expect(await storedPrices(db)).toEqual([
      [WRONG_HOUR, 2119],
      [NEXT_HOUR, 1545],
    ])
    expect(await storedTokenValues(db)).toEqual([
      [WRONG_HOUR, 21190, 2119],
      [NEXT_HOUR, 15450, 1545],
    ])
  })

  // A circulating supply is the amount, not the price, and is stored in base
  // units, so it takes its own path through the overwrite.
  it('overwrites the stored circulating supply of a corrected hour and recomputes its token value', async () => {
    const token = tokenWith({
      type: 'circulatingSupply',
      apiId: 'coin',
      decimals: 18,
      sinceTimestamp: UnixTime(0),
      address: EthereumAddress.ZERO,
      chain: 'ethereum',
    })
    const { config, price, amount } = configFor(token)
    await storePrice(db, price.id, WRONG_HOUR, 2)
    await db.tvsAmount.upsertMany([
      {
        configurationId: amount.id,
        timestamp: WRONG_HOUR,
        amount: 964n * 10n ** 18n,
      },
    ])
    await storeTokenValue(db, token, WRONG_HOUR, { amount: 964, value: 1928 })

    await overwriteCorrectedHours(
      [
        correction('circulatingSupply', [
          { at: '2026-05-31T00:00:00Z', value: 452 },
        ]),
      ],
      config,
      syncOptimizer,
      db,
      Logger.SILENT,
    )

    expect(await db.tvsAmount.getAll()).toEqual([
      {
        configurationId: amount.id,
        timestamp: WRONG_HOUR,
        amount: 452n * 10n ** 18n,
      },
    ])
    expect(await storedTokenValues(db)).toEqual([[WRONG_HOUR, 904, 2]])
  })

  // The price indexer stores nothing for an hour CoinGecko returned nothing
  // for, and the token value of that hour is then calculated from the latest
  // older price. Stores such a token value with no price of its own hour: the
  // correction has to add the price and recompute the value from it.
  it('stores the corrected price of an hour the indexer skipped and recomputes its token value', async () => {
    const token = tokenWith({
      type: 'totalSupply',
      address: EthereumAddress.ZERO,
      chain: 'ethereum',
      decimals: 0,
      sinceTimestamp: UnixTime(0),
    })
    const { config, price, amount } = configFor(token)
    await storePrice(db, price.id, DAY_BEFORE, 1545)
    await db.tvsAmount.upsertMany([
      { configurationId: amount.id, timestamp: WRONG_HOUR, amount: 10n },
    ])
    await storeTokenValue(db, token, WRONG_HOUR, { amount: 10, value: 15450 })

    await overwriteCorrectedHours(
      [correction('price', [{ at: '2026-05-31T00:00:00Z', value: 2119 }])],
      config,
      syncOptimizer,
      db,
      Logger.SILENT,
    )

    expect(await storedPrices(db)).toEqual([
      [DAY_BEFORE, 1545],
      [WRONG_HOUR, 2119],
    ])
    expect(await storedTokenValues(db)).toEqual([[WRONG_HOUR, 21190, 2119]])
  })

  // After a deploy that changes a token, its stored values still carry the
  // old configuration id until the indexer wipes them, and the amount the new
  // configuration needs is not stored yet. Recomputing such a value would
  // throw and stop the backend from starting, on every restart.
  it('leaves token values stored under an older configuration of the token', async () => {
    const token = tokenWith({
      type: 'totalSupply',
      address: EthereumAddress.ZERO,
      chain: 'ethereum',
      decimals: 0,
      sinceTimestamp: UnixTime(0),
    })
    const { config, price } = configFor(token)
    await storePrice(db, price.id, WRONG_HOUR, 1545)
    await storeTokenValue(
      db,
      token,
      WRONG_HOUR,
      { amount: 10, value: 15450 },
      'older-config',
    )

    await overwriteCorrectedHours(
      [correction('price', [{ at: '2026-05-31T00:00:00Z', value: 2119 }])],
      config,
      syncOptimizer,
      db,
      Logger.SILENT,
    )

    expect(await storedPrices(db)).toEqual([[WRONG_HOUR, 2119]])
    expect(await storedTokenValues(db)).toEqual([[WRONG_HOUR, 15450, 1545]])
  })

  // A run that corrected the price but failed before recomputing the token
  // value must not keep the price: the next run would find it correct and
  // never recompute. Makes the recomputation fail by leaving out the amount,
  // then adds it and runs again.
  it('keeps nothing from a run that fails, so the next run repeats it', async () => {
    const token = tokenWith({
      type: 'totalSupply',
      address: EthereumAddress.ZERO,
      chain: 'ethereum',
      decimals: 0,
      sinceTimestamp: UnixTime(0),
    })
    const { config, price, amount } = configFor(token)
    await storePrice(db, price.id, WRONG_HOUR, 1545)
    await storeTokenValue(db, token, WRONG_HOUR, { amount: 10, value: 15450 })
    const run = () =>
      overwriteCorrectedHours(
        [correction('price', [{ at: '2026-05-31T00:00:00Z', value: 2119 }])],
        config,
        syncOptimizer,
        db,
        Logger.SILENT,
      )

    await expect(run()).toBeRejected()
    expect(await storedPrices(db)).toEqual([[WRONG_HOUR, 1545]])

    await db.tvsAmount.upsertMany([
      { configurationId: amount.id, timestamp: WRONG_HOUR, amount: 10n },
    ])
    await run()
    expect(await storedPrices(db)).toEqual([[WRONG_HOUR, 2119]])
    expect(await storedTokenValues(db)).toEqual([[WRONG_HOUR, 21190, 2119]])
  })

  // The overwrite runs on every backend start. Postgres keeps a price as a
  // 32-bit float and returns 63996.68 for the value below, so comparing the
  // two at full precision would find a difference on every start and rewrite
  // the data forever. A token value changed by hand between two runs shows
  // whether the second one wrote.
  it('writes nothing once the stored data matches the corrections', async () => {
    const token = tokenWith({
      type: 'totalSupply',
      address: EthereumAddress.ZERO,
      chain: 'ethereum',
      decimals: 0,
      sinceTimestamp: UnixTime(0),
    })
    const { config, price, amount } = configFor(token)
    await storePrice(db, price.id, WRONG_HOUR, 93147)
    await db.tvsAmount.upsertMany([
      { configurationId: amount.id, timestamp: WRONG_HOUR, amount: 10n },
    ])
    await storeTokenValue(db, token, WRONG_HOUR, { amount: 10, value: 931470 })
    const corrections = [
      correction('price', [
        { at: '2026-05-31T00:00:00Z', value: 63996.6812345 },
      ]),
    ]

    await overwriteCorrectedHours(
      corrections,
      config,
      syncOptimizer,
      db,
      Logger.SILENT,
    )
    await storeTokenValue(db, token, WRONG_HOUR, { amount: 10, value: 1 })
    await overwriteCorrectedHours(
      corrections,
      config,
      syncOptimizer,
      db,
      Logger.SILENT,
    )

    const [[, value]] = await storedTokenValues(db)
    expect(value).toEqual(1)
  })
})

function tokenWith(amount: TvsToken['amount']): TvsToken {
  return {
    mode: 'auto',
    id: TokenId('project-COIN'),
    priceId: 'coin',
    symbol: 'COIN',
    name: 'Coin',
    amount,
    category: 'other',
    source: 'native',
    isAssociated: false,
  }
}

function configFor(token: TvsToken) {
  const { prices, amounts } = extractPricesAndAmounts([token])
  const project = {
    projectId: 'project',
    tokens: [token],
    amountSources: [],
    storeEscrowValues: false,
  }
  return {
    config: { prices, amounts, projects: [project] },
    price: prices[0],
    amount: amounts[0],
  }
}

function correction(
  field: CoingeckoCorrection['field'],
  points: CoingeckoCorrection['points'],
): CoingeckoCorrection {
  return {
    coingeckoId: 'coin',
    field,
    reason: 'reason',
    evidence: ['evidence'],
    points,
  }
}

async function storePrice(
  db: Database,
  configurationId: string,
  timestamp: UnixTime,
  priceUsd: number,
) {
  await db.tvsPrice.upsertMany([
    { configurationId, timestamp, priceUsd, priceId: 'coin' },
  ])
}

async function storeTokenValue(
  db: Database,
  token: TvsToken,
  timestamp: UnixTime,
  { amount, value }: { amount: number; value: number },
  configurationId = TokenValueIndexer.idToConfigurationId(token, false),
) {
  await db.tvsTokenValue.upsertMany([
    {
      configurationId,
      projectId: 'project',
      tokenId: token.id,
      timestamp,
      amount,
      value,
      valueForProject: value,
      valueForSummary: value,
      priceUsd: value / amount,
    },
  ])
}

async function storedPrices(db: Database) {
  const records = await db.tvsPrice.getAll()
  return records
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((r) => [r.timestamp, r.priceUsd])
}

async function storedTokenValues(db: Database) {
  const records = await db.tvsTokenValue.getAll()
  return records
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((r) => [r.timestamp, r.value, r.priceUsd])
}
