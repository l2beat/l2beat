import { type ChainSpecificAddress, formatAddress } from '@l2beat/shared-pure'
import { getContractAddressAnchor } from './getContractAddressAnchor'
import type { ContractsSection } from './getContractsSection'
import type { PermissionSection } from './getPermissionsSection'

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
  contractsSection: ContractsSection | undefined,
  permissionsSection: PermissionSection | undefined,
): UnverifiedContractEntry[] {
  const targetByAnchorId = new Map<string, UnverifiedContractTarget>()

  for (const { roles, actors } of Object.values(
    permissionsSection?.permissionsByChain ?? {},
  )) {
    for (const permission of roles) {
      for (const address of permission.addresses) {
        addTarget(
          targetByAnchorId,
          address.anchorId,
          permission.name,
          address.address,
        )
      }
    }
    for (const permission of actors) {
      for (const address of permission.addresses) {
        addTarget(
          targetByAnchorId,
          address.anchorId,
          permission.addresses.length > 1 ? address.name : permission.name,
          address.address,
        )
      }
    }
  }

  for (const contract of Object.values(
    contractsSection?.contracts ?? {},
  ).flat()) {
    for (const address of contract.addresses) {
      addTarget(
        targetByAnchorId,
        address.anchorId,
        contract.name,
        address.address,
      )
    }
  }

  return [...new Set(unverifiedContracts)].map((address) => ({
    address,
    target:
      targetByAnchorId.get(getContractAddressAnchor('contracts', address)) ??
      targetByAnchorId.get(getContractAddressAnchor('permissions', address)),
  }))
}

function addTarget(
  targetByAnchorId: Map<string, UnverifiedContractTarget>,
  anchorId: string | undefined,
  name: string | undefined,
  address: string,
) {
  if (!anchorId) return

  targetByAnchorId.set(anchorId, {
    id: anchorId,
    label: getDisplayLabel(name, address),
  })
}

function getDisplayLabel(
  name: string | undefined,
  address: string,
): string | undefined {
  if (!name || name === 'Contract') return undefined

  const formattedAddress = formatAddress(address)
  return name === formattedAddress ? undefined : name
}
