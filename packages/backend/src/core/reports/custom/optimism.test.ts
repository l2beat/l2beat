import {
  AssetId,
  ChainId,
  ProjectId,
  UnixTime,
  ValueType,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import {
  genOpTokenReport,
  OP_TOKEN_ID,
  OP_TOKEN_SINCE_TIMESTAMP,
  UPDATE_TIMESTAMP,
} from './optimism'

describe(genOpTokenReport.name, () => {
  it('returns untouched if op price missing', () => {
    const timestamp = UnixTime.now()
    const prices = [
      { timestamp, priceUsd: Math.random(), assetId: AssetId.ETH },
    ]

    expect(genOpTokenReport(prices, timestamp)).toEqual([])
  })

  it('returns untouched if eth price missing', () => {
    const timestamp = UnixTime.now()
    const prices = [
      { timestamp, priceUsd: Math.random(), assetId: OP_TOKEN_ID },
    ]

    expect(genOpTokenReport(prices, timestamp)).toEqual([])
  })

  it('returns untouched if too early timestamp', () => {
    const timestamp = OP_TOKEN_SINCE_TIMESTAMP.add(-1, 'hours')
    const prices = [
      { timestamp, priceUsd: Math.random(), assetId: AssetId.ETH },
      { timestamp, priceUsd: Math.random(), assetId: OP_TOKEN_ID },
    ]

    expect(genOpTokenReport(prices, timestamp)).toEqual([])
  })

  it('adds op report if not present', () => {
    const timestamp = UPDATE_TIMESTAMP.add(-1, 'hours')
    const prices = [
      { timestamp, priceUsd: 1, assetId: AssetId.ETH },
      { timestamp, priceUsd: 2, assetId: OP_TOKEN_ID },
    ]

    expect(genOpTokenReport(prices, timestamp)).toEqual([
      {
        asset: OP_TOKEN_ID,
        chainId: ChainId.NMV,
        type: ValueType.NMV,
        projectId: ProjectId.OPTIMISM,
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

    expect(genOpTokenReport(prices, timestamp)).toEqual([
      {
        asset: OP_TOKEN_ID,
        chainId: ChainId.NMV,
        type: ValueType.NMV,
        projectId: ProjectId.OPTIMISM,
        timestamp,
        amount: 644594782000000000000000000n,
        ethValue: 1289189564000000n,
        usdValue: 128918956400n,
      },
    ])
  })
})
