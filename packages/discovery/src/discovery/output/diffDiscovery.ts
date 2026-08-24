import type { ChainSpecificAddress } from '@l2beat/shared-pure'

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

// Permissions held by addresses of a referenced project are stored outside
// `entries`, so folding them in is what makes a shared module change visible
// in a consumer's diff. The stub of an entrypoint is already an entry, so the
// two are merged rather than listed twice - a duplicated address would confuse
// the address lookups below.
export function entriesForDiff(
  discovery: DiscoveryOutput | undefined,
): EntryParameters[] {
  if (discovery === undefined) {
    return []
  }
  const referenced = Object.entries(discovery.referencedPermissions ?? {})
  if (referenced.length === 0) {
    return discovery.entries
  }

  const result = discovery.entries.map((entry) => ({ ...entry }))
  const byAddress = new Map(result.map((entry) => [entry.address, entry]))

  for (const [rawAddress, permissions] of referenced) {
    const address = rawAddress as ChainSpecificAddress
    const existing = byAddress.get(address)
    if (existing === undefined) {
      result.push({ type: 'Reference', address, ...permissions })
    } else {
      Object.assign(existing, permissions)
    }
  }

  return result
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
