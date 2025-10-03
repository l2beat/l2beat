import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type {
  ContractValue,
  DiscoveryOutput,
  EntryParameters,
} from '../output/types'

/**
 * Filters discovery entries to only include contracts that are referenced
 * directly by entry points or indirectly via other referenced contracts.
 *
 * @param discovery - The discovery output containing all entries
 * @param references - Array of entry parameters
 * @returns Filtered discovery output with only referenced entries
 */
export function filterReferencedEntries(
  references: EntryParameters[],
  discovery: DiscoveryOutput,
): DiscoveryOutput {
  const entrypointAddresses = new Set(references.map((r) => r.address))
  const referencedAddresses = new Set<ChainSpecificAddress>()
  const addressToEntry = new Map<ChainSpecificAddress, EntryParameters>()

  for (const entry of discovery.entries) {
    addressToEntry.set(entry.address, entry)
  }

  for (const address of entrypointAddresses) {
    referencedAddresses.add(address)
  }

  let foundNewReferences = true
  while (foundNewReferences) {
    foundNewReferences = false
    const currentReferencedAddresses = Array.from(referencedAddresses)

    for (const address of currentReferencedAddresses) {
      const entry = addressToEntry.get(address)
      if (!entry || !entry.values) {
        continue
      }

      const extractedAddresses = extractAddressesFromValues(entry.values)

      for (const extractedAddress of extractedAddresses) {
        if (
          !referencedAddresses.has(extractedAddress) &&
          addressToEntry.has(extractedAddress)
        ) {
          referencedAddresses.add(extractedAddress)
          foundNewReferences = true
        }
      }
    }
  }

  const filteredEntries = discovery.entries.filter((entry) =>
    referencedAddresses.has(entry.address),
  )

  return {
    ...discovery,
    entries: filteredEntries,
  }
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
