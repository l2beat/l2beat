import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import isEmpty from 'lodash/isEmpty'
import type {
  DiscoveryOutput,
  EntryParameters,
  PermissionsOutput,
  ReceivedPermission,
  ResolvedPermissionGroup,
} from '../output/types'
import type { DiscoveryTimestamps } from './modelPermissions'

// This function transforms permission modelling output such that
// it matches the historical format of ReceivedPermission.
// This makes the new Clingo modelling a drop-in replacement for the old one
// and gives certainty that nothing has been broken.
export function combinePermissionsIntoDiscovery(
  discovery: DiscoveryOutput,
  permissionsOutput: PermissionsOutput,
  options: { skipDependentDiscoveries?: boolean } = {},
) {
  const permissionsFor = (
    receiver: ChainSpecificAddress,
    isFinal: boolean,
  ): ReceivedPermission[] | undefined => {
    const matching = permissionsOutput.permissions.filter(
      (permission) =>
        permission.receiver.toLowerCase() === receiver.toLowerCase() &&
        permission.isFinal === isFinal,
    )

    if (matching.length === 0) {
      return undefined
    }

    return reverseVia(
      sortReceivedPermissions(
        matching.map((permission) => {
          // Remove some fields for backwards compatibility
          const { receiver: _, isFinal: __, ...rest } = permission
          return rest
        }),
      ),
    )
  }

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
  discovery.impactScenarios = permissionsOutput.impactScenarios

  const allAddresses = new Set(
    discovery.entries.map((e) => e.address.toLowerCase()),
  )
  const concreteAddresses = new Set(
    discovery.entries
      .filter((entry) => entry.type !== 'Reference')
      .map((entry) => entry.address.toLowerCase()),
  )

  for (const entry of discovery.entries) {
    updateRelevantField(
      entry,
      'receivedPermissions',
      permissionsFor(entry.address, true),
    )
    updateRelevantField(
      entry,
      'directlyReceivedPermissions',
      permissionsFor(entry.address, false),
    )

    entry.eoaWithUpgradePermissions =
      permissionsOutput.eoasWithUpgradePermissions?.includes(entry.address) &&
      !isZeroAddress(entry.address) &&
      !isAlias(entry.address, allAddresses) &&
      upgradesCriticalContract(entry, discovery)
        ? true
        : undefined
  }

  const permissionGroups = permissionsOutput.permissionGroups ?? []
  const impactGroupPrincipals = new Set(
    (permissionsOutput.impactScenarios ?? []).flatMap((scenario) =>
      scenario.principals.flatMap((principal) =>
        principal.type === 'group' ? [principal.key] : [],
      ),
    ),
  )
  const localPermissionGroups = permissionGroups.filter((group) =>
    concreteAddresses.has(group.permission.from.toLowerCase()),
  )
  const externalPermissionGroups = permissionGroups.filter(
    (group) =>
      (permissionsOutput.impactScenarios === undefined
        ? group.isProjectScoped === true
        : impactGroupPrincipals.has(
            `group:${group.permission.from.toLowerCase()}:${group.id}`,
          )) && !concreteAddresses.has(group.permission.from.toLowerCase()),
  )
  discovery.permissionGroups = isEmpty(localPermissionGroups)
    ? undefined
    : localPermissionGroups.map(withoutProjectScope)
  discovery.externalPermissionGroups = isEmpty(externalPermissionGroups)
    ? undefined
    : externalPermissionGroups.map(withoutProjectScope)

  const externalReceivers = new Set(
    permissionsOutput.permissions
      .filter(
        (permission) =>
          !concreteAddresses.has(permission.receiver.toLowerCase()) &&
          concreteAddresses.has(permission.from.toLowerCase()),
      )
      .map((permission) => permission.receiver),
  )
  for (const scenario of permissionsOutput.impactScenarios ?? []) {
    for (const principal of scenario.principals) {
      if (
        principal.type === 'address' &&
        !concreteAddresses.has(principal.address.toLowerCase()) &&
        permissionsOutput.permissions.some(
          (permission) =>
            permission.receiver.toLowerCase() ===
              principal.address.toLowerCase() && permission.isFinal,
        )
      ) {
        externalReceivers.add(principal.address)
      }
    }
  }

  const externalPermissions = Object.fromEntries(
    Array.from(externalReceivers)
      .sort()
      .map((receiver) => [
        receiver,
        {
          receivedPermissions: permissionsFor(receiver, true),
          directlyReceivedPermissions: permissionsFor(receiver, false),
          eoaWithUpgradePermissions:
            permissionsOutput.eoasWithUpgradePermissions?.some(
              (address) => address.toLowerCase() === receiver.toLowerCase(),
            ) || undefined,
        },
      ]),
  )
  discovery.externalPermissions = isEmpty(externalPermissions)
    ? undefined
    : externalPermissions

  if (!options.skipDependentDiscoveries) {
    const timestampsWithoutCurProj: DiscoveryTimestamps = {}
    for (const [project, { timestamp }] of Object.entries(
      permissionsOutput.dependentTimestamps,
    )) {
      if (!(project === discovery.name)) {
        timestampsWithoutCurProj[project] ??= { timestamp }
        timestampsWithoutCurProj[project].timestamp = timestamp
      }
    }
    discovery.dependentDiscoveries = isEmpty(timestampsWithoutCurProj)
      ? undefined // remove entry if there are no dependent discoveries
      : timestampsWithoutCurProj
  }
}

function withoutProjectScope(
  group: ResolvedPermissionGroup,
): ResolvedPermissionGroup {
  const { isProjectScoped: _, ...rest } = group
  return rest
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
  entry: EntryParameters,
  discovery: DiscoveryOutput,
): boolean {
  const upgradeTargets =
    entry.receivedPermissions
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
