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

const NOW = UnixTime.now()
const EARLIER = NOW.add(-1, 'hours')
const OP_PRICE = 100
const OP_PRICE_EARLIER = 69
const ETH_PRICE = 2000
const ETH_PRICE_EARLIER = 1500
const opPriceNow = {
  timestamp: NOW,
  assetId: AssetId('op-optimism'),
  priceUsd: OP_PRICE,
}
const opPriceEarlier = {
  timestamp: EARLIER,
  assetId: AssetId('op-optimism'),
  priceUsd: OP_PRICE_EARLIER,
}
const opPrices: PriceRecord[] = [opPriceEarlier, opPriceNow]
const ethPriceEarlier = {
  timestamp: EARLIER,
  assetId: AssetId.ETH,
  priceUsd: ETH_PRICE_EARLIER,
}
const ethPriceNow = {
  timestamp: NOW,
  assetId: AssetId.ETH,
  priceUsd: ETH_PRICE,
}
const ethPrices: PriceRecord[] = [ethPriceEarlier, ethPriceNow]

describe(addOpTokenToReports.name, () => {
  const { balanceUsd: opTvlUsd, balanceEth: opTvlEth } = convertBalance(
    OP_PRICE,
    18,
    OP_TOKEN_BALANCE,
    ETH_PRICE,
  )

  const { balanceUsd: opTvlUsdEarlier, balanceEth: opTvlEthEarlier } =
    convertBalance(OP_PRICE_EARLIER, 18, OP_TOKEN_BALANCE, ETH_PRICE_EARLIER)

  it('adds op-optimism to an empty reports array', () => {
    const aggregateReports: AggregateReportRecord[] = []
    const reports: ReportRecord[] = []
    addOpTokenToReports(aggregateReports, reports, opPrices, ethPrices, NOW)
    expect(aggregateReports).toEqual([
      {
        timestamp: EARLIER,
        projectId: ProjectId('optimism'),
        tvlUsd: opTvlUsdEarlier,
        tvlEth: opTvlEthEarlier,
      },
      {
        timestamp: EARLIER,
        projectId: ProjectId.ALL,
        tvlUsd: opTvlUsdEarlier,
        tvlEth: opTvlEthEarlier,
      },
      {
        timestamp: NOW,
        projectId: ProjectId('optimism'),
        tvlUsd: opTvlUsd,
        tvlEth: opTvlEth,
      },
      {
        timestamp: NOW,
        projectId: ProjectId.ALL,
        tvlUsd: opTvlUsd,
        tvlEth: opTvlEth,
      },
    ])
    expect(reports).toEqual([
      {
        timestamp: NOW,
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
        timestamp: NOW,
        projectId: ProjectId('optimism'),
        tvlUsd: 420_00n,
        tvlEth: 69_000000n,
      },
      {
        timestamp: NOW,
        projectId: ProjectId.ALL,
        tvlUsd: 2137_00n,
        tvlEth: 996_000000n,
      },
    ]
    addOpTokenToReports(aggregateReports, [], opPrices, ethPrices, NOW)
    expect(aggregateReports).toEqual([
      {
        timestamp: NOW,
        projectId: ProjectId('optimism'),
        tvlUsd: 420_00n + opTvlUsd,
        tvlEth: 69_000000n + opTvlEth,
      },
      {
        timestamp: NOW,
        projectId: ProjectId.ALL,
        tvlUsd: 2137_00n + opTvlUsd,
        tvlEth: 996_000000n + opTvlEth,
      },
      {
        timestamp: EARLIER,
        projectId: ProjectId('optimism'),
        tvlUsd: opTvlUsdEarlier,
        tvlEth: opTvlEthEarlier,
      },
      {
        timestamp: EARLIER,
        projectId: ProjectId.ALL,
        tvlUsd: opTvlUsdEarlier,
        tvlEth: opTvlEthEarlier,
      },
    ])
  })
})

describe(getUsablePrices.name, () => {
  it('reduces to prices with matching timestamps', () => {
    const prices = getUsablePrices(opPrices, ethPrices, NOW)

    expect(prices).toEqual([
      {
        opPrice: opPriceEarlier,
        ethPrice: ethPriceEarlier,
      },
      {
        opPrice: opPriceNow,
        ethPrice: ethPriceNow,
      },
    ])
  })
  it('skips prices after maxTimestamp', () => {
    const prices = getUsablePrices(opPrices, ethPrices, EARLIER)

    expect(prices).toEqual([
      {
        opPrice: opPriceEarlier,
        ethPrice: ethPriceEarlier,
      },
    ])
  })

  it('skips eth prices with no matching timestamps', () => {
    const opPrices = [
      opPriceEarlier
    ]
    const prices = getUsablePrices(opPrices, ethPrices, NOW)

    expect(prices).toEqual([
      {
        opPrice: opPriceEarlier,
        ethPrice: ethPriceEarlier,
      },
    ])
  })

  it('skips op prices with no matching timestamps', () => {
    const ethPrices = [
      ethPriceNow
    ]
    const prices = getUsablePrices(opPrices, ethPrices, NOW)

    expect(prices).toEqual([
      {
        opPrice: opPriceNow,
        ethPrice: ethPriceNow,
      },
    ])
  })
})

describe(amendAggregateReport.name, () => {
  const OP_PRICE = 300
  const ETH_PRICE = 1669

  const opPrice = {
    timestamp: NOW,
    assetId: AssetId('op-optimism'),
    priceUsd: OP_PRICE,
  }

  const ethPrice = {
    timestamp: NOW,
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
        timestamp: NOW,
        projectId: ProjectId('optimism'),
        tvlUsd: opTvlUsd,
        tvlEth: opTvlEth,
      },
      {
        timestamp: NOW,
        projectId: ProjectId.ALL,
        tvlUsd: opTvlUsd,
        tvlEth: opTvlEth,
      },
    ])
  })
  it('amends the aggtegated reports', () => {
    const aggregateReports: AggregateReportRecord[] = [
      {
        timestamp: NOW,
        projectId: ProjectId('optimism'),
        tvlUsd: 2100n,
        tvlEth: 24n,
      },
      {
        timestamp: NOW,
        projectId: ProjectId('arbitrum'),
        tvlUsd: 1000n,
        tvlEth: 1n,
      },
      {
        timestamp: NOW,
        projectId: ProjectId.ALL,
        tvlUsd: 12456n,
        tvlEth: 76n,
      },
    ]
    amendAggregateReport(opPrice, ethPrice, aggregateReports)
    expect(aggregateReports).toEqual([
      {
        timestamp: NOW,
        projectId: ProjectId('optimism'),
        tvlUsd: 2100n + opTvlUsd,
        tvlEth: 24n + opTvlEth,
      },
      {
        timestamp: NOW,
        projectId: ProjectId('arbitrum'),
        tvlUsd: 1000n,
        tvlEth: 1n,
      },
      {
        timestamp: NOW,
        projectId: ProjectId.ALL,
        tvlUsd: 12456n + opTvlUsd,
        tvlEth: 76n + opTvlEth,
      },
    ])
  })
})
