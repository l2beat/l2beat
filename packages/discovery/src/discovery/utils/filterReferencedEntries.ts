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

  // Build address to entry mapping for quick lookup
  for (const entry of discovery.entries) {
    addressToEntry.set(entry.address, entry)
  }

  // Start with all entrypoint addresses as referenced
  for (const address of entrypointAddresses) {
    referencedAddresses.add(address)
  }

  // Iteratively find all indirectly referenced addresses
  let foundNewReferences = true
  while (foundNewReferences) {
    foundNewReferences = false
    const currentReferencedAddresses = Array.from(referencedAddresses)

    for (const address of currentReferencedAddresses) {
      const entry = addressToEntry.get(address)
      if (!entry || !entry.values) {
        continue
      }

      // Extract all addresses from the contract values
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

  // Filter entries to only include referenced ones
  const filteredEntries = discovery.entries.filter((entry) =>
    referencedAddresses.has(entry.address),
  )

  return {
    ...discovery,
    entries: filteredEntries,
  }
}

/**
 * Recursively extracts all addresses from contract values
 */
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

/**
 * Recursively extracts addresses from a single contract value
 */
function extractAddressesFromValue(
  value: ContractValue,
): ChainSpecificAddress[] {
  const addresses: ChainSpecificAddress[] = []

  if (typeof value === 'string' && ChainSpecificAddress.check(value)) {
    addresses.push(value)
  }

  if (Array.isArray(value)) {
    // Recursively process array elements
    for (const item of value) {
      addresses.push(...extractAddressesFromValue(item))
    }
  } else if (typeof value === 'object' && value !== null) {
    // Recursively process object values
    for (const objectValue of Object.values(value)) {
      if (objectValue !== undefined) {
        addresses.push(...extractAddressesFromValue(objectValue))
      }
    }
  }

  return addresses
}
