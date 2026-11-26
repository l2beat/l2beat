import { Logger } from '@l2beat/backend-tools'
import type { Database, EthereumStakingDailyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { BurnDay } from './dune/readDuneBurns'
import {
  EthereumSupplyIndexer,
  getIssuance,
  SUPPLY_ANCHOR,
} from './EthereumSupplyIndexer'

const { DAY } = UnixTime
const ETH = 10n ** 18n
const first = SUPPLY_ANCHOR.timestamp
const day = (n: number) => UnixTime(first + n * DAY)

describe(EthereumSupplyIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  it('stores the anchor, then adds each day its issuance less its burn', async () => {
    const { indexer, supplyDaily, readBurns } = createIndexer({
      // Issuance: 4 ETH on day 0, 3 ETH on day 1
      staking: [staking(0, 100n), staking(1, 104n), staking(2, 107n)],
      burns: [burn(0, 1n), burn(1, 5n)],
    })

    expect(await indexer.update(day(1), day(3))).toEqual(day(3))

    expect(readBurns).toHaveBeenOnlyCalledWith(day(0), day(1))
    expect(supplyDaily.upsertMany).toHaveBeenOnlyCalledWith([
      SUPPLY_ANCHOR,
      { timestamp: day(1), supply: SUPPLY_ANCHOR.supply + 3 },
      { timestamp: day(2), supply: SUPPLY_ANCHOR.supply + 1 },
    ])
  })

  it('stores only the anchor while its day is the last ended one', async () => {
    const { indexer, supplyDaily, readBurns } = createIndexer({})

    expect(await indexer.update(day(1), day(1))).toEqual(day(1))

    expect(readBurns).not.toHaveBeenCalled()
    expect(supplyDaily.upsertMany).toHaveBeenOnlyCalledWith([SUPPLY_ANCHOR])
  })

  it('continues from the stored day before', async () => {
    const { indexer, supplyDaily } = createIndexer({
      stored: { timestamp: day(4), supply: 1_000 },
      staking: [staking(4, 100n), staking(5, 102n)],
      burns: [burn(4, 1n)],
    })

    expect(await indexer.update(day(5) + 1, day(6))).toEqual(day(6))

    expect(supplyDaily.upsertMany).toHaveBeenOnlyCalledWith([
      { timestamp: day(5), supply: 1_001 },
    ])
  })

  it("throws when Dune's day has another number of blocks than the staking day", async () => {
    const { indexer, supplyDaily } = createIndexer({
      staking: [staking(0, 100n), staking(1, 104n)],
      burns: [[day(0), { burn: ETH, blockCount: 7_199 }]],
    })

    await expect(indexer.update(day(1), day(2))).toBeRejectedWith(
      'ETH supply inputs missing',
    )
    expect(supplyDaily.upsertMany).not.toHaveBeenCalled()
  })

  it('throws when the next staking day is not stored', async () => {
    const { indexer } = createIndexer({
      staking: [staking(0, 100n)],
      burns: [burn(0, 1n)],
    })

    await expect(indexer.update(day(1), day(2))).toBeRejectedWith(
      'ETH supply inputs missing',
    )
  })

  it('throws when the day before is not stored', async () => {
    const { indexer } = createIndexer({})

    await expect(indexer.update(day(5) + 1, day(6))).toBeRejectedWith(
      'ETH supply of the previous day missing',
    )
  })

  it('keeps the days that end by the invalidated height', async () => {
    const { indexer, supplyDaily } = createIndexer({})

    expect(await indexer.invalidate(day(3))).toEqual(day(3))
    expect(supplyDaily.deleteAfter).toHaveBeenOnlyCalledWith(day(2))
  })

  it('refuses a first day other than the anchor', () => {
    expect(() => createIndexer({ firstDay: day(1) })).toThrow(
      'ETH supply must start on its anchor day',
    )
  })
})

describe(getIssuance.name, () => {
  it('counts withdrawals and pending deposits as held, and leaves out deposits', () => {
    const start = {
      ...staking(0, 100n),
      pendingDeposits: null,
      withdrawals: 7n * ETH,
      deposits: 32n * ETH,
    }
    const end = { ...staking(1, 120n), pendingDeposits: 10n * ETH }

    // Held 100 → 130, 7 withdrawn, 32 deposited
    expect(getIssuance(start, end)).toEqual(5n * ETH)
  })
})

function staking(n: number, balanceEth: bigint): EthereumStakingDailyRecord {
  return {
    timestamp: day(n),
    slot: 0,
    totalBalance: balanceEth * ETH,
    activeBalance: balanceEth * ETH,
    pendingDeposits: 0n,
    withdrawals: 0n,
    deposits: 0n,
    builderPayments: 0n,
    priorityFees: 0n,
    directTransfers: 0n,
    blockCount: 7_200,
    builderBlockCount: 0,
  }
}

function burn(n: number, eth: bigint): [UnixTime, BurnDay] {
  return [day(n), { burn: eth * ETH, blockCount: 7_200 }]
}

function createIndexer({
  firstDay = first,
  stored,
  staking = [],
  burns = [],
}: {
  firstDay?: UnixTime
  stored?: { timestamp: UnixTime; supply: number }
  staking?: EthereumStakingDailyRecord[]
  burns?: [UnixTime, BurnDay][]
}) {
  const supplyDaily = mockObject<Database['ethereumSupplyDaily']>({
    upsertMany: mockFn().resolvesTo(1),
    deleteAfter: mockFn().resolvesTo(0),
    getInRange: mockFn().resolvesTo(stored ? [stored] : []),
  })
  const stakingDaily = mockObject<Database['ethereumStakingDaily']>({
    getInRange: mockFn().resolvesTo(staking),
  })
  const readBurns = mockFn().resolvesTo(new Map(burns))
  const indexer = new EthereumSupplyIndexer(
    {
      parents: [],
      indexerService: mockObject<IndexerService>(),
      firstDay,
      db: mockDatabase({
        ethereumSupplyDaily: supplyDaily,
        ethereumStakingDaily: stakingDaily,
      }),
      readBurns,
    },
    Logger.SILENT,
  )
  return { indexer, supplyDaily, readBurns }
}
