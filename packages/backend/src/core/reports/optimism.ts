import { AssetId, ProjectId, UnixTime } from '@l2beat/types'

import { PriceRecord } from '../../peripherals/database/PriceRepository'
import { ReportRecord } from '../../peripherals/database/ReportRepository'
import { convertBalance } from './createReport'

export const OPTIMISM_PROJECT_ID = ProjectId('optimism')
export const OP_TOKEN_SINCE_TIMESTAMP = UnixTime.fromDate(
  new Date('2022-05-30'),
)
export const OP_TOKEN_ID = AssetId('op-optimism')
const OP_TOKEN_DECIMALS = 18
// This is the circulating supply of OP as given by Coingecko.
// The value is obtained by looking at how many tokens have been designated
// to be distributed in the Optimism's airdrop.
// Our policy is to keep this value in sync with Coingecko.
// https://www.coingecko.com/en/coins/optimism
// https://optimistic.etherscan.io/token/0x4200000000000000000000000000000000000042?a=0x2a82ae142b2e62cb7d10b55e323acb1cab663a26
export const OP_TOKEN_BALANCE = 214_748_364n * 10n ** BigInt(OP_TOKEN_DECIMALS)

function createOpTokenReport(
  opPriceUsd: number,
  ethPriceUsd: number,
  timestamp: UnixTime,
): ReportRecord {
  const { balanceUsd, balanceEth } = convertBalance(
    opPriceUsd,
    OP_TOKEN_DECIMALS,
    OP_TOKEN_BALANCE,
    ethPriceUsd,
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

export function addOpTokenReport(
  reports: ReportRecord[],
  prices: PriceRecord[],
  timestamp: UnixTime,
): ReportRecord[] {
  const opPriceUsd = prices.find((p) => p.assetId === OP_TOKEN_ID)?.priceUsd
  const ethPriceUsd = prices.find((p) => p.assetId === AssetId.ETH)?.priceUsd
  if (!opPriceUsd || !ethPriceUsd || timestamp.lt(OP_TOKEN_SINCE_TIMESTAMP)) {
    return reports
  }
  const opReportIndex = reports.findIndex(
    (r) =>
      r.asset === OP_TOKEN_ID &&
      r.projectId === OPTIMISM_PROJECT_ID &&
      r.timestamp.equals(timestamp),
  )
  if (opReportIndex !== -1) reports.splice(opReportIndex, 1)
  reports.push(createOpTokenReport(opPriceUsd, ethPriceUsd, timestamp))
  return reports
}
