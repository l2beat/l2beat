import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import isEmpty from 'lodash/isEmpty'
import type {
  DiscoveryOutput,
  EntryParameters,
  PermissionsOutput,
  ReceivedPermission,
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

  const allAddresses = new Set(
    discovery.entries.map((e) => e.address.toLowerCase()),
  )

  for (const entry of discovery.entries) {
    const permissionKeys: (keyof EntryParameters)[] = [
      'receivedPermissions',
      'directlyReceivedPermissions',
    ]
    for (const key of permissionKeys) {
      const ultimatePermissionsForEntry = permissionsOutput.permissions.filter(
        (p) =>
          p.receiver.startsWith(entry.address) &&
          (key === 'receivedPermissions' ? p.isFinal : !p.isFinal),
      )
      const permissions =
        ultimatePermissionsForEntry.length === 0
          ? undefined
          : reverseVia(
              sortReceivedPermissions(
                ultimatePermissionsForEntry.map((p) => {
                  // Remove some fields for backwards compatibility
                  const { receiver: _, isFinal: __, ...rest } = p
                  return rest
                }),
              ),
            )
      updateRelevantField(entry, key, permissions)
    }

    entry.eoaWithUpgradePermissions =
      permissionsOutput.eoasWithUpgradePermissions?.includes(entry.address) &&
      !isZeroAddress(entry.address) &&
      !isAlias(entry.address, allAddresses) &&
      upgradesCriticalContract(entry, discovery)
        ? true
        : undefined
  }

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
