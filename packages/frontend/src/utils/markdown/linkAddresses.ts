import type { ProjectContracts, ProjectPermissions } from '@l2beat/config'

/**
 * replaces ChainSpecificAddress occurrences (e.g., eth:0xB272B188855128c10a933Edb62CC64c22B1f3754)
 * in markdown string with named markdown links [Name](#id).
 * only replaces if the address name is known from contracts or permissions.
 */
export function linkAddresses(
  content: string,
  contracts: ProjectContracts | undefined,
  permissions: Record<string, ProjectPermissions> | undefined,
): string {
  const addressToDetails = buildAddressToDetailsMap(contracts, permissions)
  if (addressToDetails.size === 0) {
    return content
  }

  // ChainSpecificAddress pattern: shortChainName:0xHexAddress (40 hex chars)
  const chainSpecificAddressPattern = /([a-z][a-z0-9-]*):0x[a-fA-F0-9]{40}/g

  return content.replace(chainSpecificAddressPattern, (match) => {
    const details = addressToDetails.get(match)
    if (!details) {
      return match
    }

    return `[${details.name}](#${encodeURIComponent(details.id)})`
  })
}

function buildAddressToDetailsMap(
  contracts: ProjectContracts | undefined,
  permissions: Record<string, ProjectPermissions> | undefined,
): Map<string, { id: string; name: string }> {
  const addressToDetails = new Map<string, { id: string; name: string }>()

  if (contracts?.addresses) {
    for (const chainContracts of Object.values(contracts.addresses)) {
      for (const contract of chainContracts) {
        addressToDetails.set(contract.address.toString(), {
          id: contract.name,
          name: contract.name,
        })
      }
    }
  }

  if (permissions) {
    for (const chainPermissions of Object.values(permissions)) {
      const allPermissions = [
        ...(chainPermissions.roles ?? []),
        ...(chainPermissions.actors ?? []),
      ]

      for (const permission of allPermissions) {
        for (const account of permission.accounts) {
          addressToDetails.set(account.address.toString(), {
            id: permission.id,
            name: permission.name,
          })
        }
      }
    }
  }

  return addressToDetails
}
