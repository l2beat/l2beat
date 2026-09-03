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

// Diffed as a pair rather than a side at a time: a holder that gains its first
// permission has neither an entry nor a map row on the previous side, so
// standing in only on the current side would report the whole address as
// created. A creation carries no field diffs, and both Update Monitor's web
// feed and its ultimate-upgrader detection key off a `receivedPermissions`
// field diff, so the change would reach neither.
export function entriesForDiffPair(
  previous: DiscoveryOutput | undefined,
  current: DiscoveryOutput | undefined,
): [EntryParameters[], EntryParameters[]] {
  const holders = new Set([
    ...Object.keys(previous?.permissions ?? {}),
    ...Object.keys(current?.permissions ?? {}),
  ])
  return [entriesForDiff(previous, holders), entriesForDiff(current, holders)]
}

// Permissions are stored outside `entries`, so folding them in is what keeps a
// permission change visible in a diff at all. Unlike the read path this joins
// onto a copy: callers diff discoveries that are afterwards written to the
// database and to disk, where permissions must stay out of the entries.
export function entriesForDiff(
  discovery: DiscoveryOutput | undefined,
  standInFor?: ReadonlySet<string>,
): EntryParameters[] {
  if (discovery === undefined) {
    return []
  }
  const permissions = discovery.permissions
  const holders = standInFor ?? new Set(Object.keys(permissions ?? {}))
  if (permissions === undefined && holders.size === 0) {
    return discovery.entries
  }

  const copy = {
    ...discovery,
    entries: discovery.entries.map((entry) => ({ ...entry })),
  }
  attachPermissions([copy])

  // A holder owned by a referenced project has no entry here, so without a
  // stand-in it is absent from the diff and a change to its permissions reaches
  // neither diffHistory nor Update Monitor. `Reference` is what marks it as
  // belonging to another project when it is rendered. Sorted, so the diff does
  // not reorder between runs.
  const known = new Set(copy.entries.map((entry) => entry.address))
  for (const rawAddress of [...holders].sort()) {
    const address = rawAddress as ChainSpecificAddress
    if (known.has(address)) {
      continue
    }
    copy.entries.push({
      type: 'Reference',
      address,
      ...(permissions?.[address] ?? {}),
    })
  }

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
