import { AssetId, ProjectId, UnixTime } from '@l2beat/common'

import { AggregateReportRecord } from '../../peripherals/database/AggregateReportRepository'
import { PriceRecord } from '../../peripherals/database/PriceRepository'
import { ReportRecord } from '../../peripherals/database/ReportRepository'
import { convertBalance, toBalanceUsd } from './createReport'

const OP_TOKEN_DECIMALS = 18
const OPTIMISM_PROJECT_ID = ProjectId('optimism')
const OP_TOKEN_SINCE_TIMESTAMP = UnixTime.fromDate(new Date('2022-05-30'))
export const OP_TOKEN_ID = AssetId('op-optimism')
// This is the circulating supply of OP as given by Coingecko.
// The value is obtained by looking at how many tokens have been designated
// to be distributed in the Optimism's airdrop.
// Our policy is to keep this value in sync with Coingecko.
// https://www.coingecko.com/en/coins/optimism
// https://optimistic.etherscan.io/token/0x4200000000000000000000000000000000000042?a=0x2a82ae142b2e62cb7d10b55e323acb1cab663a26
export const OP_TOKEN_BALANCE = 214_748_364n * 10n ** BigInt(OP_TOKEN_DECIMALS)

export function addOpTokenToReports(
  aggregateReports: AggregateReportRecord[],
  reports: ReportRecord[],
  opPrices: PriceRecord[],
  ethPrices: PriceRecord[],
  maxTimestamp: UnixTime,
): void {
  const prices = getUsablePrices(opPrices, ethPrices, maxTimestamp)
  prices.forEach(({ opPrice, ethPrice }) =>
    amendAggregateReport(opPrice, ethPrice, aggregateReports),
  )
  const latestPrices = prices[prices.length - 1]
  reports.push(
    createOpTokenReport(
      latestPrices.opPrice,
      latestPrices.ethPrice,
      latestPrices.opPrice.timestamp,
    ),
  )
}

export function getUsablePrices(
  opPrices: PriceRecord[],
  ethPrices: PriceRecord[],
  maxTimestamp: UnixTime,
) {
  return opPrices.reduce<{ opPrice: PriceRecord; ethPrice: PriceRecord }[]>(
    (acc, opPrice) => {
      const ethPrice = ethPrices.find((p) =>
        p.timestamp.equals(opPrice.timestamp),
      )
      if (
        ethPrice?.timestamp.gte(OP_TOKEN_SINCE_TIMESTAMP) &&
        ethPrice.timestamp.lte(maxTimestamp) &&
        ethPrice.timestamp.isFull('day')
      ) {
        acc.push({
          ethPrice,
          opPrice,
        })
      }
      return acc
    },
    [],
  )
}

export function amendAggregateReport(
  opPrice: PriceRecord,
  ethPrice: PriceRecord,
  aggregateReports: AggregateReportRecord[],
) {
  const timestamp = opPrice.timestamp
  let optimismReport = aggregateReports.find(
    (r) => r.projectId === OPTIMISM_PROJECT_ID && r.timestamp.equals(timestamp),
  )
  let reportAll = aggregateReports.find(
    (r) => r.projectId === ProjectId.ALL && r.timestamp.equals(timestamp),
  )

  if (!optimismReport) {
    optimismReport = {
      timestamp,
      projectId: OPTIMISM_PROJECT_ID,
      tvlUsd: 0n,
      tvlEth: 0n,
    }
    aggregateReports.push(optimismReport)
  }

  if (!reportAll) {
    reportAll = {
      timestamp,
      projectId: ProjectId.ALL,
      tvlUsd: 0n,
      tvlEth: 0n,
    }
    aggregateReports.push(reportAll)
  }

  const { balanceEth, balanceUsd } = createOpTokenReport(
    opPrice,
    ethPrice,
    opPrice.timestamp,
  )

  optimismReport.tvlEth += balanceEth
  optimismReport.tvlUsd += balanceUsd
  reportAll.tvlEth += balanceEth
  reportAll.tvlUsd += balanceUsd
}

export function createOpTokenReport(
  opPrice: PriceRecord,
  ethPrice: PriceRecord,
  timestamp: UnixTime,
): ReportRecord {
  const { balanceUsd, balanceEth } = convertBalance(
    opPrice.priceUsd,
    OP_TOKEN_DECIMALS,
    OP_TOKEN_BALANCE,
    ethPrice.priceUsd,
  )
  return {
    timestamp,
    asset: OP_TOKEN_ID,
    balance: OP_TOKEN_BALANCE,
    balanceEth,
    balanceUsd,
    projectId: OPTIMISM_PROJECT_ID,
  }
}

export function getOpTokenDailyChartData(prices: PriceRecord[]) {
  return prices
    .filter((p) => p.timestamp.gte(OP_TOKEN_SINCE_TIMESTAMP))
    .map((price) => ({
      timestamp: price.timestamp,
      balance: OP_TOKEN_BALANCE,
      balanceUsd: toBalanceUsd(
        price.priceUsd,
        OP_TOKEN_DECIMALS,
        OP_TOKEN_BALANCE,
      ),
    }))
}
