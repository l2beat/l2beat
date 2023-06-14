import { hashJson } from '@l2beat/shared-pure'
import { sortBy } from 'lodash'

import { BalanceProject } from './BalanceProject'

// Increment this value to change the hash which in turn causes the system to
// recalculate balances
const BALANCE_LOGIC_VERSION = 0

export function getBalanceConfigHash(projects: BalanceProject[]) {
  return hashJson([getEntries(projects), BALANCE_LOGIC_VERSION])
}

export function getEntries(projects: BalanceProject[]) {
  const entries = []
  for (const { projectId, escrows } of projects) {
    for (const { tokens, address, sinceTimestamp } of escrows) {
      for (const token of tokens) {
        entries.push({
          projectId: projectId.toString(),
          holder: address.toString(),
          holderSinceTimestamp: sinceTimestamp.toNumber(),
          assetId: token.id.toString(),
          assetSinceTimestamp: token.sinceTimestamp.toNumber(),
        })
      }
    }
  }
  return sortBy(entries, ['projectId', 'holder', 'assetId'])
}
