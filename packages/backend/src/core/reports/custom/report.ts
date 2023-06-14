import { AssetId, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { PriceRecord } from '../../../peripherals/database/PriceRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { convertBalance } from '../createReport'

function createCustomTokenReport({
  tokenPriceUsd,
  tokenDecimals,
  tokenBalance,
  tokenId,
  ethPriceUsd,
  timestamp,
  projectId,
}: {
  tokenPriceUsd: number
  tokenDecimals: number
  tokenBalance: bigint
  tokenId: AssetId
  projectId: ProjectId
  ethPriceUsd: number
  timestamp: UnixTime
}): ReportRecord {
  const { balanceUsd, balanceEth } = convertBalance(
    tokenPriceUsd,
    tokenDecimals,
    tokenBalance,
    ethPriceUsd,
  )
  return {
    timestamp,
    asset: tokenId,
    balance: tokenBalance,
    balanceEth,
    balanceUsd,
    projectId,
  }
}

export function createAddCustomTokenReport(
  tokenId: AssetId,
  sinceTimestamp: UnixTime,
  projectId: ProjectId,
  tokenBalance: bigint,
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
        projectId,
        tokenPriceUsd,
        ethPriceUsd,
        timestamp,
      }),
    )
  }
}
