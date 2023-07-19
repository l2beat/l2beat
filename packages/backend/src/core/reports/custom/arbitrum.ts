import {
  AssetId,
  ChainId,
  ProjectId,
  UnixTime,
  ValueType,
} from '@l2beat/shared-pure'

import { createGenCustomTokenReport as createGenCustomTokenReport } from './report'

// Ethereum block 16890400 timestamp
export const ARB_TOKEN_SINCE_TIMESTAMP = new UnixTime(1679572871)
export const ARB_TOKEN_ID = AssetId('arb-arbitrum')
const ARB_TOKEN_DECIMALS = 18
// This is the circulating supply of ARB as given by Coingecko.
// The value is obtained by looking at how many tokens have been designated
// to be distributed in the Arbitrum's airdrop.
// Our policy is to keep this value in sync with Coingecko.
// https://www.coingecko.com/en/coins/arbitrum
// https://docs.arbitrum.foundation/airdrop-eligibility-distribution#initial-token-allocation--airdrop-distribution

export const ARB_TOKEN_BALANCE = () =>
  1_275_000_000n * 10n ** BigInt(ARB_TOKEN_DECIMALS)

export const genArbTokenReport = createGenCustomTokenReport(
  ARB_TOKEN_ID,
  ChainId.NMV,
  ValueType.NMV,
  ARB_TOKEN_SINCE_TIMESTAMP,
  ProjectId.ARBITRUM,
  ARB_TOKEN_BALANCE,
  ARB_TOKEN_DECIMALS,
)
