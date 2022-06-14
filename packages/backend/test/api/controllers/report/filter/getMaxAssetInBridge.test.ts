import { AssetId, EthereumAddress, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { getMaxAssetInBridge } from '../../../../../src/api/controllers/report/filter/getMaxAssetsInBridge'

describe(getMaxAssetInBridge.name, () => {
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
      usdTVL: 0n,
      ethTVL: 0n,
      balance: 0n,
    }
  }

  it('returns mapping', () => {
    const reports = [
      mockReport(BRIDGE_A, ASSET_A, 0),
      mockReport(BRIDGE_A, ASSET_A, -1),
      mockReport(BRIDGE_A, ASSET_A, -2),

      mockReport(BRIDGE_A, ASSET_B, 0),
      mockReport(BRIDGE_A, ASSET_B, -1),
      mockReport(BRIDGE_A, ASSET_B, -2),

      mockReport(BRIDGE_B, ASSET_A, -1),
      mockReport(BRIDGE_B, ASSET_A, -2),

      mockReport(BRIDGE_B, ASSET_B, 0),
    ]

    const result = getMaxAssetInBridge(reports)

    expect(result).toEqual(
      new Map([
        [`${BRIDGE_A.toString()}-${ASSET_A.toString()}`, TODAY],
        [`${BRIDGE_A.toString()}-${ASSET_B.toString()}`, TODAY],
        [`${BRIDGE_B.toString()}-${ASSET_A.toString()}`, TODAY.add(-1, 'days')],
        [`${BRIDGE_B.toString()}-${ASSET_B.toString()}`, TODAY],
      ]),
    )
  })
})
