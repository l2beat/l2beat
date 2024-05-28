import { ContractParameters } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { FieldDiff, diffContracts } from './diffContracts'

export interface DiscoveryDiff {
  name: string
  address: EthereumAddress
  diff?: FieldDiff[]
  type?: 'created' | 'deleted'
}

export function diffDiscovery(
  previous: ContractParameters[],
  current: ContractParameters[],
  unverifiedContracts?: string[],
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

    if (
      unverifiedContracts?.includes(currentContract.name) &&
      !currentContract.unverified
    ) {
      continue
    }

    const ignoreValuesInWatchMode = (
      currentContract.ignoreInWatchMode ?? []
    ).map((i) => `values.${i}`)

    const ignored = ['ignoreInWatchMode', ...ignoreValuesInWatchMode]
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
