import { AssetId, ProjectId, UnixTime, ValueType } from '@l2beat/shared-pure'

import { PriceRecord } from '../../../peripherals/database/PriceRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { balanceToValue } from '../createReport'

function createCustomTokenReport({
  tokenPriceUsd,
  tokenDecimals,
  tokenBalance,
  tokenId,
  assetType,
  ethPriceUsd,
  timestamp,
  projectId,
}: {
  tokenPriceUsd: number
  tokenDecimals: number
  tokenBalance: (t: UnixTime) => bigint
  tokenId: AssetId
  assetType: ValueType
  projectId: ProjectId
  ethPriceUsd: number
  timestamp: UnixTime
}): ReportRecord {
  const balance = tokenBalance(timestamp)

  const { usdValue, ethValue } = balanceToValue(
    tokenPriceUsd,
    tokenDecimals,
    balance,
    ethPriceUsd,
  )
  return {
    timestamp,
    asset: tokenId,
    type: assetType,
    amount: balance,
    ethValue,
    usdValue,
    projectId,
  }
}

export function createAddCustomTokenReport(
  tokenId: AssetId,
  assetType: ValueType,
  sinceTimestamp: UnixTime,
  projectId: ProjectId,
  tokenBalance: (t: UnixTime) => bigint,
  tokenDecimals: number,
) {
  return function (
    reports: ReportRecord[],
    prices: PriceRecord[],
    timestamp: UnixTime,
  ) {
    const tokenPriceUsd = prices.find((p) => p.assetId === tokenId)?.priceUsd
    const ethPriceUsd = prices.find((p) => p.assetId === AssetId.ETH)?.priceUsd
    if (!tokenPriceUsd || !ethPriceUsd || timestamp.lt(sinceTimestamp)) {
      return reports
    }
    const tokenReportIndex = reports.findIndex(
      (r) =>
        r.asset === tokenId &&
        r.projectId === projectId &&
        r.timestamp.equals(timestamp),
    )
    if (tokenReportIndex !== -1) reports.splice(tokenReportIndex, 1)
    reports.push(
      createCustomTokenReport({
        tokenBalance,
        tokenDecimals,
        tokenId,
        assetType,
        projectId,
        tokenPriceUsd,
        ethPriceUsd,
        timestamp,
      }),
    )
  }
}
