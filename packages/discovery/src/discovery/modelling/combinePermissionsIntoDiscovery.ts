import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import type {
  DiscoveryOutput,
  EntryParameters,
  PermissionEntry,
  PermissionsOutput,
  ReceivedPermission,
} from '../output/types'
import { getReachableEntries } from '../utils/reachable'

// Permissions are stored outside `entries`, in one map keyed by the address
// that holds them, so that an entry stays a description of a contract and
// nothing else. Reading joins the map back onto the entries.
//
// The shape of a stored permission is unchanged: it still matches the
// historical ReceivedPermission format, so the Clingo modelling remains a
// drop-in replacement for the old one.
export function combinePermissionsIntoDiscovery(
  discovery: DiscoveryOutput,
  permissionsOutput: PermissionsOutput,
  // Every entry of the cluster, because an upgrade target or the original of
  // an aliased address can live in a referenced project.
  clusterEntries: EntryParameters[] = discovery.entries,
) {
  discovery.permissionsConfigHash = permissionsOutput.permissionsConfigHash

  const allAddresses = new Set(
    clusterEntries.map((e) => e.address.toLowerCase()),
  )

  // Keyed by receiver rather than by entry: modelling now spans the whole
  // cluster, so an address that holds a permission is often owned by a
  // referenced project and has no entry here beyond a Reference stub.
  const receivers = new Set(
    permissionsOutput.permissions.map((p) => p.receiver.toString()),
  )

  const byAddress: Record<string, PermissionEntry> = {}
  for (const receiver of receivers) {
    const permissionEntry = buildPermissionEntry(
      ChainSpecificAddress(receiver),
      permissionsOutput,
      clusterEntries,
      allAddresses,
    )
    if (Object.keys(permissionEntry).length === 0) {
      continue
    }
    byAddress[receiver] = permissionEntry
  }

  const reachable = reachableFromEntrypoints(
    discovery,
    clusterEntries,
    byAddress,
  )

  const sorted: Record<string, PermissionEntry> = {}
  for (const address of Object.keys(byAddress).sort()) {
    if (!reachable.has(address)) {
      continue
    }
    const permissionEntry = byAddress[address]
    assert(permissionEntry !== undefined)
    sorted[address] = permissionEntry
  }

  discovery.permissions = Object.keys(sorted).length === 0 ? undefined : sorted
}

// A reference points at one specific deployment inside a shared module, not at
// everything else that module discovered, so a project holds only the part of
// the cluster its own entrypoints reach. This is the same filter the read side
// applies in ProjectDiscovery: storing more than that would store what nothing
// ever shows.
function reachableFromEntrypoints(
  discovery: DiscoveryOutput,
  clusterEntries: EntryParameters[],
  byAddress: Record<string, PermissionEntry>,
): Set<string> {
  // Reachability walks issued permissions, so they have to be on the entries
  // before it runs. The copy keeps them off the entries that get written.
  const withPermissions = clusterEntries
    .filter((entry) => entry.type !== 'Reference')
    .map((entry) => ({ ...entry, ...(byAddress[entry.address] ?? {}) }))

  const entrypoints = discovery.entries.map((entry) => entry.address)
  return new Set(
    getReachableEntries(withPermissions, entrypoints).map((entry) =>
      entry.address.toString(),
    ),
  )
}

function buildPermissionEntry(
  receiver: ChainSpecificAddress,
  permissionsOutput: PermissionsOutput,
  clusterEntries: EntryParameters[],
  allAddresses: Set<string>,
): PermissionEntry {
  const pick = (isFinal: boolean) => {
    const forEntry = permissionsOutput.permissions.filter(
      (p) => p.receiver === receiver && p.isFinal === isFinal,
    )
    if (forEntry.length === 0) {
      return undefined
    }
    return reverseVia(
      sortReceivedPermissions(
        forEntry.map((p) => {
          // Remove some fields for backwards compatibility
          const { receiver: _, isFinal: __, ...rest } = p
          return rest
        }),
      ),
    )
  }

  // A permission the address does not hold is an absent key, never a key
  // holding undefined: reading joins the map with Object.assign, which would
  // copy such a key onto the entry and make the diff report a phantom change.
  const permissionEntry: PermissionEntry = {}

  const receivedPermissions = pick(true)
  if (receivedPermissions !== undefined) {
    permissionEntry.receivedPermissions = receivedPermissions
  }

  const directlyReceivedPermissions = pick(false)
  if (directlyReceivedPermissions !== undefined) {
    permissionEntry.directlyReceivedPermissions = directlyReceivedPermissions
  }

  if (
    permissionsOutput.eoasWithUpgradePermissions?.includes(receiver) &&
    !isZeroAddress(receiver) &&
    !isAlias(receiver, allAddresses) &&
    upgradesCriticalContract(receivedPermissions, clusterEntries)
  ) {
    permissionEntry.eoaWithUpgradePermissions = true
  }

  return permissionEntry
}

// Renounced admin slots point at the zero address, which the modelling
// still reports as an EOA with upgrade permissions even though nobody
// controls it.
function isZeroAddress(address: ChainSpecificAddress): boolean {
  const hexAddr = address.split(':0x')[1]
  return hexAddr !== undefined && BigInt('0x' + hexAddr) === 0n
}

// Known address alias offsets per chain prefix.
// When an L1 contract sends a message to L2, the L2 sees the sender address
// offset by this value. The resulting "alias" address has no private key.
const ALIAS_OFFSETS: Record<string, bigint> = {
  arb1: 0x1111000000000000000000000000000000001111n,
  'arb-nova': 0x1111000000000000000000000000000000001111n,
  base: 0x1111000000000000000000000000000000001111n,
  oeth: 0x1111000000000000000000000000000000001111n,
  ink: 0x1111000000000000000000000000000000001111n,
  unichain: 0x1111000000000000000000000000000000001111n,
  kinto: 0x1111000000000000000000000000000000001111n,
  zksync: 0x1111000000000000000000000000000000001111n,
  scr: 0x1111000000000000000000000000000000001111n,
  robinhood: 0x1111000000000000000000000000000000001111n,
}

const MOD = 2n ** 160n

function isAlias(
  address: ChainSpecificAddress,
  allAddresses: Set<string>,
): boolean {
  const parts = address.split(':0x')
  const chain = parts[0]
  const hexAddr = parts[1]
  if (chain === undefined || hexAddr === undefined) return false

  const offset = ALIAS_OFFSETS[chain]
  if (offset === undefined) return false

  const addressBig = BigInt('0x' + hexAddr)
  const originalBig = (addressBig - offset + MOD) % MOD
  const originalHex = originalBig.toString(16).padStart(40, '0')

  // Check if any address in the discovery (on any chain) matches the original
  for (const knownAddr of allAddresses) {
    const knownHex = knownAddr.split(':0x')[1]
    if (knownHex === originalHex) {
      return true
    }
  }
  return false
}

function upgradesCriticalContract(
  receivedPermissions: ReceivedPermission[] | undefined,
  clusterEntries: EntryParameters[],
): boolean {
  const upgradeTargets =
    receivedPermissions
      ?.filter((p) => p.permission === 'upgrade')
      .map((p) => p.from) ?? []
  return upgradeTargets.some((target) => {
    const targetEntry = clusterEntries.find((e) => e.address === target)
    if (targetEntry === undefined) return false
    return (
      targetEntry.category === undefined || targetEntry.category.priority > 0
    )
  })
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
