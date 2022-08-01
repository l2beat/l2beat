import { AssetId, ProjectId, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { convertBalance } from '../../../src/core/reports/createReport'
import {
  addOpTokenToReports,
  amendAggregateReport,
  getUsablePrices,
  OP_TOKEN_BALANCE,
} from '../../../src/core/reports/optimism'
import { AggregateReportRecord } from '../../../src/peripherals/database/AggregateReportRepository'
import { PriceRecord } from '../../../src/peripherals/database/PriceRepository'
import { ReportRecord } from '../../../src/peripherals/database/ReportRepository'

const TODAY = UnixTime.now().toStartOf('day')
const YESTERDAY = TODAY.add(-1, 'days')
const OP_PRICE = 100
const OP_PRICE_YESTERDAY = 69
const ETH_PRICE = 2000
const ETH_PRICE_YESTERDAY = 1500
const opPriceToday = {
  timestamp: TODAY,
  assetId: AssetId('op-optimism'),
  priceUsd: OP_PRICE,
}
const opPriceYesterday = {
  timestamp: YESTERDAY,
  assetId: AssetId('op-optimism'),
  priceUsd: OP_PRICE_YESTERDAY,
}
const opPrices: PriceRecord[] = [opPriceYesterday, opPriceToday]
const ethPriceYesterday = {
  timestamp: YESTERDAY,
  assetId: AssetId.ETH,
  priceUsd: ETH_PRICE_YESTERDAY,
}
const ethPriceToday = {
  timestamp: TODAY,
  assetId: AssetId.ETH,
  priceUsd: ETH_PRICE,
}
const ethPrices: PriceRecord[] = [ethPriceYesterday, ethPriceToday]

describe(addOpTokenToReports.name, () => {
  const { balanceUsd: opTvlUsd, balanceEth: opTvlEth } = convertBalance(
    OP_PRICE,
    18,
    OP_TOKEN_BALANCE,
    ETH_PRICE,
  )

  const { balanceUsd: opTvlUsdYesterday, balanceEth: opTvlEthYesterday } =
    convertBalance(
      OP_PRICE_YESTERDAY,
      18,
      OP_TOKEN_BALANCE,
      ETH_PRICE_YESTERDAY,
    )

  it('adds op-optimism to an empty reports array', () => {
    const aggregateReports: AggregateReportRecord[] = []
    const reports: ReportRecord[] = []
    addOpTokenToReports(aggregateReports, reports, opPrices, ethPrices, TODAY)
    expect(aggregateReports).toEqual([
      {
        timestamp: YESTERDAY,
        projectId: ProjectId('optimism'),
        tvlUsd: opTvlUsdYesterday,
        tvlEth: opTvlEthYesterday,
      },
      {
        timestamp: YESTERDAY,
        projectId: ProjectId.ALL,
        tvlUsd: opTvlUsdYesterday,
        tvlEth: opTvlEthYesterday,
      },
      {
        timestamp: TODAY,
        projectId: ProjectId('optimism'),
        tvlUsd: opTvlUsd,
        tvlEth: opTvlEth,
      },
      {
        timestamp: TODAY,
        projectId: ProjectId.ALL,
        tvlUsd: opTvlUsd,
        tvlEth: opTvlEth,
      },
    ])
    expect(reports).toEqual([
      {
        timestamp: TODAY,
        projectId: ProjectId('optimism'),
        asset: AssetId('op-optimism'),
        balanceUsd: opTvlUsd,
        balanceEth: opTvlEth,
        balance: OP_TOKEN_BALANCE,
      },
    ])
  })

  it('adds op-optimism to aggregated reports array', () => {
    const aggregateReports: AggregateReportRecord[] = [
      {
        timestamp: TODAY,
        projectId: ProjectId('optimism'),
        tvlUsd: 420_00n,
        tvlEth: 69_000000n,
      },
      {
        timestamp: TODAY,
        projectId: ProjectId.ALL,
        tvlUsd: 2137_00n,
        tvlEth: 996_000000n,
      },
    ]
    addOpTokenToReports(aggregateReports, [], opPrices, ethPrices, TODAY)
    expect(aggregateReports).toEqual([
      {
        timestamp: TODAY,
        projectId: ProjectId('optimism'),
        tvlUsd: 420_00n + opTvlUsd,
        tvlEth: 69_000000n + opTvlEth,
      },
      {
        timestamp: TODAY,
        projectId: ProjectId.ALL,
        tvlUsd: 2137_00n + opTvlUsd,
        tvlEth: 996_000000n + opTvlEth,
      },
      {
        timestamp: YESTERDAY,
        projectId: ProjectId('optimism'),
        tvlUsd: opTvlUsdYesterday,
        tvlEth: opTvlEthYesterday,
      },
      {
        timestamp: YESTERDAY,
        projectId: ProjectId.ALL,
        tvlUsd: opTvlUsdYesterday,
        tvlEth: opTvlEthYesterday,
      },
    ])
  })
})

describe(getUsablePrices.name, () => {
  it('reduces to prices with matching timestamps', () => {
    const prices = getUsablePrices(opPrices, ethPrices, TODAY)

    expect(prices).toEqual([
      {
        opPrice: opPriceYesterday,
        ethPrice: ethPriceYesterday,
      },
      {
        opPrice: opPriceToday,
        ethPrice: ethPriceToday,
      },
    ])
  })
  it('skips prices after maxTimestamp', () => {
    const prices = getUsablePrices(opPrices, ethPrices, YESTERDAY)

    expect(prices).toEqual([
      {
        opPrice: opPriceYesterday,
        ethPrice: ethPriceYesterday,
      },
    ])
  })

  it('skips eth prices with no matching timestamps', () => {
    const opPrices = [opPriceYesterday]
    const prices = getUsablePrices(opPrices, ethPrices, TODAY)

    expect(prices).toEqual([
      {
        opPrice: opPriceYesterday,
        ethPrice: ethPriceYesterday,
      },
    ])
  })

  it('skips op prices with no matching timestamps', () => {
    const ethPrices = [ethPriceToday]
    const prices = getUsablePrices(opPrices, ethPrices, TODAY)

    expect(prices).toEqual([
      {
        opPrice: opPriceToday,
        ethPrice: ethPriceToday,
      },
    ])
  })

  it('skips not daily prices', () => {
    const notDaily = TODAY.add(-12, 'hours')

    const opPriceNotDaily = {
      ...opPriceToday,
      timestamp: notDaily,
    }

    const ethPriceNotDaily = {
      ...ethPriceToday,
      timestamp: notDaily,
    }

    const prices = getUsablePrices(
      [opPriceNotDaily, opPriceToday],
      [ethPriceNotDaily, ethPriceToday],
      TODAY,
    )

    expect(prices).toEqual([
      {
        opPrice: opPriceToday,
        ethPrice: ethPriceToday,
      },
    ])
  })
})

describe(amendAggregateReport.name, () => {
  const OP_PRICE = 300
  const ETH_PRICE = 1669

  const opPrice = {
    timestamp: TODAY,
    assetId: AssetId('op-optimism'),
    priceUsd: OP_PRICE,
  }

  const ethPrice = {
    timestamp: TODAY,
    assetId: AssetId.ETH,
    priceUsd: ETH_PRICE,
  }

  const { balanceUsd: opTvlUsd, balanceEth: opTvlEth } = convertBalance(
    OP_PRICE,
    18,
    OP_TOKEN_BALANCE,
    ETH_PRICE,
  )

  it('amends the empty array', () => {
    const aggregateReports: AggregateReportRecord[] = []
    amendAggregateReport(opPrice, ethPrice, aggregateReports)
    expect(aggregateReports).toEqual([
      {
        timestamp: TODAY,
        projectId: ProjectId('optimism'),
        tvlUsd: opTvlUsd,
        tvlEth: opTvlEth,
      },
      {
        timestamp: TODAY,
        projectId: ProjectId.ALL,
        tvlUsd: opTvlUsd,
        tvlEth: opTvlEth,
      },
    ])
  })
  it('amends the aggtegated reports', () => {
    const aggregateReports: AggregateReportRecord[] = [
      {
        timestamp: TODAY,
        projectId: ProjectId('optimism'),
        tvlUsd: 2100n,
        tvlEth: 24n,
      },
      {
        timestamp: TODAY,
        projectId: ProjectId('arbitrum'),
        tvlUsd: 1000n,
        tvlEth: 1n,
      },
      {
        timestamp: TODAY,
        projectId: ProjectId.ALL,
        tvlUsd: 12456n,
        tvlEth: 76n,
      },
    ]
    amendAggregateReport(opPrice, ethPrice, aggregateReports)
    expect(aggregateReports).toEqual([
      {
        timestamp: TODAY,
        projectId: ProjectId('optimism'),
        tvlUsd: 2100n + opTvlUsd,
        tvlEth: 24n + opTvlEth,
      },
      {
        timestamp: TODAY,
        projectId: ProjectId('arbitrum'),
        tvlUsd: 1000n,
        tvlEth: 1n,
      },
      {
        timestamp: TODAY,
        projectId: ProjectId.ALL,
        tvlUsd: 12456n + opTvlUsd,
        tvlEth: 76n + opTvlEth,
      },
    ])
  })
})
