import { AssetId, ProjectId, UnixTime, ValueType } from '@l2beat/shared-pure'

import { PriceRecord } from '../../../peripherals/database/PriceRepository'
import { Asset } from '../../assets/Asset'
import { BalancePerProject } from '../createReport'

export function createAddCustomTokenAsset(
  tokenId: AssetId,
  assetType: ValueType,
  sinceTimestamp: UnixTime,
  projectId: ProjectId,
  tokenBalance: (t: UnixTime) => bigint,
  tokenDecimals: number,
) {
  return function (prices: PriceRecord[], timestamp: UnixTime): Asset[] {
    const tokenPrice = prices.find((p) => p.assetId === tokenId)
    const ethPriceUsd = prices.find((p) => p.assetId === AssetId.ETH)?.priceUsd
    if (!tokenPrice || !ethPriceUsd || timestamp.lt(sinceTimestamp)) {
      return []
    }

    const balance: BalancePerProject = {
      assetId: tokenId,
      type: assetType,
      balance: tokenBalance(timestamp),
      decimals: tokenDecimals,
      projectId: projectId,
    }

    return [
      {
        price: tokenPrice,
        balance: balance,
        ethPrice: ethPriceUsd,
      },
    ]
  }
}
