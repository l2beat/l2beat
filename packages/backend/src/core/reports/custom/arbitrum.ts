import { AssetId, ProjectId, UnixTime } from '@l2beat/shared'

import { createAddCustomTokenReport } from './report'

export const ARBITRUM_PROJECT_ID = ProjectId('arbitrum')
export const ARB_TOKEN_SINCE_TIMESTAMP = UnixTime.fromDate(
  new Date('2023-03-23'),
)
export const ARB_TOKEN_ID = AssetId('arbitrum')
const ARB_TOKEN_DECIMALS = 18
// This is the circulating supply of OP as given by Coingecko.
// The value is obtained by looking at how many tokens have been designated
// to be distributed in the Optimism's airdrop.
// Our policy is to keep this value in sync with Coingecko.
// https://www.coingecko.com/en/coins/optimism
// https://optimistic.etherscan.io/token/0x4200000000000000000000000000000000000042?a=0x2a82ae142b2e62cb7d10b55e323acb1cab663a26
export const ARB_TOKEN_BALANCE =
  214_748_364n * 10n ** BigInt(ARB_TOKEN_DECIMALS)

export const addArbTokenReport = createAddCustomTokenReport(
  ARB_TOKEN_ID,
  ARB_TOKEN_SINCE_TIMESTAMP,
  ARBITRUM_PROJECT_ID,
  ARB_TOKEN_BALANCE,
  ARB_TOKEN_DECIMALS,
)
