import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  Logger,
  mock,
  UnixTime,
} from '@l2beat/common'
import { expect, mockFn } from 'earljs'

import {
  calculateTVL,
  getBigIntPrice,
  ReportUpdater,
} from '../../src/core/ReportUpdater'
import { Token } from '../../src/model'
import {
  BalanceRecord,
  BalanceRepository,
} from '../../src/peripherals/database/BalanceRepository'
import {
  PriceRecord,
  PriceRepository,
} from '../../src/peripherals/database/PriceRepository'
import { ReportRepository } from '../../src/peripherals/database/ReportRepository'

describe(ReportUpdater.name, () => {
  const START = UnixTime.now().toStartOf('hour')
  const START_BN = 1000n
  const MOCK_BRIDGE = EthereumAddress(
    '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515'
  )

  const MOCK_ASSET = AssetId('dai-dai-stablecoin')
  const MOCK_COINGECKO = CoingeckoId('dai')

  const TOKENS: Token[] = [
    {
      id: AssetId('eth-ether'),
      symbol: 'ETH',
      decimals: 18,
      coingeckoId: CoingeckoId('ethereum'),
    },
    {
      id: MOCK_ASSET,
      coingeckoId: MOCK_COINGECKO,
      address: EthereumAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F'),
      symbol: 'DAI',
      decimals: 18,
    },
  ]

  describe(ReportUpdater.prototype.update.name, () => {
    it('calculates and saves to DB', async () => {
      const prices: PriceRecord[] = [
        {
          priceUsd: 3.2,
          coingeckoId: MOCK_COINGECKO,
          timestamp: START,
        },
        {
          priceUsd: 1000,
          coingeckoId: CoingeckoId('ethereum'),
          timestamp: START,
        },
      ]

      const balances: BalanceRecord[] = [
        {
          blockNumber: START_BN,
          holderAddress: MOCK_BRIDGE,
          assetId: MOCK_ASSET,
          balance: 22123456789123456789n,
        },
      ]

      const priceRepository = mock<PriceRepository>({
        getByTimestamp: mockFn()
          .returnsOnce(prices)
          .returnsOnce(
            prices.map((p) => ({ ...p, timestamp: START.add(1, 'hours') }))
          ),
      })
      const balanceRepository = mock<BalanceRepository>({
        getByBlock: mockFn()
          .returnsOnce(balances)
          .returnsOnce(
            balances.map((b) => ({ ...b, blockNumber: START_BN + 200n }))
          ),
      })
      const reportRepository = mock<ReportRepository>({
        addOrUpdateMany: mockFn().returns({}),
      })

      const reportUpdater = new ReportUpdater(
        priceRepository,
        balanceRepository,
        reportRepository,
        TOKENS,
        Logger.SILENT
      )

      await reportUpdater.update([
        { timestamp: START, blockNumber: START_BN },
        { timestamp: START.add(1, 'hours'), blockNumber: START_BN + 200n },
      ])

      expect(reportRepository.addOrUpdateMany.calls.length).toEqual(2)
    })
  })

  describe(ReportUpdater.prototype.calculateTvls.name, () => {
    it('correctly aggregates many calculated tvls', () => {
      const prices: PriceRecord[] = [
        {
          priceUsd: 3.2,
          coingeckoId: MOCK_COINGECKO,
          timestamp: START,
        },
        {
          priceUsd: 1000,
          coingeckoId: CoingeckoId('ethereum'),
          timestamp: START,
        },
      ]

      const balances: BalanceRecord[] = [
        {
          blockNumber: START_BN,
          holderAddress: MOCK_BRIDGE,
          assetId: MOCK_ASSET,
          balance: 22123456789123456789n,
        },
        {
          blockNumber: START_BN,
          holderAddress: MOCK_BRIDGE,
          assetId: AssetId.ETH,
          balance: 22123456789123456789n,
        },
      ]

      const reportUpdater = new ReportUpdater(
        mock<PriceRepository>(),
        mock<BalanceRepository>(),
        mock<ReportRepository>(),
        TOKENS,
        Logger.SILENT
      )

      const result = reportUpdater.calculateTvls(prices, balances)

      expect(result).toEqual([
        calculateTVL(prices[0], 18, balances[0], 1000),
        calculateTVL(prices[1], 18, balances[1], 1000),
      ])
    })
  })

  describe(calculateTVL.name, () => {
    it('price: 3.20 $ || balance: 22.123456', async () => {
      const price: PriceRecord = {
        priceUsd: 3.2,
        timestamp: UnixTime.now(),
        coingeckoId: CoingeckoId('token'),
      }

      const balance: BalanceRecord = {
        balance: 22123456n,
        assetId: AssetId('tok-token'),
        blockNumber: 100000n,
        holderAddress: EthereumAddress(
          '0xcEe284F754E854890e311e3280b767F80797180d'
        ),
      }

      const decimals = 6

      const ethPrice = 1000

      const result = calculateTVL(price, decimals, balance, ethPrice)

      expect(result).toEqual({
        blockNumber: balance.blockNumber,
        timestamp: price.timestamp,
        bridge: balance.holderAddress,
        asset: balance.assetId,
        balance: balance.balance,
        usdTVL: 7079n,
        ethTVL: 70795n,
      })
    })

    it('price: 3.20 $ || balance: 22.123456789123456789', async () => {
      const price: PriceRecord = {
        priceUsd: 3.2,
        timestamp: UnixTime.now(),
        coingeckoId: CoingeckoId('token'),
      }

      const balance: BalanceRecord = {
        balance: 22123456789123456789n,
        assetId: AssetId('tok-token'),
        blockNumber: 100000n,
        holderAddress: EthereumAddress(
          '0xcEe284F754E854890e311e3280b767F80797180d'
        ),
      }

      const decimals = 18

      const ethPrice = 1000

      const result = calculateTVL(price, decimals, balance, ethPrice)

      expect(result).toEqual({
        blockNumber: balance.blockNumber,
        timestamp: price.timestamp,
        bridge: balance.holderAddress,
        asset: balance.assetId,
        balance: balance.balance,
        usdTVL: 7079n,
        ethTVL: 70795n,
      })
    })
  })

  describe(getBigIntPrice.name, () => {
    it('$1.23 at 18 decimals', () => {
      const result = getBigIntPrice(1.23, 18)
      expect(result).toEqual(1230000000000000000n)
    })

    it('$1.23 at 6 decimals', () => {
      const result = getBigIntPrice(1.23, 6)
      expect(result).toEqual(1230000000000000000000000000000n)
    })

    it('$1.23 at 2 decimals', () => {
      const result = getBigIntPrice(1.23, 2)
      expect(result).toEqual(12300000000000000000000000000000000n)
    })

    it('$6789 at 18 decimals', () => {
      const result = getBigIntPrice(6789, 18)
      expect(result).toEqual(6789000000000000000000n)
    })

    it('$6789 at 6 decimals', () => {
      const result = getBigIntPrice(6789, 6)
      expect(result).toEqual(6789000000000000000000000000000000n)
    })

    it('$6789 at 2 decimals', () => {
      const result = getBigIntPrice(6789, 2)
      expect(result).toEqual(67890000000000000000000000000000000000n)
    })

    it('$0.00057 at 18 decimals', () => {
      const result = getBigIntPrice(0.00057, 18)
      expect(result).toEqual(570000000000000n)
    })

    it('$0.00057 at 6 decimals', () => {
      const result = getBigIntPrice(0.00057, 6)
      expect(result).toEqual(570000000000000000000000000n)
    })

    it('$0.00057 at 2 decimals', () => {
      const result = getBigIntPrice(0.00057, 2)
      expect(result).toEqual(5700000000000000000000000000000n)
    })
  })
})
