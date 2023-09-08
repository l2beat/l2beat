import {
  assert,
  AssetId,
  ChainId,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { createGenCustomTokenReport } from './report'

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

// When updating, make sure you add the newest timestamp at the end of this array.
export const OP_CIRCULATING_SUPPLY_HISTORY: {
  supply: bigint
  untilTimestamp?: UnixTime
}[] = [
  {
    supply: 214_748_364n * 10n ** BigInt(OP_TOKEN_DECIMALS),
    untilTimestamp: new UnixTime(1685502000),
  },
  {
    supply: 644_594_782n * 10n ** BigInt(OP_TOKEN_DECIMALS),
    untilTimestamp: UnixTime.fromDate(new Date('2023-07-30T06:00:00Z')),
  },
  {
    supply: 716_708_907n * 10n ** BigInt(OP_TOKEN_DECIMALS),
  },
]

function opTokenBalance(timestamp: UnixTime): bigint {
  let circulatingSupply: bigint | undefined = undefined

  for (const { supply, untilTimestamp } of OP_CIRCULATING_SUPPLY_HISTORY) {
    if (untilTimestamp === undefined || timestamp.lt(untilTimestamp)) {
      circulatingSupply = supply
      break
    }
  }

  assert(circulatingSupply !== undefined, 'Circulating supply not found')

  return circulatingSupply
}

export const genOpTokenReport = createGenCustomTokenReport(
  OP_TOKEN_ID,
  ChainId.NMV,
  'NMV',
  OP_TOKEN_SINCE_TIMESTAMP,
  ProjectId.OPTIMISM,
  opTokenBalance,
  OP_TOKEN_DECIMALS,
)
