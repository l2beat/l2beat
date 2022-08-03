import { AssetId, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import {
  addOpTokenReport,
  OP_TOKEN_ID,
  OP_TOKEN_SINCE_TIMESTAMP,
  OPTIMISM_PROJECT_ID,
} from '../../../src/core/reports/optimism'
import { ReportRecord } from '../../../src/peripherals/database/ReportRepository'

describe(addOpTokenReport.name, () => {
  it('returns untouched if op price missing', () => {
    const reports: ReportRecord[] = []
    const timestamp = UnixTime.now()
    const prices = [
      { timestamp, priceUsd: Math.random(), assetId: AssetId.ETH },
    ]
    addOpTokenReport(reports, prices, timestamp)
    expect(reports).toEqual([])
  })

  it('returns untouched if eth price missing', () => {
    const reports: ReportRecord[] = []
    const timestamp = UnixTime.now()
    const prices = [
      { timestamp, priceUsd: Math.random(), assetId: OP_TOKEN_ID },
    ]
    addOpTokenReport(reports, prices, timestamp)
    expect(reports).toEqual([])
  })

  it('returns untouched if too early timestamp', () => {
    const reports: ReportRecord[] = []
    const timestamp = OP_TOKEN_SINCE_TIMESTAMP.add(-1, 'hours')
    const prices = [
      { timestamp, priceUsd: Math.random(), assetId: AssetId.ETH },
      { timestamp, priceUsd: Math.random(), assetId: OP_TOKEN_ID },
    ]
    addOpTokenReport(reports, prices, timestamp)
    expect(reports).toEqual([])
  })

  it('updates balances if op report present already', () => {
    const timestamp = UnixTime.now()
    const prices = [
      { timestamp, priceUsd: 1, assetId: AssetId.ETH },
      { timestamp, priceUsd: 2, assetId: OP_TOKEN_ID },
    ]
    const opReport = {
      asset: OP_TOKEN_ID,
      balance: 0n,
      balanceEth: 0n,
      balanceUsd: 0n,
      projectId: OPTIMISM_PROJECT_ID,
      timestamp,
    }
    const reports: ReportRecord[] = [opReport]
    addOpTokenReport(reports, prices, timestamp)
    expect(reports).toEqual([
      {
        ...opReport,
        balance: 214748364000000000000000000n,
        balanceEth: 429496728000000n,
        balanceUsd: 42949672800n,
      },
    ])
  })

  it('adds op report if not present', () => {
    const timestamp = UnixTime.now()
    const prices = [
      { timestamp, priceUsd: 1, assetId: AssetId.ETH },
      { timestamp, priceUsd: 2, assetId: OP_TOKEN_ID },
    ]
    const reports: ReportRecord[] = []
    addOpTokenReport(reports, prices, timestamp)
    expect(reports).toEqual([
      {
        asset: OP_TOKEN_ID,
        projectId: OPTIMISM_PROJECT_ID,
        timestamp,
        balance: 214748364000000000000000000n,
        balanceEth: 429496728000000n,
        balanceUsd: 42949672800n,
      },
    ])
  })
})
