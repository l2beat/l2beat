import type {
  DiscoveryOutput,
  EntryParameters,
  PermissionsOutput,
  ReceivedPermission,
} from '../output/types'

// This function transforms permission modelling output such that
// it matches the historical format of ReceivedPermission.
// This makes the new Clingo modelling a drop-in replacement for the old one
// and gives certainty that nothing has been broken.
export async function combinePermissionsIntoDiscovery(
  discovery: DiscoveryOutput,
  permissionsOutput: PermissionsOutput,
) {
  const updateRelevantField = (
    entry: EntryParameters,
    field: keyof EntryParameters,
    value: ReceivedPermission[] | undefined,
  ) => {
    if (field === 'receivedPermissions') {
      entry.receivedPermissions = value
    } else if (field === 'directlyReceivedPermissions') {
      entry.directlyReceivedPermissions = value
    } else {
      throw new Error(`Not a permission field: ${field}`)
    }
  }

  discovery.permissionsConfigHash = permissionsOutput.permissionsConfigHash

  for (const entry of discovery.entries) {
    const permissionKeys: (keyof EntryParameters)[] = [
      'receivedPermissions',
      'directlyReceivedPermissions',
    ]
    for (const key of permissionKeys) {
      const ultimatePermissionsForEntry = permissionsOutput.permissions.filter(
        (p) =>
          p.receiver.startsWith(`${entry.address}`) &&
          p.receiverChain === discovery.chain &&
          (key === 'receivedPermissions' ? p.isFinal : !p.isFinal),
      )
      const permissions =
        ultimatePermissionsForEntry.length === 0
          ? undefined
          : reverseVia(
              sortReceivedPermissions(
                ultimatePermissionsForEntry.map((p) => {
                  // Remove some fields for backwards compatibility
                  const { receiver, receiverChain, isFinal, ...rest } = p
                  return rest
                }),
              ),
            )
      updateRelevantField(entry, key, permissions)
    }
  }
}

// Temporary reversal of via for backwards compatibility
function reverseVia(p: ReceivedPermission[]) {
  return p.map((p) => {
    const { via, ...rest } = p
    if (!via) {
      return p
    }
    return {
      ...rest,
      via: via.reverse(),
    }
  })
}

// Backwards compatible sorting function
function sortReceivedPermissions<T extends ReceivedPermission>(
  input: T[],
): T[] {
  return input.sort((a, b) => {
    return JSON.stringify(a).localeCompare(JSON.stringify(b))
  })
}
