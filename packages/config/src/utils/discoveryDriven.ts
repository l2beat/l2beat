import type { Layer2, Layer3 } from '../'

export function arePermissionsDiscoveryDriven(
  project: Layer2 | Layer3,
): boolean {
  if (project.permissions === undefined) {
    return true
  }

  if (project.permissions === 'UnderReview') {
    return true
  }

  return Object.values(project.permissions).every((e) => {
    const all = [...(e?.roles ?? []), ...(e?.actors ?? [])]
    return all.every((p) => p.discoveryDrivenData === true)
  })
}

export function areContractsDiscoveryDriven(project: Layer2 | Layer3): boolean {
  const checkContracts = (project: Layer2 | Layer3): boolean => {
    return project.contracts.addresses.every(
      (a) => a.discoveryDrivenData === true,
    )
  }

  const checkNativeContracts = (project: Layer2 | Layer3): boolean => {
    return Object.values(project.contracts.nativeAddresses ?? {}).every((e) =>
      e.every((a) => a.discoveryDrivenData === true),
    )
  }

  const areContractsDiscoveryDriven = checkContracts(project)
  const areNativeContractsDiscoveryDriven = checkNativeContracts(project)

  return areContractsDiscoveryDriven && areNativeContractsDiscoveryDriven
}

export function isDiscoveryDriven(project: Layer2 | Layer3): boolean {
  const permissions = arePermissionsDiscoveryDriven(project)
  const contracts = arePermissionsDiscoveryDriven(project)

  return permissions && contracts
}
