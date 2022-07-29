import { AssetId, ProjectId, UnixTime } from '@l2beat/common'

import { AggregateReportRecord } from '../../peripherals/database/AggregateReportRepository'
import { PriceRecord } from '../../peripherals/database/PriceRepository'
import { convertBalance } from './createReport'

export const OP_TOKEN_BALANCE = 214_748_364n * 10n ** 18n

export function addOptimismToken(
  aggregatedReports: AggregateReportRecord[],
  prices: PriceRecord[],
  timestamp: UnixTime,
) {
  const opPrice = prices.find((p) => p.assetId === AssetId('op-optimism'))
  const ethPrice = prices.find((p) => p.assetId === AssetId.ETH)

  if (!opPrice || !ethPrice) {
    return aggregatedReports
  }

  let optimismReport = aggregatedReports.find(
    (r) => r.projectId === ProjectId('optimism'),
  )
  let reportAll = aggregatedReports.at(-1)

  if (!optimismReport) {
    optimismReport = {
      timestamp,
      projectId: ProjectId('optimism'),
      tvlUsd: 0n,
      tvlEth: 0n,
    }
    aggregatedReports.push(optimismReport)
  }

  if (!reportAll) {
    reportAll = {
      timestamp,
      projectId: ProjectId.ALL,
      tvlUsd: 0n,
      tvlEth: 0n,
    }
    aggregatedReports.push(reportAll)
  }

  const { balanceUsd, balanceEth } = convertBalance(
    opPrice.priceUsd,
    18,
    OP_TOKEN_BALANCE,
    ethPrice.priceUsd,
  )

  optimismReport.tvlEth += balanceEth
  optimismReport.tvlUsd += balanceUsd

  reportAll.tvlEth += balanceEth
  reportAll.tvlUsd += balanceUsd

  return aggregatedReports
}
