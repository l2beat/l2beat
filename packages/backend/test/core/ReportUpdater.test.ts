import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  mock,
  UnixTime,
} from '@l2beat/common'
import { getTokenByAssetId } from '@l2beat/config'
import { expect } from 'earljs'

import { ReportUpdater } from '../../src/core/ReportUpdater'
import { BalanceRecord, BalanceRepository } from '../../src/peripherals/database/BalanceRepository'
import {
  PriceRecord,
  PriceRepository,
} from '../../src/peripherals/database/PriceRepository'
import { ReportRepository } from '../../src/peripherals/database/ReportRepository'

describe(ReportUpdater.name, () => {
  describe(ReportUpdater.prototype.calculateTVL.name, () => {
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

      const result = reportUpdater.calculateTVL(prices,balances)

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

getTokenByAssetId
