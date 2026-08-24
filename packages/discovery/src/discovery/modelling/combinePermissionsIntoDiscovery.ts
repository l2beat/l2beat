import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type {
  DiscoveryOutput,
  PermissionEntry,
  PermissionsOutput,
  ReceivedPermission,
} from '../output/types'

// This function transforms permission modelling output such that
// it matches the historical format of ReceivedPermission.
// This makes the new Clingo modelling a drop-in replacement for the old one
// and gives certainty that nothing has been broken.
export function combinePermissionsIntoDiscovery(
  discovery: DiscoveryOutput,
  permissionsOutput: PermissionsOutput,
) {
  discovery.permissionsConfigHash = permissionsOutput.permissionsConfigHash

  const allAddresses = new Set(
    discovery.entries.map((e) => e.address.toLowerCase()),
  )
  const ownAddresses = new Set(
    discovery.entries
      .filter((e) => e.type !== 'Reference')
      .map((e) => e.address),
  )

  const byReceiver = groupByReceiver(permissionsOutput.permissions)

  for (const entry of discovery.entries) {
    // A Reference entry is a stub for an address owned by another project, so
    // it is handled like any other foreign receiver below.
    const forEntry =
      entry.type === 'Reference' ? [] : (byReceiver.get(entry.address) ?? [])
    const permissionEntry = buildPermissionEntry(
      entry.address,
      forEntry,
      permissionsOutput,
      discovery,
      allAddresses,
    )
    entry.receivedPermissions = permissionEntry.receivedPermissions
    entry.directlyReceivedPermissions =
      permissionEntry.directlyReceivedPermissions
    entry.eoaWithUpgradePermissions = permissionEntry.eoaWithUpgradePermissions
  }

  discovery.referencedPermissions = buildReferencedPermissions(
    byReceiver,
    permissionsOutput,
    discovery,
    ownAddresses,
    allAddresses,
  )
}

function groupByReceiver(
  permissions: PermissionsOutput['permissions'],
): Map<ChainSpecificAddress, PermissionsOutput['permissions']> {
  const result = new Map<
    ChainSpecificAddress,
    PermissionsOutput['permissions']
  >()
  for (const permission of permissions) {
    const bucket = result.get(permission.receiver)
    if (bucket === undefined) {
      result.set(permission.receiver, [permission])
    } else {
      bucket.push(permission)
    }
  }
  return result
}

// Everything the modelling found for one receiver, in the shape an entry
// stores it.
function buildPermissionEntry(
  receiver: ChainSpecificAddress,
  permissionsForReceiver: PermissionsOutput['permissions'],
  permissionsOutput: PermissionsOutput,
  discovery: DiscoveryOutput,
  allAddresses: Set<string>,
): PermissionEntry {
  const pick = (isFinal: boolean) => {
    const picked = permissionsForReceiver.filter((p) => p.isFinal === isFinal)
    if (picked.length === 0) {
      return undefined
    }
    return reverseVia(
      sortReceivedPermissions(
        picked.map((p) => {
          // Remove some fields for backwards compatibility
          const { receiver: _, isFinal: __, ...rest } = p
          return rest
        }),
      ),
    )
  }

  const receivedPermissions = pick(true)
  const isEoaWithUpgradePermissions =
    permissionsOutput.eoasWithUpgradePermissions?.includes(receiver) &&
    !isZeroAddress(receiver) &&
    !isAlias(receiver, allAddresses) &&
    upgradesCriticalContract(receivedPermissions, discovery)

  return {
    receivedPermissions,
    directlyReceivedPermissions: pick(false),
    eoaWithUpgradePermissions: isEoaWithUpgradePermissions ? true : undefined,
  }
}

// A permission can end up in the hands of an address that this project never
// discovered, because the crawl stops at the entrypoint of the project that
// owns it. Keyed by address so the read side can merge it onto the referenced
// discovery. Only permissions given by this project's own contracts are kept,
// otherwise every consumer would carry a copy of the shared module's internal
// permission graph.
function buildReferencedPermissions(
  byReceiver: Map<ChainSpecificAddress, PermissionsOutput['permissions']>,
  permissionsOutput: PermissionsOutput,
  discovery: DiscoveryOutput,
  ownAddresses: Set<ChainSpecificAddress>,
  allAddresses: Set<string>,
): Record<ChainSpecificAddress, PermissionEntry> | undefined {
  const result: Record<ChainSpecificAddress, PermissionEntry> = {}

  const foreignReceivers = [...byReceiver.keys()]
    .filter((receiver) => !ownAddresses.has(receiver))
    .sort()

  for (const receiver of foreignReceivers) {
    const permissions = (byReceiver.get(receiver) ?? []).filter((p) =>
      ownAddresses.has(p.from),
    )
    if (permissions.length === 0) {
      continue
    }
    result[receiver] = withoutUndefined(
      buildPermissionEntry(
        receiver,
        permissions,
        permissionsOutput,
        discovery,
        allAddresses,
      ),
    )
  }

  return Object.keys(result).length === 0 ? undefined : result
}

function withoutUndefined(entry: PermissionEntry): PermissionEntry {
  const result: PermissionEntry = {}
  if (entry.receivedPermissions !== undefined) {
    result.receivedPermissions = entry.receivedPermissions
  }
  if (entry.directlyReceivedPermissions !== undefined) {
    result.directlyReceivedPermissions = entry.directlyReceivedPermissions
  }
  if (entry.eoaWithUpgradePermissions !== undefined) {
    result.eoaWithUpgradePermissions = entry.eoaWithUpgradePermissions
  }
  return result
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
