import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type {
  DiscoveryOutput,
  EntryParameters,
  PermissionEntry,
  ReceivedPermission,
} from '../output/types'

// Modelling stores a permission that ended up outside the project it was
// modelled for under `referencedPermissions`, keyed by the address that holds
// it. That address is discovered in full by the project that owns it, so the
// two halves are joined here, in memory, when the cluster is read. Nothing is
// written back: a shared module's own discovery stays consumer agnostic.
//
// Mutates in place, because callers compare entries by identity afterwards.
export function mergeReferencedPermissions(
  discoveries: DiscoveryOutput[],
): void {
  const entriesByAddress = new Map<ChainSpecificAddress, EntryParameters[]>()
  for (const discovery of discoveries) {
    for (const entry of discovery.entries) {
      if (entry.type === 'Reference') {
        continue
      }
      const bucket = entriesByAddress.get(entry.address)
      if (bucket === undefined) {
        entriesByAddress.set(entry.address, [entry])
      } else {
        bucket.push(entry)
      }
    }
  }

  for (const discovery of discoveries) {
    for (const [address, permissions] of Object.entries(
      discovery.referencedPermissions ?? {},
    )) {
      const targets = entriesByAddress.get(address as ChainSpecificAddress)
      for (const target of targets ?? []) {
        mergeInto(target, permissions)
      }
    }
  }
}

function mergeInto(entry: EntryParameters, permissions: PermissionEntry): void {
  entry.receivedPermissions = concatPermissions(
    entry.receivedPermissions,
    permissions.receivedPermissions,
  )
  entry.directlyReceivedPermissions = concatPermissions(
    entry.directlyReceivedPermissions,
    permissions.directlyReceivedPermissions,
  )
  if (permissions.eoaWithUpgradePermissions) {
    entry.eoaWithUpgradePermissions = true
  }
}

// `via` is already reversed and the arrays already sorted at write time, so
// this only de-duplicates: merging the same cluster twice must not grow it.
function concatPermissions(
  current: ReceivedPermission[] | undefined,
  extra: ReceivedPermission[] | undefined,
): ReceivedPermission[] | undefined {
  if (extra === undefined || extra.length === 0) {
    return current
  }
  const result = [...(current ?? [])]
  const seen = new Set(result.map((p) => JSON.stringify(p)))
  for (const permission of extra) {
    const key = JSON.stringify(permission)
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    result.push(permission)
  }
  return result
}
