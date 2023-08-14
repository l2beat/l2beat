import { hashJson, Token } from '@l2beat/shared-pure'
import { sortBy } from 'lodash'

// Increment this value to change the hash which in turn causes the system to
// recalculate total supplies
const TOTAL_SUPPLY_LOGIC_VERSION = 0

export function getTotalSupplyConfigHash(totalSupplyTokensConfig: Token[]) {
  return hashJson([
    getEntries(totalSupplyTokensConfig),
    TOTAL_SUPPLY_LOGIC_VERSION,
  ])
}

export function getEntries(totalSupplyTokensConfig: Token[]) {
  const serializedEntries = totalSupplyTokensConfig.map(
    ({ id, address, sinceTimestamp, decimals }) => {
      return {
        assetId: id.toString(),
        tokenAddress: address?.toString() ?? '',
        sinceTimestamp: sinceTimestamp.toNumber(),
        decimals: decimals,
      }
    },
  )
  return sortBy(serializedEntries, ['assetId', 'tokenAddress', 'decimals'])
}
