import { AssetId, ProjectId, UnixTime } from '@l2beat/shared'

import { createAddCustomTokenReport } from './report'

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

export const addOpTokenReport = createAddCustomTokenReport(
  OP_TOKEN_ID,
  OP_TOKEN_SINCE_TIMESTAMP,
  OPTIMISM_PROJECT_ID,
  OP_TOKEN_BALANCE,
  OP_TOKEN_DECIMALS,
)
