import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  Logger,
  mock,
  ProjectId,
  UnixTime,
} from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { expect, mockFn } from 'earljs'

import { ReportUpdater } from '../../../src/core/reports/ReportUpdater'
import { ProjectInfo } from '../../../src/model'
import {
  BalanceRecord,
  BalanceRepository,
} from '../../../src/peripherals/database/BalanceRepository'
import {
  PriceRecord,
  PriceRepository,
} from '../../../src/peripherals/database/PriceRepository'
import { ReportRepository } from '../../../src/peripherals/database/ReportRepository'

describe(ReportUpdater.name, () => {
  const START = UnixTime.now().toStartOf('hour')
  const MOCK_BRIDGE = EthereumAddress(
    '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
  )

  const ARBITRUM = ProjectId('arbitrum')
  const OPTIMISM = ProjectId('optimism')
  const ARBITRUM_ADDRESS = EthereumAddress.random()
  const OPTIMISM_ADDRESS = EthereumAddress.random()

  const PROJECTS: ProjectInfo[] = [
    {
      projectId: ARBITRUM,
      name: 'Arbitrum',
      bridges: [
        {
          address: ARBITRUM_ADDRESS,
          sinceBlock: 0,
          tokens: [
            mockToken(AssetId.DAI, 'DAI'),
            mockToken(AssetId.ETH, 'WETH'),
          ],
        },
      ],
    },
    {
      projectId: OPTIMISM,
      name: 'Optimism',
      bridges: [
        {
          address: OPTIMISM_ADDRESS,
          sinceBlock: 0,
          tokens: [mockToken(AssetId.DAI, 'DAI')],
        },
      ],
    },
  ]

  describe(ReportUpdater.prototype.update.name, () => {
    it('calculates and saves to DB', async () => {
      const prices: PriceRecord[] = []

      const balances: BalanceRecord[] = [
        {
          timestamp: START,
          holderAddress: MOCK_BRIDGE,
          assetId: AssetId.DAI,
          balance: 22123456789123456789n,
        },
      ]

      const priceRepository = mock<PriceRepository>({
        getByTimestamp: mockFn()
          .returnsOnce(prices)
          .returnsOnce(
            prices.map((p) => ({ ...p, timestamp: START.add(1, 'hours') })),
          ),
      })
      const balanceRepository = mock<BalanceRepository>({
        getByTimestamp: mockFn()
          .returnsOnce(balances)
          .returnsOnce(
            balances.map((b) => ({ ...b, timestamp: START.add(1, 'hours') })),
          ),
      })
      const reportRepository = mock<ReportRepository>({
        addOrUpdateMany: mockFn().returns({}),
      })

      const reportUpdater = new ReportUpdater(
        priceRepository,
        balanceRepository,
        reportRepository,
        PROJECTS,
        Logger.SILENT,
      )

      await reportUpdater.update([START, START.add(1, 'hours')])

      expect(reportRepository.addOrUpdateMany.calls.length).toEqual(2)
    })
  })
})

function mockToken(assetId: AssetId, symbol: string): TokenInfo {
  return {
    id: assetId,
    name: '',
    coingeckoId: CoingeckoId('-'),
    address: EthereumAddress.random(),
    symbol,
    decimals: 0,
    sinceBlock: 0,
    category: 'other',
  }
}
