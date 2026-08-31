import { assert, type ChainSpecificAddress } from '@l2beat/shared-pure'
import type {
  DiscoveryOutput,
  EntryParameters,
  PermissionEntry,
  PermissionsOutput,
  ReceivedPermission,
} from '../output/types'

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
) {
  discovery.permissionsConfigHash = permissionsOutput.permissionsConfigHash

  const allAddresses = new Set(
    discovery.entries.map((e) => e.address.toLowerCase()),
  )

  const byAddress: Record<string, PermissionEntry> = {}
  for (const entry of discovery.entries) {
    const permissionEntry = buildPermissionEntry(
      entry,
      permissionsOutput,
      discovery,
      allAddresses,
    )
    if (isEmpty(permissionEntry)) {
      continue
    }
    byAddress[entry.address] = permissionEntry
  }

  const sorted: Record<string, PermissionEntry> = {}
  for (const address of Object.keys(byAddress).sort()) {
    const permissionEntry = byAddress[address]
    assert(permissionEntry !== undefined)
    sorted[address] = permissionEntry
  }

  discovery.permissions = Object.keys(sorted).length === 0 ? undefined : sorted
}

function buildPermissionEntry(
  entry: EntryParameters,
  permissionsOutput: PermissionsOutput,
  discovery: DiscoveryOutput,
  allAddresses: Set<string>,
): PermissionEntry {
  const pick = (isFinal: boolean) => {
    const forEntry = permissionsOutput.permissions.filter(
      (p) => p.receiver.startsWith(entry.address) && p.isFinal === isFinal,
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

  const receivedPermissions = pick(true)
  const isEoaWithUpgradePermissions =
    permissionsOutput.eoasWithUpgradePermissions?.includes(entry.address) &&
    !isZeroAddress(entry.address) &&
    !isAlias(entry.address, allAddresses) &&
    upgradesCriticalContract(receivedPermissions, discovery)

  return {
    receivedPermissions,
    directlyReceivedPermissions: pick(false),
    eoaWithUpgradePermissions: isEoaWithUpgradePermissions ? true : undefined,
  }
}

function isEmpty(permissionEntry: PermissionEntry): boolean {
  return (
    permissionEntry.receivedPermissions === undefined &&
    permissionEntry.directlyReceivedPermissions === undefined &&
    permissionEntry.eoaWithUpgradePermissions === undefined
  )
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
  discovery: DiscoveryOutput,
): boolean {
  const upgradeTargets =
    receivedPermissions
      ?.filter((p) => p.permission === 'upgrade')
      .map((p) => p.from) ?? []
  return upgradeTargets.some((target) => {
    const targetEntry = discovery.entries.find((e) => e.address === target)
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
