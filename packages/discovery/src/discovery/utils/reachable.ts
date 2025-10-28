import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import uniq from 'lodash/uniq'
import type { EntryParameters } from '../output/types'
import { toAddressArray } from './extractors'

type ReferenceNode = {
  address: ChainSpecificAddress
  references: ChainSpecificAddress[]
}

// Convert discovery entries into a simple graph nodes
// with connections to all referenced nodes (directly
// or due to the issued permissions).
// See the test file for graphical example.
export function mapToReferenceNodes(
  entries: EntryParameters[],
): ReferenceNode[] {
  // Entries have *received permissions*, but we need
  // *issued permissions* for correct **direction**.
  // Gather those:
  const issuedPermissions: Record<
    ChainSpecificAddress,
    Set<ChainSpecificAddress>
  > = {}

  for (const entry of entries) {
    const addresses = extractDirectPermissions(entry)
    for (const address of addresses) {
      const value = issuedPermissions[address]
      if (value) {
        value.add(entry.address)
      } else {
        issuedPermissions[address] = new Set([entry.address])
      }
    }
  }

  // Return nodes with direct references in correct (forward) direction
  return entries.map((entry) => ({
    address: entry.address,
    references: uniq([
      // from fields:
      ...extractAddressesFromValues(entry),
      // from issued permissions:
      ...(issuedPermissions[entry.address] ?? []),
    ]),
  }))
}

// Traverse the graph and return all addresses
// that are reachable from initial entrypoints
export function getReachableAddresses(
  nodes: ReferenceNode[],
  entrypoints: ChainSpecificAddress[],
): ChainSpecificAddress[] {
  const nodeByAddress: Record<ChainSpecificAddress, ReferenceNode> = {}
  nodes.forEach((node) => (nodeByAddress[node.address] = node))

  const visited = new Set<ChainSpecificAddress>()

  function visit(address: ChainSpecificAddress) {
    if (visited.has(address)) {
      return
    }
    visited.add(address)

    const node = nodeByAddress[address]
    if (!node) {
      // It's possible to reference nodes that don't exist
      // e.g. due to "ignoreDiscovery" flag, etc.
      return
    }
    for (const ref of node.references) {
      visit(ref)
    }
  }

  entrypoints.forEach(visit)
  return Array.from(visited)
}

export function getReachableEntries(
  entries: EntryParameters[],
  entrypoints: ChainSpecificAddress[],
): EntryParameters[] {
  const asReferenceNodes = mapToReferenceNodes(entries)
  const reachableAddresses = getReachableAddresses(
    asReferenceNodes,
    entrypoints,
  )
  const reachableSet = new Set(reachableAddresses)
  return entries.filter((e) => reachableSet.has(e.address))
}

function extractAddressesFromValues(
  entry: EntryParameters,
): ChainSpecificAddress[] {
  const addresses: ChainSpecificAddress[] = []

  for (const value of Object.values(entry.values ?? {})) {
    addresses.push(...toAddressArray(value))
  }

  return addresses
}

function extractDirectPermissions(
  entry: EntryParameters,
): ChainSpecificAddress[] {
  const permissions = [
    // We're only interested in direct connections
    ...(entry.receivedPermissions ?? []).filter(
      (p) => (p.via ?? []).length === 0,
    ),
    ...(entry.directlyReceivedPermissions ?? []),
  ]

  return permissions.map((p) => p.from)
}
