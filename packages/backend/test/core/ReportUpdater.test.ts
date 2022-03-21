import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  mock,
  UnixTime,
} from '@l2beat/common'
import { expect } from 'earljs'

import { calculateReport, ReportUpdater } from '../../src/core/ReportUpdater'
import { BalanceRecord, BalanceRepository } from '../../src/peripherals/database/BalanceRepository'
import {
  PriceRecord,
  PriceRepository,
} from '../../src/peripherals/database/PriceRepository'
import { ReportRepository } from '../../src/peripherals/database/ReportRepository'

describe(ReportUpdater.name, () => {
  describe(ReportUpdater.prototype.calculateTvls.name, () => {
    it('**name**', async () => {
      const START = UnixTime.now().toStartOf('hour')
      const MOCK_BRIDGE = EthereumAddress(
        '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515'
      )

      const MOCK_ASSET =  AssetId('dai-dai-stablecoin')
      const MOCK_COINGECKO = CoingeckoId('dai')

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
          blockNumber: 1000n,
          holderAddress: MOCK_BRIDGE,
          assetId: MOCK_ASSET,
          balance: 100000n,
        },
      ]

      const priceRepository = mock<PriceRepository>()
      const balanceRepository = mock<BalanceRepository>()
      const reportRepository = mock<ReportRepository>()

      const reportUpdater = new ReportUpdater(
        priceRepository,
        balanceRepository,
        reportRepository
      )

      const result = reportUpdater.calculateTvls(prices,balances)

      expect(result).toEqual([{
        blockNumber: 1000n,
        timestamp: START,
        bridge: MOCK_BRIDGE,
        asset: MOCK_ASSET,
        usdTVL: 10000000n,
        ethTVL: 100n,
      }])
    })
  })
})

describe(calculateReport.name, () => {
  it('price: 3.20 $ || balance: 22.123456', async () => {
    const price: PriceRecord = {
      priceUsd: 3.20,
      timestamp: UnixTime.now(),
      coingeckoId: CoingeckoId('token')
    }

    const balance: BalanceRecord = {
      balance: 22123456n,
      assetId: AssetId('tok-token'),
      blockNumber: 100000n,
      holderAddress: EthereumAddress('0xcEe284F754E854890e311e3280b767F80797180d')
    }

    const decimals = 6

    const ethPrice = 1000

    const result = calculateReport(price,decimals,balance,ethPrice)

    expect(result).toEqual({
      blockNumber: balance.blockNumber,
      timestamp: price.timestamp,
      bridge: balance.holderAddress,
      asset: balance.assetId,
      usdTVL: 70795059200000000000n,
      ethTVL: 70795059200000000n,
    })
  })

  it('price: 3.20 $ || balance: 22.123456789123456789', async () => {
    const price: PriceRecord = {
      priceUsd: 3.20,
      timestamp: UnixTime.now(),
      coingeckoId: CoingeckoId('token')
    }

    const balance: BalanceRecord = {
      balance: 22123456789123456789n,
      assetId: AssetId('tok-token'),
      blockNumber: 100000n,
      holderAddress: EthereumAddress('0xcEe284F754E854890e311e3280b767F80797180d')
    }

    const decimals = 18

    const ethPrice = 1000

    const result = calculateReport(price,decimals,balance,ethPrice)

    expect(result).toEqual({
      blockNumber: balance.blockNumber,
      timestamp: price.timestamp,
      bridge: balance.holderAddress,
      asset: balance.assetId,
      usdTVL: 70795061725195061724n,
      ethTVL: 70795061725195061n,
    })
  })
})


