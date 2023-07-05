import { AssetId, ProjectId, UnixTime, ValueType } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import {
  addOpTokenReport,
  OP_TOKEN_ID,
  OP_TOKEN_SINCE_TIMESTAMP,
  OPTIMISM_PROJECT_ID,
  UPDATE_TIMESTAMP,
} from './optimism'

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

  describe('updates balances if op report present already', () => {
    const timestamp = UPDATE_TIMESTAMP.add(-1, 'hours')
    const prices = [
      { timestamp, priceUsd: 1, assetId: AssetId.ETH },
      { timestamp, priceUsd: 2, assetId: OP_TOKEN_ID },
    ]
    const opReport: ReportRecord = {
      asset: OP_TOKEN_ID,
      type: ValueType.NMV,
      amount: 0n,
      usdValue: 0n,
      ethValue: 0n,
      projectId: OPTIMISM_PROJECT_ID,
      timestamp,
    }
    const otherReports: ReportRecord[] = [
      {
        asset: AssetId.DAI,
        type: ValueType.CBV,
        amount: 1n,
        ethValue: 1n,
        usdValue: 1n,
        projectId: ProjectId('arbitrum'),
        timestamp,
      },
      {
        asset: AssetId.ETH,
        type: ValueType.CBV,
        amount: 2n,
        ethValue: 2n,
        usdValue: 2n,
        projectId: ProjectId('arbitrum'),
        timestamp,
      },
    ]
    const reports: ReportRecord[] = [...otherReports, opReport]
    addOpTokenReport(reports, prices, timestamp)
    expect(reports).toEqual([
      ...otherReports,
      {
        ...opReport,
        type: ValueType.NMV,
        amount: 214748364000000000000000000n,
        ethValue: 429496728000000n,
        usdValue: 42949672800n,
      },
    ])
  })

  it('adds op report if not present', () => {
    const timestamp = UPDATE_TIMESTAMP.add(-1, 'hours')
    const prices = [
      { timestamp, priceUsd: 1, assetId: AssetId.ETH },
      { timestamp, priceUsd: 2, assetId: OP_TOKEN_ID },
    ]
    const reports: ReportRecord[] = []
    addOpTokenReport(reports, prices, timestamp)
    expect(reports).toEqual([
      {
        asset: OP_TOKEN_ID,
        type: ValueType.NMV,
        projectId: OPTIMISM_PROJECT_ID,
        timestamp,
        amount: 214748364000000000000000000n,
        ethValue: 429496728000000n,
        usdValue: 42949672800n,
      },
    ])
  })

  it('numbers match after the update', () => {
    const timestamp = UPDATE_TIMESTAMP
    const prices = [
      { timestamp, priceUsd: 1, assetId: AssetId.ETH },
      { timestamp, priceUsd: 2, assetId: OP_TOKEN_ID },
    ]
    const reports: ReportRecord[] = []
    addOpTokenReport(reports, prices, timestamp)
    expect(reports).toEqual([
      {
        asset: OP_TOKEN_ID,
        type: ValueType.NMV,
        projectId: OPTIMISM_PROJECT_ID,
        timestamp,
        amount: 644594782000000000000000000n,
        ethValue: 1289189564000000n,
        usdValue: 128918956400n,
      },
    ])
  })
})
