import { AssetId, EthereumAddress, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { getSufficientlySynced } from '../../../../../src/api/controllers/report/filter/getSufficientlySynced'

describe(getSufficientlySynced.name, () => {
  const TODAY = UnixTime.now().toStartOf('day')
  const BRIDGE_A = EthereumAddress.random()
  const BRIDGE_B = EthereumAddress.random()
  const ASSET_A = AssetId('apple')
  const ASSET_B = AssetId('banana')

  function mockReport(bridge: EthereumAddress, asset: AssetId, offset: number) {
    return {
      timestamp: TODAY.add(offset, 'days'),
      bridge,
      asset,
      blockNumber: 0n,
      balanceUsd: 0n,
      balanceEth: 0n,
      balance: 0n,
    }
  }

  it('nothing to exclude', () => {
    const reports = [
      mockReport(BRIDGE_A, ASSET_A, 0),
      mockReport(BRIDGE_A, ASSET_A, -1),
      mockReport(BRIDGE_A, ASSET_A, -2),
      mockReport(BRIDGE_B, ASSET_A, 0),
      mockReport(BRIDGE_B, ASSET_A, -1),
      mockReport(BRIDGE_B, ASSET_A, -2),
      mockReport(BRIDGE_B, ASSET_B, 0),
      mockReport(BRIDGE_B, ASSET_B, -1),
      mockReport(BRIDGE_B, ASSET_B, -2),
    ]
    const result = getSufficientlySynced(reports)
    expect(result).toEqual(reports)
  })

  it('exclude out of sync project', () => {
    const reports = [
      mockReport(BRIDGE_A, ASSET_A, 0),
      mockReport(BRIDGE_A, ASSET_A, -1),
      mockReport(BRIDGE_A, ASSET_A, -2),
      mockReport(BRIDGE_A, ASSET_A, -3),

      mockReport(BRIDGE_B, ASSET_A, 0),
      mockReport(BRIDGE_B, ASSET_A, -1),
      mockReport(BRIDGE_B, ASSET_A, -2),
      mockReport(BRIDGE_B, ASSET_A, -3),

      mockReport(BRIDGE_B, ASSET_B, -2),
      mockReport(BRIDGE_B, ASSET_B, -3),
    ]
    const result = getSufficientlySynced(reports)
    expect(result).toEqual([
      mockReport(BRIDGE_A, ASSET_A, 0),
      mockReport(BRIDGE_A, ASSET_A, -1),
      mockReport(BRIDGE_A, ASSET_A, -2),
      mockReport(BRIDGE_A, ASSET_A, -3),

      mockReport(BRIDGE_B, ASSET_A, 0),
      mockReport(BRIDGE_B, ASSET_A, -1),
      mockReport(BRIDGE_B, ASSET_A, -2),
      mockReport(BRIDGE_B, ASSET_A, -3),
    ])
  })

  it('go back in time one day', () => {
    const reports = [
      mockReport(BRIDGE_A, ASSET_A, 0),
      mockReport(BRIDGE_A, ASSET_A, -1),
      mockReport(BRIDGE_A, ASSET_A, -2),
      mockReport(BRIDGE_A, ASSET_A, -3),

      mockReport(BRIDGE_B, ASSET_A, 0),
      mockReport(BRIDGE_B, ASSET_A, -1),
      mockReport(BRIDGE_B, ASSET_A, -2),
      mockReport(BRIDGE_B, ASSET_A, -3),

      mockReport(BRIDGE_B, ASSET_B, -1),
      mockReport(BRIDGE_B, ASSET_B, -2),
      mockReport(BRIDGE_B, ASSET_B, -3),
    ]
    const result = getSufficientlySynced(reports)
    expect(result).toEqual([
      mockReport(BRIDGE_A, ASSET_A, -1),
      mockReport(BRIDGE_A, ASSET_A, -2),
      mockReport(BRIDGE_A, ASSET_A, -3),

      mockReport(BRIDGE_B, ASSET_A, -1),
      mockReport(BRIDGE_B, ASSET_A, -2),
      mockReport(BRIDGE_B, ASSET_A, -3),

      mockReport(BRIDGE_B, ASSET_B, -1),
      mockReport(BRIDGE_B, ASSET_B, -2),
      mockReport(BRIDGE_B, ASSET_B, -3),
    ])
  })
})
