import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { EntryParameters } from '../output/types'
import { toAddressArray } from './extractors'

type ReferenceNode = {
  entry: EntryParameters
  references: Set<ChainSpecificAddress>
}

export function getReferencedEntries(
  references: EntryParameters[],
  entries: EntryParameters[],
): EntryParameters[] {
  const nodes = new Map<ChainSpecificAddress, ReferenceNode>()
  const referencedEntries = new Set<ChainSpecificAddress>()

  function addEntry(entry: EntryParameters) {
    if (nodes.has(entry.address)) {
      throw new Error(`Duplicate entry address: ${entry.address}`)
    }

    nodes.set(entry.address, {
      entry,
      references: new Set(),
    })
  }

  function getEntry(address: ChainSpecificAddress): ReferenceNode | null {
    const node = nodes.get(address)

    return node ?? null
  }

  function addReference(from: ChainSpecificAddress, to: ChainSpecificAddress) {
    const fromEntry = getEntry(from)
    if (fromEntry) {
      fromEntry.references.add(to)
    }
  }

  for (const entry of entries) {
    addEntry(entry)
  }

  for (const entry of entries) {
    const referencedAddresses = extractAddressesFromValues(entry)
    const referencedAddressesFromPermissions =
      extractAddressesFromPermissions(entry)

    for (const referencedAddress of referencedAddresses) {
      addReference(entry.address, referencedAddress)
    }

    for (const referencedAddress of referencedAddressesFromPermissions) {
      addReference(entry.address, referencedAddress)
    }
  }

  function collectReferences(entry: EntryParameters) {
    if (referencedEntries.has(entry.address)) {
      return
    }

    referencedEntries.add(entry.address)
    const node = getEntry(entry.address)

    if (!node) {
      return
    }

    for (const refAddress of node.references) {
      const refNode = getEntry(refAddress)

      if (refNode) {
        collectReferences(refNode.entry)
      }
    }
  }

  for (const ref of references) {
    const node = getEntry(ref.address)

    if (node) {
      collectReferences(node.entry)
    }
  }

  return Array.from(referencedEntries).flatMap(
    (address) => getEntry(address)?.entry ?? [],
  )
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

function extractAddressesFromPermissions(
  entry: EntryParameters,
): ChainSpecificAddress[] {
  const addresses: ChainSpecificAddress[] = []

  const permissions = [
    ...(entry.receivedPermissions ?? []),
    ...(entry.directlyReceivedPermissions ?? []),
  ]

  for (const permission of permissions) {
    addresses.push(permission.from)

    if (permission.via) {
      for (const via of permission.via) {
        addresses.push(via.address)
      }
    }
  }

  return addresses
}
