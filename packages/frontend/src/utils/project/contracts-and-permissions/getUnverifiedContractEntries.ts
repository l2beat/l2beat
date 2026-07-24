import type { ProjectContracts, ProjectPermissions } from '@l2beat/config'
import { ChainSpecificAddress, formatAddress } from '@l2beat/shared-pure'
import { getContractAddressAnchor } from './getContractAddressAnchor'

export interface UnverifiedContractEntry {
  address: ChainSpecificAddress
  target?: UnverifiedContractTarget
}

interface UnverifiedContractTarget {
  id: string
  label?: string
}

export function getUnverifiedContractEntries(
  unverifiedContracts: ChainSpecificAddress[],
  contracts: ProjectContracts | undefined,
  permissions: Record<string, ProjectPermissions> | undefined,
): UnverifiedContractEntry[] {
  const targetByAddress = new Map<
    ChainSpecificAddress,
    UnverifiedContractTarget
  >()

  const projectPermissions = Object.values(permissions ?? {}).flatMap(
    ({ roles = [], actors = [] }) => roles.concat(actors),
  )
  for (const permission of projectPermissions) {
    for (const account of permission.accounts) {
      targetByAddress.set(account.address, {
        id: getContractAddressAnchor('permissions', account.address),
        label: getDisplayLabel(
          permission.name || account.name,
          account.address,
        ),
      })
    }
  }

  const projectContracts = Object.values(contracts?.addresses ?? {}).flat()
  for (const contract of projectContracts) {
    targetByAddress.set(contract.address, {
      id: getContractAddressAnchor('contracts', contract.address),
      label: getDisplayLabel(contract.name, contract.address),
    })
  }

  return [...new Set(unverifiedContracts)].map((address) => ({
    address,
    target: targetByAddress.get(address),
  }))
}

function getDisplayLabel(
  name: string | undefined,
  address: ChainSpecificAddress,
): string | undefined {
  if (!name || name === 'Contract') return undefined

  const formattedAddress = formatAddress(ChainSpecificAddress.address(address))
  return name === formattedAddress ? undefined : name
}
