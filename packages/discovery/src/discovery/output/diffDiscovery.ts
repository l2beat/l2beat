import { ContractParameters, EthereumAddress } from '@l2beat/shared-pure'

import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { DiscoveryOverrides } from '../config/DiscoveryOverrides'
import { diffContracts, FieldDiff } from './diffContracts'

export interface DiscoveryDiff {
  name: string
  address: EthereumAddress
  diff?: FieldDiff[]
  type?: 'created' | 'deleted'
}

export function diffDiscovery(
  previous: ContractParameters[],
  current: ContractParameters[],
  config: DiscoveryConfig,
): DiscoveryDiff[] {
  const modifiedOrDeleted: DiscoveryDiff[] = []

  for (const previousContract of previous) {
    const currentContract = current.find(
      (d) => d.address === previousContract.address,
    )
    if (currentContract === undefined) {
      modifiedOrDeleted.push({
        name: previousContract.name,
        address: previousContract.address,
        type: 'deleted',
      })
      continue
    }

    const ignored = getIgnored(previousContract.address, config.overrides)

    const diff = diffContracts(previousContract, currentContract, ignored)

    if (diff.length > 0) {
      modifiedOrDeleted.push({
        name: previousContract.name,
        address: previousContract.address,
        diff,
      })
    }
  }

  const created: DiscoveryDiff[] = []

  for (const currentContract of current) {
    const previousContract = previous.find(
      (c) => c.address === currentContract.address,
    )
    if (previousContract === undefined) {
      created.push({
        name: currentContract.name,
        address: currentContract.address,
        type: 'created',
      })
    }
  }

  return modifiedOrDeleted.concat(created)
}

function getIgnored(
  address: EthereumAddress,
  overrides: DiscoveryOverrides,
): string[] {
  return overrides.get(address).ignoreInWatchMode ?? []
}
