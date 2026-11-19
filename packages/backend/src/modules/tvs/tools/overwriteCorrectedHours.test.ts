import { Logger } from '@l2beat/backend-tools'
import type { TvsToken } from '@l2beat/config'
import type { CoingeckoCorrection } from '@l2beat/config/build/global/coingeckoCorrections'
import type { Database } from '@l2beat/database'
import { EthereumAddress, TokenId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
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

// Runs against Postgres because the behavior depends on it: prices and token
// values are stored as 32-bit floats and supplies as 80-digit decimals.
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
  // fail and alert on every restart.
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

  // On the first run in production one token may lack an input the others
  // have. Two tokens share the corrected price and one has no stored amount:
  // the other still has to get its new value, the failure has to alert
  // without throwing, because this runs before the indexers start, and the
  // run after the amount arrives has to finish the job although the price
  // already matches by then.
  it('recomputes the other tokens when one fails, alerts, and finishes on the next run', async () => {
    const failing = tokenWith({
      type: 'totalSupply',
      address: EthereumAddress.ZERO,
      chain: 'ethereum',
      decimals: 0,
      sinceTimestamp: UnixTime(0),
    })
    const healthy = tokenWith(
      {
        type: 'totalSupply',
        address: EthereumAddress('0x' + '1'.repeat(40)),
        chain: 'ethereum',
        decimals: 0,
        sinceTimestamp: UnixTime(0),
      },
      'project-OTHER',
    )
    const { config, price, amounts } = configFor(failing, healthy)
    const [failingAmount, healthyAmount] = amounts
    await storePrice(db, price.id, WRONG_HOUR, 1545)
    await db.tvsAmount.upsertMany([
      { configurationId: healthyAmount.id, timestamp: WRONG_HOUR, amount: 10n },
    ])
    for (const token of [failing, healthy]) {
      await storeTokenValue(db, token, WRONG_HOUR, { amount: 10, value: 15450 })
    }
    const { logger, critical } = recordingLogger()
    const run = () =>
      overwriteCorrectedHours(
        [correction('price', [{ at: '2026-05-31T00:00:00Z', value: 2119 }])],
        config,
        syncOptimizer,
        db,
        logger,
      )

    await run()
    expect(await storedValueOf(db, healthy)).toEqual(21190)
    expect(await storedValueOf(db, failing)).toEqual(15450)
    expect(critical).toHaveBeenCalledTimes(1)

    await db.tvsAmount.upsertMany([
      { configurationId: failingAmount.id, timestamp: WRONG_HOUR, amount: 10n },
    ])
    await run()
    expect(await storedValueOf(db, failing)).toEqual(21190)
    expect(critical).toHaveBeenCalledTimes(1)
  })

  // The overwrite runs on every backend start. Postgres keeps prices and
  // token values as 32-bit floats and returns 63996.68 for the price below,
  // so comparing at full precision would find a difference on every start
  // and rewrite the data forever. The log line it writes when it changed
  // something shows whether the second run did.
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
    const { logger, info } = recordingLogger()

    await overwriteCorrectedHours(
      corrections,
      config,
      syncOptimizer,
      db,
      logger,
    )
    expect(info).toHaveBeenOnlyCalledWith(
      'Overwrote stored data with CoinGecko corrections',
      { prices: 1, supplies: 0, tokenValues: 1 },
    )

    await overwriteCorrectedHours(
      corrections,
      config,
      syncOptimizer,
      db,
      logger,
    )
    expect(info).toHaveBeenCalledTimes(1)
  })

  // A token value can be saved from the old price after the price itself was
  // corrected, for example by an instance still running during a deploy.
  // Stores the corrected price next to a value calculated from the old one:
  // nothing is left to overwrite, and the value still has to change.
  it('recomputes a token value that is wrong although its price already matches', async () => {
    const token = tokenWith({
      type: 'totalSupply',
      address: EthereumAddress.ZERO,
      chain: 'ethereum',
      decimals: 0,
      sinceTimestamp: UnixTime(0),
    })
    const { config, price, amount } = configFor(token)
    await storePrice(db, price.id, WRONG_HOUR, 2119)
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

    expect(await storedTokenValues(db)).toEqual([[WRONG_HOUR, 21190, 2119]])
  })
})

function recordingLogger() {
  const info = mockFn().returns(undefined)
  const critical = mockFn().returns(undefined)
  const logger: Logger = mockObject<Logger>({
    for: () => logger,
    info,
    warn: () => {},
    critical,
  })
  return { logger, info, critical }
}

function tokenWith(amount: TvsToken['amount'], id = 'project-COIN'): TvsToken {
  return {
    mode: 'auto',
    id: TokenId(id),
    priceId: 'coin',
    symbol: 'COIN',
    name: 'Coin',
    amount,
    category: 'other',
    source: 'native',
    isAssociated: false,
  }
}

function configFor(...tokens: TvsToken[]) {
  const { prices, amounts } = extractPricesAndAmounts(tokens)
  const project = {
    projectId: 'project',
    tokens,
    amountSources: [],
    storeEscrowValues: false,
  }
  return {
    config: { prices, amounts, projects: [project] },
    price: prices[0],
    amount: amounts[0],
    amounts,
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

async function storedValueOf(db: Database, token: TvsToken) {
  const records = await db.tvsTokenValue.getAll()
  return records.find((r) => r.tokenId === token.id)?.value
}
