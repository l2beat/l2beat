import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  mock,
  UnixTime,
} from '@l2beat/common'
import { expect, mockFn } from 'earljs'

import {
  calculateTVL,
  getBigIntPrice,
  ReportUpdater,
} from '../../src/core/ReportUpdater'
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

  describe(ReportUpdater.prototype.update.name, () => {
    it('calculates and saves to DB', async () => {
      const prices: PriceRecord[] = [
        {
          priceUsd: 100,
          coingeckoId: MOCK_COINGECKO,
          timestamp: START,
        },
        {
          priceUsd: 2000,
          coingeckoId: CoingeckoId('ethereum'),
          timestamp: START,
        },
      ]

      const balances: BalanceRecord[] = [
        {
          blockNumber: START_BN,
          holderAddress: MOCK_BRIDGE,
          assetId: MOCK_ASSET,
          balance: 100000n,
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
        addOrUpdate: mockFn().returns({}),
      })

      const reportUpdater = new ReportUpdater(
        priceRepository,
        balanceRepository,
        reportRepository
      )

      await reportUpdater.update([
        { timestamp: START, blockNumber: 1000n },
        { timestamp: START.add(1, 'hours'), blockNumber: 1200n },
      ])

      expect(reportRepository.addOrUpdate.calls.length).toEqual(2)
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
          balance: 100000n,
        },
      ]

      const reportUpdater = new ReportUpdater(
        mock<PriceRepository>(),
        mock<BalanceRepository>(),
        mock<ReportRepository>()
      )

      const result = reportUpdater.calculateTvls(prices, balances)

      expect(result).toEqual([calculateTVL(prices[0], 18, balances[0], 1000)])
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
        usdTVL: 7079n,
        ethTVL: 70795059n,
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
        usdTVL: 7079n,
        ethTVL: 70795061n,
      })
    })
  })

  describe(getBigIntPrice.name, () => {
    const PRICE = 1.23

    it('18 decimals', () => {
      const result = getBigIntPrice(PRICE, 18)
      expect(result).toEqual(1230000000000000000n)
    })

    it('6 decimals', () => {
      const result = getBigIntPrice(PRICE, 6)
      expect(result).toEqual(1230000000000000000000000000000n)
    })

    it('2 decimals', () => {
      const result = getBigIntPrice(PRICE, 2)
      expect(result).toEqual(12300000000000000000000000000000000n)
    })
  })
})
