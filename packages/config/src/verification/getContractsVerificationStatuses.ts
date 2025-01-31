import { assert } from '@l2beat/shared-pure'
import type {
  Bridge,
  DaProject,
  Layer2,
  Layer3,
  ProjectContract,
} from '../types'

export function getContractsVerificationStatuses(
  project: Layer2 | Layer3 | Bridge | DaProject,
) {
  if (!('contracts' in project)) {
    return {}
  }

  const contracts: Record<string, ProjectContract[]> =
    project.contracts?.addresses ?? {}

  const result: Record<string, Record<string, boolean>> = {}
  for (const chain in contracts) {
    for (const c of contracts[chain]) {
      const computedChain = c.chain ?? 'ethereum'
      // TODO(radomski): Remove, only for testing
      assert(computedChain === chain)
      result[chain] ??= {}
      result[chain][c.address.toString()] = c.isVerified
    }
  }

  return result
}
