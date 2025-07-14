import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'

import { diffContracts, type FieldDiff } from './diffContracts'
import type { EntryParameters, StructureEntry } from './types'

export interface DiscoveryDiff {
  name?: string
  address: EthereumAddress
  addressType: StructureEntry['type']
  description?: string
  diff?: FieldDiff[]
  type?: 'created' | 'deleted'
}

function addressCompare(a: string, b: string): boolean {
  const lhs = a.includes(':')
    ? ChainSpecificAddress.address(ChainSpecificAddress(a))
    : a
  const rhs = b.includes(':')
    ? ChainSpecificAddress.address(ChainSpecificAddress(b))
    : b
  return lhs.toLowerCase() === rhs.toLowerCase()
}

export function diffDiscovery(
  previous: EntryParameters[],
  current: EntryParameters[],
  unverifiedContracts?: string[],
): DiscoveryDiff[] {
  const modifiedOrDeleted: DiscoveryDiff[] = []

  for (const previousContract of previous) {
    const currentContract = current.find((d) =>
      addressCompare(d.address.toString(), previousContract.address.toString()),
    )
    if (currentContract === undefined) {
      if (previousContract.proxyType !== 'EOA') {
        modifiedOrDeleted.push({
          name: previousContract.name,
          address: ChainSpecificAddress.address(previousContract.address),
          addressType: previousContract.type,
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
        address: ChainSpecificAddress.address(currentContract.address),
        addressType: currentContract.type,
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
          address: ChainSpecificAddress.address(currentContract.address),
          addressType: currentContract.type,
          description: currentContract.description,
          type: 'created',
        })
      }
    }
  }

  return modifiedOrDeleted.concat(created)
}
