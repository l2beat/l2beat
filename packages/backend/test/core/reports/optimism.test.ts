import { AssetId, ProjectId, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { convertBalance } from '../../../src/core/reports/createReport'
import {
  amendAggregateReport,
  OP_TOKEN_BALANCE,
} from '../../../src/core/reports/optimism'
import { AggregateReportRecord } from '../../../src/peripherals/database/AggregateReportRepository'
import { PriceRecord } from '../../../src/peripherals/database/PriceRepository'

describe.skip(amendAggregateReport.name, () => {
  const NOW = UnixTime.now()
  const OP_PRICE = 100
  const ETH_PRICE = 2000
  const PRICES: PriceRecord[] = [
    {
      timestamp: NOW,
      assetId: AssetId('op-optimism'),
      priceUsd: OP_PRICE,
    },
    {
      timestamp: NOW,
      assetId: AssetId.ETH,
      priceUsd: ETH_PRICE,
    },
  ]
  const REPORTS: AggregateReportRecord[] = [
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
  const { balanceUsd: opTvlUsd, balanceEth: opTvlEth } = convertBalance(
    OP_PRICE,
    18,
    OP_TOKEN_BALANCE,
    ETH_PRICE,
  )

  it('adds op-optimism to an empty reports array', () => {
    const result = amendAggregateReport([], PRICES, NOW)
    expect(result).toEqual([
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

  it('adds op-optimism to aggregated reports array', () => {
    const result = amendAggregateReport(REPORTS, PRICES, NOW)

    expect(result).toEqual([
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
    ])
  })

  it('does nothing if no prices provided', () => {
    const result = amendAggregateReport(REPORTS, PRICES, NOW)
    expect(result).toEqual(REPORTS)
  })
})
