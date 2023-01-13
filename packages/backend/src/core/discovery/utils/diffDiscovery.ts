import { DiscoveryContract } from '../DiscoveryConfig'
import { ContractParameters } from '../types'

export interface DiscoveryDiff {
  address: string
  diff: string[]
}

export function diffDiscovery(
  committed: ContractParameters[],
  discovered: ContractParameters[],
  ignoreInWatchMode?: Record<string, DiscoveryContract>,
): DiscoveryDiff[] {
  return []
}

export function diffContracts(
  before: ContractParameters,
  after: ContractParameters,
  ignoreInWatchMode: [],
) {
  
}
