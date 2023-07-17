import { hashJson } from '@l2beat/shared-pure'
import { sortBy } from 'lodash'

import { TotalSupplyTokensConfig } from './TotalSupplyTokensConfig'

// Increment this value to change the hash which in turn causes the system to
// recalculate total supplies
const TOTAL_SUPPLY_LOGIC_VERSION = 0

export function getTotalSupplyConfigHash(
  totalSupplyTokensConfig: TotalSupplyTokensConfig[],
) {
  return hashJson([
    getEntries(totalSupplyTokensConfig),
    TOTAL_SUPPLY_LOGIC_VERSION,
  ])
}

export function getEntries(totalSupplyTokensConfig: TotalSupplyTokensConfig[]) {
  const serializedEntries = totalSupplyTokensConfig.map(
    ({ assetId, tokenAddress, sinceTimestamp, decimals }) => {
      return {
        assetId: assetId.toString(),
        tokenAddress: tokenAddress.toString(),
        sinceTimestamp: sinceTimestamp.toNumber(),
        decimals: decimals,
      }
    },
  )
  return sortBy(serializedEntries, ['assetId', 'tokenAddress', 'decimals'])
}
