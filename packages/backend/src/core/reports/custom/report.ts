import { AssetId, ProjectId, UnixTime, ValueType } from '@l2beat/shared-pure'

import { PriceRecord } from '../../../peripherals/database/PriceRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { BalancePerProject, createReport } from '../createReport'

export function createAddCustomTokenReport(
  tokenId: AssetId,
  assetType: ValueType,
  sinceTimestamp: UnixTime,
  projectId: ProjectId,
  tokenBalance: (t: UnixTime) => bigint,
  tokenDecimals: number,
) {
  return function (prices: PriceRecord[], timestamp: UnixTime): ReportRecord[] {
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

    return [createReport(tokenPrice, balance, ethPriceUsd)]
  }
}
