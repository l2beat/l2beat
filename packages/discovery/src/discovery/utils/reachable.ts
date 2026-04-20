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
// that are reachable from initial entrypoints.
// maxDepth=0 means "only entrypoints", 1 means "entrypoints + direct refs", etc.
export function getReachableAddresses(
  nodes: ReferenceNode[],
  entrypoints: ChainSpecificAddress[],
  maxDepth = Number.POSITIVE_INFINITY,
): ChainSpecificAddress[] {
  const nodeByAddress: Record<ChainSpecificAddress, ReferenceNode> = {}
  nodes.forEach((node) => (nodeByAddress[node.address] = node))

  const shortestDepthByAddress = new Map<ChainSpecificAddress, number>()
  const queue = entrypoints.map((address) => ({ address, depth: 0 }))

  for (const item of queue) {
    const { address, depth } = item
    const previousDepth = shortestDepthByAddress.get(address)
    if (previousDepth !== undefined && previousDepth <= depth) {
      continue
    }

    shortestDepthByAddress.set(address, depth)

    if (depth >= maxDepth) {
      continue
    }

    const node = nodeByAddress[address]
    if (!node) {
      // It's possible to reference nodes that don't exist
      // e.g. due to "ignoreDiscovery" flag, etc.
      continue
    }

    for (const ref of node.references) {
      queue.push({ address: ref, depth: depth + 1 })
    }
  }

  return Array.from(shortestDepthByAddress.keys())
}

export function getReachableEntries(
  entries: EntryParameters[],
  entrypoints: ChainSpecificAddress[],
  maxDepth = Number.POSITIVE_INFINITY,
): EntryParameters[] {
  const asReferenceNodes = mapToReferenceNodes(entries)
  const reachableAddresses = getReachableAddresses(
    asReferenceNodes,
    entrypoints,
    maxDepth,
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
