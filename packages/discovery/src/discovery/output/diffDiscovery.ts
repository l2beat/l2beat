import type { EthereumAddress } from '@l2beat/shared-pure'

import { type FieldDiff, diffContracts } from './diffContracts'
import type { EntryParameters } from './types'

export interface DiscoveryDiff {
  name?: string
  address: EthereumAddress
  description?: string
  diff?: FieldDiff[]
  type?: 'created' | 'deleted'
}

export function diffDiscovery(
  previous: EntryParameters[],
  current: EntryParameters[],
  unverifiedContracts?: string[],
): DiscoveryDiff[] {
  const modifiedOrDeleted: DiscoveryDiff[] = []

  for (const previousContract of previous) {
    const currentContract = current.find(
      (d) => d.address === previousContract.address,
    )
    if (currentContract === undefined) {
      if (previousContract.proxyType !== 'EOA') {
        modifiedOrDeleted.push({
          name: previousContract.name,
          address: previousContract.address,
          description: previousContract.description,
          type: 'deleted',
        })
      }
      continue
    }

    if (
      currentContract.name !== undefined &&
      unverifiedContracts?.includes(currentContract.name) &&
      !currentContract.unverified
    ) {
      continue
    }

    const ignoreValuesInWatchMode = (
      currentContract.ignoreInWatchMode ?? []
    ).map((i) => `values.${i}`)

    const ignored = [
      // temporarily ignoring meta fields to not trigger diffs
      'ignoreInWatchMode',
      ...ignoreValuesInWatchMode,
    ]
    const diff = diffContracts(previousContract, currentContract, ignored)

    if (diff.length > 0) {
      modifiedOrDeleted.push({
        name: currentContract.name,
        address: currentContract.address,
        description: currentContract.description,
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
      if (currentContract.proxyType !== 'EOA') {
        created.push({
          name: currentContract.name,
          address: currentContract.address,
          description: currentContract.description,
          type: 'created',
        })
      }
    }
  }

  return modifiedOrDeleted.concat(created)
}
