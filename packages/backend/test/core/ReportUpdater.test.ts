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

import {
  convertBalance,
  createReport,
  getBigIntPrice,
  ReportUpdater,
} from '../../src/core/ReportUpdater'
import { ProjectInfo, Token } from '../../src/model'
import {
  BalanceRecord,
  BalanceRepository,
} from '../../src/peripherals/database/BalanceRepository'
import {
  PriceRecord,
  PriceRepository,
} from '../../src/peripherals/database/PriceRepository'
import { ReportRepository } from '../../src/peripherals/database/ReportRepository'
import { fakeBalance } from '../fakes'

describe(ReportUpdater.name, () => {
  const START = UnixTime.now().toStartOf('hour')
  const MOCK_BRIDGE = EthereumAddress(
    '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
  )

  const ARBITRUM = ProjectId('arbitrum')
  const OPTIMISM = ProjectId('optimism')
  const ARBITRUM_ADDRESS = EthereumAddress.random()
  const OPTIMISM_ADDRESS = EthereumAddress.random()
  const MOCK_ASSET = AssetId('dai-dai-stablecoin')
  const MOCK_COINGECKO = CoingeckoId('dai')

  const PROJECTS: ProjectInfo[] = [
    {
      projectId: ARBITRUM,
      name: 'Arbitrum',
      bridges: [
        {
          address: ARBITRUM_ADDRESS.toString(),
          sinceBlock: 0,
          tokens: [
            mockToken(MOCK_ASSET, 'DAI'),
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
          address: OPTIMISM_ADDRESS.toString(),
          sinceBlock: 0,
          tokens: [mockToken(MOCK_ASSET, 'DAI')],
        },
      ],
    },
  ]

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
        fakePrice({ assetId: MOCK_ASSET }),
        fakePrice(),
      ]

      const balances: BalanceRecord[] = [
        {
          timestamp: START,
          holderAddress: MOCK_BRIDGE,
          assetId: MOCK_ASSET,
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
        TOKENS,
        Logger.SILENT,
      )

      await reportUpdater.update([START, START.add(1, 'hours')])

      expect(reportRepository.addOrUpdateMany.calls.length).toEqual(2)
    })
  })

  describe(ReportUpdater.prototype.createReports.name, () => {
    it('correctly aggregates many calculated balances', () => {
      const prices: PriceRecord[] = [
        {
          priceUsd: 3.2,
          assetId: MOCK_ASSET,
          timestamp: START,
        },
        {
          priceUsd: 1000,
          assetId: AssetId.ETH,
          timestamp: START,
        },
      ]

      const balances: BalanceRecord[] = [
        fakeBalance({
          assetId: prices[0].assetId,
          holderAddress: OPTIMISM_ADDRESS,
        }),
        fakeBalance({
          assetId: prices[1].assetId,
          holderAddress: ARBITRUM_ADDRESS,
        }),
      ]

      const reportUpdater = new ReportUpdater(
        mock<PriceRepository>(),
        mock<BalanceRepository>(),
        mock<ReportRepository>(),
        PROJECTS,
        TOKENS,
        Logger.SILENT,
      )

      const result = reportUpdater.createReports(prices, balances)

      expect(result).toBeAnArrayWith(
        createReport(
          prices[0],
          18,
          {
            projectId: OPTIMISM,
            assetId: prices[0].assetId,
            balance: balances[0].balance,
          },
          1000,
        ),
        createReport(
          prices[1],
          18,
          {
            projectId: ARBITRUM,
            assetId: prices[1].assetId,
            balance: balances[1].balance,
          },
          1000,
        ),
      )
    })
  })

  describe(createReport.name, () => {
    it('price: 3.20 $ || balance: 22.123456', async () => {
      const price = fakePrice({ priceUsd: 3.2 })
      const balance = {
        projectId: ARBITRUM,
        assetId: price.assetId,
        balance: 22123456n,
      }

      const decimals = 6

      const ethPrice = 1000

      const result = createReport(price, decimals, balance, ethPrice)

      expect(result).toEqual({
        timestamp: price.timestamp,
        projectId: balance.projectId,
        asset: balance.assetId,
        balance: balance.balance,
        balanceUsd: 7079n,
        balanceEth: 70795n,
      })
    })

    it('price: 3.20 $ || balance: 22.123456789123456789', async () => {
      const price = fakePrice({ priceUsd: 3.2 })
      const balance = {
        projectId: ARBITRUM,
        balance: 22123456789123456789n,
        assetId: price.assetId,
      }

      const decimals = 18

      const ethPrice = 1000

      const result = createReport(price, decimals, balance, ethPrice)

      expect(result).toEqual({
        timestamp: price.timestamp,
        projectId: balance.projectId,
        asset: balance.assetId,
        balance: balance.balance,
        balanceUsd: 7079n,
        balanceEth: 70795n,
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

describe(convertBalance.name, () => {
  const runs = [
    {
      priceUsd: 1,
      decimals: 0,
      balance: 1n,
      ethPrice: 1,
      balanceUsd: 100n,
      balanceEth: 1000000n,
    },
    {
      priceUsd: 2,
      decimals: 3,
      balance: 2000n,
      ethPrice: 1500,
      balanceUsd: 400n,
      balanceEth: 2666n,
    },
    {
      priceUsd: 3.5,
      decimals: 18,
      balance: 12345n * 10n ** 18n,
      ethPrice: 2334,
      balanceUsd: 4320750n,
      balanceEth: 18512210n,
    },
  ]

  for (const run of runs) {
    it(`calculates price:${run.priceUsd}, decimals: ${run.decimals}, balance: ${run.balance}, ethPrice: ${run.ethPrice}`, () => {
      expect(
        convertBalance(run.priceUsd, run.decimals, run.balance, run.ethPrice),
      ).toEqual({
        balanceUsd: run.balanceUsd,
        balanceEth: run.balanceEth,
      })
    })
  }
})

function fakePrice(price?: Partial<PriceRecord>): PriceRecord {
  return {
    priceUsd: Math.floor(Math.random() * 100) / 10,
    timestamp: UnixTime.now(),
    assetId: AssetId.ETH,
    ...price,
  }
}

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
