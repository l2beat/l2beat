import type { DiscoveryOutput } from './types'

// Permissions are stored outside `entries`, in one map owned by the project
// that was modelled. Reading joins it onto the entries of every project in the
// cluster: an address is discovered by whichever project owns it, but the
// permission over it was modelled here. A referenced project's own map is
// deliberately ignored, so a project is always rendered from a single model
// rather than a union of independently stale ones.
//
// Mutates in place, because callers compare entries by identity afterwards.
export function attachPermissions(discoveries: DiscoveryOutput[]): void {
  const permissions = discoveries.at(0)?.permissions
  if (permissions === undefined) {
    return
  }

  for (const discovery of discoveries) {
    for (const entry of discovery.entries) {
      const forEntry = permissions[entry.address]
      if (forEntry === undefined) {
        continue
      }
      // Assigned rather than set field by field so that a permission the
      // address does not hold stays an absent key, not a key holding
      // undefined - the diff treats those two as different.
      Object.assign(entry, forEntry)
    }
  }
}
