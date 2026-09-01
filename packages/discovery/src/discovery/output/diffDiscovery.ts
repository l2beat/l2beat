import type { ChainSpecificAddress } from '@l2beat/shared-pure'

import { attachPermissions } from './attachPermissions'
import { diffContracts, type FieldDiff } from './diffContracts'
import type { DiscoveryOutput, EntryParameters, StructureEntry } from './types'

export interface DiscoveryDiff {
  name?: string
  address: ChainSpecificAddress
  addressType: StructureEntry['type']
  description?: string
  template?: string
  diff?: FieldDiff[]
  type?: 'created' | 'deleted'
}

// Permissions are stored outside `entries`, so folding them in is what keeps a
// permission change visible in a diff at all. Unlike the read path this joins
// onto a copy: callers diff discoveries that are afterwards written to the
// database and to disk, where permissions must stay out of the entries.
export function entriesForDiff(
  discovery: DiscoveryOutput | undefined,
): EntryParameters[] {
  if (discovery === undefined) {
    return []
  }
  if (discovery.permissions === undefined) {
    return discovery.entries
  }

  const copy = {
    ...discovery,
    entries: discovery.entries.map((entry) => ({ ...entry })),
  }
  attachPermissions([copy])
  return copy.entries
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
          addressType: previousContract.type,
          description: previousContract.description,
          template: previousContract.template,
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
        addressType: currentContract.type,
        description: currentContract.description,
        template: currentContract.template,
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
          addressType: currentContract.type,
          description: currentContract.description,
          template: currentContract.template,
          type: 'created',
        })
      }
    }
  }

  return modifiedOrDeleted.concat(created)
}
