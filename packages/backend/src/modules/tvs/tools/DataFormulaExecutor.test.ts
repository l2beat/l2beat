import { Logger } from '@l2beat/backend-tools'
import type { CoingeckoCorrection } from '@l2beat/config/build/global/coingeckoCorrections'
import type {
  BalanceProvider,
  BlockTimestampProvider,
  CirculatingSupplyProvider,
  PriceProvider,
  StarknetBalanceProvider,
  StarknetTotalSupplyProvider,
  TotalSupplyProvider,
} from '@l2beat/shared'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { OnchainAmountConfig } from '../types'
import { DataFormulaExecutor } from './DataFormulaExecutor'
import type { LocalStorage } from './LocalStorage'

describe(DataFormulaExecutor.name, () => {
  describe(DataFormulaExecutor.prototype.execute.name, () => {
    it('sums balanceOfEscrows holders into one amount per config', async () => {
      const timestamp = UnixTime(1000)
      const blockNumber = 12345
      const chain = 'arbitrum'
      const token = EthereumAddress.random()
      const escrow = EthereumAddress.random()
      const holdersA = [EthereumAddress.random(), EthereumAddress.random()]
      const holdersB = [
        EthereumAddress.random(),
        EthereumAddress.random(),
        EthereumAddress.random(),
      ]

      const single: OnchainAmountConfig = {
        id: 'single',
        type: 'balanceOfEscrow',
        address: token,
        chain,
        escrowAddress: escrow,
        decimals: 18,
        sinceTimestamp: 0,
      }
      const aggregateA: OnchainAmountConfig = {
        id: 'aggregate-a',
        type: 'balanceOfEscrows',
        address: token,
        chain,
        escrowAddresses: holdersA,
        decimals: 18,
        sinceTimestamp: 0,
      }
      const aggregateB: OnchainAmountConfig = {
        id: 'aggregate-b',
        type: 'balanceOfEscrows',
        address: token,
        chain,
        escrowAddresses: holdersB,
        decimals: 18,
        sinceTimestamp: 0,
      }

      const balances = new Map<string, bigint>([
        [escrow, 1n],
        [holdersA[0], 10n],
        [holdersA[1], 20n],
        [holdersB[0], 100n],
        [holdersB[1], 200n],
        [holdersB[2], 300n],
      ])

      const localStorage = mockObject<LocalStorage>({
        getBlockNumber: mockFn().resolvesTo(blockNumber),
        getAmount: mockFn().resolvesTo(undefined),
        writeAmounts: mockFn().resolvesTo(undefined),
      })
      const balanceProvider = mockObject<BalanceProvider>({
        getBalances: mockFn<BalanceProvider['getBalances']>().executes(
          (queries) =>
            Promise.resolve(queries.map((q) => balances.get(q.holder) ?? 0n)),
        ),
      })

      const executor = new DataFormulaExecutor(
        localStorage,
        undefined,
        mockObject<PriceProvider>({}),
        mockObject<CirculatingSupplyProvider>({}),
        new Map(),
        mockObject<BlockTimestampProvider>({}),
        mockObject<TotalSupplyProvider>({}),
        mockObject<StarknetTotalSupplyProvider>({}),
        mockObject<StarknetBalanceProvider>({}),
        balanceProvider,
        [],
        Logger.SILENT,
      )

      await executor.execute(
        [],
        [single, aggregateA, aggregateB],
        timestamp,
        false,
      )

      // one batched read per formula type, aggregate holders flattened in order
      expect(balanceProvider.getBalances).toHaveBeenCalledTimes(2)
      expect(balanceProvider.getBalances).toHaveBeenNthCalledWith(
        1,
        [{ token, holder: escrow }],
        blockNumber,
        chain,
      )
      expect(balanceProvider.getBalances).toHaveBeenNthCalledWith(
        2,
        [...holdersA, ...holdersB].map((holder) => ({ token, holder })),
        blockNumber,
        chain,
      )

      // per-holder results folded back into one amount per config
      expect(localStorage.writeAmounts).toHaveBeenCalledTimes(2)
      expect(localStorage.writeAmounts).toHaveBeenNthCalledWith(1, timestamp, [
        { id: 'single', amount: 1n },
      ])
      expect(localStorage.writeAmounts).toHaveBeenNthCalledWith(2, timestamp, [
        { id: 'aggregate-a', amount: 30n },
        { id: 'aggregate-b', amount: 600n },
      ])
    })
  })

  // `tvs:execute` takes a historical price or supply from its local cache,
  // then the database, then CoinGecko, and assumes 0 when the fetch fails.
  // The cache here holds a value from before the correction and the providers
  // have no methods, so any call to CoinGecko fails: a corrected hour has to
  // get its value from the corrections alone.
  describe('CoinGecko corrections', () => {
    it('uses the corrected price for a listed hour over a cached one', async () => {
      const localStorage = mockObject<LocalStorage>({
        getPrice: mockFn().resolvesTo(1545),
        writePrice: mockFn().resolvesTo(undefined),
      })

      await executorWithoutCoingecko(localStorage).execute(
        [{ id: 'price', priceId: 'coin', sinceTimestamp: UnixTime(0) }],
        [],
        LISTED_HOUR,
        false,
      )

      expect(localStorage.writePrice).toHaveBeenOnlyCalledWith(
        'price',
        LISTED_HOUR,
        2119,
      )
    })

    it('uses the corrected circulating supply for a listed hour over a cached one', async () => {
      const localStorage = mockObject<LocalStorage>({
        getAmount: mockFn().resolvesTo(964n),
        writeAmount: mockFn().resolvesTo(undefined),
      })

      await executorWithoutCoingecko(localStorage).execute(
        [],
        [
          {
            id: 'supply',
            type: 'circulatingSupply',
            apiId: 'coin',
            decimals: 0,
            sinceTimestamp: UnixTime(0),
            address: EthereumAddress.ZERO,
            chain: 'ethereum',
          },
        ],
        LISTED_HOUR,
        false,
      )

      expect(localStorage.writeAmount).toHaveBeenOnlyCalledWith(
        'supply',
        LISTED_HOUR,
        452n,
      )
    })
  })
})

const LISTED_HOUR = UnixTime.fromDate(new Date('2026-05-31T00:00:00Z'))

const CORRECTIONS: CoingeckoCorrection[] = [
  {
    coingeckoId: 'coin',
    field: 'price',
    reason: 'reason',
    evidence: ['evidence'],
    points: [{ at: '2026-05-31T00:00:00Z', value: 2119 }],
  },
  {
    coingeckoId: 'coin',
    field: 'circulatingSupply',
    reason: 'reason',
    evidence: ['evidence'],
    points: [{ at: '2026-05-31T00:00:00Z', value: 452 }],
  },
]

function executorWithoutCoingecko(localStorage: LocalStorage) {
  return new DataFormulaExecutor(
    localStorage,
    undefined,
    mockObject<PriceProvider>({}),
    mockObject<CirculatingSupplyProvider>({}),
    new Map(),
    mockObject<BlockTimestampProvider>({}),
    mockObject<TotalSupplyProvider>({}),
    mockObject<StarknetTotalSupplyProvider>({}),
    mockObject<StarknetBalanceProvider>({}),
    mockObject<BalanceProvider>({}),
    CORRECTIONS,
    Logger.SILENT,
  )
}
