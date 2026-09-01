import type { DiscoveryOutput } from './types'

// Permissions are stored outside `entries`, in a map keyed by the address that
// holds them, so that an entry stays a description of a contract and nothing
// else. Reading joins each project's map back onto its own entries.
//
// Mutates in place, because callers compare entries by identity afterwards.
export function attachPermissions(discoveries: DiscoveryOutput[]): void {
  for (const discovery of discoveries) {
    const permissions = discovery.permissions
    if (permissions === undefined) {
      continue
    }

    for (const entry of discovery.entries) {
      const forEntry = permissions[entry.address]
      if (forEntry === undefined) {
        continue
      }
      // Assigned rather than set field by field so that a permission the
      // project does not hold stays an absent key, not a key holding
      // undefined - the diff treats those two as different.
      Object.assign(entry, forEntry)
    }
  }
}
