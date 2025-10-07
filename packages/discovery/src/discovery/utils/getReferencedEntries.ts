import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { writeFileSync } from 'fs'
import type {
  ContractValue,
  EntryParameters,
  ReceivedPermission,
} from '../output/types'

type ReferenceNode = {
  entry: EntryParameters
  referencedBy: Set<ChainSpecificAddress>
  references: Set<ChainSpecificAddress>
}

export function getReferencedEntries(
  references: EntryParameters[],
  entries: EntryParameters[],
  debug?: boolean,
): EntryParameters[] {
  const nodes = new Map<ChainSpecificAddress, ReferenceNode>()

  function addEntry(entry: EntryParameters) {
    if (nodes.has(entry.address)) {
      throw new Error(`Duplicate entry address: ${entry.address}`)
    }

    nodes.set(entry.address, {
      entry,
      referencedBy: new Set(),
      references: new Set(),
    })
  }

  function getEntry(address: ChainSpecificAddress): ReferenceNode | null {
    const node = nodes.get(address)

    if (
      ChainSpecificAddress.ZERO(ChainSpecificAddress.longChain(address)) ===
        address &&
      !nodes.has(address)
    ) {
      nodes.set(address, {
        entry: {
          type: 'Reference',
          address,
          targetType: 'Reference',
          targetProject: 'ZERO',
        },
        referencedBy: new Set(),
        references: new Set(),
      })

      // biome-ignore lint/style/noNonNullAssertion: it's guaranteed to be set
      return nodes.get(address)!
    }

    return node ?? null
  }

  function addReference(from: ChainSpecificAddress, to: ChainSpecificAddress) {
    const fromEntry = getEntry(from)

    if (fromEntry) {
      fromEntry.references.add(to)
    }

    const toEntry = getEntry(to)
    if (toEntry) {
      toEntry.referencedBy.add(from)
    }
  }

  for (const entry of entries) {
    addEntry(entry)
  }

  for (const entry of entries) {
    if (entry.values) {
      const referencedAddresses = extractAddressesFromValues(entry.values)
      const referencedAddressesFromPermissions =
        extractAddressesFromPermissions(entry)

      for (const referencedAddress of referencedAddresses) {
        addReference(entry.address, referencedAddress)
      }

      for (const referencedAddress of referencedAddressesFromPermissions) {
        addReference(entry.address, referencedAddress)
      }
    }
  }

  const referencedEntries = new Set<ChainSpecificAddress>()

  if (debug) {
    writeFileSync(
      'referencedEntries.json',
      JSON.stringify(
        Array.from(nodes.entries()).map(([, node]) => ({
          name: node.entry.name,
          address: node.entry.address,
          referencedBy: Array.from(node.referencedBy),
          references: Array.from(node.references),
        })),
        null,
        2,
      ),
    )
  }

  function expandReferences(entry: EntryParameters) {
    if (referencedEntries.has(entry.address)) {
      return
    }
    referencedEntries.add(entry.address)
    const entryNode = getEntry(entry.address)
    if (entryNode) {
      for (const refAddress of entryNode.references) {
        const refNode = getEntry(refAddress)
        if (refNode) {
          expandReferences(refNode.entry)
        }
      }
    }
  }

  for (const ref of references) {
    const refNode = getEntry(ref.address)
    if (refNode) {
      expandReferences(refNode.entry)
    }
  }

  return Array.from(referencedEntries).flatMap(
    (address) => getEntry(address)?.entry ?? [],
  )
}

function extractAddressesFromValues(
  values: Record<string, ContractValue | undefined>,
): ChainSpecificAddress[] {
  const addresses: ChainSpecificAddress[] = []

  for (const value of Object.values(values)) {
    if (value !== undefined) {
      addresses.push(...extractAddressesFromValue(value))
    }
  }

  return addresses
}

function extractAddressesFromValue(
  value: ContractValue,
): ChainSpecificAddress[] {
  const addresses: ChainSpecificAddress[] = []

  if (typeof value === 'string' && ChainSpecificAddress.check(value)) {
    addresses.push(value)
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      addresses.push(...extractAddressesFromValue(item))
    }
  } else if (typeof value === 'object' && value !== null) {
    for (const objectValue of Object.values(value)) {
      if (objectValue !== undefined) {
        addresses.push(...extractAddressesFromValue(objectValue))
      }
    }
  }

  return addresses
}

function extractAddressesFromPermissions(
  entry: EntryParameters,
): ChainSpecificAddress[] {
  const addresses: ChainSpecificAddress[] = []

  if (entry.receivedPermissions) {
    for (const permission of entry.receivedPermissions) {
      addresses.push(...extractAddressesFromReceivedPermission(permission))
    }
  }

  return addresses
}

function extractAddressesFromReceivedPermission(
  permission: ReceivedPermission,
): ChainSpecificAddress[] {
  const addresses: ChainSpecificAddress[] = []

  addresses.push(...extractAddressesFromValue(permission.from))

  if (permission.via) {
    for (const via of permission.via) {
      addresses.push(...extractAddressesFromValue(via.address))
    }
  }

  return addresses
}
